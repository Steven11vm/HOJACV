"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageCircle, Mail, RefreshCw } from "lucide-react"
import type { Lang } from "@/lib/translations"

interface Quote {
  priceUsd: number
  priceCop: number
  complexity: number
  timelineDays: number
  reasoning: string
  includes: string[]
}

const PROJECT_TYPES = [
  { es: "Landing / Sitio institucional", en: "Landing / Institutional site" },
  { es: "E-commerce", en: "E-commerce" },
  { es: "Dashboard / Panel admin", en: "Dashboard / Admin panel" },
  { es: "SaaS a medida", en: "Custom SaaS" },
  { es: "Integración IA / Chatbot", en: "AI integration / Chatbot" },
  { es: "App móvil", en: "Mobile app" },
  { es: "Otro", en: "Other" },
]

const FEATURE_OPTIONS = [
  { es: "Autenticación de usuarios", en: "User auth" },
  { es: "Panel de administración", en: "Admin panel" },
  { es: "Pasarela de pagos", en: "Payment gateway" },
  { es: "Chatbot con IA", en: "AI chatbot" },
  { es: "Reportes PDF/Excel", en: "PDF/Excel reports" },
  { es: "Notificaciones email/WhatsApp", en: "Email/WhatsApp notifications" },
  { es: "Multi-idioma", en: "Multi-language" },
  { es: "Diseño responsive", en: "Responsive design" },
]

const TIMELINES_ES = ["Urgente (< 2 semanas)", "2-4 semanas", "1-2 meses", "Flexible"]
const TIMELINES_EN = ["Urgent (< 2 weeks)", "2-4 weeks", "1-2 months", "Flexible"]

const WHATSAPP = "573046467135"
const EMAIL = "Stevenvilla10@gmail.com"

function fmtUSD(n: number) {
  return `US$${n.toLocaleString("en-US")}`
}
function fmtCOP(n: number) {
  return `$${n.toLocaleString("es-CO")} COP`
}

export function QuoteForm({ lang }: { lang: Lang }) {
  const [projectType, setProjectType] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState("")
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timelines = lang === "es" ? TIMELINES_ES : TIMELINES_EN

  const toggleFeature = (f: string) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setQuote(null)
    setLoading(true)
    try {
      const res = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType,
          description,
          features,
          timeline,
          honeypot: "",
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.quote) {
        setError(
          lang === "es"
            ? "No pude generar la cotización ahora mismo. Intenta de nuevo en un momento o escríbeme directo."
            : "Couldn't generate the quote right now. Try again in a moment or reach out directly.",
        )
      } else {
        setQuote(data.quote)
      }
    } catch {
      setError(
        lang === "es"
          ? "Error de conexión. Verifica tu internet e intenta de nuevo."
          : "Connection error. Check your internet and try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setQuote(null)
    setError(null)
  }

  const waMsg = quote
    ? lang === "es"
      ? `Hola Steven, cotizador me estimó ${fmtUSD(quote.priceUsd)} para: ${description.slice(0, 120)}${description.length > 120 ? "…" : ""}`
      : `Hi Steven, the quote tool estimated ${fmtUSD(quote.priceUsd)} for: ${description.slice(0, 120)}${description.length > 120 ? "…" : ""}`
    : ""

  return (
    <section
      id="cotizacion"
      className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-16 flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            <span>{lang === "es" ? "07 · Cotización" : "07 · Quote"}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            {lang === "es" ? "Estimación con IA · MMXXV" : "AI estimate · MMXXV"}
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          {/* Header block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              {lang === "es" ? "Cuéntame tu proyecto." : "Tell me your project."}
            </h2>
            <div aria-hidden className="mt-8 h-px w-16 bg-foreground/40" />
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {lang === "es"
                ? "Describe lo que quieres construir y un agente IA calcula el precio automáticamente en segundos. Precios de arranque LATAM — busco ganar tu proyecto, no maximizar margen."
                : "Describe what you want to build and an AI agent calculates the price in seconds. LATAM entry pricing — I aim to win your project, not maximize margin."}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              <span>{lang === "es" ? "USD 200 - 2 500 · USD + COP" : "USD 200 - 2,500 · USD + COP"}</span>
            </p>
          </motion.div>

          {/* Form / Result */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!quote ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  className="flex flex-col gap-8"
                >
                  {/* Honeypot invisible */}
                  <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                  <Field label={lang === "es" ? "Tipo de proyecto" : "Project type"}>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full border border-hairline bg-transparent px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground focus:outline-none"
                    >
                      <option value="">{lang === "es" ? "— Selecciona —" : "— Choose —"}</option>
                      {PROJECT_TYPES.map((p) => (
                        <option key={p.en} value={p[lang]} className="bg-background text-foreground">
                          {p[lang]}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label={lang === "es" ? "Descripción del proyecto" : "Project description"}
                    hint={lang === "es"
                      ? "Sé específico: qué hace la app, para quién, y qué funciones clave debe tener."
                      : "Be specific: what the app does, who it's for, key features."}
                  >
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      maxLength={1500}
                      required
                      placeholder={lang === "es"
                        ? "Ejemplo: Plataforma web para gestionar reservas de un gimnasio. Necesito login para clientes, panel admin para el dueño, calendario de clases, notificaciones por WhatsApp y pagos con tarjeta."
                        : "Example: Web platform to manage gym bookings. I need client login, admin panel, class calendar, WhatsApp notifications and card payments."}
                      className="w-full border border-hairline bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                    />
                    <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
                      {description.length} / 1500
                    </p>
                  </Field>

                  <Field label={lang === "es" ? "Funciones (opcional)" : "Features (optional)"}>
                    <div className="flex flex-wrap gap-2">
                      {FEATURE_OPTIONS.map((f) => {
                        const label = f[lang]
                        const active = features.includes(label)
                        return (
                          <button
                            key={f.en}
                            type="button"
                            onClick={() => toggleFeature(label)}
                            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                              active
                                ? "border-foreground bg-foreground text-background"
                                : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </Field>

                  <Field label={lang === "es" ? "Timeline deseado" : "Desired timeline"}>
                    <div className="flex flex-wrap gap-2">
                      {timelines.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                            timeline === t
                              ? "border-foreground bg-foreground text-background"
                              : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {error && (
                    <p className="border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || description.length < 10}
                    className="btn-plain btn-plain-inv w-fit gap-3 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span>{lang === "es" ? "Calculando" : "Calculating"}</span>
                        <span className="flex items-center gap-1" aria-hidden>
                          <span className="inline-block h-1 w-1 rounded-full bg-current animate-loader-dot" style={{ animationDelay: "0ms" }} />
                          <span className="inline-block h-1 w-1 rounded-full bg-current animate-loader-dot" style={{ animationDelay: "150ms" }} />
                          <span className="inline-block h-1 w-1 rounded-full bg-current animate-loader-dot" style={{ animationDelay: "300ms" }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{lang === "es" ? "Calcular precio" : "Calculate price"}</span>
                        <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="flex flex-col gap-8 border border-hairline bg-muted/30 p-8 sm:p-10"
                >
                  {quote.priceUsd === 0 ? (
                    <>
                      <div className="flex flex-col gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          {lang === "es" ? "Necesito más contexto" : "Need more context"}
                        </p>
                        <p className="text-base leading-relaxed text-foreground/90">
                          {quote.reasoning}
                        </p>
                      </div>
                      <button type="button" onClick={reset} className="btn-plain btn-plain-inv w-fit gap-2">
                        <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                        {lang === "es" ? "Volver a intentar" : "Try again"}
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Header con precio */}
                      <div className="flex flex-col gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          {lang === "es" ? "Estimación de arranque" : "Starting estimate"}
                        </p>
                        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                          <p className="font-display text-5xl leading-none text-foreground sm:text-6xl">
                            {fmtUSD(quote.priceUsd)}
                          </p>
                          <p className="font-mono text-sm uppercase tracking-[0.14em] text-muted-foreground">
                            ≈ {fmtCOP(quote.priceCop)}
                          </p>
                        </div>
                      </div>

                      <div aria-hidden className="h-px w-16 bg-foreground/40" />

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <MetaItem
                          label={lang === "es" ? "Complejidad" : "Complexity"}
                          value={`${quote.complexity}/10`}
                        />
                        <MetaItem
                          label={lang === "es" ? "Timeline" : "Timeline"}
                          value={
                            lang === "es"
                              ? `~${quote.timelineDays} días`
                              : `~${quote.timelineDays} days`
                          }
                        />
                      </div>

                      {/* Reasoning */}
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          {lang === "es" ? "Por qué este precio" : "Why this price"}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                          {quote.reasoning}
                        </p>
                      </div>

                      {/* Includes */}
                      {quote.includes.length > 0 && (
                        <div>
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                            {lang === "es" ? "Qué incluye" : "What's included"}
                          </p>
                          <ul className="grid gap-2">
                            {quote.includes.map((it, i) => (
                              <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                                <span aria-hidden className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
                        <a
                          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-plain btn-plain-inv gap-2"
                        >
                          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                          {lang === "es" ? "Continuar por WhatsApp" : "Continue on WhatsApp"}
                        </a>
                        <a
                          href={`mailto:${EMAIL}?subject=${encodeURIComponent(
                            lang === "es" ? "Nuevo proyecto — cotización previa" : "New project — pre-quote",
                          )}&body=${encodeURIComponent(waMsg)}`}
                          className="link-r font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                        >
                          <Mail className="mr-2 inline h-3.5 w-3.5" strokeWidth={2} />
                          {lang === "es" ? "Enviar email" : "Send email"}
                        </a>
                        <button
                          type="button"
                          onClick={reset}
                          className="link-r ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                        >
                          <RefreshCw className="mr-2 inline h-3.5 w-3.5" strokeWidth={2} />
                          {lang === "es" ? "Cotizar otro" : "Quote another"}
                        </button>
                      </div>

                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                        {lang === "es"
                          ? "Estimación indicativa. El precio final se acuerda tras call de discovery (gratis, 30 min)."
                          : "Indicative estimate. Final price agreed after a free 30 min discovery call."}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-muted-foreground/70">{hint}</p>}
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-2xl leading-none text-foreground">{value}</span>
    </div>
  )
}
