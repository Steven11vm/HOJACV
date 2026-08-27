/**
 * POST /api/estudio/logout — invalida la sesión.
 *
 * FIX HIGH-2: exige origen mismo-sitio + cookie de sesión válida + CSRF
 * header/cookie válidos. Sin estas comprobaciones, evil.com podía hacer
 * fetch no-cors → forced logout + Clear-Site-Data del admin cross-origin.
 *
 * FIX HIGH-3: revoca el nonce de la sesión en la revocation list server-side
 * antes de responder — un token filtrado ya no vuelve a validar aunque el
 * atacante lo replaye antes de la exp absoluta.
 */
import { NextResponse } from "next/server"
import { clearAllCookieHeaders, revokeSession, verifyCsrf, isSessionAuthed } from "@/lib/auth-session"
import { auditLog, newRequestId } from "@/lib/audit-log"
import { getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function isOriginAllowed(req: Request): boolean {
  const host = req.headers.get("host") ?? ""
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""
  const ownVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const allowed = new Set<string>([`https://${host}`, `http://${host}`])
  if (ownVercel) allowed.add(ownVercel)
  if (origin && allowed.has(origin)) return true
  if (!origin && referer) {
    try {
      if (allowed.has(new URL(referer).origin)) return true
    } catch { return false }
  }
  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost") || referer.startsWith("http://localhost")) return true
  }
  return false
}

export async function POST(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)

  if (!isOriginAllowed(req)) {
    auditLog("warn", { action: "logout", ip, requestId, result: "denied", reason: "bad_origin" })
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  if (!isSessionAuthed(req)) {
    // Sin sesión válida no hay nada que invalidar. Devolver 401 (no 200) —
    // no queremos que evil.com sepa que el endpoint pasó por el "borrado".
    auditLog("warn", { action: "logout", ip, requestId, result: "denied", reason: "no_session" })
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  if (!verifyCsrf(req)) {
    auditLog("warn", { action: "logout", ip, requestId, result: "denied", reason: "csrf_failed" })
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  revokeSession(req)
  auditLog("info", { action: "logout", ip, requestId, result: "ok" })

  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Request-ID": requestId,
    "Clear-Site-Data": "\"cookies\", \"storage\"",
  })
  for (const c of clearAllCookieHeaders()) headers.append("Set-Cookie", c)
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers })
}
