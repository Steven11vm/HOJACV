"use client"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, MessageCircle, Mail, Calendar } from "lucide-react"
import type { Lang } from "@/lib/translations"

/**
 * SalesFunnel — 7 pasos de ventas clásicos aplicados al portafolio de Steven.
 *
 *  01 Preparación         → caldeo + tipo de proyecto
 *  02 Contacto / Rapport  → nombre + contexto (empresa o personal)
 *  03 Descubrimiento      → dolor real (qué problema resuelve, qué han probado)
 *  04 Presentación        → propuesta específica según lo capturado
 *  05 Objeciones          → identifica el freno y lo neutraliza en el momento
 *  06 Cierre              → pide el sí concreto (call agendada)
 *  07 Seguimiento         → confirma próximo paso, deja canales abiertos
 *
 * No cotiza automáticamente. Cada paso construye contexto que se envía por
 * WhatsApp/email al final — Steven llega a la call sabiendo exactamente qué
 * necesita el cliente. El precio se acuerda offline con contexto real.
 */

const WHATSAPP = "573046467135"
const EMAIL = "Stevenvilla10@gmail.com"

interface Answers {
  projectType: string
  name: string
  companyOrPersonal: string
  pain: string
  tried: string
  objection: string
  when: string
  contactPref: string
}

const EMPTY: Answers = {
  projectType: "",
  name: "",
  companyOrPersonal: "",
  pain: "",
  tried: "",
  objection: "",
  when: "",
  contactPref: "",
}

const PROJECT_TYPES = {
  es: ["Landing / Sitio", "E-commerce", "Dashboard", "SaaS a medida", "Integración IA", "App móvil", "Otro"],
  en: ["Landing / Site", "E-commerce", "Dashboard", "Custom SaaS", "AI Integration", "Mobile app", "Other"],
}

const OBJECTIONS = {
  es: [
    { key: "presupuesto", label: "Presupuesto ajustado", answer: "Entiendo — arrancamos por lo mínimo viable, entrego en fases y solo pagas lo que sí ship a producción. Sin sorpresas." },
    { key: "tiempo", label: "Falta de tiempo mío", answer: "Yo llevo el proyecto de punta a punta: tú apruebas por WhatsApp lo que necesito y sigo. Reuniones máximo 30 min semanales." },
    { key: "confianza", label: "No te conozco / dudas", answer: "Perfecto, la primera call de 30 min es gratuita y ahí ves cómo trabajo. Además tengo 20+ proyectos en producción listos para mostrar." },
    { key: "experiencia", label: "¿Tienes casos en mi sector?", answer: "Cuéntame el sector — probablemente sí (salud, e-commerce, barbería, streetwear, dashboards empresariales). Si no, adapto casos análogos." },
    { key: "ninguna", label: "Ninguna, estoy listo", answer: "Excelente — vamos al paso final para agendar la call." },
  ],
  en: [
    { key: "budget", label: "Tight budget", answer: "Understood — we start with the leanest MVP, ship in phases, and you only pay for what actually goes to production. No surprises." },
    { key: "time", label: "I don't have time", answer: "I run the project end to end: you approve on WhatsApp what I need and I keep going. Max 30 min sync per week." },
    { key: "trust", label: "I don't know you yet", answer: "Perfect — the first 30 min call is free and that's when you see how I work. Plus 20+ shipped projects ready to walk through." },
    { key: "sector", label: "Any cases in my sector?", answer: "Tell me the sector — probably yes (health, e-commerce, barbershop, streetwear, enterprise dashboards). If not, I adapt from analog cases." },
    { key: "none", label: "None, I'm ready", answer: "Excellent — let's move to the final step to book the call." },
  ],
}

const WHEN_OPTIONS = {
  es: ["Esta semana", "En 1-2 semanas", "En 1 mes", "Estoy explorando"],
  en: ["This week", "In 1-2 weeks", "In 1 month", "Just exploring"],
}

const CONTACT_PREF = {
  es: ["WhatsApp", "Email", "Videollamada 30 min"],
  en: ["WhatsApp", "Email", "30 min video call"],
}

export function SalesFunnel({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const t = TXT[lang]

  const update = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }))

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return a.projectType.length > 0
      case 1: return a.name.trim().length >= 2 && a.companyOrPersonal.length > 0
      case 2: return a.pain.trim().length >= 20
      case 3: return true
      case 4: return a.objection.length > 0
      case 5: return a.when.length > 0 && a.contactPref.length > 0
      default: return true
    }
  }, [step, a])

  const totalSteps = 7

  const summary = useMemo(() => buildSummary(a, lang), [a, lang])
  const objectionAnswer = useMemo(() => {
    const o = OBJECTIONS[lang].find((x) => x.key === a.objection)
    return o?.answer ?? ""
  }, [a.objection, lang])

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
            <span>{t.eyebrow}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            {t.subEyebrow}
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          {/* Left column: intent + progress */}
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

            {/* Progress rail */}
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

          {/* Right column: current step */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full"
          >
            <div className="min-h-[420px] border border-hairline bg-muted/30 p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                  className="flex flex-col gap-6"
                >
                  {step === 0 && (
                    <StepShell num={1} title={t.steps[0].title} sub={t.steps[0].sub}>
                      <p className="text-sm leading-relaxed text-foreground/80">{t.prep}</p>
                      <FieldLabel>{t.q.projectType}</FieldLabel>
                      <ChipGroup
                        options={PROJECT_TYPES[lang]}
                        value={a.projectType}
                        onChange={(v) => update({ projectType: v })}
                      />
                    </StepShell>
                  )}

                  {step === 1 && (
                    <StepShell num={2} title={t.steps[1].title} sub={t.steps[1].sub}>
                      <FieldLabel>{t.q.name}</FieldLabel>
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => update({ name: e.target.value })}
                        maxLength={80}
                        placeholder={t.ph.name}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                      />
                      <FieldLabel className="mt-4">{t.q.context}</FieldLabel>
                      <ChipGroup
                        options={[t.chip.company, t.chip.personal, t.chip.startup]}
                        value={a.companyOrPersonal}
                        onChange={(v) => update({ companyOrPersonal: v })}
                      />
                      {a.name.trim().length >= 2 && a.companyOrPersonal && (
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-400">
                          {t.hello.replace("{name}", a.name.split(" ")[0])}
                        </p>
                      )}
                    </StepShell>
                  )}

                  {step === 2 && (
                    <StepShell num={3} title={t.steps[2].title} sub={t.steps[2].sub}>
                      <p className="text-sm leading-relaxed text-foreground/80">{t.painIntro}</p>
                      <FieldLabel>{t.q.pain}</FieldLabel>
                      <textarea
                        value={a.pain}
                        onChange={(e) => update({ pain: e.target.value })}
                        rows={5}
                        maxLength={1200}
                        placeholder={t.ph.pain}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                      />
                      <p className="text-right font-mono text-[10px] text-muted-foreground">{a.pain.length} / 1200</p>
                      <FieldLabel className="mt-2">{t.q.tried}</FieldLabel>
                      <textarea
                        value={a.tried}
                        onChange={(e) => update({ tried: e.target.value })}
                        rows={2}
                        maxLength={400}
                        placeholder={t.ph.tried}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                      />
                    </StepShell>
                  )}

                  {step === 3 && (
                    <StepShell num={4} title={t.steps[3].title} sub={t.steps[3].sub}>
                      <p className="text-sm leading-relaxed text-foreground/80">{t.solutionIntro.replace("{type}", a.projectType || t.chip.thisKind)}</p>
                      <ul className="mt-2 flex flex-col gap-3">
                        {t.solutionPoints.map((s, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                            <span aria-hidden className="mt-[0.6rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">
                        {t.solutionNote}
                      </p>
                    </StepShell>
                  )}

                  {step === 4 && (
                    <StepShell num={5} title={t.steps[4].title} sub={t.steps[4].sub}>
                      <FieldLabel>{t.q.objection}</FieldLabel>
                      <ChipGroup
                        options={OBJECTIONS[lang].map((o) => o.label)}
                        value={OBJECTIONS[lang].find((o) => o.key === a.objection)?.label ?? ""}
                        onChange={(label) => {
                          const found = OBJECTIONS[lang].find((o) => o.label === label)
                          update({ objection: found?.key ?? "" })
                        }}
                      />
                      {objectionAnswer && (
                        <motion.p
                          key={a.objection}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 border-l-2 border-foreground/60 pl-4 text-sm leading-relaxed text-foreground/90"
                        >
                          {objectionAnswer}
                        </motion.p>
                      )}
                    </StepShell>
                  )}

                  {step === 5 && (
                    <StepShell num={6} title={t.steps[5].title} sub={t.steps[5].sub}>
                      <FieldLabel>{t.q.when}</FieldLabel>
                      <ChipGroup
                        options={WHEN_OPTIONS[lang]}
                        value={a.when}
                        onChange={(v) => update({ when: v })}
                      />
                      <FieldLabel className="mt-4">{t.q.contactPref}</FieldLabel>
                      <ChipGroup
                        options={CONTACT_PREF[lang]}
                        value={a.contactPref}
                        onChange={(v) => update({ contactPref: v })}
                      />
                    </StepShell>
                  )}

                  {step === 6 && (
                    <StepShell num={7} title={t.steps[6].title} sub={t.steps[6].sub}>
                      <div className="flex flex-col gap-4 border border-hairline bg-background/60 p-5">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          <span>{t.doneTag}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {t.closingHi.replace("{name}", a.name.split(" ")[0] || t.friend)}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/85">
                          {t.closingNext.replace("{when}", a.when).replace("{how}", a.contactPref)}
                        </p>
                      </div>

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

                      <button
                        type="button"
                        onClick={restart}
                        className="ml-auto mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.restart}
                      </button>
                    </StepShell>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav */}
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
  children,
}: {
  num: number
  title: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
        <span className="text-muted-foreground">Paso {String(num).padStart(2, "0")}</span>
      </p>
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

function buildSummary(a: Answers, lang: Lang): string {
  const line = lang === "es"
    ? [
        `Hola Steven, vengo de tu portafolio (cotizador de 7 pasos).`,
        ``,
        `— Nombre: ${a.name || "(sin nombre)"}`,
        `— Contexto: ${a.companyOrPersonal || "-"}`,
        `— Tipo de proyecto: ${a.projectType || "-"}`,
        `— Problema a resolver: ${a.pain || "-"}`,
        a.tried ? `— Han probado: ${a.tried}` : null,
        `— Freno principal: ${OBJECTIONS.es.find((o) => o.key === a.objection)?.label ?? "-"}`,
        `— Cuándo: ${a.when || "-"}`,
        `— Prefiere: ${a.contactPref || "-"}`,
        ``,
        `Cuando puedas, ¿arrancamos con la call gratuita de 30 min?`,
      ]
    : [
        `Hi Steven, coming from your portfolio (7-step qualifier).`,
        ``,
        `— Name: ${a.name || "(no name)"}`,
        `— Context: ${a.companyOrPersonal || "-"}`,
        `— Project type: ${a.projectType || "-"}`,
        `— Problem to solve: ${a.pain || "-"}`,
        a.tried ? `— Tried before: ${a.tried}` : null,
        `— Main hesitation: ${OBJECTIONS.en.find((o) => o.key === a.objection)?.label ?? "-"}`,
        `— When: ${a.when || "-"}`,
        `— Prefers: ${a.contactPref || "-"}`,
        ``,
        `When you can, shall we start with the free 30 min call?`,
      ]
  return line.filter(Boolean).join("\n")
}

/* ---------------- copy ---------------- */

const TXT = {
  es: {
    eyebrow: "07 · Vamos a arrancar",
    subEyebrow: "7 pasos · MMXXV",
    title: "Vamos a arrancar tu proyecto.",
    lede: "Un flujo corto de 7 pasos para que llegue a tu WhatsApp con toda la información — y podamos agendar la primera call sabiendo exactamente qué necesitas.",
    doneTag: "Perfil listo",
    back: "Atrás",
    next: "Siguiente",
    friend: "amigo",
    restart: "Volver a empezar",
    hello: "Genial, {name} — encantado.",
    prep: "Empecemos por lo básico: cuéntame qué tipo de proyecto tienes en mente. Después vamos a profundizar.",
    q: {
      projectType: "Tipo de proyecto",
      name: "¿Cómo te llamas?",
      context: "¿Es para empresa, personal o startup?",
      pain: "¿Qué problema estás intentando resolver?",
      tried: "¿Han probado algo antes que no funcionó? (opcional)",
      objection: "¿Qué te podría hacer dudar de arrancar?",
      when: "¿Cuándo te gustaría arrancar?",
      contactPref: "¿Cómo prefieres que sigamos?",
    },
    ph: {
      name: "Nombre y apellido",
      pain: "Ejemplo: mi equipo pierde 4h diarias cargando pedidos a mano. Necesito automatizarlo con un panel donde los clientes hagan el pedido y llegue directo al sistema.",
      tried: "Ejemplo: probamos un Excel compartido pero se dañaba con 3 personas editando.",
    },
    chip: {
      company: "Empresa",
      personal: "Personal",
      startup: "Startup",
      thisKind: "este tipo de proyecto",
    },
    painIntro: "No hay solución sin problema real. Sé específico: qué duele, cuánto duele, y a quién.",
    solutionIntro: "Así resolvemos {type}, típicamente:",
    solutionPoints: [
      "Discovery de 1-3 días para mapear tu proceso actual y decidir el mínimo viable.",
      "Arquitectura y diseño en 3-7 días — te muestro pantallas y flujo antes de escribir código.",
      "Desarrollo iterativo por sprints de 1-2 semanas, con demo cada viernes.",
      "QA, seguridad (OWASP), y despliegue en Vercel/AWS con dominio propio.",
      "Soporte y evolución post-launch — el proyecto no queda huérfano.",
    ],
    solutionNote: "El precio final se acuerda tras la call de 30 min (gratis). Sale acorde al alcance real — no le pongo un número al aire.",
    closingHi: "{name}, ya tengo tu perfil completo.",
    closingNext: "Voy a mandarte a tu WhatsApp/email un resumen con propuesta preliminar. Timing: {when}. Canal: {how}.",
    cta: {
      wa: "Enviar por WhatsApp",
      email: "Enviar por email",
      call: "Agendar call 30 min (gratis)",
    },
    emailSubject: "Nuevo proyecto — perfil desde portafolio",
    callMsg: "Hola Steven, me gustaría agendar la call gratuita de 30 min. ¿Qué horario tienes disponible esta semana?",
    steps: [
      { tag: "Preparación",      title: "Empecemos.",                 sub: "Contexto rápido antes de profundizar." },
      { tag: "Contacto",         title: "Cuéntame quién eres.",        sub: "Para saludarnos como se debe." },
      { tag: "Descubrimiento",   title: "¿Qué problema resolvemos?",   sub: "El dolor real, no la solución que crees que necesitas." },
      { tag: "Presentación",     title: "Así resolveríamos esto.",     sub: "Método claro, entregas medibles, sin humo." },
      { tag: "Objeciones",       title: "¿Qué te podría frenar?",       sub: "Prefiero saberlo ahora que descubrirlo en el camino." },
      { tag: "Cierre",           title: "Timing y canal.",              sub: "Cerramos con un siguiente paso concreto." },
      { tag: "Seguimiento",      title: "Perfecto — ya casi.",           sub: "Un click y llega tu perfil a mi WhatsApp." },
    ],
  },
  en: {
    eyebrow: "07 · Let's start",
    subEyebrow: "7 steps · MMXXV",
    title: "Let's start your project.",
    lede: "A short 7-step flow so I get to your WhatsApp with everything I need — and we can book the first call knowing exactly what you need.",
    doneTag: "Profile ready",
    back: "Back",
    next: "Next",
    friend: "friend",
    restart: "Start over",
    hello: "Great, {name} — nice to meet you.",
    prep: "Let's start with the basics: what kind of project do you have in mind? Then we'll go deeper.",
    q: {
      projectType: "Project type",
      name: "What's your name?",
      context: "Is it for a company, personal or startup?",
      pain: "What problem are you trying to solve?",
      tried: "Anything you tried before that didn't work? (optional)",
      objection: "What could make you hesitate to start?",
      when: "When would you like to start?",
      contactPref: "How do you prefer we continue?",
    },
    ph: {
      name: "Full name",
      pain: "Example: my team loses 4h daily entering orders by hand. I need to automate it with a panel where clients place orders and land directly in the system.",
      tried: "Example: we tried a shared spreadsheet but it broke with 3 people editing.",
    },
    chip: {
      company: "Company",
      personal: "Personal",
      startup: "Startup",
      thisKind: "this kind of project",
    },
    painIntro: "No solution without a real problem. Be specific: what hurts, how much, and to whom.",
    solutionIntro: "Here's how we typically solve {type}:",
    solutionPoints: [
      "Discovery in 1-3 days to map your current process and pick the leanest MVP.",
      "Architecture and design in 3-7 days — you see screens and flow before I write code.",
      "Iterative development in 1-2 week sprints, with a Friday demo every week.",
      "QA, security (OWASP), and deploy on Vercel/AWS with your own domain.",
      "Post-launch support and evolution — the project isn't left orphaned.",
    ],
    solutionNote: "Final price is agreed after the free 30 min call. It matches real scope — I don't throw a number in the air.",
    closingHi: "{name}, I've got your full profile.",
    closingNext: "I'll send a summary with a preliminary proposal to your WhatsApp/email. Timing: {when}. Channel: {how}.",
    cta: {
      wa: "Send via WhatsApp",
      email: "Send via email",
      call: "Book free 30 min call",
    },
    emailSubject: "New project — profile from portfolio",
    callMsg: "Hi Steven, I'd like to book the free 30 min call. What slots do you have this week?",
    steps: [
      { tag: "Prep",             title: "Let's begin.",                     sub: "Quick context before going deeper." },
      { tag: "Rapport",          title: "Tell me who you are.",              sub: "So we can say hi properly." },
      { tag: "Discovery",        title: "What problem are we solving?",       sub: "The real pain — not the solution you think you need." },
      { tag: "Presentation",     title: "Here's how we'd solve this.",         sub: "Clear method, measurable deliveries, no fluff." },
      { tag: "Objections",       title: "What could hold you back?",           sub: "I'd rather know now than discover it later." },
      { tag: "Close",            title: "Timing and channel.",                 sub: "We close on a concrete next step." },
      { tag: "Follow-up",        title: "Perfect — almost done.",              sub: "One click and your profile lands in my WhatsApp." },
    ],
  },
} as const
