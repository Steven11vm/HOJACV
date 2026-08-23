/**
 * POST /api/estudio/login — issues a signed session cookie if the password is
 * correct. Aggressive rate limit (5 intentos / 15 min → bloqueo 30 min).
 *
 * Defense in depth:
 *   - Origin check (same-site only).
 *   - JSON body, size cap 1 KB, honeypot.
 *   - Timing-safe password comparison + timing-safe HMAC verify.
 *   - Sleep aleatorio pequeño en fallo para difuminar timing side-channels.
 *   - Log de intento fallido con IP (sin exponer si el password existe o no).
 *   - Cookie httpOnly + secure + sameSite=strict + path=/ + Max-Age forzado.
 */
import { NextResponse } from "next/server"
import { getClientIp, rateLimitLogin } from "@/lib/rate-limit"
import { createSessionToken, sessionCookieHeader, verifyAdminPassword } from "@/lib/auth-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 10

const MAX_BODY_BYTES = 1024

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
  // 80–220ms para difuminar diferencias de timing entre "password wrong" y
  // "user-agent bloqueado" u otras ramas.
  const ms = 80 + Math.floor(Math.random() * 140)
  return new Promise((r) => setTimeout(r, ms))
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) {
    await jitterSleep()
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const ctype = req.headers.get("content-type") ?? ""
  if (!ctype.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415 })
  }
  const len = parseInt(req.headers.get("content-length") ?? "0", 10)
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  const ip = getClientIp(req)
  const rl = rateLimitLogin(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    )
  }

  let body: { password?: string; honeypot?: string }
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  // Honeypot: bots que llenan todos los campos hidden.
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 401 })
  }

  const password = typeof body.password === "string" ? body.password : ""
  if (!password || password.length > 256) {
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 401 })
  }

  const ok = verifyAdminPassword(password)
  if (!ok) {
    console.warn(`[estudio/login] FAILED attempt from ${ip}`)
    await jitterSleep()
    return NextResponse.json({ error: "invalid" }, { status: 401 })
  }

  const token = createSessionToken()
  if (!token) {
    console.error("[estudio/login] AUTH_SECRET missing or too short (needs >=32 chars)")
    return NextResponse.json({ error: "misconfigured" }, { status: 503 })
  }

  console.log(`[estudio/login] OK from ${ip}`)

  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": sessionCookieHeader(token),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
}
