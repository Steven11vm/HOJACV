/**
 * In-memory sliding-window rate limiter con buckets separados por endpoint.
 *
 * Best-effort on serverless: warm instances share state, cold starts reset.
 * Para garantías estrictas (por ejemplo enforcement across regions), reemplazar
 * con Upstash o Vercel KV. Este in-memory es suficiente para mitigar abuso
 * automatizado en el edge.
 *
 * Cada bucket enforce dos ventanas simultáneas: short burst + long sustained.
 * Los buckets se identifican por `${endpoint}:${ip}` para que abuso en
 * /api/lead no consuma quota de /api/estudio/login.
 */

type Bucket = {
  short: number[]
  long: number[]
  blockedUntil: number
}

type Policy = {
  shortWindowMs: number
  shortLimit: number
  longWindowMs: number
  longLimit: number
  blockMs: number
}

const DEFAULT_POLICY: Policy = {
  shortWindowMs: 60_000,        // 1 min
  shortLimit: 10,
  longWindowMs: 60 * 60_000,    // 1 h
  longLimit: 60,
  blockMs: 5 * 60_000,          // 5 min
}

const LOGIN_POLICY: Policy = {
  shortWindowMs: 15 * 60_000,   // 15 min
  shortLimit: 5,
  longWindowMs: 60 * 60_000,    // 1 h
  longLimit: 8,
  blockMs: 30 * 60_000,         // 30 min block
}

const POLICIES: Record<string, Policy> = {
  default: DEFAULT_POLICY,
  login: LOGIN_POLICY,
  admin: {                       // /api/estudio/leads GET/PATCH/DELETE
    shortWindowMs: 60_000,
    shortLimit: 30,
    longWindowMs: 60 * 60_000,
    longLimit: 300,
    blockMs: 5 * 60_000,
  },
  lead: DEFAULT_POLICY,          // /api/lead
  chat: DEFAULT_POLICY,          // /api/chat
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5_000

function gc(now: number) {
  if (buckets.size <= MAX_BUCKETS) return
  for (const [key, b] of buckets) {
    const liveShort = b.short.length > 0 && now - b.short[b.short.length - 1] < 60 * 60_000
    const liveLong = b.long.length > 0 && now - b.long[b.long.length - 1] < 60 * 60_000
    if (!liveShort && !liveLong && b.blockedUntil < now) buckets.delete(key)
    if (buckets.size <= MAX_BUCKETS / 2) break
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
    b = { short: [], long: [], blockedUntil: 0 }
    buckets.set(key, b)
    gc(now)
  }
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

/** Retrocompat: mantiene la API del rate limit login. */
export function rateLimitLogin(ip: string): RateLimitResult {
  return rateLimit(ip, "login")
}

export function getClientIp(req: Request): string {
  const headers = req.headers
  const xff = headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const realIp = headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  const vercelIp = headers.get("x-vercel-forwarded-for")
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim()
    if (first) return first
  }
  return "anonymous"
}
