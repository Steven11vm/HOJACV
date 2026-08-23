/**
 * /api/estudio/leads — CRUD del dashboard privado.
 * Autenticado con cookie de sesión firmada HMAC (SESSION_COOKIE).
 * No acepta Bearer ni query params — solo cookie.
 */
import { NextResponse } from "next/server"
import { isSessionAuthed } from "@/lib/auth-session"
import { listLeads, markContacted, deleteLead, dbAvailable } from "@/lib/leads-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

function unauth() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function GET(req: Request) {
  if (!isSessionAuthed(req)) return unauth()
  if (!dbAvailable()) {
    return NextResponse.json({ leads: [], warning: "POSTGRES_URL no configurado" })
  }
  const leads = await listLeads(200)
  return NextResponse.json(
    { leads },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  )
}

export async function PATCH(req: Request) {
  if (!isSessionAuthed(req)) return unauth()
  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== "number" || typeof body.contacted !== "boolean") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const ok = await markContacted(body.id, body.contacted)
  return NextResponse.json({ ok })
}

export async function DELETE(req: Request) {
  if (!isSessionAuthed(req)) return unauth()
  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== "number") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const ok = await deleteLead(body.id)
  return NextResponse.json({ ok })
}
