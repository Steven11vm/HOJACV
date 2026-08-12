"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { useAudience } from "@/lib/audience"

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const { audience } = useAudience()
  const isRecruiter = audience === "recruiter"

  const status = isRecruiter
    ? lang === "es"
      ? "Abierto a nuevas oportunidades"
      : "Open to new opportunities"
    : t.hero.status

  const intro = isRecruiter
    ? lang === "es"
      ? "Ingeniero Full Stack (2+ años) con foco en React/Next.js, Node, SQL y despliegue Docker + AWS/Vercel. Envío productos a producción con seguridad por defecto (CSP, OWASP Top 10) e integraciones de IA aplicada."
      : "Full Stack Engineer (2+ yrs) focused on React/Next.js, Node, SQL and Docker + AWS/Vercel deployments. I ship production products with security by default (CSP, OWASP Top 10) and applied AI integrations."
    : t.hero.intro

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center px-6 pt-32 pb-24 sm:px-10 lg:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* Eyebrow simetrico con lineas a ambos lados */}
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
          <span>{status}</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        {/* Numero decorativo — solo en desktop, para dar aire editorial */}
        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 02 · MMXXV
        </p>

        {/* Nombre */}
        <h1 className="mt-8 font-display text-5xl leading-[1.02] tracking-tight text-foreground sm:mt-10 sm:text-6xl md:text-7xl lg:text-8xl">
          Steven
          <br />
          Villamizar
          <span className="text-muted-foreground">.</span>
        </h1>

        {/* Rule editorial bajo el nombre */}
        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />

        {/* Intro */}
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {intro}
        </p>

        {/* CTAs — reordenados por audiencia */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {isRecruiter ? (
            <>
              <a
                href="/CV/Hoja de vida.pdf"
                download="Steven_Villamizar_CV.pdf"
                className="btn-plain btn-plain-inv"
              >
                {t.hero.downloadCV}
                <span aria-hidden>↓</span>
              </a>
              <a href="#experience" className="link-r text-sm text-foreground">
                {lang === "es" ? "Ver experiencia" : "See experience"}
              </a>
              <a href="#contact" className="link-r text-sm text-foreground">
                {lang === "es" ? "Contacto" : "Contact"}
              </a>
            </>
          ) : (
            <>
              <a href="#services" className="btn-plain btn-plain-inv">
                {lang === "es" ? "Ver servicios" : "See services"}
                <span aria-hidden>→</span>
              </a>
              <a href="#projects" className="link-r text-sm text-foreground">
                {lang === "es" ? "Ver trabajo" : "See work"}
              </a>
              <a href="#contact" className="link-r text-sm text-foreground">
                {lang === "es" ? "Contacto" : "Contact"}
              </a>
            </>
          )}
        </div>

        {/* Stats — centradas y contenidas */}
        <dl className="mt-20 grid w-full max-w-xl grid-cols-3 gap-8 border-t border-hairline pt-10">
          <div className="text-center">
            <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {t.stats.years}
            </dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">2+</dd>
          </div>
          <div className="border-x border-hairline text-center">
            <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {t.stats.projects}
            </dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">20+</dd>
          </div>
          <div className="text-center">
            <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {lang === "es" ? "Base" : "Based"}
            </dt>
            <dd className="font-display text-3xl text-foreground sm:text-4xl">Medellín</dd>
          </div>
        </dl>
      </motion.div>
    </section>
  )
}
