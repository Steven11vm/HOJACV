"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Experience({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const experiences = t.experiences

  return (
    <section
      id="experience"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      {/* HEADER — mismo lenguaje editorial que Hero/About/Skills/Process */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span>02 · {lang === "es" ? "Experiencia" : "Experience"}</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 05 · MMXXV
        </p>

        <h2 className="mt-8 font-display text-4xl leading-tight text-foreground sm:mt-10 sm:text-5xl md:text-6xl">
          {t.experience.title}
        </h2>

        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {lang === "es"
            ? "Roles que me formaron y donde llevé software real a producción. En orden inverso."
            : "Roles that shaped me and where I shipped real software into production. In reverse order."}
        </p>

        <p className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
          <span>
            {experiences.length} {lang === "es" ? "roles" : "roles"}
          </span>
          <span aria-hidden>·</span>
          <span>2022 — 2025</span>
        </p>
      </motion.div>

      {/* ROLES — grid horizontal denso: periodo | contenido */}
      <div className="mx-auto mt-20 w-full max-w-4xl border-t border-hairline">
        {experiences.map((exp, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid gap-6 border-b border-hairline py-10 sm:grid-cols-[140px_1fr] sm:gap-12 sm:py-12"
          >
            {/* Columna izquierda: periodo + current badge si aplica */}
            <div className="flex flex-col gap-2 sm:pt-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground">
                {exp.period}
              </span>
              {exp.current && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-foreground"
                  />
                  {t.experience.current}
                </span>
              )}
            </div>

            {/* Columna derecha: title + company/location + description + achievements + tech */}
            <div className="flex flex-col">
              <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
                {exp.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {exp.company}
                <span aria-hidden className="mx-2 text-muted-foreground/50">
                  ·
                </span>
                {exp.location}
              </p>

              <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-foreground/80">
                {exp.description}
              </p>

              {/* Achievements: compactos, dots inline, 2 columnas en desktop */}
              <ul className="mt-5 grid gap-x-8 gap-y-2 text-[14px] leading-[1.6] text-foreground/75 sm:grid-cols-2">
                {exp.achievements.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60"
                    />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>

              {/* Tech stack como linea mono */}
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {exp.tech.join(" · ")}
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
            ? "Cada rol dejó un producto en producción — no un CV bonito."
            : "Every role left a shipped product — not a pretty résumé."}
        </p>
        <span aria-hidden className="h-px w-12 bg-foreground/40" />
      </div>
    </section>
  )
}
