/**
 * GET /api/estudio/2fa-setup — devuelve un secreto TOTP nuevo + URI otpauth.
 * Requiere sesión válida (o config-time via ENV).
 *
 * El secreto NO se persiste automáticamente — se muestra al admin para que
 * lo pegue como env var TOTP_SECRET en Vercel, y a partir del próximo
 * deploy el login lo exigirá. Este endpoint solo GENERA — es responsabilidad
 * del admin guardarlo antes de cerrar la página.
 */
import { NextResponse } from "next/server"
import { generateTotpSecret, totpUri } from "@/lib/totp"
import { isSessionAuthed, verifyAdminPassword } from "@/lib/auth-session"
import { auditLog, newRequestId } from "@/lib/audit-log"
import { getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  if (!(await isSessionAuthed(req))) {
    auditLog("warn", { action: "2fa.setup", ip, requestId, result: "denied", reason: "no_session" })
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const secret = generateTotpSecret()
  const uri = totpUri(secret, "Steven CV — Estudio")
  auditLog("info", { action: "2fa.setup", ip, requestId, result: "ok" })
  return NextResponse.json(
    { secret, uri },
    { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } },
  )
}

/**
 * POST /api/estudio/2fa-setup — sin sesión, usa ADMIN_PASSWORD como auth
 * (bootstrap: útil cuando aún no hay 2FA configurado y necesitas generarlo).
 */
export async function POST(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  if (!body.password || !verifyAdminPassword(body.password)) {
    auditLog("warn", { action: "2fa.setup", ip, requestId, result: "invalid", reason: "bad_password" })
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const secret = generateTotpSecret()
  const uri = totpUri(secret, "Steven CV — Estudio")
  auditLog("info", { action: "2fa.setup", ip, requestId, result: "ok", via: "password" })
  return NextResponse.json(
    { secret, uri },
    { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } },
  )
}
