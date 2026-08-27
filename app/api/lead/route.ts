/**
 * Lead API — recibe la petición completa del SalesFunnel cuando el cliente
 * llega al step 7 con los 3 sí, y la persiste para que Steven pueda verla
 * SIN depender de que el cliente haga click en el CTA de WhatsApp/email.
 *
 * Estrategia en cascada (usa la primera disponible):
 *   1. RESEND_API_KEY  →  email a Stevenvilla10@gmail.com (recomendado)
 *   2. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID  →  mensaje a Telegram
 *   3. console.log  →  visible en Vercel dashboard > Logs (fallback)
 *
 * Mismas defensas que /api/chat: origin check, rate limit, sanitize,
 * honeypot, size caps.
 */
import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { insertLead } from "@/lib/leads-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

const MAX_BODY_BYTES = 4 * 1024
const LEAD_TO_EMAIL = "Stevenvilla10@gmail.com"
const LEAD_FROM_EMAIL = "leads@cv-steven.vercel.app"

/**
 * FIX MEDIUM-4: origin whitelist estricta contra host propio + VERCEL_URL,
 * ya no acepta cualquier *.vercel.app (cualquiera podía registrar
 * fake.vercel.app y bypass).
 */
function isOriginAllowed(req: Request) {
  const host = req.headers.get("host") ?? ""
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""

  const fromEnv = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  const allowed = new Set<string>(fromEnv)
  if (host) {
    allowed.add(`https://${host}`)
    allowed.add(`http://${host}`)
  }
  const ownVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  if (ownVercel) allowed.add(ownVercel)

  if (origin && allowed.has(origin)) return true
  if (!origin && referer) {
    try {
      if (allowed.has(new URL(referer).origin)) return true
    } catch {
      return false
    }
  }
  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost") || referer.startsWith("http://localhost")) return true
  }
  return false
}

/**
 * FIX MEDIUM-3: sanitize filtra TODOS los control chars incluyendo \r y \n
 * (antes preservábamos \n para textareas, pero el field iba directo al audit
 * log y permitía inyectar líneas [AUDIT] falsas).
 */
function sanitize(text: string): string {
  let out = ""
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x20 && code !== 9) continue  // solo TAB pasa; \n \r se dropean
    if (code === 0x7f) continue
    if (code >= 0x200b && code <= 0x200f) continue
    if (code >= 0x202a && code <= 0x202e) continue
    if (code >= 0x2060 && code <= 0x206f) continue
    if (code === 0xfeff) continue
    out += ch
  }
  return out.trim().slice(0, 4000)
}

async function sendResend(subject: string, body: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        subject,
        text: body,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) {
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
  const rl = await rateLimit(ip, "lead")
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } })
  }

  let raw: string
  try {
    raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
    }
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  let body: {
    projectType?: string
    plan?: string
    currency?: string
    monthLabel?: string
    clientBrief?: string
    summary?: string
    lang?: string
    commit1?: boolean
    commit2?: boolean
    commit3?: boolean
    honeypot?: string
  }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const projectType = sanitize(String(body.projectType ?? "-"))
  const plan = sanitize(String(body.plan ?? "-"))
  const currency = sanitize(String(body.currency ?? "-"))
  const monthLabel = sanitize(String(body.monthLabel ?? "-"))
  const clientBrief = sanitize(String(body.clientBrief ?? ""))
  const summary = sanitize(String(body.summary ?? ""))
  const lang = sanitize(String(body.lang ?? "es")).slice(0, 4)
  const commit1 = typeof body.commit1 === "boolean" ? body.commit1 : null
  const commit2 = typeof body.commit2 === "boolean" ? body.commit2 : null
  const commit3 = typeof body.commit3 === "boolean" ? body.commit3 : null

  // Persistir en Postgres (si está configurada; sino fallback silencioso).
  const referer = req.headers.get("referer") ?? "-"
  const persisted = await insertLead({
    projectType, plan, currency, monthLabel, clientBrief, summary,
    lang, ip, referer, commit1, commit2, commit3,
  })

  const now = new Date().toISOString()
  const subject = `[Nuevo lead] ${projectType} · ${plan} · ${currency}`
  const emailBody = [
    `Nuevo lead desde el portafolio (SalesFunnel step 7 completo).`,
    ``,
    `Fecha (UTC): ${now}`,
    `Idioma: ${lang}`,
    `IP: ${ip}`,
    `Referer: ${referer}`,
    ``,
    `— Tipo de proyecto: ${projectType}`,
    `— Plan elegido:    ${plan}`,
    `— Moneda:          ${currency}`,
    `— Mes actual:      ${monthLabel}`,
    ``,
    `--- Qué escribió el cliente (texto libre) ---`,
    clientBrief || "(sin brief libre)",
    `----------------------------------------------`,
    ``,
    `--- Resumen que verá el cliente al enviar por WhatsApp/email ---`,
    summary,
    `----------------------------------------------------------------`,
    ``,
    `Persistido en DB: ${persisted ? "sí" : "no (POSTGRES_URL no configurado)"}`,
    `Dashboard: /estudio (cookie firmada · AUTH_SECRET + ADMIN_PASSWORD)`,
  ].join("\n")

  const telegramMsg = `🎯 NUEVO LEAD\n\nTipo: ${projectType}\nPlan: ${plan}\nMoneda: ${currency}\n\n${summary}`

  // Log siempre (visible en Vercel dashboard > Logs)
  console.log(`[LEAD] ${subject} | persisted:${persisted} | IP:${ip}`)

  // Cascada de canales.
  const [emailed, telegramSent] = await Promise.all([
    sendResend(subject, emailBody),
    sendTelegram(telegramMsg),
  ])

  return NextResponse.json(
    { ok: true, channels: { db: persisted, email: emailed, telegram: telegramSent, log: true } },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  )
}

export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
}
