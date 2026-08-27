"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"

/**
 * /estudio/setup-2fa — asistente de setup de 2FA TOTP.
 *
 * Flujo:
 *   1. Admin ingresa ADMIN_PASSWORD (bootstrap sin 2FA).
 *   2. Server genera secreto TOTP + URI otpauth.
 *   3. Admin escanea QR con Google Authenticator / Authy / 1Password.
 *   4. Admin copia el secreto y lo mete en Vercel env vars como TOTP_SECRET.
 *   5. Redeploy. A partir de ahí el login exige código TOTP además del password.
 *
 * QR se renderiza vía api.qrserver.com (imagen externa; la CSP permite
 * img-src https:).
 */
export default function Setup2FAPage() {
  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState<string | null>(null)
  const [uri, setUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch("/api/estudio/2fa-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setErr(res.status === 401 ? "Password incorrecto" : "Error del servidor")
        return
      }
      const data = await res.json()
      setSecret(data.secret)
      setUri(data.uri)
    } catch {
      setErr("Error de red")
    } finally {
      setLoading(false)
    }
  }

  const copySecret = async () => {
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const qrUrl = uri
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(uri)}`
    : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-hairline bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <Link href="/estudio" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3 w-3" strokeWidth={2} />
            Volver al dashboard
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Estudio · Setup 2FA</p>
          <span className="w-16" />
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Bootstrap · TOTP RFC 6238</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">Configurar 2FA</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Genera un secreto TOTP, escanéalo en tu app de autenticador, y persístelo en Vercel como
            <code className="mx-1 font-mono text-[13px] text-foreground">TOTP_SECRET</code>.
            A partir del próximo deploy, el login exigirá el código de 6 dígitos además del password.
          </p>
        </div>

        {!secret ? (
          <form onSubmit={generate} className="flex flex-col gap-6 border border-hairline bg-muted/30 p-8">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Confirma con ADMIN_PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                maxLength={256}
                className="mt-2 w-full border border-hairline bg-transparent px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground focus:outline-none"
                autoFocus
              />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button type="submit" disabled={loading || !password} className="btn-plain btn-plain-inv w-fit gap-2 disabled:opacity-40">
              {loading ? "Generando…" : "Generar secreto"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Paso 1: QR */}
            <div className="border border-hairline bg-muted/30 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Paso 01</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Escanea con tu app</h2>
              <p className="mt-2 text-sm text-muted-foreground">Google Authenticator, Authy, 1Password, Bitwarden — cualquier app TOTP.</p>
              {qrUrl && (
                <div className="mt-6 flex justify-center bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="QR TOTP setup" width={280} height={280} />
                </div>
              )}
            </div>

            {/* Paso 2: Secreto manual */}
            <div className="border border-hairline bg-muted/30 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Paso 02</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Guarda el secreto</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cópialo y agrégalo en Vercel → <code className="font-mono text-[13px] text-foreground">Settings → Environment Variables</code>
                {" "}como <code className="font-mono text-[13px] text-foreground">TOTP_SECRET</code> en Production + Preview + Development.
              </p>
              <div className="mt-4 flex items-center gap-3 border border-hairline bg-background p-4">
                <code className="flex-1 break-all font-mono text-xs text-foreground sm:text-sm">{secret}</code>
                <button type="button" onClick={copySecret} className="flex items-center gap-2 border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:bg-muted">
                  {copied ? <Check className="h-3 w-3" strokeWidth={2} /> : <Copy className="h-3 w-3" strokeWidth={2} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Paso 3: Redeploy */}
            <div className="border border-hairline bg-muted/30 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Paso 03</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Redeploy</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                En Vercel → Deployments → último → menú <code className="font-mono text-[13px] text-foreground">…</code> → Redeploy.
                A partir de ese deploy, el login pedirá el código TOTP además del password.
              </p>
              <p className="mt-4 border-l-2 border-amber-400 bg-amber-400/5 p-4 text-xs text-amber-200">
                ⚠️ Guarda el secreto en un password manager como backup. Si pierdes acceso a la app TOTP
                y no tienes el secreto, tendrás que borrar <code className="font-mono">TOTP_SECRET</code> en Vercel
                y redeploy para volver a entrar solo con password.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
