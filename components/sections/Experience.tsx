"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Building2, MapPin, Sparkles, ChevronRight } from "lucide-react"

export function Experience({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const experiences = t.experiences

  return (
    <section id="experience" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-small mask-radial opacity-30" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.experience.subtitle}</div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.experience.title}
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-10 sm:space-y-16">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`relative grid items-start gap-6 sm:grid-cols-2 sm:gap-12 ${
                  idx % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 top-3 z-10 -translate-x-1/2 sm:left-1/2">
                  <div className="relative flex h-3 w-3 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary" />
                    {exp.current && (
                      <div className="absolute -inset-1 animate-ping rounded-full bg-primary/60" />
                    )}
                  </div>
                </div>

                {/* Date side */}
                <div
                  className={`pl-10 sm:pl-0 ${
                    idx % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"
                  }`}
                >
                  <div
                    className={`inline-flex flex-col gap-2 ${
                      idx % 2 === 0 ? "sm:items-end" : "sm:items-start"
                    }`}
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-primary">
                      {exp.period}
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                      {exp.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {exp.company}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {exp.location}
                      </span>
                    </div>
                    {exp.current && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-neon-green/15 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-neon-green ring-1 ring-neon-green/30">
                        <span className="status-dot" />
                        {t.experience.current}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content card */}
                <div className="pl-10 sm:pl-0">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass group relative rounded-2xl p-6 sm:p-7"
                  >
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {exp.description}
                    </p>

                    <div className="mb-5">
                      <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {t.experience.achievements}
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground/90">
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
                      {exp.tech.map((tech, i) => (
                        <span key={i} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Decorative gradient corner */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
