"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Process({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const steps = t.process.steps

  return (
    <section
      id="process"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      {/* HEADER — mismo lenguaje editorial que Hero/About/Skills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span>05 · {lang === "es" ? "Proceso" : "Process"}</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 06 · MMXXV
        </p>

        <h2 className="mt-8 font-display text-4xl leading-tight text-foreground sm:mt-10 sm:text-5xl md:text-6xl">
          {t.process.title}
        </h2>

        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {t.process.subtitle}
        </p>

        {/* Micro-eyebrow con el arco total de duraciones */}
        <p className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
          <span>{lang === "es" ? "5 fases" : "5 phases"}</span>
          <span aria-hidden>·</span>
          <span>{lang === "es" ? "de 2 a 12 semanas" : "from 2 to 12 weeks"}</span>
        </p>
      </motion.div>

      {/* PASOS — chapter cards con numero display grande */}
      <div className="mx-auto mt-20 w-full max-w-3xl border-t border-hairline">
        {steps.map((step, idx) => (
          <motion.article
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            className="group relative grid gap-6 border-b border-hairline py-12 sm:grid-cols-[110px_1fr] sm:gap-12 sm:py-16"
          >
            {/* Numero display gigante */}
            <div className="flex items-start sm:justify-end">
              <span
                className="font-display text-6xl leading-[0.85] text-foreground sm:text-7xl md:text-[5.5rem]"
                aria-hidden
              >
                {step.number}
              </span>
            </div>

            <div className="flex flex-col">
              {/* Eyebrow con duracion */}
              <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <span aria-hidden className="inline-block h-px w-8 bg-muted-foreground/60" />
                <span>{step.duration}</span>
              </div>

              {/* Titulo */}
              <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
                {step.title}
              </h3>

              {/* Rule editorial */}
              <div aria-hidden className="mt-5 h-px w-10 bg-foreground/40" />

              {/* Descripcion */}
              <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground/80 sm:text-base">
                {step.desc}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Cierre editorial */}
      <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-6 px-4 text-center">
        <span aria-hidden className="h-px w-12 bg-foreground/40" />
        <p
          className="text-balance text-lg leading-relaxed text-foreground sm:text-xl"
          style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
        >
          {lang === "es"
            ? "Sin sprints eternos, sin sorpresas al final. Solo entregables visibles cada semana."
            : "No endless sprints, no last-minute surprises. Just visible deliverables every week."}
        </p>
        <span aria-hidden className="h-px w-12 bg-foreground/40" />
      </div>
    </section>
  )
}
