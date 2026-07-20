"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Experience({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const experiences = t.experiences

  return (
    <section id="experience" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "02 · Experiencia" : "02 · Experience"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t.experience.title}
          </motion.h2>

          <ol className="mt-16 divide-y divide-hairline border-y border-hairline">
            {experiences.map((exp, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
                className="grid gap-4 py-10 sm:grid-cols-[130px_1fr] sm:gap-10"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {exp.period}
                  </p>
                  {exp.current && (
                    <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden />
                      {t.experience.current}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                    {exp.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exp.company} · {exp.location}
                  </p>
                  <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-foreground/80">
                    {exp.description}
                  </p>

                  <ul className="mt-6 max-w-2xl space-y-2 text-[15px] leading-[1.75] text-foreground/80">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="flex gap-4">
                        <span
                          className="mt-[0.65rem] inline-block h-px w-4 shrink-0 bg-foreground"
                          aria-hidden
                        />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {exp.tech.join(" · ")}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
