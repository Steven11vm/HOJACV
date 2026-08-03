"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

const SPECIALTIES: { es: string; en: string }[] = [
  { es: "SaaS a medida", en: "Custom SaaS" },
  { es: "Dashboards & analytics", en: "Dashboards & analytics" },
  { es: "Integraciones IA", en: "AI integrations" },
  { es: "Bases de datos SQL", en: "SQL databases" },
  { es: "Docker & CI/CD", en: "Docker & CI/CD" },
  { es: "Despliegue en cloud", en: "Cloud deployment" },
  { es: "Seguridad web (OWASP)", en: "Web security (OWASP)" },
  { es: "E-commerce", en: "E-commerce" },
  { es: "Apps web escalables", en: "Scalable web apps" },
]

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang]

  return (
    <section
      id="about"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      {/* HEADER — mismo lenguaje editorial que Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span>01 · {lang === "es" ? "Sobre mí" : "About"}</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 03 · MMXXV
        </p>

        <h2 className="mt-8 font-display text-4xl leading-tight text-foreground sm:mt-10 sm:text-5xl md:text-6xl">
          {t.about.title}
        </h2>

        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />
      </motion.div>

      {/* LEAD PARAGRAPH — mas grande, "primer parrafo" tipo revista */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mx-auto mt-14 max-w-2xl text-center"
      >
        <p className="text-lg leading-[1.7] text-foreground/90 sm:text-xl sm:leading-[1.65]">
          {t.about.bio1}{" "}
          <span className="text-foreground">Steven Villamizar Mendoza</span>
          {t.about.bio1b} <span className="text-foreground">{t.about.bio1c}</span>{" "}
          {t.about.bio1d}
        </p>
      </motion.div>

      {/* BODY — parrafo secundario, texto normal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mx-auto mt-8 max-w-2xl text-center"
      >
        <p className="text-[15px] leading-[1.85] text-foreground/80 sm:text-base">
          {t.about.bio2}{" "}
          <span className="text-foreground">{t.about.bio2b}</span> {t.about.bio2c}
        </p>
      </motion.div>

      {/* PULL QUOTE — italica serif entre rules */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mx-auto mt-16 flex w-full max-w-xl flex-col items-center gap-6 text-center"
      >
        <span aria-hidden className="h-px w-16 bg-foreground/40" />
        <p
          className="text-balance px-2 text-lg leading-relaxed text-foreground sm:text-xl"
          style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
        >
          {t.about.bio3}
        </p>
        <span aria-hidden className="h-px w-16 bg-foreground/40" />
      </motion.div>

      {/* SPECIALTIES — chips editoriales */}
      <div className="mx-auto mt-20 w-full max-w-3xl">
        <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {lang === "es" ? "Enfoque" : "Focus"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {SPECIALTIES.map((sp, i) => (
            <motion.span
              key={sp.en}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="inline-flex items-center gap-2 border border-hairline px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/90"
            >
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-foreground" />
              {sp[lang]}
            </motion.span>
          ))}
        </div>
      </div>

      {/* CREDENTIALS GRID — tabla premium con divisores verticales */}
      <div className="mx-auto mt-20 w-full max-w-3xl border-y border-hairline py-10">
        <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
          {[
            { label: lang === "es" ? "Ubicación" : "Location", value: t.about.info.location },
            { label: lang === "es" ? "Formación" : "Education", value: t.about.info.degree },
            { label: lang === "es" ? "Modalidad" : "Mode", value: t.about.info.availability },
            { label: lang === "es" ? "Idiomas" : "Languages", value: t.about.info.languages },
          ].map((it, i, arr) => (
            <div
              key={it.label}
              className={`px-3 text-center ${
                i > 0 && i < arr.length ? "sm:border-l sm:border-hairline" : ""
              }`}
            >
              <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {it.label}
              </dt>
              <dd className="text-sm text-foreground">{it.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Micro cierre */}
      <p className="mx-auto mt-10 max-w-xl text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        {lang === "es" ? "Disponible para nuevos proyectos" : "Available for new projects"}
      </p>
    </section>
  )
}
