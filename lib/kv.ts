/**
 * kv — abstracción sobre Upstash Redis con fallback in-memory.
 *
 * Si UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN están configurados
 * (Vercel Storage → Marketplace → Upstash), usa Redis distribuido:
 * rate-limit y revocation list son consistentes cross-instance.
 * Si no, cae a Map in-memory (best-effort single-instance).
 *
 * Todas las operaciones son fire-and-forget async y devuelven Promise. En
 * caso de error de red del Redis, log warn y fallback silencioso al Map
 * — nunca bloquear una request por un timeout de KV.
 */
import { Redis } from "@upstash/redis"

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    redis = new Redis({ url, token })
    return redis
  } catch (err) {
    console.warn("[kv] failed to init Redis:", err)
    return null
  }
}

export function kvAvailable(): boolean {
  return getRedis() !== null
}

// ---------- Fallback in-memory ----------
type MemEntry = { value: string; exp: number }
const mem = new Map<string, MemEntry>()

function memGet(key: string): string | null {
  const e = mem.get(key)
  if (!e) return null
  if (e.exp && e.exp < Date.now()) {
    mem.delete(key)
    return null
  }
  return e.value
}

function memSet(key: string, value: string, ttlSec?: number) {
  mem.set(key, { value, exp: ttlSec ? Date.now() + ttlSec * 1000 : 0 })
  // Reap ocasional para no crecer sin techo.
  if (mem.size > 5000) {
    const now = Date.now()
    for (const [k, e] of mem) {
      if (e.exp && e.exp < now) mem.delete(k)
      if (mem.size <= 4000) break
    }
  }
}

function memDel(key: string) { mem.delete(key) }
function memIncr(key: string, ttlSec: number): number {
  const raw = memGet(key)
  const n = raw ? parseInt(raw, 10) + 1 : 1
  memSet(key, String(n), ttlSec)
  return n
}

// ---------- Public API ----------

export async function kvGet(key: string): Promise<string | null> {
  const r = getRedis()
  if (r) {
    try {
      const v = await r.get<string>(key)
      return v ?? null
    } catch (err) {
      console.warn("[kv.get] fallback to memory:", err)
    }
  }
  return memGet(key)
}

export async function kvSet(key: string, value: string, ttlSec?: number): Promise<void> {
  const r = getRedis()
  if (r) {
    try {
      if (ttlSec && ttlSec > 0) await r.set(key, value, { ex: ttlSec })
      else await r.set(key, value)
      return
    } catch (err) {
      console.warn("[kv.set] fallback to memory:", err)
    }
  }
  memSet(key, value, ttlSec)
}

export async function kvDel(key: string): Promise<void> {
  const r = getRedis()
  if (r) {
    try {
      await r.del(key)
      return
    } catch (err) {
      console.warn("[kv.del] fallback to memory:", err)
    }
  }
  memDel(key)
}

/**
 * INCR atómico con TTL — para rate-limit distribuido. Devuelve el contador
 * post-incremento. El TTL solo se setea si el key era nuevo (INCR + EXPIRE
 * como pipeline; Upstash Redis lo soporta).
 */
export async function kvIncr(key: string, ttlSec: number): Promise<number> {
  const r = getRedis()
  if (r) {
    try {
      const n = await r.incr(key)
      if (n === 1) await r.expire(key, ttlSec)
      return n
    } catch (err) {
      console.warn("[kv.incr] fallback to memory:", err)
    }
  }
  return memIncr(key, ttlSec)
}
