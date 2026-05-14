/**
 * In-memory sliding-window rate limiter.
 *
 * Best-effort on serverless: warm instances share state, cold starts reset.
 * For stricter guarantees, swap with an external store (Upstash, Vercel KV).
 *
 * Two windows enforced simultaneously: short burst + long sustained.
 */

type Bucket = {
  short: number[] // timestamps within SHORT_WINDOW_MS
  long: number[] // timestamps within LONG_WINDOW_MS
  blockedUntil: number
}

const SHORT_WINDOW_MS = 60_000 // 1 minute
const SHORT_LIMIT = 10
const LONG_WINDOW_MS = 60 * 60_000 // 1 hour
const LONG_LIMIT = 60
const BLOCK_MS = 5 * 60_000 // 5 minutes block after abuse

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5_000

function gc(now: number) {
  if (buckets.size <= MAX_BUCKETS) return
  for (const [key, b] of buckets) {
    const liveShort = b.short.length > 0 && now - b.short[b.short.length - 1] < SHORT_WINDOW_MS
    const liveLong = b.long.length > 0 && now - b.long[b.long.length - 1] < LONG_WINDOW_MS
    if (!liveShort && !liveLong && b.blockedUntil < now) buckets.delete(key)
    if (buckets.size <= MAX_BUCKETS / 2) break
  }
}

export type RateLimitResult = {
  ok: boolean
  retryAfter: number // seconds
  remainingShort: number
  remainingLong: number
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) {
    b = { short: [], long: [], blockedUntil: 0 }
    buckets.set(key, b)
    gc(now)
  }

  if (b.blockedUntil > now) {
    return {
      ok: false,
      retryAfter: Math.ceil((b.blockedUntil - now) / 1000),
      remainingShort: 0,
      remainingLong: 0,
    }
  }

  b.short = b.short.filter((t) => now - t < SHORT_WINDOW_MS)
  b.long = b.long.filter((t) => now - t < LONG_WINDOW_MS)

  if (b.short.length >= SHORT_LIMIT || b.long.length >= LONG_LIMIT) {
    b.blockedUntil = now + BLOCK_MS
    return {
      ok: false,
      retryAfter: Math.ceil(BLOCK_MS / 1000),
      remainingShort: 0,
      remainingLong: 0,
    }
  }

  b.short.push(now)
  b.long.push(now)

  return {
    ok: true,
    retryAfter: 0,
    remainingShort: Math.max(0, SHORT_LIMIT - b.short.length),
    remainingLong: Math.max(0, LONG_LIMIT - b.long.length),
  }
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
