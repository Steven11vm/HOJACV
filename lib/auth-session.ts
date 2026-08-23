/**
 * auth-session — sesiones firmadas con HMAC-SHA256 para el panel privado.
 *
 * Diseño:
 *   Cookie payload: `<expTs>.<nonce>.<signature>` (base64url en todo)
 *   Signature      = HMAC-SHA256(secret, `<expTs>.<nonce>`)
 *
 * Propiedades de seguridad:
 *   - `httpOnly` + `secure` + `sameSite=strict`: no accesible por JS del
 *     cliente, no sale del origen, obliga TLS en producción.
 *   - Firma HMAC: cookie no forjable sin conocer AUTH_SECRET.
 *   - Expiración corta (8h) forzada server-side vía timestamp firmado.
 *   - `path=/` con `Max-Age` explícito (nunca "session cookie" que dura
 *     lo que el navegador quiera).
 *   - Comparaciones timing-safe (crypto.timingSafeEqual).
 *   - Nonce aleatorio en cada sesión: dos logins seguidos producen cookies
 *     distintas aunque el reloj coincida al ms — mitiga replay.
 */
import crypto from "crypto"

export const SESSION_COOKIE = "sv_session"
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8h

export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000

function getSecret(): string | null {
  const s = process.env.AUTH_SECRET
  if (!s || s.length < 32) return null
  return s
}

function timingEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8")
  const bb = Buffer.from(b, "utf8")
  if (ba.length !== bb.length) {
    // Compare against equal-length buffer to still burn similar time.
    crypto.timingSafeEqual(ba, ba)
    return false
  }
  return crypto.timingSafeEqual(ba, bb)
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf
  return b.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function signPayload(payload: string, secret: string): string {
  const h = crypto.createHmac("sha256", secret).update(payload).digest()
  return b64url(h)
}

export function createSessionToken(): string | null {
  const secret = getSecret()
  if (!secret) return null
  const exp = Date.now() + SESSION_TTL_MS
  const nonce = b64url(crypto.randomBytes(12))
  const payload = `${exp}.${nonce}`
  const sig = signPayload(payload, secret)
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [expStr, nonce, sig] = parts
  if (!expStr || !nonce || !sig) return false
  const payload = `${expStr}.${nonce}`
  const expected = signPayload(payload, secret)
  if (!timingEqualStr(sig, expected)) return false
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  return true
}

/** Compara el password del cliente contra ADMIN_PASSWORD sin timing leak. */
export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return timingEqualStr(input, expected)
}

/** Serializa una cookie para el header `Set-Cookie`. */
export function sessionCookieHeader(token: string, opts?: { ttlSeconds?: number; secure?: boolean }): string {
  const ttl = opts?.ttlSeconds ?? SESSION_TTL_SECONDS
  const secure = opts?.secure ?? process.env.NODE_ENV === "production"
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${ttl}`,
  ]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

/** Header que borra la cookie. */
export function clearCookieHeader(): string {
  const secure = process.env.NODE_ENV === "production"
  const parts = [`${SESSION_COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Strict", "Max-Age=0"]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

/** Lee la cookie de sesión de un `Request`. */
export function readSessionCookie(req: Request): string | null {
  const raw = req.headers.get("cookie") ?? ""
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function isSessionAuthed(req: Request): boolean {
  return verifySessionToken(readSessionCookie(req))
}
