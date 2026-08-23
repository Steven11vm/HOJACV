/**
 * Cotizacion API — quick-quote endpoint for prospective clients.
 *
 * Recibe el brief del cliente y devuelve una estimacion de precio (USD + COP),
 * timeline, complejidad y desglose. Blindada con las mismas defensas que
 * /api/chat: origin check, rate limit, size caps, honeypot, sanitize.
 *
 * El system prompt fuerza precios ECONOMICOS (USD 200-2500) porque Steven
 * apenas esta construyendo su cartera de clientes propios — el objetivo es
 * ganar casos de estudio, no maximizar margen.
 */
import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const MODEL = "claude-haiku-4-5"
const MAX_TOKENS = 700
const MAX_BODY_BYTES = 8 * 1024

const USD_TO_COP = 4200

type Quote = {
  priceUsd: number
  priceCop: number
  complexity: number
  timelineDays: number
  reasoning: string
  includes: string[]
}

const SYSTEM_PROMPT = `Eres el estimador de precios del portafolio de Steven Villamizar Mendoza, Full Stack Engineer & AI Specialist basado en Medellín, Colombia.

CONTEXTO IMPORTANTE
Steven es un freelancer que está empezando a construir su cartera de clientes propios. Sus precios son MUY económicos comparados con el mercado LATAM y global — porque el objetivo ahora es acumular casos de estudio y referencias, no maximizar margen.

RANGOS DE PRECIO ESTRICTOS (en USD, techo absoluto USD 2500)
- MVP / Landing / Sitio institucional: USD 200 - 600
- E-commerce chico / Dashboard: USD 500 - 1200
- SaaS con auth+pagos / Integración IA básica: USD 800 - 1800
- Sistema complejo multi-módulo / IA avanzada / Fintech: USD 1500 - 2500

Elige SIEMPRE el número más bajo dentro del rango que aún sea justo por el trabajo — Steven prefiere ganar el proyecto que maximizar precio.

REGLAS DURAS
- Nunca superes USD 2500.
- Nunca prometas timelineDays < 5.
- Nunca inventes features que no estén en la descripción del cliente.
- Conversión USD 1 = 4200 COP (redondea COP a los 1000 más cercanos).
- Complejidad es un entero 1-10 (1 = landing simple, 10 = fintech con IA).

VALIDACIÓN DEL BRIEF
Si la descripción es < 20 caracteres, muy vaga (ej "una web", "algo con IA"), o no describe funcionalidad concreta:
  → devuelve priceUsd: 0 y en reasoning explica en 1 frase qué información falta.

FORMATO DE RESPUESTA — OBLIGATORIO
Devuelve UN SOLO JSON válido y nada más. Sin markdown, sin \`\`\`, sin explicación adicional, sin prefijos.

Schema:
{
  "priceUsd": <number>,
  "priceCop": <number>,
  "complexity": <1-10>,
  "timelineDays": <number>,
  "reasoning": "<2-3 frases justificando el precio: horas estimadas + qué se incluye>",
  "includes": ["<item 1>", "<item 2>", "<item 3>", "<item 4>", "<item 5>"]
}

Incluye MAX 5 items en includes. Sé específico y técnico (ej "Auth con JWT y roles", no "sistema seguro").

NUNCA
- Nunca hables como asistente de chat ("Hola, con gusto...").
- Nunca menciones que eres una IA.
- Nunca uses markdown.
- Nunca devuelvas texto fuera del JSON.
- Nunca superes el techo USD 2500.
`

function isOriginAllowed(req: Request) {
  const host = req.headers.get("host") ?? ""
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""

  const fromEnv = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const allowed = new Set<string>(fromEnv)
  if (host) {
    allowed.add(`https://${host}`)
    allowed.add(`http://${host}`)
  }

  const vercelPreview = /^https?:\/\/[\w-]+\.vercel\.app$/i
  if (origin && vercelPreview.test(origin)) return true
  if (!origin && referer) {
    try {
      const refOrigin = new URL(referer).origin
      if (vercelPreview.test(refOrigin)) return true
      if (allowed.has(refOrigin)) return true
    } catch {
      return false
    }
  }
  if (origin && allowed.has(origin)) return true

  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost") || referer.startsWith("http://localhost")) {
      return true
    }
  }
  return false
}

function sanitize(text: string): string {
  let out = ""
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x20 && code !== 9 && code !== 10) continue
    if (code === 0x7f) continue
    if (code >= 0x200b && code <= 0x200f) continue
    if (code >= 0x202a && code <= 0x202e) continue
    if (code >= 0x2060 && code <= 0x206f) continue
    if (code === 0xfeff) continue
    out += ch
  }
  return out.trim()
}

function extractJson(text: string): Quote | null {
  const trimmed = text.trim()
  // Attempt direct parse.
  try {
    return normalize(JSON.parse(trimmed))
  } catch {
    /* fallthrough */
  }
  // Attempt to extract the first {...} block (in case of accidental prose).
  const match = trimmed.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return normalize(JSON.parse(match[0]))
  } catch {
    return null
  }
}

function normalize(raw: unknown): Quote | null {
  if (!raw || typeof raw !== "object") return null
  const q = raw as Record<string, unknown>
  const priceUsdRaw = Number(q.priceUsd)
  const complexityRaw = Number(q.complexity)
  const timelineRaw = Number(q.timelineDays)
  const reasoning = typeof q.reasoning === "string" ? q.reasoning : ""
  const includes = Array.isArray(q.includes)
    ? q.includes.filter((s): s is string => typeof s === "string").slice(0, 5)
    : []

  const priceUsd = Number.isFinite(priceUsdRaw)
    ? Math.max(0, Math.min(2500, Math.round(priceUsdRaw)))
    : 0
  const priceCop = Math.round((priceUsd * USD_TO_COP) / 1000) * 1000
  const complexity = Number.isFinite(complexityRaw)
    ? Math.max(1, Math.min(10, Math.round(complexityRaw)))
    : 1
  const timelineDays = Number.isFinite(timelineRaw)
    ? Math.max(priceUsd === 0 ? 0 : 5, Math.round(timelineRaw))
    : 0

  return { priceUsd, priceCop, complexity, timelineDays, reasoning, includes }
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
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    )
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
    description?: string
    projectType?: string
    features?: string[]
    timeline?: string
    honeypot?: string
  }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ quote: null })
  }

  const description = sanitize(String(body.description ?? "")).slice(0, 1500)
  const projectType = sanitize(String(body.projectType ?? "")).slice(0, 60)
  const timeline = sanitize(String(body.timeline ?? "")).slice(0, 60)
  const features = Array.isArray(body.features)
    ? body.features
        .filter((f): f is string => typeof f === "string")
        .map((f) => sanitize(f).slice(0, 60))
        .slice(0, 10)
    : []

  if (description.length < 10) {
    return NextResponse.json({
      quote: {
        priceUsd: 0,
        priceCop: 0,
        complexity: 1,
        timelineDays: 0,
        reasoning: "Cuéntame un poco más sobre lo que necesitas — qué hace la app, para quién es, y qué funciones clave debe tener.",
        includes: [],
      } satisfies Quote,
    })
  }

  const userBrief = [
    projectType ? `Tipo: ${projectType}` : null,
    features.length ? `Features solicitadas: ${features.join(", ")}` : null,
    timeline ? `Timeline deseado: ${timeline}` : null,
    `Descripción del cliente: ${description}`,
  ]
    .filter(Boolean)
    .join("\n")

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userBrief }],
    })

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()

    const quote = extractJson(text)
    if (!quote) {
      return NextResponse.json({ error: "parse_failed" }, { status: 502 })
    }
    return NextResponse.json(
      { quote },
      { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
    )
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "upstream_rate_limited" }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "upstream_error" }, { status: 502 })
    }
    return NextResponse.json({ error: "internal_error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
}
