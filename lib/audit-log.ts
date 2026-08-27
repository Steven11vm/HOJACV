/**
 * audit-log — logs estructurados en JSON para grep/monitoring.
 *
 * Formato: una sola línea JSON por evento, visible en Vercel Dashboard > Logs.
 * Nunca loguea el password ni el token de sesión, solo hash truncado.
 */
import crypto from "crypto"

type LogLevel = "info" | "warn" | "error"

interface AuditEvent {
  action: string
  ip?: string
  result?: "ok" | "denied" | "invalid" | "rate_limited" | "error"
  reason?: string
  requestId?: string
  ua?: string
  [key: string]: unknown
}

export function auditLog(level: LogLevel, event: AuditEvent) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    ...event,
  }
  const line = `[AUDIT] ${JSON.stringify(entry)}`
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.log(line)
}

/** Hash truncado (12 chars) — útil para correlacionar eventos sin exponer valor. */
export function fingerprint(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 12)
}

/** Genera un ID corto para trazar una request end-to-end. */
export function newRequestId(): string {
  return crypto.randomBytes(6).toString("hex")
}
