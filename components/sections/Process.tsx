"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Compass, Pencil, Rocket, ShieldCheck, LifeBuoy, Clock } from "lucide-react"

const STEP_ICONS = [Compass, Pencil, Rocket, ShieldCheck, LifeBuoy]

export function Process({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const steps = t.process.steps

  return (
    <section id="process" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-radial opacity-40" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.process.label}</div>
          <h2 className="mb-5 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.process.title}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{t.process.subtitle}</p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, idx) => {
              const Icon = STEP_ICONS[idx] ?? Compass
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative"
                >
                  {/* Number bubble */}
                  <div className="relative z-10 mx-auto flex h-[72px] w-[72px] items-center justify-center">
                    <div className="absolute inset-0 animate-pulse-slow rounded-full bg-primary/20 blur-xl" />
                    <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-card to-background ring-1 ring-white/10">
                      <Icon className="h-7 w-7 text-primary" />
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-bold text-primary-foreground shadow-lg shadow-primary/30">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass relative mt-4 rounded-xl p-5 text-center"
                  >
                    <h3 className="mb-2 font-serif text-lg font-medium text-foreground">
                      {step.title}
                    </h3>
                    <p className="mb-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {step.desc}
                    </p>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
