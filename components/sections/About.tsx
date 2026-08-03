"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang]

  return (
    <section
      id="about"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* Eyebrow simetrico */}
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span>01 · {lang === "es" ? "Sobre mí" : "About"}</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 03 · MMXXV
        </p>

        {/* Titulo */}
        <h2 className="mt-8 font-display text-4xl leading-tight text-foreground sm:mt-10 sm:text-5xl md:text-6xl">
          {t.about.title}
        </h2>

        {/* Rule editorial */}
        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />

        {/* Prose bio */}
        <div className="mt-10 max-w-2xl space-y-6 text-[15px] leading-[1.85] text-foreground/80 sm:text-base">
          <p>
            {t.about.bio1}{" "}
            <span className="text-foreground">Steven Villamizar Mendoza</span>
            {t.about.bio1b} <span className="text-foreground">{t.about.bio1c}</span> {t.about.bio1d}
          </p>
          <p>
            {t.about.bio2}{" "}
            <span className="text-foreground">{t.about.bio2b}</span> {t.about.bio2c}
          </p>
        </div>

        {/* Callout / pull-quote centrado con rules arriba y abajo */}
        <div className="mt-14 flex w-full max-w-xl flex-col items-center gap-6">
          <span aria-hidden className="h-px w-16 bg-foreground/40" />
          <p
            className="text-balance px-2 text-center text-lg leading-relaxed text-foreground sm:text-xl"
            style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
          >
            {t.about.bio3}
          </p>
          <span aria-hidden className="h-px w-16 bg-foreground/40" />
        </div>

        {/* Info grid con divisores hairline entre columnas */}
        <dl className="mt-20 grid w-full grid-cols-2 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-4 sm:gap-y-0">
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
      </motion.div>
    </section>
  )
}
