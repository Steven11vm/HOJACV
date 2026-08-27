/**
 * TOTP RFC 6238 — implementación mínima sin dependencias externas.
 *
 * Usa HMAC-SHA1 (spec) sobre contador T = floor(now / 30s). Ventana de
 * tolerancia ±1 step para compensar drift de reloj de ~30 s.
 *
 * `otpauth://` URI compatible con Google Authenticator, Authy, 1Password.
 */
import crypto from "crypto"

const STEP_SECONDS = 30
const DIGITS = 6

/** Genera un secreto base32 de 20 bytes (160 bits) — spec RFC 4226. */
export function generateTotpSecret(): string {
  const buf = crypto.randomBytes(20)
  return base32Encode(buf)
}

/** Genera el URI otpauth:// para pegar en apps de autenticador o QR. */
export function totpUri(secret: string, account: string, issuer = "Steven CV"): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  })
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?${params.toString()}`
}

/** Devuelve el código actual de 6 dígitos para un secreto (base32). */
export function totpCode(secret: string, at: number = Date.now()): string {
  return computeCode(secret, Math.floor(at / 1000 / STEP_SECONDS))
}

/**
 * Verifica un código contra el secreto en una ventana ±window steps.
 * Comparación timing-safe.
 */
export function totpVerify(secret: string, code: string, window = 1): boolean {
  const clean = code.replace(/\s/g, "").padStart(DIGITS, "0")
  if (clean.length !== DIGITS || !/^\d+$/.test(clean)) return false
  const t = Math.floor(Date.now() / 1000 / STEP_SECONDS)
  for (let i = -window; i <= window; i++) {
    const candidate = computeCode(secret, t + i)
    if (timingEqual(candidate, clean)) return true
  }
  return false
}

function timingEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const ba = Buffer.from(a, "utf8")
  const bb = Buffer.from(b, "utf8")
  return crypto.timingSafeEqual(ba, bb)
}

function computeCode(base32Secret: string, counter: number): string {
  const key = base32Decode(base32Secret)
  // Counter como big-endian de 8 bytes.
  const buf = Buffer.alloc(8)
  buf.writeUInt32BE(Math.floor(counter / 0x1_0000_0000), 0)
  buf.writeUInt32BE(counter >>> 0, 4)
  const hmac = crypto.createHmac("sha1", key).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const bin =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  const code = (bin % Math.pow(10, DIGITS)).toString().padStart(DIGITS, "0")
  return code
}

// ---------- Base32 (RFC 4648) ----------
const B32_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function base32Encode(buf: Buffer): string {
  let bits = 0
  let value = 0
  let out = ""
  for (const b of buf) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) {
      out += B32_ALPHA[(value >>> (bits - 5)) & 0x1f]
      bits -= 5
    }
  }
  if (bits > 0) out += B32_ALPHA[(value << (5 - bits)) & 0x1f]
  return out
}

function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "")
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = B32_ALPHA.indexOf(ch)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(out)
}
