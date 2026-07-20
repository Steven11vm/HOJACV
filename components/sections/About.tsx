"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang]

  return (
    <section id="about" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "01 · Sobre mí" : "01 · About"}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            {t.about.title}
          </h2>

          <div className="mt-12 max-w-2xl space-y-6 text-base leading-[1.75] text-foreground/80">
            <p>
              {t.about.bio1} <span className="text-foreground">Steven Villamizar Mendoza</span>
              {t.about.bio1b} <span className="text-foreground">{t.about.bio1c}</span> {t.about.bio1d}
            </p>
            <p>
              {t.about.bio2} <span className="text-foreground">{t.about.bio2b}</span> {t.about.bio2c}
            </p>
            <p className="border-l border-foreground pl-6 text-foreground">
              {t.about.bio3}
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-hairline pt-10 sm:grid-cols-4">
            {[
              { label: lang === "es" ? "Ubicación" : "Location", value: t.about.info.location },
              { label: lang === "es" ? "Formación" : "Education", value: t.about.info.degree },
              { label: lang === "es" ? "Modalidad" : "Mode", value: t.about.info.availability },
              { label: lang === "es" ? "Idiomas" : "Languages", value: t.about.info.languages },
            ].map((it, i) => (
              <div key={i}>
                <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {it.label}
                </dt>
                <dd className="text-sm text-foreground">{it.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  )
}
