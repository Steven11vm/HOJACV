import { NextResponse } from "next/server"
import { clearAllCookieHeaders } from "@/lib/auth-session"
import { auditLog, newRequestId } from "@/lib/audit-log"
import { getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const requestId = newRequestId()
  auditLog("info", { action: "logout", ip: getClientIp(req), requestId, result: "ok" })
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Request-ID": requestId,
    // Clear-Site-Data: le pide al navegador borrar cookies, cache, storage
    // asociados al sitio. Ampliamente soportado en Chrome/Firefox/Edge.
    "Clear-Site-Data": "\"cookies\", \"storage\"",
  })
  for (const c of clearAllCookieHeaders()) headers.append("Set-Cookie", c)
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers })
}
