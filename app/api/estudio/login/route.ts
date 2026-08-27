/**
 * POST /api/estudio/login — issues a signed session cookie + CSRF token.
 *
 * Defensas:
 *   - Origin/Referer strict same-site (o Vercel preview).
 *   - Rate limit específico login: 5 intentos/15 min → bloqueo 30 min.
 *   - Zod schema validation del body.
 *   - Honeypot field para bots.
 *   - Content-Type application/json obligatorio, body cap 1 KB.
 *   - Timing-safe password compare + jitter aleatorio en fallo (80-220 ms).
 *   - Verifica ADMIN_PASSWORD y AUTH_SECRET cumplan longitud mínima.
 *   - Structured audit log (JSON con fingerprint de sesión, nunca del password).
 *   - Set-Cookie triple: session (httpOnly) + csrf (readable JS) + __Host- prefix
 *     en producción.
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

function isOriginAllowed(req: Request) {
  const host = req.headers.get("host") ?? ""
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""
  const vercelPreview = /^https?:\/\/[\w-]+\.vercel\.app$/i
  const allowed = new Set<string>([`https://${host}`, `http://${host}`])
  if (origin && (vercelPreview.test(origin) || allowed.has(origin))) return true
  if (!origin && referer) {
    try {
      const refOrigin = new URL(referer).origin
      if (vercelPreview.test(refOrigin) || allowed.has(refOrigin)) return true
    } catch {
      return false
    }
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
  const ua = req.headers.get("user-agent") ?? ""

  if (!isOriginAllowed(req)) {
    auditLog("warn", { action: "login", ip, ua, result: "denied", reason: "bad_origin", requestId })
    await jitterSleep()
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: baseHeaders(requestId) })
  }
  const ctype = req.headers.get("content-type") ?? ""
  if (!ctype.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415, headers: baseHeaders(requestId) })
  }
  const len = parseInt(req.headers.get("content-length") ?? "0", 10)
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: baseHeaders(requestId) })
  }

  // Validación de configuración antes de exponer nada.
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

  // Honeypot: bots que llenan hidden inputs.
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
