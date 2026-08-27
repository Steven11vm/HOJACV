/**
 * In-memory sliding-window rate limiter con buckets separados por endpoint.
 *
 * Best-effort on serverless: warm instances share state, cold starts reset.
 * Para garantías estrictas cross-region (KNOWN-LIMIT: HIGH-5), reemplazar
 * con Upstash Redis o Vercel KV backing store. Este in-memory es suficiente
 * para mitigar abuso automatizado en single-instance, no como control único.
 */

type Bucket = {
  short: number[]
  long: number[]
  blockedUntil: number
  lastTouch: number
}

type Policy = {
  shortWindowMs: number
  shortLimit: number
  longWindowMs: number
  longLimit: number
  blockMs: number
}

const DEFAULT_POLICY: Policy = {
  shortWindowMs: 60_000,
  shortLimit: 10,
  longWindowMs: 60 * 60_000,
  longLimit: 60,
  blockMs: 5 * 60_000,
}

const LOGIN_POLICY: Policy = {
  shortWindowMs: 15 * 60_000,
  shortLimit: 5,
  longWindowMs: 60 * 60_000,
  longLimit: 8,
  blockMs: 30 * 60_000,
}

const POLICIES: Record<string, Policy> = {
  default: DEFAULT_POLICY,
  login: LOGIN_POLICY,
  admin: {
    shortWindowMs: 60_000,
    shortLimit: 30,
    longWindowMs: 60 * 60_000,
    longLimit: 300,
    blockMs: 5 * 60_000,
  },
  lead: DEFAULT_POLICY,
  chat: DEFAULT_POLICY,
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5_000
const HARD_EVICT_MS = 2 * 60 * 60_000 // Evict cualquier bucket sin toque en 2h

/**
 * GC con LRU eviction. Antes barría solo lo obviamente muerto y podía dejar
 * el Map creciendo sin techo bajo flood de IPs únicas (fix HIGH-4).
 * Ahora si excedemos MAX_BUCKETS forzamos eviction del 25% más viejo por
 * lastTouch, sin importar si están "live" — bajo ataque la memoria manda.
 */
function gc(now: number) {
  // Fase 1: barrer lo obviamente muerto.
  for (const [key, b] of buckets) {
    if (b.blockedUntil < now && now - b.lastTouch > HARD_EVICT_MS) {
      buckets.delete(key)
    }
  }
  if (buckets.size <= MAX_BUCKETS) return
  // Fase 2: LRU forzado — evict el 25% con lastTouch más viejo.
  const target = Math.floor(MAX_BUCKETS * 0.75)
  const entries = Array.from(buckets.entries()).sort((a, b) => a[1].lastTouch - b[1].lastTouch)
  for (const [key] of entries) {
    if (buckets.size <= target) break
    buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  retryAfter: number
  remainingShort: number
  remainingLong: number
}

export function rateLimit(ip: string, endpoint: keyof typeof POLICIES = "default"): RateLimitResult {
  const policy = POLICIES[endpoint] ?? DEFAULT_POLICY
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) {
    b = { short: [], long: [], blockedUntil: 0, lastTouch: now }
    buckets.set(key, b)
    gc(now)
  }
  b.lastTouch = now
  if (b.blockedUntil > now) {
    return { ok: false, retryAfter: Math.ceil((b.blockedUntil - now) / 1000), remainingShort: 0, remainingLong: 0 }
  }
  b.short = b.short.filter((t) => now - t < policy.shortWindowMs)
  b.long = b.long.filter((t) => now - t < policy.longWindowMs)
  if (b.short.length >= policy.shortLimit || b.long.length >= policy.longLimit) {
    b.blockedUntil = now + policy.blockMs
    return { ok: false, retryAfter: Math.ceil(policy.blockMs / 1000), remainingShort: 0, remainingLong: 0 }
  }
  b.short.push(now)
  b.long.push(now)
  return {
    ok: true,
    retryAfter: 0,
    remainingShort: Math.max(0, policy.shortLimit - b.short.length),
    remainingLong: Math.max(0, policy.longLimit - b.long.length),
  }
}

export function rateLimitLogin(ip: string): RateLimitResult {
  return rateLimit(ip, "login")
}

/**
 * getClientIp — extrae la IP real del cliente.
 *
 * FIX HIGH-1: Vercel APPENDEA la IP real del edge al FINAL del X-Forwarded-For.
 * Tomar `split(",")[0]` significaba tomar cualquier valor spoofeado que el
 * cliente ponga primero → rate-limit bypasseable.
 *
 * Orden de confianza:
 *   1. `x-vercel-forwarded-for` — puesto EXCLUSIVAMENTE por Vercel (no
 *      pasa un XFF del cliente aquí). Primer valor = IP real.
 *   2. Último valor de `x-forwarded-for` — Vercel appendea la IP real al
 *      final; los valores anteriores pueden ser del cliente y no son de fiar.
 *   3. `x-real-ip` — fallback para otros proxies.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers
  const vercelIp = headers.get("x-vercel-forwarded-for")
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim()
    if (first) return first
  }
  const xff = headers.get("x-forwarded-for")
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }
  const realIp = headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  return "anonymous"
}
