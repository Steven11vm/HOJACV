/**
 * auth-session — sesiones firmadas con HMAC-SHA256 + CSRF double-submit +
 * revocation list in-memory.
 *
 * Cookie de sesión (httpOnly, __Host- en prod, sameSite=strict):
 *   payload  = `<iat>.<exp>.<nonce>`
 *   token    = `<payload>.<hmac(payload)>`   (todo base64url)
 *
 * Propiedades:
 *   - httpOnly     → no accesible por JS (mitiga XSS-lift).
 *   - __Host-      → fuerza Secure + Path=/ + no-Domain (mitiga cookie tossing).
 *   - sameSite=Strict → nunca se envía cross-site (mitiga CSRF navegacional).
 *   - iat  → idle timeout server-side (30 min sin actividad → inválida).
 *   - exp  → expiración absoluta (8 h) forzada server-side por firma.
 *   - nonce aleatorio → replay resistance + clave para revocación.
 *   - HMAC-SHA256(AUTH_SECRET) → cookie no forjable.
 *   - Revocation list in-memory (FIX HIGH-3): logout marca el nonce como
 *     revocado; el nonce queda inválido hasta que expira absolutamente
 *     aunque el token sea replayed. Nota operacional: se pierde en cold
 *     start — el worst case es "token válido X minutos después de logout"
 *     hasta que la instancia recicla. Para revocación durable, migrar a
 *     Upstash/Vercel KV con TTL=SESSION_TTL_MS.
 *   - CSRF double-submit: cookie NO httpOnly + header X-CSRF-Token,
 *     ambos deben coincidir con HMAC(secret, "csrf:" + session).
 */
import crypto from "crypto"

const IS_PROD = process.env.NODE_ENV === "production"

export const SESSION_COOKIE = IS_PROD ? "__Host-sv_session" : "sv_session"
export const CSRF_COOKIE = IS_PROD ? "__Host-sv_csrf" : "sv_csrf"
export const CSRF_HEADER = "x-csrf-token"

const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const SESSION_IDLE_MS = 30 * 60 * 1000

export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000
const MIN_ADMIN_PW_LEN = 16
const MIN_AUTH_SECRET_LEN = 32

function getSecret(): string | null {
  const s = process.env.AUTH_SECRET
  if (!s || s.length < MIN_AUTH_SECRET_LEN) return null
  return s
}

function timingEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8")
  const bb = Buffer.from(b, "utf8")
  if (ba.length !== bb.length) {
    crypto.timingSafeEqual(ba, ba)
    return false
  }
  return crypto.timingSafeEqual(ba, bb)
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf
  return b.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function hmac(input: string, secret: string): string {
  return b64url(crypto.createHmac("sha256", secret).update(input).digest())
}

// ---------- Revocation list (fix HIGH-3) ----------
// Map<nonce, expTimestamp> — el nonce queda revocado hasta su exp absoluta.
const revoked = new Map<string, number>()

function gcRevoked() {
  const now = Date.now()
  if (revoked.size < 2000) return
  for (const [nonce, exp] of revoked) {
    if (exp < now) revoked.delete(nonce)
  }
}

function isRevoked(nonce: string): boolean {
  const exp = revoked.get(nonce)
  if (!exp) return false
  if (exp < Date.now()) {
    revoked.delete(nonce)
    return false
  }
  return true
}

function revokeNonce(nonce: string, exp: number) {
  revoked.set(nonce, exp)
  gcRevoked()
}

// ---------- Session tokens ----------

export function createSessionToken(): string | null {
  const secret = getSecret()
  if (!secret) return null
  const now = Date.now()
  const iat = now
  const exp = now + SESSION_TTL_MS
  const nonce = b64url(crypto.randomBytes(12))
  const payload = `${iat}.${exp}.${nonce}`
  return `${payload}.${hmac(payload, secret)}`
}

export function verifySessionToken(token: string | undefined | null):
  | { ok: true; iat: number; exp: number; nonce: string }
  | { ok: false; reason: "empty" | "malformed" | "no_secret" | "bad_sig" | "expired" | "idle" | "revoked" }
{
  if (!token) return { ok: false, reason: "empty" }
  const secret = getSecret()
  if (!secret) return { ok: false, reason: "no_secret" }
  const parts = token.split(".")
  if (parts.length !== 4) return { ok: false, reason: "malformed" }
  const [iatStr, expStr, nonce, sig] = parts
  if (!iatStr || !expStr || !nonce || !sig) return { ok: false, reason: "malformed" }
  const payload = `${iatStr}.${expStr}.${nonce}`
  const expectedSig = hmac(payload, secret)
  if (!timingEqualStr(sig, expectedSig)) return { ok: false, reason: "bad_sig" }
  const iat = parseInt(iatStr, 10)
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(iat) || !Number.isFinite(exp)) return { ok: false, reason: "malformed" }
  const now = Date.now()
  if (now > exp) return { ok: false, reason: "expired" }
  if (now - iat > SESSION_IDLE_MS) return { ok: false, reason: "idle" }
  if (isRevoked(nonce)) return { ok: false, reason: "revoked" }
  return { ok: true, iat, exp, nonce }
}

export function isSessionAuthed(req: Request): boolean {
  return verifySessionToken(readSessionCookie(req)).ok
}

/**
 * Marca la sesión actual como revocada (fix HIGH-3). Se llama desde logout.
 * Si el token es válido, el nonce se guarda como revocado hasta su exp.
 */
export function revokeSession(req: Request): boolean {
  const token = readSessionCookie(req)
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 4) return false
  const [, expStr, nonce] = parts
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp)) return false
  revokeNonce(nonce, exp)
  return true
}

// ---------- CSRF ----------

export function csrfTokenFor(sessionToken: string): string | null {
  const secret = getSecret()
  if (!secret) return null
  return hmac(`csrf:${sessionToken}`, secret)
}

export function verifyCsrf(req: Request): boolean {
  const session = readSessionCookie(req)
  if (!session) return false
  const csrfHeader = req.headers.get(CSRF_HEADER)
  const csrfCookie = readCookie(req, CSRF_COOKIE)
  if (!csrfHeader || !csrfCookie) return false
  if (!timingEqualStr(csrfHeader, csrfCookie)) return false
  const expected = csrfTokenFor(session)
  if (!expected) return false
  return timingEqualStr(csrfHeader, expected)
}

// ---------- Password / config ----------

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || expected.length < MIN_ADMIN_PW_LEN) return false
  return timingEqualStr(input, expected)
}

export function isMisconfigured(): { ok: boolean; reason?: string } {
  if (!process.env.AUTH_SECRET) return { ok: false, reason: "AUTH_SECRET missing" }
  if ((process.env.AUTH_SECRET ?? "").length < MIN_AUTH_SECRET_LEN)
    return { ok: false, reason: `AUTH_SECRET too short (needs >=${MIN_AUTH_SECRET_LEN})` }
  if (!process.env.ADMIN_PASSWORD) return { ok: false, reason: "ADMIN_PASSWORD missing" }
  if ((process.env.ADMIN_PASSWORD ?? "").length < MIN_ADMIN_PW_LEN)
    return { ok: false, reason: `ADMIN_PASSWORD too short (needs >=${MIN_ADMIN_PW_LEN})` }
  return { ok: true }
}

// ---------- Cookie serialization ----------

function baseCookieAttrs(name: string, value: string, httpOnly: boolean, maxAge: number): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ]
  if (httpOnly) parts.push("HttpOnly")
  if (IS_PROD) parts.push("Secure")
  return parts.join("; ")
}

export function sessionCookieHeader(token: string, opts?: { ttlSeconds?: number }): string {
  return baseCookieAttrs(SESSION_COOKIE, token, true, opts?.ttlSeconds ?? SESSION_TTL_SECONDS)
}

export function csrfCookieHeader(csrf: string, opts?: { ttlSeconds?: number }): string {
  return baseCookieAttrs(CSRF_COOKIE, csrf, false, opts?.ttlSeconds ?? SESSION_TTL_SECONDS)
}

export function clearAllCookieHeaders(): string[] {
  return [
    baseCookieAttrs(SESSION_COOKIE, "", true, 0),
    baseCookieAttrs(CSRF_COOKIE, "", false, 0),
  ]
}

/**
 * FIX LOW-2: readCookie envuelve decodeURIComponent en try/catch —
 * cookies malformadas ya no tiran URIError 500.
 */
function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") ?? ""
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = raw.match(new RegExp(`(?:^|;\\s*)${safeName}=([^;]+)`))
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export function readSessionCookie(req: Request): string | null {
  return readCookie(req, SESSION_COOKIE)
}
