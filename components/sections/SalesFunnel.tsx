"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, MessageCircle, Mail, Calendar, Sparkles, Shield, Zap, TrendingUp, Award } from "lucide-react"
import type { Lang } from "@/lib/translations"
import { useCurrency, pricebook } from "@/lib/currency"

/**
 * SalesFunnel — 7 pasos aplicando Cialdini + Kahneman.
 * Layout stack vertical con tipografía grande y aireada, progress rail
 * horizontal arriba, card del step gigante debajo con animaciones de
 * movimiento en cada elemento (word-by-word reveal, stagger, ping,
 * shimmer bar) para mantener la atención sin perder el foco.
 */

const WHATSAPP = "573046467135"
const EMAIL = "Stevenvilla10@gmail.com"

const SLOTS_TAKEN = 2
const SLOTS_TOTAL = 3

interface Answers {
  projectType: string
  plan: string
  commit1: boolean | null
  commit2: boolean | null
  commit3: boolean | null
}

const EMPTY: Answers = { projectType: "", plan: "", commit1: null, commit2: null, commit3: null }

const EASE = [0.2, 0.8, 0.2, 1] as const

export function SalesFunnel({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const t = TXT[lang]
  const { currency } = useCurrency()
  const pb = pricebook(currency)
  const leadSentRef = useRef(false)

  const update = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }))

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return a.projectType.length > 0
      case 4: return a.plan.length > 0
      case 6: return a.commit1 !== null && a.commit2 !== null && a.commit3 !== null
      default: return true
    }
  }, [step, a])

  const totalSteps = 7
  const now = new Date()
  const monthLabel = now.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { month: "long", year: "numeric" })
  const summary = useMemo(() => buildSummary(a, lang, monthLabel), [a, lang, monthLabel])
  const restart = () => { setA(EMPTY); setStep(0); leadSentRef.current = false }

  // Fire-and-forget lead capture: cuando el cliente marca los 3 SI en el
  // paso 7, envia auto-silencioso al backend para que Steven lo reciba
  // aunque el cliente NO haga click en el CTA de WhatsApp/email.
  useEffect(() => {
    if (leadSentRef.current) return
    if (!(a.commit1 && a.commit2 && a.commit3)) return
    leadSentRef.current = true
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        projectType: a.projectType,
        plan: a.plan,
        currency: currency ?? "USD",
        monthLabel,
        summary,
        lang,
        honeypot: "",
      }),
    }).catch(() => { /* silent — no bloquear UX si el lead falla */ })
  }, [a.commit1, a.commit2, a.commit3, a.projectType, a.plan, currency, monthLabel, summary, lang])

  const currentStep = t.steps[step]

  return (
    <section id="cotizacion" className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Eyebrow superior */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-8 bg-muted-foreground/60" />
            <span>{t.eyebrow}</span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.55em] text-muted-foreground/60">
            {t.subEyebrow}
          </p>
        </motion.div>

        {/* HERO — título gigante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-col items-start gap-6"
        >
          <h2 className="font-display text-5xl leading-[0.98] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl lg:text-[88px]">
            {t.title}
          </h2>
          <p className="max-w-2xl text-lg leading-[1.6] text-muted-foreground md:text-xl md:leading-[1.55]">
            {t.lede}
          </p>
        </motion.div>

        {/* PROGRESS RAIL HORIZONTAL */}
        <div className="mb-16 flex flex-col gap-5">
          <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.32em]">
            <span className="text-foreground">
              {String(step + 1).padStart(2, "0")} · {currentStep.tag}
            </span>
            <span className="text-muted-foreground">
              {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
            </span>
          </div>

          {/* Bar animada con shimmer */}
          <div className="relative h-[3px] w-full overflow-hidden bg-hairline">
            <motion.span
              className="absolute inset-y-0 left-0 bg-foreground"
              initial={false}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <motion.span
              className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ left: "-10%" }}
              animate={{ left: "110%" }}
              transition={{ duration: 2.2, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
            />
          </div>

          {/* Dots de pasos con animación de ping en el activo */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {t.steps.map((s, i) => {
              const isActive = i === step
              const isDone = i < step
              return (
                <button
                  key={s.tag}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] transition-colors ${
                    isActive
                      ? "text-foreground"
                      : isDone
                        ? "text-muted-foreground/70 hover:text-foreground"
                        : "text-muted-foreground/40 hover:text-muted-foreground"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    {isActive && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
                    )}
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${
                        isDone ? "bg-foreground/70" : isActive ? "bg-foreground" : "border border-muted-foreground/40"
                      }`}
                    />
                  </span>
                  <span className="hidden sm:inline">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.tag}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* CARD DEL STEP — gigante, aireada */}
        <div className="relative overflow-hidden border border-hairline bg-muted/30">
          {/* Vermilion accent bar top */}
          <motion.div
            key={`accent-${step}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-foreground to-transparent"
          />

          <div className="min-h-[560px] p-8 sm:p-14 lg:p-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col gap-8"
              >
                {/* Header del step: pill izq + principio der */}
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-mono text-[11px] uppercase tracking-[0.36em] text-muted-foreground"
                  >
                    Paso {String(step + 1).padStart(2, "0")}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="inline-flex items-center gap-2 border border-foreground/50 bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground"
                  >
                    <TrendingUp className="h-3 w-3" strokeWidth={2} />
                    <span>{currentStep.principle}</span>
                  </motion.p>
                </div>

                {/* Título del step — GIGANTE con reveal word-by-word */}
                <WordReveal
                  key={`title-${step}`}
                  text={currentStep.title}
                  className="font-display text-3xl leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
                />

                {currentStep.sub && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-2xl text-base leading-[1.7] text-muted-foreground sm:text-lg"
                  >
                    {currentStep.sub}
                  </motion.p>
                )}

                {/* Rule vermilion animada */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                  style={{ transformOrigin: "left" }}
                  className="h-px w-24 bg-foreground/50"
                  aria-hidden
                />

                {/* CONTENIDO POR STEP */}
                <div className="flex flex-col gap-6">
                  {step === 0 && (
                    <StaggerChildren delay={0.6}>
                      <p className="text-base leading-[1.75] text-foreground/85 sm:text-lg">{t.anchor.intro}</p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <PricePill dim label={t.anchor.agency} amount={pb.anchorAgency} note={t.anchor.agencyNote} />
                        <PricePill dim label={t.anchor.usFreelance} amount={pb.anchorUsFree} note={t.anchor.usNote} />
                        <PricePill highlighted label={t.anchor.steven} amount={pb.anchorSteven} note={t.anchor.stevenNote} />
                      </div>
                      <p className="text-base italic leading-[1.7] text-muted-foreground sm:text-lg">
                        {pb.isCop ? t.anchor.whyCop : t.anchor.why}
                      </p>
                      <FieldLabel>{t.q.projectType}</FieldLabel>
                      <ChipGroup options={t.projectTypes} value={a.projectType} onChange={(v) => update({ projectType: v })} />
                    </StaggerChildren>
                  )}

                  {step === 1 && (
                    <StaggerChildren delay={0.6}>
                      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">{monthLabel}</p>
                        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-foreground">
                          {SLOTS_TAKEN} / {SLOTS_TOTAL} {t.scarcity.taken}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {Array.from({ length: SLOTS_TOTAL }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 + i * 0.15, ease: EASE }}
                            style={{ transformOrigin: "left" }}
                            className={`h-3 flex-1 ${
                              i < SLOTS_TAKEN ? "bg-foreground/70" : "border border-dashed border-emerald-400/60 bg-emerald-400/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.28em] text-emerald-400">
                        <span className="relative inline-flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                        <span>{t.scarcity.remaining.replace("{n}", String(SLOTS_TOTAL - SLOTS_TAKEN))}</span>
                      </p>
                      <p className="border-l-2 border-foreground/60 pl-5 text-base leading-[1.75] text-foreground/90 sm:text-lg">
                        {t.scarcity.why}
                      </p>
                    </StaggerChildren>
                  )}

                  {step === 2 && (
                    <StaggerChildren delay={0.6}>
                      <p className="text-base leading-[1.75] text-foreground/85 sm:text-lg">{t.reciprocity.intro}</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <GiftCard icon={<Zap className="h-5 w-5" strokeWidth={1.6} />} title={t.reciprocity.gift1Title} body={t.reciprocity.gift1Body} />
                        <GiftCard icon={<Shield className="h-5 w-5" strokeWidth={1.6} />} title={t.reciprocity.gift2Title} body={t.reciprocity.gift2Body} />
                        <GiftCard icon={<Sparkles className="h-5 w-5" strokeWidth={1.6} />} title={t.reciprocity.gift3Title} body={t.reciprocity.gift3Body} />
                      </div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                        {t.reciprocity.value}
                      </p>
                    </StaggerChildren>
                  )}

                  {step === 3 && (
                    <StaggerChildren delay={0.6}>
                      <div className="grid grid-cols-3 gap-1 border border-hairline">
                        <Stat n="20+" label={t.proof.projects} />
                        <Stat n="2+" label={t.proof.years} />
                        <Stat n="NPS 9" label={t.proof.nps} />
                      </div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                        {t.proof.deployedFor}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["ORAL-PLUS", "Vetalud", "Tonsorium", "STRVGE Archive", "Emuna Salud", "Beat Generator AI", "Finanzas Pro", "Inventory SaaS"].map((c) => (
                          <motion.span
                            key={c}
                            whileHover={{ y: -2 }}
                            className="border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/90 transition-colors hover:border-foreground"
                          >
                            {c}
                          </motion.span>
                        ))}
                      </div>
                      <blockquote
                        className="border-l-2 border-foreground/60 pl-5 text-lg italic leading-[1.7] text-foreground/90 sm:text-xl"
                        style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                      >
                        {t.proof.quote}
                      </blockquote>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">— {t.proof.quoteAuthor}</p>
                    </StaggerChildren>
                  )}

                  {step === 4 && (
                    <StaggerChildren delay={0.6}>
                      <p className="text-base leading-[1.75] text-foreground/85 sm:text-lg">{t.contrast.intro}</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <PlanCard name={t.contrast.p1Name} price={pb.starter} time={t.contrast.p1Time} bullets={t.contrast.p1Bullets} active={a.plan === t.contrast.p1Name} onClick={() => update({ plan: t.contrast.p1Name })} />
                        <PlanCard featured badge={t.contrast.mostChosen} name={t.contrast.p2Name} price={pb.growth} time={t.contrast.p2Time} bullets={t.contrast.p2Bullets} active={a.plan === t.contrast.p2Name} onClick={() => update({ plan: t.contrast.p2Name })} />
                        <PlanCard name={t.contrast.p3Name} price={pb.complete} time={t.contrast.p3Time} bullets={t.contrast.p3Bullets} active={a.plan === t.contrast.p3Name} onClick={() => update({ plan: t.contrast.p3Name })} />
                      </div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{t.contrast.note}</p>
                    </StaggerChildren>
                  )}

                  {step === 5 && (
                    <StaggerChildren delay={0.6}>
                      <p className="text-base leading-[1.75] text-foreground/85 sm:text-lg">{t.authority.intro}</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <AuthorityRow tech="Next.js" used={t.authority.nextUsed} />
                        <AuthorityRow tech="Claude API" used={t.authority.claudeUsed} />
                        <AuthorityRow tech="Vercel" used={t.authority.vercelUsed} />
                        <AuthorityRow tech="PostgreSQL" used={t.authority.pgUsed} />
                        <AuthorityRow tech="Docker" used={t.authority.dockerUsed} />
                        <AuthorityRow tech="Stripe" used={t.authority.stripeUsed} />
                      </div>
                      <p className="border-l-2 border-foreground/60 pl-5 text-base italic leading-[1.7] text-foreground/90 sm:text-lg">
                        {t.authority.why}
                      </p>
                      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                        <Award className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>{t.authority.creds}</span>
                      </p>
                    </StaggerChildren>
                  )}

                  {step === 6 && (
                    <StaggerChildren delay={0.6}>
                      <p className="text-base leading-[1.75] text-foreground/85 sm:text-lg">{t.commit.intro}</p>
                      <div className="flex flex-col gap-4">
                        <YesNoRow question={t.commit.q1} value={a.commit1} onChange={(v) => update({ commit1: v })} yes={t.yes} no={t.no} />
                        <YesNoRow
                          question={t.commit.q2.replace("{range}", `${pb.rangeLo} – ${pb.rangeHi}`)}
                          value={a.commit2}
                          onChange={(v) => update({ commit2: v })}
                          yes={t.yes} no={t.no}
                        />
                        <YesNoRow question={t.commit.q3} value={a.commit3} onChange={(v) => update({ commit3: v })} yes={t.yes} no={t.no} />
                      </div>

                      {a.commit1 && a.commit2 && a.commit3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.55, ease: EASE }}
                          className="flex flex-col gap-5 border border-emerald-400/40 bg-emerald-400/5 p-6 sm:p-8"
                        >
                          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                            <span>{t.commit.readyTag}</span>
                          </p>
                          <p className="text-base leading-[1.7] text-foreground/90 sm:text-lg">{t.commit.readyBody}</p>
                          <div className="flex flex-wrap items-center gap-4">
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(summary)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-plain btn-plain-inv gap-2"
                            >
                              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                              {t.cta.wa}
                            </motion.a>
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(summary)}`}
                              className="btn-plain gap-2 border border-hairline bg-background text-foreground hover:bg-muted"
                            >
                              <Mail className="h-4 w-4" strokeWidth={1.8} />
                              {t.cta.email}
                            </motion.a>
                            <a
                              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.callMsg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-r font-mono text-[11px] uppercase tracking-[0.2em] text-foreground"
                            >
                              <Calendar className="mr-2 inline h-3.5 w-3.5" strokeWidth={2} />
                              {t.cta.call}
                            </a>
                          </div>
                        </motion.div>
                      )}

                      {(a.commit1 === false || a.commit2 === false || a.commit3 === false) && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-l-2 border-foreground/60 pl-5 text-base leading-[1.7] text-foreground/85 sm:text-lg"
                        >
                          {t.commit.softNo}
                        </motion.p>
                      )}

                      <button
                        type="button"
                        onClick={restart}
                        className="ml-auto font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.restart}
                      </button>
                    </StaggerChildren>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* NAV — Back / Next */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            {t.back}
          </button>
          {step < totalSteps - 1 && (
            <motion.button
              whileHover={{ scale: canAdvance ? 1.03 : 1 }}
              whileTap={{ scale: canAdvance ? 0.97 : 1 }}
              type="button"
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              disabled={!canAdvance}
              className="btn-plain btn-plain-inv gap-3 px-8 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.next}
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- helpers */

function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ")
  return (
    <h3 className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, delay: 0.25 + i * 0.06, ease: EASE }}
          className="inline-block"
        >
          {w}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </h3>
  )
}

function StaggerChildren({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.09, ease: EASE }}
        >
          {child}
        </motion.div>
      ))}
    </>
  )
}

function StepShellUnused() { return null }
void StepShellUnused

function FieldLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground ${className}`}>
      {children}
    </label>
  )
}

function ChipGroup({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt === value
        return (
          <motion.button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            }`}
          >
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}

function PricePill({ label, amount, note, dim, highlighted }: { label: string; amount: string; note?: string; dim?: boolean; highlighted?: boolean }) {
  return (
    <motion.div
      whileHover={highlighted ? { y: -3 } : undefined}
      className={`flex flex-col gap-2 border p-5 transition-all ${
        highlighted
          ? "border-foreground bg-foreground/5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]"
          : dim
            ? "border-hairline opacity-70 line-through decoration-muted-foreground/40"
            : "border-hairline"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground no-underline">{label}</p>
      <p className={`font-display text-2xl leading-none no-underline sm:text-3xl ${highlighted ? "text-foreground" : "text-muted-foreground"}`}>
        {amount}
      </p>
      {note && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 no-underline">{note}</p>}
    </motion.div>
  )
}

function GiftCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex flex-col gap-3 border border-hairline bg-background/40 p-5 transition-colors hover:border-foreground/60"
    >
      <span className="text-foreground">{icon}</span>
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground">{title}</p>
      <p className="text-[14px] leading-[1.65] text-muted-foreground">{body}</p>
    </motion.div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-hairline bg-background/40 p-8 text-center">
      <p className="font-display text-4xl leading-none text-foreground sm:text-5xl">{n}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
    </div>
  )
}

function PlanCard({ name, price, time, bullets, active, featured, badge, onClick }: {
  name: string; price: string; time: string; bullets: string[]; active: boolean; featured?: boolean; badge?: string; onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={`relative flex flex-col gap-4 border p-6 text-left transition-all ${
        active
          ? "border-foreground bg-foreground/5"
          : featured
            ? "border-foreground/60 shadow-[0_24px_50px_-24px_rgba(255,65,20,0.4)]"
            : "border-hairline hover:border-foreground/60"
      }`}
    >
      {featured && badge && (
        <span className="absolute -top-3 left-4 border border-foreground bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
          {badge}
        </span>
      )}
      <p className="font-display text-2xl text-foreground">{name}</p>
      <p className="font-display text-3xl leading-none text-foreground">{price}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{time}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-foreground/85">
            <span aria-hidden className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </motion.button>
  )
}

function AuthorityRow({ tech, used }: { tech: string; used: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-baseline justify-between gap-3 border-b border-hairline py-3"
    >
      <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-foreground">{tech}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{used}</p>
    </motion.div>
  )
}

function YesNoRow({ question, value, onChange, yes, no }: { question: string; value: boolean | null; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex flex-col gap-3 border border-hairline p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <p className="text-base leading-[1.6] text-foreground/90 sm:text-lg">{question}</p>
      <div className="flex shrink-0 gap-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => onChange(true)}
          className={`border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.28em] transition-colors ${
            value === true
              ? "border-foreground bg-foreground text-background"
              : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
          }`}
        >
          {yes}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => onChange(false)}
          className={`border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.28em] transition-colors ${
            value === false
              ? "border-foreground bg-foreground text-background"
              : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
          }`}
        >
          {no}
        </motion.button>
      </div>
    </motion.div>
  )
}

function buildSummary(a: Answers, lang: Lang, monthLabel: string): string {
  return lang === "es"
    ? [
        `Hola Steven, vengo de tu portafolio (funnel de 7 pasos).`,
        ``,
        `— Tipo de proyecto: ${a.projectType || "-"}`,
        `— Plan seleccionado: ${a.plan || "-"}`,
        `— Sabe que tienes ${SLOTS_TOTAL - SLOTS_TAKEN} slot(s) en ${monthLabel}.`,
        `— Compromisos: approach ${a.commit1 ? "OK" : "?"} · rango ${a.commit2 ? "OK" : "?"} · timing este mes ${a.commit3 ? "OK" : "?"}.`,
        ``,
        `¿Cuándo podemos hacer la call gratuita de 30 min?`,
      ].join("\n")
    : [
        `Hi Steven, coming from your portfolio (7-step funnel).`,
        ``,
        `— Project type: ${a.projectType || "-"}`,
        `— Selected plan: ${a.plan || "-"}`,
        `— Knows you have ${SLOTS_TOTAL - SLOTS_TAKEN} slot(s) in ${monthLabel}.`,
        `— Commitments: approach ${a.commit1 ? "OK" : "?"} · range ${a.commit2 ? "OK" : "?"} · this month ${a.commit3 ? "OK" : "?"}.`,
        ``,
        `When can we do the free 30 min call?`,
      ].join("\n")
}

/* ------------------------------------------------------------- copy */

const TXT = {
  es: {
    eyebrow: "07 · Método 7 pasos",
    subEyebrow: "Cialdini · Kahneman",
    title: "Vamos a arrancar tu proyecto.",
    lede: "Siete pasos con principios de persuasión probados. Al final llegas a mi WhatsApp con contexto completo, y agendamos la call de 30 min gratis.",
    doneTag: "Perfil listo",
    back: "Atrás",
    next: "Siguiente",
    yes: "Sí",
    no: "No",
    restart: "Volver a empezar",
    q: { projectType: "¿Qué tipo de proyecto tienes en mente?" },
    projectTypes: ["Landing / Sitio", "E-commerce", "Dashboard", "SaaS a medida", "Integración IA", "App móvil", "Otro"],
    steps: [
      { tag: "Ancla",         principle: "Ancla cognitiva",           title: "El mercado cotiza esto entre US$ 3k y US$ 15k.",  sub: "Referencia real para calibrar tu percepción antes de ver mi precio." },
      { tag: "Escasez",       principle: "Escasez",                    title: "Solo 3 proyectos por mes.",                        sub: "No es marketing — es la única forma de mantener calidad end-to-end." },
      { tag: "Reciprocidad",  principle: "Reciprocidad",               title: "Antes de que decidas, esto va gratis.",            sub: "Tres entregables reales sin compromiso — para que veas cómo trabajo." },
      { tag: "Prueba social", principle: "Prueba social",              title: "Ya lo hicimos, 20 veces.",                          sub: "Los números y las marcas que respaldan cada afirmación." },
      { tag: "Contraste",     principle: "Contraste perceptual",       title: "Tres planes lado a lado.",                          sub: "El del medio es el que arrancan 7 de cada 10 clientes." },
      { tag: "Autoridad",     principle: "Autoridad prestada",         title: "Mismo stack que Netflix, Anthropic y Vercel.",      sub: "No aprendo tech de moda; uso lo que producción del mundo real validó." },
      { tag: "Compromiso",    principle: "Compromiso + consistencia",  title: "Tres micro-sí y estás dentro.",                    sub: "Cada pequeño acuerdo hace más probable el siguiente." },
    ],
    anchor: {
      intro: "Los tres precios reales que enfrentas para el mismo output:",
      agency: "Agencia LATAM",
      agencyNote: "3-6 meses · overhead brutal",
      usFreelance: "Freelance USA",
      usNote: "US$ 60-100/h · 60h típicas",
      steven: "Con Steven",
      stevenNote: "Mismo output · trato directo",
      from: "desde",
      why: "Cobro esto porque estoy construyendo cartera propia. En 6 meses no volverás a ver estos precios en mi CV.",
      whyCop: "En COP cobro precio-vecino, sin markup por tasa de cambio: si eres cliente en Colombia, no te vale lo mismo que a un cliente en USA — y no debería. Prioridad: ganar cartera local antes que maximizar margen. En 6 meses estos precios ya no existen.",
    },
    scarcity: {
      taken: "tomados",
      remaining: "{n} slot disponible este mes",
      why: "Trabajo end-to-end (arquitectura, código, deploy, soporte). Con más de 3 proyectos simultáneos baja la calidad — y prefiero decir 'este mes no' antes que entregar algo tibio.",
    },
    reciprocity: {
      intro: "Antes de que pongas un peso, esto va gratis y sin ataduras:",
      gift1Title: "Audit 15 min",
      gift1Body: "Revisión técnica rápida de tu producto o idea actual. Te digo qué está bien, qué mejoraría, y qué no tocar.",
      gift2Title: "Mini-diagnóstico",
      gift2Body: "Documento escrito con arquitectura recomendada, stack, riesgos y estimación de tiempo. Tuyo, uses o no mi servicio.",
      gift3Title: "Call 30 min",
      gift3Body: "Sin agenda de venta. Preguntas técnicas, brainstorming, o feedback franco sobre tu roadmap.",
      value: "Valor equivalente: ~US$ 250 · Costo para ti: US$ 0",
    },
    proof: {
      projects: "Proyectos en producción",
      years: "Años shippeando",
      nps: "Freelance",
      deployedFor: "Marcas que hoy corren código mío",
      quote: "Steven migró nuestro stack legacy sin caídas en producción y automatizó el 40 % del soporte con IA. Cortó 3 semanas de estimación a la mitad.",
      quoteAuthor: "ORAL-PLUS (SKY S.A.S) · producción desde 2024",
    },
    contrast: {
      intro: "Los tres planes reales. Cualquiera se cotiza formal después de la call de discovery.",
      mostChosen: "Más elegido",
      p1Name: "Starter",
      p1Time: "5-10 días",
      p1Bullets: ["Landing o MVP simple", "Diseño responsive", "Deploy en Vercel", "Formulario + WhatsApp"],
      p2Name: "Growth",
      p2Time: "3-4 semanas",
      p2Bullets: ["SaaS con auth + admin panel", "Base de datos SQL/NoSQL", "1 integración IA (chat / RAG / clasificador)", "Deploy CI/CD + OWASP básico"],
      p3Name: "Complete",
      p3Time: "6-8 semanas",
      p3Bullets: ["Sistema multi-módulo end-to-end", "Auth con roles + pagos (Stripe)", "IA aplicada + dashboards analíticos", "Deploy hardened + soporte 30 días"],
      note: "Elegir plan es indicativo — el alcance final se ajusta en la call gratuita.",
    },
    authority: {
      intro: "El stack no es 'moderno' porque suene bien. Es el que la industria ya validó en producción a escala:",
      nextUsed: "Netflix · TikTok · Twitch",
      claudeUsed: "Anthropic · Amazon · Notion",
      vercelUsed: "Nike · Loom · Sonos",
      pgUsed: "Instagram · Reddit · Twitch",
      dockerUsed: "PayPal · eBay · ADP",
      stripeUsed: "Shopify · Slack · Amazon",
      why: "No aprendo lo trending; adopto lo que producción del mundo real ya sobrevivió. Menos riesgo para ti, más rápido para mí.",
      creds: "Tecnólogo ADSO · SENA · Miembro comunidad Anthropic",
    },
    commit: {
      intro: "Tres preguntas cortas — cada sí hace más probable el siguiente:",
      q1: "¿Te hace sentido el approach que viste hasta aquí?",
      q2: "¿El rango de precio ({range}) te funciona?",
      q3: "¿Quieres tener producto en manos antes de fin de mes?",
      readyTag: "Estás dentro",
      readyBody: "Tres sí. Con ese contexto llego a la call con propuesta preliminar sobre la mesa — no te hago perder tiempo repitiendo lo que ya cerramos aquí.",
      softNo: "Sin problema — quédate con el diagnóstico gratis (paso 3), y cuando esté listo vuelves. Puedes escribirme ahora mismo por WhatsApp para reclamarlo.",
    },
    cta: {
      wa: "Enviar perfil por WhatsApp",
      email: "Enviar por email",
      call: "Agendar call 30 min (gratis)",
    },
    emailSubject: "Nuevo proyecto — perfil desde portafolio",
    callMsg: "Hola Steven, quiero agendar la call gratuita de 30 min. ¿Qué horario tienes esta semana?",
  },
  en: {
    eyebrow: "07 · 7-step method",
    subEyebrow: "Cialdini · Kahneman",
    title: "Let's start your project.",
    lede: "Seven steps applying proven persuasion principles. At the end you land in my WhatsApp with full context, and we book the free 30 min call.",
    doneTag: "Profile ready",
    back: "Back",
    next: "Next",
    yes: "Yes",
    no: "No",
    restart: "Start over",
    q: { projectType: "What kind of project do you have in mind?" },
    projectTypes: ["Landing / Site", "E-commerce", "Dashboard", "Custom SaaS", "AI Integration", "Mobile app", "Other"],
    steps: [
      { tag: "Anchor",       principle: "Cognitive anchor",           title: "The market prices this at US$ 3k–15k.",              sub: "A real reference to calibrate your perception before you see my price." },
      { tag: "Scarcity",     principle: "Scarcity",                    title: "Only 3 projects per month.",                          sub: "Not marketing — the only way to keep quality end-to-end." },
      { tag: "Reciprocity",  principle: "Reciprocity",                 title: "Before you decide, this is on me.",                   sub: "Three real deliverables with zero strings — so you see how I work." },
      { tag: "Social proof", principle: "Social proof",                title: "We already did this, 20 times.",                       sub: "The numbers and the brands that back every claim." },
      { tag: "Contrast",     principle: "Perceptual contrast",         title: "Three plans, side by side.",                           sub: "The middle one is where 7 in 10 clients land." },
      { tag: "Authority",    principle: "Borrowed authority",          title: "Same stack Netflix, Anthropic and Vercel use.",        sub: "I don't chase trending tech; I use what real production has validated." },
      { tag: "Commitment",   principle: "Commitment + consistency",    title: "Three micro-yesses and you're in.",                   sub: "Each small agreement makes the next one more likely." },
    ],
    anchor: {
      intro: "Three real prices you face for the same output:",
      agency: "LATAM Agency",
      agencyNote: "3-6 months · huge overhead",
      usFreelance: "US Freelance",
      usNote: "US$ 60-100/h · typical 60h",
      steven: "With Steven",
      stevenNote: "Same output · direct",
      from: "from",
      why: "I charge this because I'm building my client base. Six months from now these prices won't be on my CV anymore.",
      whyCop: "In COP I charge local-neighbor pricing, no FX-markup: if you're a client in Colombia, the number shouldn't match what a US client pays. Priority: build LATAM portfolio first, maximize margin later. In 6 months these prices are gone.",
    },
    scarcity: {
      taken: "taken",
      remaining: "{n} slot open this month",
      why: "I work end-to-end (architecture, code, deploy, support). Past 3 concurrent projects quality drops — I'd rather say 'not this month' than ship something lukewarm.",
    },
    reciprocity: {
      intro: "Before you spend a dime, this is on me, no strings:",
      gift1Title: "15 min audit",
      gift1Body: "Quick technical review of your current product or idea. What's fine, what I'd improve, what not to touch.",
      gift2Title: "Mini-diagnosis",
      gift2Body: "Written doc with recommended architecture, stack, risks and time estimate. Yours whether you hire me or not.",
      gift3Title: "30 min call",
      gift3Body: "No sales agenda. Tech questions, brainstorming, or honest feedback on your roadmap.",
      value: "Equivalent value: ~US$ 250 · Cost to you: US$ 0",
    },
    proof: {
      projects: "Shipped projects",
      years: "Years shipping",
      nps: "Freelance",
      deployedFor: "Brands running my code today",
      quote: "Steven migrated our legacy stack with zero production downtime and automated 40 % of support with AI. He cut a 3-week estimate in half.",
      quoteAuthor: "ORAL-PLUS (SKY S.A.S) · in production since 2024",
    },
    contrast: {
      intro: "The three real plans. Any of them gets a formal quote after the discovery call.",
      mostChosen: "Most chosen",
      p1Name: "Starter",
      p1Time: "5-10 days",
      p1Bullets: ["Landing or simple MVP", "Responsive design", "Deploy on Vercel", "Form + WhatsApp"],
      p2Name: "Growth",
      p2Time: "3-4 weeks",
      p2Bullets: ["SaaS with auth + admin panel", "SQL/NoSQL database", "1 AI integration (chat / RAG / classifier)", "CI/CD deploy + basic OWASP"],
      p3Name: "Complete",
      p3Time: "6-8 weeks",
      p3Bullets: ["End-to-end multi-module system", "Role-based auth + payments (Stripe)", "Applied AI + analytics dashboards", "Hardened deploy + 30-day support"],
      note: "Plan choice is indicative — final scope is adjusted in the free call.",
    },
    authority: {
      intro: "The stack isn't 'modern' because it sounds good. It's what the industry already runs at scale in production:",
      nextUsed: "Netflix · TikTok · Twitch",
      claudeUsed: "Anthropic · Amazon · Notion",
      vercelUsed: "Nike · Loom · Sonos",
      pgUsed: "Instagram · Reddit · Twitch",
      dockerUsed: "PayPal · eBay · ADP",
      stripeUsed: "Shopify · Slack · Amazon",
      why: "I don't learn what's trending; I adopt what real-world production has survived. Less risk for you, faster for me.",
      creds: "Software Analyst · SENA · Anthropic community member",
    },
    commit: {
      intro: "Three short questions — each yes makes the next more likely:",
      q1: "Does the approach make sense so far?",
      q2: "Does the price range ({range}) work for you?",
      q3: "Do you want product in your hands before month-end?",
      readyTag: "You're in",
      readyBody: "Three yesses. With that context I show up at the call with a preliminary proposal on the table — no wasting your time re-covering what we already agreed here.",
      softNo: "No problem — keep the free diagnosis (step 3), and come back when you're ready. You can DM me on WhatsApp right now to claim it.",
    },
    cta: {
      wa: "Send profile via WhatsApp",
      email: "Send via email",
      call: "Book free 30 min call",
    },
    emailSubject: "New project — profile from portfolio",
    callMsg: "Hi Steven, I'd like to book the free 30 min call. What slots do you have this week?",
  },
} as const
