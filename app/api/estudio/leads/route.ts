/**
 * /api/estudio/leads — CRUD del dashboard privado.
 *
 * GET     — lista leads.       Auth: cookie sesión.
 * PATCH   — marca contactado.  Auth: cookie sesión + CSRF double-submit.
 * DELETE  — elimina lead.       Auth: cookie sesión + CSRF double-submit.
 *
 * FIX MEDIUM-9: auth ANTES que rate-limit (un atacante compartiendo IP con
 * el admin no puede quemarle el rate-limit sin credenciales válidas).
 * FIX MEDIUM-5: cap explícito de Content-Length antes de req.json() en
 * PATCH/DELETE — sesión secuestrada no puede subir 100MB en el body.
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

const MAX_MUTATION_BODY_BYTES = 512

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

/** Chequea Content-Length antes de leer el body — fix MEDIUM-5. */
function bodyTooLarge(req: Request, max: number): boolean {
  const cl = parseInt(req.headers.get("content-length") ?? "", 10)
  if (!Number.isFinite(cl)) return true // sin CL, rechazamos
  return cl < 1 || cl > max
}

export async function GET(req: Request) {
  const requestId = newRequestId()
  const ip = getClientIp(req)
  if (!(await isSessionAuthed(req))) return unauth(requestId, "no_session", ip, "leads.list")
  const rl = await rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
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
  if (!(await isSessionAuthed(req))) return unauth(requestId, "no_session", ip, "leads.patch")
  if (!verifyCsrf(req)) return unauth(requestId, "csrf_failed", ip, "leads.patch")
  const rl = await rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
  if (bodyTooLarge(req, MAX_MUTATION_BODY_BYTES)) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: baseHeaders(requestId) })
  }

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
  if (!(await isSessionAuthed(req))) return unauth(requestId, "no_session", ip, "leads.delete")
  if (!verifyCsrf(req)) return unauth(requestId, "csrf_failed", ip, "leads.delete")
  const rl = await rateLimit(ip, "admin")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...baseHeaders(requestId), "Retry-After": String(rl.retryAfter) } })
  }
  if (bodyTooLarge(req, MAX_MUTATION_BODY_BYTES)) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413, headers: baseHeaders(requestId) })
  }

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
