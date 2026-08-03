"use client"

import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Timeline, type TimelineEntry } from "@/components/ui/timeline"

export function Experience({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const experiences = t.experiences

  // Adapto cada experiencia al formato del Timeline. title = periodo,
  // subtitle = "actual" opcional, content = el card completo del rol.
  const timelineData: TimelineEntry[] = experiences.map((exp) => ({
    title: exp.period,
    subtitle: exp.current ? t.experience.current : undefined,
    content: <RoleCard exp={exp} lang={lang} t={t} />,
  }))

  return (
    <section
      id="experience"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      {/* HEADER */}
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
            ? "Roles que me formaron y donde llevé software real a producción. La línea se llena a medida que scrolleas."
            : "Roles that shaped me and where I shipped real software into production. The line fills as you scroll."}
        </p>

        <p className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
          <span>
            {experiences.length} {lang === "es" ? "roles" : "roles"}
          </span>
          <span aria-hidden>·</span>
          <span>2022 — 2025</span>
        </p>
      </motion.div>

      {/* TIMELINE con progreso al scroll */}
      <div className="mt-8 sm:mt-12">
        <Timeline data={timelineData} />
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

function RoleCard({
  exp,
  lang,
  t,
}: {
  exp: (typeof translations)[Lang]["experiences"][number]
  lang: Lang
  t: (typeof translations)[Lang]
}) {
  return (
    <article className="rounded-2xl border border-hairline bg-background/60 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-1">
        <h4 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
          {exp.title}
        </h4>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {exp.company}
          <span aria-hidden className="mx-2 text-muted-foreground/50">
            ·
          </span>
          {exp.location}
        </p>
      </div>

      {exp.current && (
        <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
          <span aria-hidden className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {t.experience.current}
        </p>
      )}

      <p className="mt-5 text-[15px] leading-[1.7] text-foreground/80">
        {exp.description}
      </p>

      {/* Logros clave */}
      <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
        {t.experience.achievements}
      </p>
      <ul className="mt-3 grid gap-x-8 gap-y-2 text-[14px] leading-[1.6] text-foreground/80 sm:grid-cols-2">
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

      {/* Stack */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {exp.tech.map((tk) => (
          <span
            key={tk}
            className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            {tk}
          </span>
        ))}
      </div>
    </article>
  )
}
