"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Process({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const steps = t.process.steps

  return (
    <section id="process" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "05 · Proceso" : "05 · Process"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t.process.title}
          </motion.h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t.process.subtitle}
          </p>

          <ol className="mt-16 border-t border-hairline">
            {steps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="grid gap-4 border-b border-hairline py-8 sm:grid-cols-[80px_1fr_120px] sm:gap-8"
              >
                <p className="index pt-1">{step.number}</p>
                <div>
                  <h3 className="font-display text-xl leading-tight text-foreground sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-right sm:pt-1">
                  {step.duration}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
