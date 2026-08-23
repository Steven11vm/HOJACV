/**
 * Admin API — lista/actualiza/borra leads. Protegido con ADMIN_PASSWORD.
 *
 * Auth: header `Authorization: Bearer <ADMIN_PASSWORD>`.
 * Comparación constant-time para evitar timing attacks básicos.
 */
import { NextResponse } from "next/server"
import { listLeads, markContacted, deleteLead, dbAvailable } from "@/lib/leads-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function authOk(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const header = req.headers.get("authorization") ?? ""
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) return false
  return timingSafeEqual(match[1].trim(), expected)
}

export async function GET(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  if (!dbAvailable()) {
    return NextResponse.json({ leads: [], warning: "POSTGRES_URL not configured — no persisted leads yet" })
  }
  const leads = await listLeads(200)
  return NextResponse.json(
    { leads },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function PATCH(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== "number" || typeof body.contacted !== "boolean") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const ok = await markContacted(body.id, body.contacted)
  return NextResponse.json({ ok })
}

export async function DELETE(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== "number") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const ok = await deleteLead(body.id)
  return NextResponse.json({ ok })
}
