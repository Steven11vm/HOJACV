import { NextResponse } from "next/server"
import { clearCookieHeader } from "@/lib/auth-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookieHeader(),
      "Cache-Control": "no-store",
    },
  })
}
