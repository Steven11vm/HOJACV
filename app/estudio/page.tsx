"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Trash2, Check, Circle, LogOut } from "lucide-react"

/** Lee cookie por nombre desde document.cookie (para el CSRF token). */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function csrfName() {
  // Debe coincidir con lib/auth-session.CSRF_COOKIE.
  return typeof window !== "undefined" && window.location.protocol === "https:"
    ? "__Host-sv_csrf"
    : "sv_csrf"
}

function csrfHeaders(): HeadersInit {
  const token = readCookie(csrfName())
  return token ? { "X-CSRF-Token": token } : {}
}

interface Lead {
  id: number
  created_at: string
  project_type: string | null
  plan: string | null
  currency: string | null
  month_label: string | null
  client_brief: string | null
  summary: string | null
  lang: string | null
  ip: string | null
  referer: string | null
  commit1: boolean | null
  commit2: boolean | null
  commit3: boolean | null
  contacted: boolean
}

export default function EstudioPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/estudio/leads", { credentials: "include" })
      if (res.status === 401) {
        setAuthed(false)
        return
      }
      const data = await res.json()
      setLeads(data.leads ?? [])
      setWarning(data.warning ?? null)
      setAuthed(true)
    } catch {
      setError("Error de red")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    setError(null)
    setRetryAfter(null)
    setLoading(true)
    try {
      const res = await fetch("/api/estudio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, honeypot: "" }),
      })
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}))
        setRetryAfter(data.retryAfter ?? 1800)
        setError("Demasiados intentos. Intenta más tarde.")
        return
      }
      if (!res.ok) {
        setError("Credenciales inválidas")
        return
      }
      setPassword("")
      await fetchLeads()
    } catch {
      setError("Error de red")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/estudio/logout", { method: "POST", credentials: "include" }).catch(() => {})
    setAuthed(false)
    setLeads([])
  }

  const toggleContacted = async (id: number, contacted: boolean) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, contacted } : l)))
    await fetch("/api/estudio/leads", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      body: JSON.stringify({ id, contacted }),
    })
  }

  const removeLead = async (id: number) => {
    if (!confirm("¿Eliminar este lead? Esta acción no se puede deshacer.")) return
    setLeads((prev) => prev.filter((l) => l.id !== id))
    await fetch("/api/estudio/leads", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      body: JSON.stringify({ id }),
    })
  }

  const visibleLeads = showAll ? leads : leads.filter((l) => !l.contacted)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-hairline bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3 w-3" strokeWidth={2} />
            <span>Volver al sitio</span>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Estudio · Privado</p>
          {authed ? (
            <button type="button" onClick={logout} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground">
              <LogOut className="h-3 w-3" strokeWidth={2} />
              <span>Salir</span>
            </button>
          ) : (
            <span className="w-16" />
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        {!authed ? (
          <form onSubmit={login} className="mx-auto flex max-w-md flex-col gap-6 border border-hairline bg-muted/30 p-8" autoComplete="off">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Acceso privado</p>
              <h1 className="mt-3 font-display text-3xl leading-tight text-foreground">Estudio</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Ingresa el password. Sesión firmada válida por 8 horas.
              </p>
            </div>
            {/* Honeypot invisible para bots */}
            <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              className="w-full border border-hairline bg-transparent px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground focus:outline-none"
              autoFocus
              maxLength={256}
            />
            {error && (
              <p className="text-sm text-red-400">
                {error}
                {retryAfter && (
                  <span className="mt-1 block text-xs text-red-400/70">
                    Espera ~{Math.ceil(retryAfter / 60)} min antes de intentar de nuevo.
                  </span>
                )}
              </p>
            )}
            <button type="submit" disabled={loading || !password} className="btn-plain btn-plain-inv w-fit gap-2 disabled:opacity-40">
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">Leads</h1>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  {leads.length} totales · {leads.filter((l) => !l.contacted).length} sin contactar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShowAll((v) => !v)} className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground">
                  {showAll ? "Solo pendientes" : "Ver todos"}
                </button>
                <button type="button" onClick={fetchLeads} disabled={loading} className="flex items-center gap-2 border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:bg-muted disabled:opacity-40">
                  <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} strokeWidth={2} />
                  Refrescar
                </button>
              </div>
            </div>

            {warning && (
              <p className="border-l-2 border-amber-400 bg-amber-400/5 p-4 text-sm text-amber-200">
                ⚠️ {warning}. Ve a Vercel Dashboard → Storage y vincula la DB al proyecto.
              </p>
            )}

            {visibleLeads.length === 0 && !loading && (
              <p className="border border-dashed border-hairline p-10 text-center text-sm text-muted-foreground">
                {leads.length === 0 ? "Aún no hay leads. Cuando alguien complete el funnel aparecerá aquí." : "No hay leads pendientes. Cambia a 'Ver todos' para ver los contactados."}
              </p>
            )}

            <div className="flex flex-col gap-3">
              {visibleLeads.map((lead) => {
                const isOpen = openId === lead.id
                const date = new Date(lead.created_at).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                return (
                  <div key={lead.id} className={`border p-5 transition-colors ${lead.contacted ? "border-hairline opacity-70" : "border-foreground/30 bg-muted/40"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">#{lead.id} · {date}</span>
                        {!lead.contacted && (
                          <span className="inline-flex items-center gap-1.5 border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-emerald-400">
                            <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
                            Nuevo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => toggleContacted(lead.id, !lead.contacted)} className="flex items-center gap-2 border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
                          {lead.contacted ? <Check className="h-3 w-3" strokeWidth={2} /> : <Circle className="h-3 w-3" strokeWidth={2} />}
                          {lead.contacted ? "Contactado" : "Pendiente"}
                        </button>
                        <button type="button" onClick={() => removeLead(lead.id)} className="flex items-center gap-1 border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-red-400 hover:text-red-400" title="Eliminar">
                          <Trash2 className="h-3 w-3" strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <Field label="Tipo" value={lead.project_type} />
                      <Field label="Plan" value={lead.plan} />
                      <Field label="Moneda" value={lead.currency} />
                      <Field label="Mes" value={lead.month_label} />
                    </div>

                    {lead.client_brief && (
                      <div className="mt-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Qué escribió el cliente</p>
                        <p className="mt-2 border-l-2 border-foreground/60 pl-4 text-[15px] leading-[1.65] text-foreground/95">{lead.client_brief}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-hairline pt-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        Compromisos: {lead.commit1 ? "✓" : "·"} approach · {lead.commit2 ? "✓" : "·"} rango · {lead.commit3 ? "✓" : "·"} este mes
                      </span>
                      <button type="button" onClick={() => setOpenId(isOpen ? null : lead.id)} className="ml-auto font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground">
                        {isOpen ? "Ocultar" : "Ver más"}
                      </button>
                    </div>

                    {isOpen && lead.summary && (
                      <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap border border-hairline bg-background/60 p-4 font-mono text-[12px] leading-[1.6] text-foreground/90">{lead.summary}</pre>
                    )}
                    {isOpen && (
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">
                        IP {lead.ip} · lang {lead.lang} · ref {lead.referer}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  )
}
