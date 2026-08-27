/**
 * Sliding-window rate limiter — Redis distribuido si UPSTASH_REDIS_* está
 * configurado, sino in-memory sliding-window per-instance.
 *
 * Con Redis (recomendado prod):
 *   - Buckets consistentes cross-Lambda (fix HIGH-5 del review).
 *   - Ventana implementada con contador INCR + EXPIRE por ventana.
 *   - Doble ventana (short + long) via dos keys separados.
 *
 * Sin Redis:
 *   - Comportamiento anterior: sliding-window per-instance con LRU eviction.
 *
 * Todo async ahora — los call sites usan `await rateLimit(...)`.
 */
import { kvAvailable, kvIncr, kvGet, kvSet } from "@/lib/kv"

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
  admin: { shortWindowMs: 60_000, shortLimit: 30, longWindowMs: 60 * 60_000, longLimit: 300, blockMs: 5 * 60_000 },
  lead: DEFAULT_POLICY,
  chat: DEFAULT_POLICY,
}

export type RateLimitResult = {
  ok: boolean
  retryAfter: number
  remainingShort: number
  remainingLong: number
}

// ---------- In-memory fallback (mismo LRU que antes) ----------
type Bucket = { short: number[]; long: number[]; blockedUntil: number; lastTouch: number }
const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5_000
const HARD_EVICT_MS = 2 * 60 * 60_000

function gcMem(now: number) {
  for (const [k, b] of buckets) {
    if (b.blockedUntil < now && now - b.lastTouch > HARD_EVICT_MS) buckets.delete(k)
  }
  if (buckets.size <= MAX_BUCKETS) return
  const target = Math.floor(MAX_BUCKETS * 0.75)
  const entries = Array.from(buckets.entries()).sort((a, b) => a[1].lastTouch - b[1].lastTouch)
  for (const [k] of entries) {
    if (buckets.size <= target) break
    buckets.delete(k)
  }
}

function memLimit(key: string, policy: Policy): RateLimitResult {
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) {
    b = { short: [], long: [], blockedUntil: 0, lastTouch: now }
    buckets.set(key, b)
    gcMem(now)
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
    ok: true, retryAfter: 0,
    remainingShort: Math.max(0, policy.shortLimit - b.short.length),
    remainingLong: Math.max(0, policy.longLimit - b.long.length),
  }
}

// ---------- Redis-backed ----------
async function redisLimit(key: string, policy: Policy): Promise<RateLimitResult> {
  const blockedKey = `rl:blk:${key}`
  const shortKey = `rl:s:${key}`
  const longKey = `rl:l:${key}`

  // Chequear bloqueo primero.
  const blockUntilStr = await kvGet(blockedKey)
  const now = Date.now()
  if (blockUntilStr) {
    const blockUntil = parseInt(blockUntilStr, 10)
    if (Number.isFinite(blockUntil) && blockUntil > now) {
      return { ok: false, retryAfter: Math.ceil((blockUntil - now) / 1000), remainingShort: 0, remainingLong: 0 }
    }
  }

  // Incrementar contadores atómicos.
  const [short, long] = await Promise.all([
    kvIncr(shortKey, Math.ceil(policy.shortWindowMs / 1000)),
    kvIncr(longKey, Math.ceil(policy.longWindowMs / 1000)),
  ])

  if (short > policy.shortLimit || long > policy.longLimit) {
    const blockUntil = now + policy.blockMs
    await kvSet(blockedKey, String(blockUntil), Math.ceil(policy.blockMs / 1000))
    return { ok: false, retryAfter: Math.ceil(policy.blockMs / 1000), remainingShort: 0, remainingLong: 0 }
  }

  return {
    ok: true, retryAfter: 0,
    remainingShort: Math.max(0, policy.shortLimit - short),
    remainingLong: Math.max(0, policy.longLimit - long),
  }
}

/**
 * rateLimit ahora es async — usa Redis si está configurado, sino in-memory.
 */
export async function rateLimit(ip: string, endpoint: keyof typeof POLICIES = "default"): Promise<RateLimitResult> {
  const policy = POLICIES[endpoint] ?? DEFAULT_POLICY
  const key = `${endpoint}:${ip}`
  if (kvAvailable()) {
    try {
      return await redisLimit(key, policy)
    } catch (err) {
      console.warn("[rate-limit] redis error, falling back to memory:", err)
    }
  }
  return memLimit(key, policy)
}

export async function rateLimitLogin(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, "login")
}

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
