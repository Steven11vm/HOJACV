/**
 * /api/estudio/leads — CRUD del dashboard privado.
 *
 * GET     — lista de leads.       Auth: cookie de sesión.
 * PATCH   — marca contactado.     Auth: cookie de sesión + CSRF token double-submit.
 * DELETE  — elimina lead.         Auth: cookie de sesión + CSRF token double-submit.
 */
import { NextResponse } from "next/server"
import { z } from "zod"
import { isSessionAuthed, verifyCsrf } from "@/lib/auth-session"
import { listLeads, markContacted, deleteLead, dbAvailable } from "@/lib/leads-db"
import { auditLog, newRequestId } from "@/lib/audit-log"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

const PatchSchema = z.object({ id: z.number().int().positive(), contacted: z.boolean() })
const DeleteSchema = z.object({ id: z.number().int().positive() })

function baseHeaders(requestId: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "X-Request-ID": requestId,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  }
}

function unauth(requestId: string, reason: string, ip: string, action: string) {
  auditLog("warn", { action, ip, requestId, result: "denied", reason })
  return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: baseHeaders(requestId) })
}

export async function GET(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  const rl = rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
  if (!isSessionAuthed(req)) return unauth(requestId, "no_session", ip, "leads.list")
  if (!dbAvailable()) {
    return NextResponse.json({ leads: [], warning: "POSTGRES_URL no configurado" }, { headers: baseHeaders(requestId) })
  }
  const leads = await listLeads(200)
  auditLog("info", { action: "leads.list", ip, requestId, result: "ok", count: leads.length })
  return NextResponse.json({ leads }, { headers: baseHeaders(requestId) })
}

export async function PATCH(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  const rl = rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
  if (!isSessionAuthed(req)) return unauth(requestId, "no_session", ip, "leads.patch")
  if (!verifyCsrf(req)) return unauth(requestId, "csrf_failed", ip, "leads.patch")

  let body: z.infer<typeof PatchSchema>
  try {
    body = PatchSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: baseHeaders(requestId) })
  }
  const ok = await markContacted(body.id, body.contacted)
  auditLog("info", { action: "leads.patch", ip, requestId, id: body.id, contacted: body.contacted, result: ok ? "ok" : "error" })
  return NextResponse.json({ ok }, { headers: baseHeaders(requestId) })
}

export async function DELETE(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  const rl = rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
  if (!isSessionAuthed(req)) return unauth(requestId, "no_session", ip, "leads.delete")
  if (!verifyCsrf(req)) return unauth(requestId, "csrf_failed", ip, "leads.delete")

  let body: z.infer<typeof DeleteSchema>
  try {
    body = DeleteSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: baseHeaders(requestId) })
  }
  const ok = await deleteLead(body.id)
  auditLog("warn", { action: "leads.delete", ip, requestId, id: body.id, result: ok ? "ok" : "error" })
  return NextResponse.json({ ok }, { headers: baseHeaders(requestId) })
}
