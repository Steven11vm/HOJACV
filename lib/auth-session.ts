/**
 * auth-session — sesiones firmadas con HMAC-SHA256 + CSRF double-submit.
 *
 * Cookie de sesión (httpOnly, __Host- en prod, sameSite=strict):
 *   payload  = `<iat>.<exp>.<nonce>`
 *   token    = `<payload>.<hmac(payload)>`   (todo base64url)
 *
 * Propiedades:
 *   - httpOnly     → no accesible por JS del cliente (mitiga XSS-lift).
 *   - __Host-      → fuerza Secure + Path=/ + no-Domain (mitiga cookie tossing
 *                    y ataques de subdominios). Sólo en producción TLS.
 *   - sameSite=Strict → nunca se envía cross-site (mitiga CSRF por navegación).
 *   - iat (issued-at) → permite invalidar por idle timeout (30 min de inactividad
 *                       aunque el TTL absoluto sean 8 h).
 *   - exp (expiración absoluta 8 h) → forzada server-side por firma.
 *   - nonce aleatorio → dos logins seguidos producen cookies distintas
 *                       aunque el reloj coincida (mitiga replay).
 *   - Firma HMAC-SHA256 con AUTH_SECRET → cookie no forjable.
 *   - Comparaciones timing-safe (crypto.timingSafeEqual).
 *
 * CSRF token (NO httpOnly, sameSite=strict, __Host- en prod):
 *   Derivado del session token via HMAC. El cliente lo lee de document.cookie
 *   y lo envía en header X-CSRF-Token en cada mutación. El server valida
 *   header === HMAC(session, "csrf") — defense-in-depth adicional a sameSite.
 */
import crypto from "crypto"

const IS_PROD = process.env.NODE_ENV === "production"

// __Host- exige Secure + Path=/ + no-Domain — no lo aceptan navegadores en HTTP dev.
export const SESSION_COOKIE = IS_PROD ? "__Host-sv_session" : "sv_session"
export const CSRF_COOKIE = IS_PROD ? "__Host-sv_csrf" : "sv_csrf"
export const CSRF_HEADER = "x-csrf-token"

const SESSION_TTL_MS = 8 * 60 * 60 * 1000    // 8h absoluto
const SESSION_IDLE_MS = 30 * 60 * 1000        // 30 min de inactividad

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
    crypto.timingSafeEqual(ba, ba) // burn similar time on length-mismatch
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

/** Crea un token de sesión nuevo con iat+exp+nonce+firma. */
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

/**
 * Verifica firma + expiración absoluta + idle timeout.
 * Devuelve `{ ok: true, payload }` o `{ ok: false, reason }`.
 */
export function verifySessionToken(token: string | undefined | null):
  | { ok: true; iat: number; exp: number; nonce: string }
  | { ok: false; reason: "empty" | "malformed" | "no_secret" | "bad_sig" | "expired" | "idle" }
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
  return { ok: true, iat, exp, nonce }
}

/** ¿La request tiene una sesión válida (firma + exp + idle)? */
export function isSessionAuthed(req: Request): boolean {
  return verifySessionToken(readSessionCookie(req)).ok
}

/** Genera el token CSRF derivado de la sesión — el mismo par (secret, session)
 *  produce siempre el mismo CSRF, lo que permite double-submit sin state extra. */
export function csrfTokenFor(sessionToken: string): string | null {
  const secret = getSecret()
  if (!secret) return null
  return hmac(`csrf:${sessionToken}`, secret)
}

/** Verifica que el header X-CSRF-Token coincide con el que le corresponde a la
 *  cookie de sesión actual. Constant-time. */
export function verifyCsrf(req: Request): boolean {
  const session = readSessionCookie(req)
  if (!session) return false
  const csrfHeader = req.headers.get(CSRF_HEADER)
  const csrfCookie = readCookie(req, CSRF_COOKIE)
  if (!csrfHeader || !csrfCookie) return false
  // Header y cookie deben coincidir (double-submit).
  if (!timingEqualStr(csrfHeader, csrfCookie)) return false
  // Y ambos deben coincidir con el CSRF derivado del session token.
  const expected = csrfTokenFor(session)
  if (!expected) return false
  return timingEqualStr(csrfHeader, expected)
}

/** Compara el password del cliente contra ADMIN_PASSWORD sin timing leak.
 *  También valida que ADMIN_PASSWORD cumpla el mínimo de fortaleza. */
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

function baseCookieAttrs(name: string, value: string, httpOnly: boolean, maxAge: number): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ]
  if (httpOnly) parts.push("HttpOnly")
  // __Host- exige Secure — se añade siempre en prod.
  if (IS_PROD) parts.push("Secure")
  return parts.join("; ")
}

/** Set-Cookie de la sesión (httpOnly). */
export function sessionCookieHeader(token: string, opts?: { ttlSeconds?: number }): string {
  return baseCookieAttrs(SESSION_COOKIE, token, true, opts?.ttlSeconds ?? SESSION_TTL_SECONDS)
}

/** Set-Cookie del CSRF token (NO httpOnly, para que el JS del cliente lo lea). */
export function csrfCookieHeader(csrf: string, opts?: { ttlSeconds?: number }): string {
  return baseCookieAttrs(CSRF_COOKIE, csrf, false, opts?.ttlSeconds ?? SESSION_TTL_SECONDS)
}

/** Set-Cookie de logout — borra ambas. Retorna array (Set-Cookie múltiple). */
export function clearAllCookieHeaders(): string[] {
  return [
    baseCookieAttrs(SESSION_COOKIE, "", true, 0),
    baseCookieAttrs(CSRF_COOKIE, "", false, 0),
  ]
}

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") ?? ""
  // Escape name for RegExp — nuestros nombres son ascii safe, pero por si acaso.
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = raw.match(new RegExp(`(?:^|;\\s*)${safeName}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function readSessionCookie(req: Request): string | null {
  return readCookie(req, SESSION_COOKIE)
}
