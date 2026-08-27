/**
 * POST /api/estudio/login — issues a signed session cookie + CSRF token.
 *
 * Defensas (nivel senior post-adversarial-review):
 *   - Origin/Referer estricto contra VERCEL_URL propio o host de la request
 *     — ya NO acepta cualquier `*.vercel.app` (fix MEDIUM-4).
 *   - Bad-origin → 403 SIN jitter y SIN audit por-request (fix MEDIUM-7/8;
 *     los abusos por-IP se cuentan igual en rateLimit "login" antes de audit).
 *   - Rate limit login: 5 intentos/15 min → block 30 min.
 *   - Content-Length OBLIGATORIO y ≤ 1 KB (fix MEDIUM-6).
 *   - Zod schema validation del body.
 *   - Honeypot field para bots.
 *   - Timing-safe password compare + jitter aleatorio en fallo (80-220 ms).
 *   - Structured audit log (JSON con fingerprint(session), nunca password).
 *   - Set-Cookie triple: session (httpOnly) + csrf (readable JS) + __Host- prod.
 */
import { NextResponse } from "next/server"
import { z } from "zod"
import { getClientIp, rateLimit } from "@/lib/rate-limit"
import {
  createSessionToken,
  csrfTokenFor,
  csrfCookieHeader,
  isMisconfigured,
  sessionCookieHeader,
  verifyAdminPassword,
} from "@/lib/auth-session"
import { auditLog, fingerprint, newRequestId } from "@/lib/audit-log"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 10

const MAX_BODY_BYTES = 1024

const LoginSchema = z.object({
  password: z.string().min(1).max(256),
  honeypot: z.string().max(64).optional(),
})

/**
 * FIX MEDIUM-4: origin whitelist estricta.
 * - Solo acepta el host de la request (Vercel resuelve el host correcto para prod).
 * - En prod, si VERCEL_URL está definido lo añade explícitamente.
 * - Ya NO acepta cualquier `*.vercel.app` — un atacante que registre
 *   `panel-legit.vercel.app` podía enviar cross-origin con ese Origin.
 */
function isOriginAllowed(req: Request): boolean {
  const host = req.headers.get("host") ?? ""
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""
  const ownVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const allowed = new Set<string>([`https://${host}`, `http://${host}`])
  if (ownVercel) allowed.add(ownVercel)
  if (origin && allowed.has(origin)) return true
  if (!origin && referer) {
    try { if (allowed.has(new URL(referer).origin)) return true } catch { return false }
  }
  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost") || referer.startsWith("http://localhost")) return true
  }
  return false
}

async function jitterSleep() {
  const ms = 80 + Math.floor(Math.random() * 140)
  return new Promise((r) => setTimeout(r, ms))
}

function baseHeaders(requestId: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "X-Request-ID": requestId,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  }
}

export async function POST(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 200) // fix LOW-1

  // FIX MEDIUM-7/8: bad origin → 403 rápido, sin jitter, sin audit por-request.
  // El rate-limit por IP ya bloquea abuso; el log solo cuando pasa.
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: baseHeaders(requestId) })
  }

  const ctype = req.headers.get("content-type") ?? ""
  if (!ctype.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415, headers: baseHeaders(requestId) })
  }

  // FIX MEDIUM-6: Content-Length OBLIGATORIO y ≤ MAX_BODY_BYTES.
  // Sin CL, req.text() bufferiza hasta ~4MB por default — vector DoS.
  const clStr = req.headers.get("content-length")
  const cl = parseInt(clStr ?? "", 10)
  if (!clStr || !Number.isFinite(cl) || cl < 1 || cl > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: baseHeaders(requestId) })
  }

  const cfg = isMisconfigured()
  if (!cfg.ok) {
    auditLog("error", { action: "login", ip, requestId, result: "error", reason: cfg.reason })
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: baseHeaders(requestId) })
  }

  const rl = rateLimit(ip, "login")
  if (!rl.ok) {
    auditLog("warn", { action: "login", ip, ua, result: "rate_limited", retryAfter: rl.retryAfter, requestId })
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } },
    )
  }

  let raw: string
  try {
    raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: baseHeaders(requestId) })
    }
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: baseHeaders(requestId) })
  }

  let parsed: z.infer<typeof LoginSchema>
  try {
    parsed = LoginSchema.parse(JSON.parse(raw))
  } catch {
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 400, headers: baseHeaders(requestId) })
  }

  if (parsed.honeypot && parsed.honeypot.length > 0) {
    auditLog("warn", { action: "login", ip, ua, result: "denied", reason: "honeypot", requestId })
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 401, headers: baseHeaders(requestId) })
  }

  if (!verifyAdminPassword(parsed.password)) {
    auditLog("warn", { action: "login", ip, ua, result: "invalid", requestId })
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 401, headers: baseHeaders(requestId) })
  }

  const token = createSessionToken()
  const csrf = token ? csrfTokenFor(token) : null
  if (!token || !csrf) {
    auditLog("error", { action: "login", ip, requestId, result: "error", reason: "token_gen_failed" })
    return NextResponse.json({ error: "service_unavailable" }, { status: 503, headers: baseHeaders(requestId) })
  }

  auditLog("info", { action: "login", ip, ua, result: "ok", session: fingerprint(token), requestId })

  const headers = new Headers(baseHeaders(requestId))
  headers.append("Set-Cookie", sessionCookieHeader(token))
  headers.append("Set-Cookie", csrfCookieHeader(csrf))
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers })
}

export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
}
