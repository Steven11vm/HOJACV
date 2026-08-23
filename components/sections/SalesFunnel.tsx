"use client"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, MessageCircle, Mail, Calendar, Sparkles, Shield, Zap, Users, TrendingUp, Award } from "lucide-react"
import type { Lang } from "@/lib/translations"

/**
 * SalesFunnel — 7 pasos, cada uno aplica un principio de persuasion
 * (Cialdini + Kahneman) al cliente antes de pedirle el si:
 *
 *  01 Ancla cognitiva      → precio de referencia del mercado vs Steven
 *  02 Escasez artificial   → 3 slots/mes + deadline visible
 *  03 Reciprocidad         → audit + call gratis ANTES de pedir compra
 *  04 Prueba social        → numeros y logos de casos reales
 *  05 Contraste perceptual → 3 planes con el del medio destacado
 *  06 Autoridad prestada   → stack usado por gigantes tech
 *  07 Compromiso + consistencia → micro-yeses hasta el cierre
 *
 * El cierre pide un WhatsApp con perfil pre-armado, no un numero — el
 * precio se acuerda offline con contexto real.
 */

const WHATSAPP = "573046467135"
const EMAIL = "Stevenvilla10@gmail.com"

const SLOTS_TAKEN = 2
const SLOTS_TOTAL = 3

interface Answers {
  projectType: string
  plan: string
  commit1: boolean | null // approach makes sense
  commit2: boolean | null // budget range works
  commit3: boolean | null // start this month
}

const EMPTY: Answers = {
  projectType: "",
  plan: "",
  commit1: null,
  commit2: null,
  commit3: null,
}

export function SalesFunnel({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const t = TXT[lang]

  const update = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }))

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return a.projectType.length > 0
      case 1: return true
      case 2: return true
      case 3: return true
      case 4: return a.plan.length > 0
      case 5: return true
      case 6: return a.commit1 !== null && a.commit2 !== null && a.commit3 !== null
      default: return true
    }
  }, [step, a])

  const totalSteps = 7
  const now = new Date()
  const monthLabel = now.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { month: "long", year: "numeric" })
  const summary = useMemo(() => buildSummary(a, lang, monthLabel), [a, lang, monthLabel])

  const restart = () => {
    setA(EMPTY)
    setStep(0)
  }

  return (
    <section
      id="cotizacion"
      className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-16 flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            <span>{t.eyebrow}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            {t.subEyebrow}
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              {t.title}
            </h2>
            <div aria-hidden className="mt-8 h-px w-16 bg-foreground/40" />
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.lede}
            </p>

            <div className="mt-12 flex flex-col gap-4">
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <span>{step < totalSteps ? `${String(step + 1).padStart(2, "0")} · ${t.steps[step].tag}` : t.doneTag}</span>
                <span>{String(Math.min(step + 1, totalSteps)).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}</span>
              </div>
              <div className="relative h-px w-full overflow-hidden bg-hairline">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-foreground"
                  initial={false}
                  animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                  transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <ol className="mt-2 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em]">
                {t.steps.map((s, i) => (
                  <li
                    key={s.tag}
                    className={`flex items-center gap-3 transition-colors ${
                      i < step
                        ? "text-muted-foreground/60 line-through decoration-muted-foreground/40"
                        : i === step
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    <span className="inline-block w-6 text-right">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.tag}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full"
          >
            <div className="min-h-[520px] border border-hairline bg-muted/30 p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  className="flex flex-col gap-6"
                >
                  {/* 01 · ANCLA COGNITIVA */}
                  {step === 0 && (
                    <StepShell num={1} title={t.steps[0].title} sub={t.steps[0].sub} principle={t.steps[0].principle}>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.anchor.intro}</p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <PricePill dim label={t.anchor.agency} amount="US$ 8k–15k" note={t.anchor.agencyNote} />
                        <PricePill dim label={t.anchor.usFreelance} amount="US$ 3k–6k" note={t.anchor.usNote} />
                        <PricePill highlighted label={t.anchor.steven} amount="desde US$ 400" note={t.anchor.stevenNote} />
                      </div>
                      <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
                        {t.anchor.why}
                      </p>
                      <FieldLabel className="mt-6">{t.q.projectType}</FieldLabel>
                      <ChipGroup
                        options={t.projectTypes}
                        value={a.projectType}
                        onChange={(v) => update({ projectType: v })}
                      />
                    </StepShell>
                  )}

                  {/* 02 · ESCASEZ ARTIFICIAL */}
                  {step === 1 && (
                    <StepShell num={2} title={t.steps[1].title} sub={t.steps[1].sub} principle={t.steps[1].principle}>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{monthLabel}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground">
                            {SLOTS_TAKEN} / {SLOTS_TOTAL} {t.scarcity.taken}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {Array.from({ length: SLOTS_TOTAL }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 ${
                                i < SLOTS_TAKEN
                                  ? "bg-foreground/70"
                                  : "border border-dashed border-emerald-400/60 bg-emerald-400/10"
                              }`}
                              aria-label={i < SLOTS_TAKEN ? t.scarcity.slotTaken : t.scarcity.slotFree}
                            />
                          ))}
                        </div>
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-400">
                          <span className="relative inline-flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                          <span>{t.scarcity.remaining.replace("{n}", String(SLOTS_TOTAL - SLOTS_TAKEN))}</span>
                        </p>
                      </div>
                      <p className="mt-4 border-l-2 border-foreground/60 pl-4 text-sm leading-relaxed text-foreground/85">
                        {t.scarcity.why}
                      </p>
                    </StepShell>
                  )}

                  {/* 03 · RECIPROCIDAD */}
                  {step === 2 && (
                    <StepShell num={3} title={t.steps[2].title} sub={t.steps[2].sub} principle={t.steps[2].principle}>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.reciprocity.intro}</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <GiftCard icon={<Zap className="h-4 w-4" strokeWidth={1.6} />} title={t.reciprocity.gift1Title} body={t.reciprocity.gift1Body} />
                        <GiftCard icon={<Shield className="h-4 w-4" strokeWidth={1.6} />} title={t.reciprocity.gift2Title} body={t.reciprocity.gift2Body} />
                        <GiftCard icon={<Sparkles className="h-4 w-4" strokeWidth={1.6} />} title={t.reciprocity.gift3Title} body={t.reciprocity.gift3Body} />
                      </div>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        {t.reciprocity.value}
                      </p>
                    </StepShell>
                  )}

                  {/* 04 · PRUEBA SOCIAL */}
                  {step === 3 && (
                    <StepShell num={4} title={t.steps[3].title} sub={t.steps[3].sub} principle={t.steps[3].principle}>
                      <div className="grid grid-cols-3 gap-1 border border-hairline">
                        <Stat n="20+" label={t.proof.projects} />
                        <Stat n="2+" label={t.proof.years} />
                        <Stat n="NPS 9" label={t.proof.nps} />
                      </div>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        {t.proof.deployedFor}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["ORAL-PLUS", "Vetalud", "Tonsorium", "STRVGE Archive", "Emuna Salud", "Beat Generator AI", "Finanzas Pro", "Inventory SaaS"].map((c) => (
                          <span key={c} className="border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/85">
                            {c}
                          </span>
                        ))}
                      </div>
                      <blockquote
                        className="mt-6 border-l-2 border-foreground/60 pl-4 text-sm italic leading-relaxed text-foreground/90"
                        style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                      >
                        {t.proof.quote}
                      </blockquote>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        — {t.proof.quoteAuthor}
                      </p>
                    </StepShell>
                  )}

                  {/* 05 · CONTRASTE PERCEPTUAL */}
                  {step === 4 && (
                    <StepShell num={5} title={t.steps[4].title} sub={t.steps[4].sub} principle={t.steps[4].principle}>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.contrast.intro}</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <PlanCard
                          name={t.contrast.p1Name}
                          price="US$ 400"
                          time={t.contrast.p1Time}
                          bullets={t.contrast.p1Bullets}
                          active={a.plan === t.contrast.p1Name}
                          onClick={() => update({ plan: t.contrast.p1Name })}
                        />
                        <PlanCard
                          featured
                          badge={t.contrast.mostChosen}
                          name={t.contrast.p2Name}
                          price="US$ 1 200"
                          time={t.contrast.p2Time}
                          bullets={t.contrast.p2Bullets}
                          active={a.plan === t.contrast.p2Name}
                          onClick={() => update({ plan: t.contrast.p2Name })}
                        />
                        <PlanCard
                          name={t.contrast.p3Name}
                          price="US$ 2 200"
                          time={t.contrast.p3Time}
                          bullets={t.contrast.p3Bullets}
                          active={a.plan === t.contrast.p3Name}
                          onClick={() => update({ plan: t.contrast.p3Name })}
                        />
                      </div>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {t.contrast.note}
                      </p>
                    </StepShell>
                  )}

                  {/* 06 · AUTORIDAD PRESTADA */}
                  {step === 5 && (
                    <StepShell num={6} title={t.steps[5].title} sub={t.steps[5].sub} principle={t.steps[5].principle}>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.authority.intro}</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AuthorityRow tech="Next.js" used={t.authority.nextUsed} />
                        <AuthorityRow tech="Claude API" used={t.authority.claudeUsed} />
                        <AuthorityRow tech="Vercel" used={t.authority.vercelUsed} />
                        <AuthorityRow tech="PostgreSQL" used={t.authority.pgUsed} />
                        <AuthorityRow tech="Docker" used={t.authority.dockerUsed} />
                        <AuthorityRow tech="Stripe" used={t.authority.stripeUsed} />
                      </div>
                      <p className="mt-4 border-l-2 border-foreground/60 pl-4 text-sm italic leading-relaxed text-foreground/90">
                        {t.authority.why}
                      </p>
                      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        <Award className="h-3 w-3" strokeWidth={2} />
                        <span>{t.authority.creds}</span>
                      </p>
                    </StepShell>
                  )}

                  {/* 07 · COMPROMISO + CONSISTENCIA */}
                  {step === 6 && (
                    <StepShell num={7} title={t.steps[6].title} sub={t.steps[6].sub} principle={t.steps[6].principle}>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.commit.intro}</p>
                      <div className="flex flex-col gap-3">
                        <YesNoRow
                          question={t.commit.q1}
                          value={a.commit1}
                          onChange={(v) => update({ commit1: v })}
                          yes={t.yes} no={t.no}
                        />
                        <YesNoRow
                          question={t.commit.q2}
                          value={a.commit2}
                          onChange={(v) => update({ commit2: v })}
                          yes={t.yes} no={t.no}
                        />
                        <YesNoRow
                          question={t.commit.q3}
                          value={a.commit3}
                          onChange={(v) => update({ commit3: v })}
                          yes={t.yes} no={t.no}
                        />
                      </div>

                      {a.commit1 && a.commit2 && a.commit3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 flex flex-col gap-4 border border-emerald-400/40 bg-emerald-400/5 p-5"
                        >
                          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            <span>{t.commit.readyTag}</span>
                          </p>
                          <p className="text-sm leading-relaxed text-foreground/90">{t.commit.readyBody}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <a
                              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(summary)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-plain btn-plain-inv gap-2"
                            >
                              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                              {t.cta.wa}
                            </a>
                            <a
                              href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(summary)}`}
                              className="btn-plain gap-2 border border-hairline bg-background text-foreground hover:bg-muted"
                            >
                              <Mail className="h-4 w-4" strokeWidth={1.8} />
                              {t.cta.email}
                            </a>
                            <a
                              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.callMsg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-r font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                            >
                              <Calendar className="mr-2 inline h-3.5 w-3.5" strokeWidth={2} />
                              {t.cta.call}
                            </a>
                          </div>
                        </motion.div>
                      )}

                      {(a.commit1 === false || a.commit2 === false || a.commit3 === false) && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 border-l-2 border-foreground/60 pl-4 text-sm leading-relaxed text-foreground/85"
                        >
                          {t.commit.softNo}
                        </motion.p>
                      )}

                      <button
                        type="button"
                        onClick={restart}
                        className="ml-auto mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.restart}
                      </button>
                    </StepShell>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                {t.back}
              </button>
              {step < totalSteps - 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
                  disabled={!canAdvance}
                  className="btn-plain btn-plain-inv gap-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t.next}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- helpers ---------------- */

function StepShell({
  num,
  title,
  sub,
  principle,
  children,
}: {
  num: number
  title: string
  sub?: string
  principle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          Paso {String(num).padStart(2, "0")}
        </p>
        <p className="inline-flex items-center gap-2 border border-hairline bg-background px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/80">
          <TrendingUp className="h-3 w-3" strokeWidth={2} />
          <span>{principle}</span>
        </p>
      </div>
      <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">{title}</h3>
      {sub && <p className="text-sm leading-relaxed text-muted-foreground">{sub}</p>}
      <div className="mt-2 flex flex-col gap-4">{children}</div>
    </div>
  )
}

function FieldLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground ${className}`}>
      {children}
    </label>
  )
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function PricePill({
  label,
  amount,
  note,
  dim,
  highlighted,
}: {
  label: string
  amount: string
  note?: string
  dim?: boolean
  highlighted?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-2 border p-4 ${
        highlighted
          ? "border-foreground bg-foreground/5"
          : dim
            ? "border-hairline opacity-70 line-through decoration-muted-foreground/40"
            : "border-hairline"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground no-underline">
        {label}
      </p>
      <p className={`font-display text-2xl leading-none ${highlighted ? "text-foreground" : "text-muted-foreground"} no-underline`}>
        {amount}
      </p>
      {note && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 no-underline">
          {note}
        </p>
      )}
    </div>
  )
}

function GiftCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2 border border-hairline bg-background/40 p-4">
      <span className="text-accent">{icon}</span>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">{title}</p>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border border-hairline bg-background/40 p-6 text-center">
      <p className="font-display text-3xl leading-none text-foreground sm:text-4xl">{n}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    </div>
  )
}

function PlanCard({
  name,
  price,
  time,
  bullets,
  active,
  featured,
  badge,
  onClick,
}: {
  name: string
  price: string
  time: string
  bullets: string[]
  active: boolean
  featured?: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col gap-4 border p-5 text-left transition-all ${
        active
          ? "border-foreground bg-foreground/5"
          : featured
            ? "border-foreground/60 shadow-[0_20px_40px_-24px_rgba(255,65,20,0.35)]"
            : "border-hairline hover:border-foreground/60"
      }`}
    >
      {featured && badge && (
        <span className="absolute -top-2.5 left-4 border border-foreground bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground">
          {badge}
        </span>
      )}
      <p className="font-display text-xl text-foreground">{name}</p>
      <p className="font-display text-2xl text-foreground">{price}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{time}</p>
      <ul className="mt-1 flex flex-col gap-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-foreground/85">
            <span aria-hidden className="mt-[0.5rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  )
}

function AuthorityRow({ tech, used }: { tech: string; used: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline py-2">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground">{tech}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{used}</p>
    </div>
  )
}

function YesNoRow({
  question,
  value,
  onChange,
  yes,
  no,
}: {
  question: string
  value: boolean | null
  onChange: (v: boolean) => void
  yes: string
  no: string
}) {
  return (
    <div className="flex flex-col gap-2 border border-hairline p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-sm leading-relaxed text-foreground/90">{question}</p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
            value === true
              ? "border-foreground bg-foreground text-background"
              : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
          }`}
        >
          {yes}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
            value === false
              ? "border-foreground bg-foreground text-background"
              : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground"
          }`}
        >
          {no}
        </button>
      </div>
    </div>
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

/* ---------------- copy ---------------- */

const TXT = {
  es: {
    eyebrow: "07 · Método 7 pasos",
    subEyebrow: "Cialdini · Kahneman",
    title: "Vamos a arrancar tu proyecto.",
    lede: "Siete pasos que aplican principios de persuasión probados. Al final llegas a mi WhatsApp con contexto completo, y agendamos la call de 30 min gratis.",
    doneTag: "Perfil listo",
    back: "Atrás",
    next: "Siguiente",
    yes: "Sí",
    no: "No",
    restart: "Volver a empezar",
    q: { projectType: "¿Qué tipo de proyecto tienes en mente?" },
    projectTypes: ["Landing / Sitio", "E-commerce", "Dashboard", "SaaS a medida", "Integración IA", "App móvil", "Otro"],
    steps: [
      { tag: "Ancla",         principle: "Ancla cognitiva",         title: "El mercado cotiza esto entre US$ 3k y US$ 15k.", sub: "Referencia real para calibrar tu percepción antes de ver mi precio." },
      { tag: "Escasez",       principle: "Escasez",                  title: "Solo 3 proyectos por mes.",                     sub: "No es marketing — es la única forma de mantener calidad end-to-end." },
      { tag: "Reciprocidad",  principle: "Reciprocidad",             title: "Antes de que decidas, esto va gratis.",         sub: "Tres entregables reales sin compromiso — para que veas cómo trabajo." },
      { tag: "Prueba social", principle: "Prueba social",            title: "Ya lo hicimos, 20 veces.",                       sub: "Los números y las marcas que respaldan cada afirmación." },
      { tag: "Contraste",     principle: "Contraste perceptual",     title: "Tres planes lado a lado.",                       sub: "El del medio es el que arrancan 7 de cada 10 clientes." },
      { tag: "Autoridad",     principle: "Autoridad prestada",       title: "Mismo stack que Netflix, Anthropic y Vercel.",   sub: "No aprendo tech de moda; uso lo que producción del mundo real validó." },
      { tag: "Compromiso",    principle: "Compromiso + consistencia", title: "Tres micro-sí y estás dentro.",                 sub: "Cada pequeño acuerdo hace más probable el siguiente." },
    ],
    anchor: {
      intro: "Los tres precios reales que enfrentas para el mismo output:",
      agency: "Agencia LATAM",
      agencyNote: "3-6 meses · overhead brutal",
      usFreelance: "Freelance USA",
      usNote: "US$ 60-100/h · 60h típicas",
      steven: "Con Steven",
      stevenNote: "Mismo output · sin agencias",
      why: "Cobro esto porque estoy construyendo cartera propia. En 6 meses no volverás a ver estos precios en mi CV.",
    },
    scarcity: {
      taken: "tomados",
      slotTaken: "Slot tomado",
      slotFree: "Slot disponible",
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
      q2: "¿El rango de precio (US$ 400 – US$ 2 200) te funciona?",
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
      { tag: "Anchor",       principle: "Cognitive anchor",       title: "The market prices this at US$ 3k–15k.",           sub: "A real reference to calibrate your perception before you see my price." },
      { tag: "Scarcity",     principle: "Scarcity",                title: "Only 3 projects per month.",                        sub: "Not marketing — the only way to keep quality end-to-end." },
      { tag: "Reciprocity",  principle: "Reciprocity",             title: "Before you decide, this is on me.",                 sub: "Three real deliverables with zero strings — so you see how I work." },
      { tag: "Social proof", principle: "Social proof",            title: "We already did this, 20 times.",                    sub: "The numbers and the brands that back every claim." },
      { tag: "Contrast",     principle: "Perceptual contrast",     title: "Three plans, side by side.",                        sub: "The middle one is where 7 in 10 clients land." },
      { tag: "Authority",    principle: "Borrowed authority",      title: "Same stack Netflix, Anthropic and Vercel use.",     sub: "I don't chase trending tech; I use what real production has validated." },
      { tag: "Commitment",   principle: "Commitment + consistency", title: "Three micro-yesses and you're in.",                sub: "Each small agreement makes the next one more likely." },
    ],
    anchor: {
      intro: "Three real prices you face for the same output:",
      agency: "LATAM Agency",
      agencyNote: "3-6 months · huge overhead",
      usFreelance: "US Freelance",
      usNote: "US$ 60-100/h · typical 60h",
      steven: "With Steven",
      stevenNote: "Same output · no agency",
      why: "I charge this because I'm building my client base. Six months from now these prices won't be on my CV anymore.",
    },
    scarcity: {
      taken: "taken",
      slotTaken: "Slot taken",
      slotFree: "Slot open",
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
      q2: "Does the price range (US$ 400 – US$ 2,200) work for you?",
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
