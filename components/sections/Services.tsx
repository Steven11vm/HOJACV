"use client"
import { motion, type Variants } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Code, Sparkles, BarChart3, Smartphone, Check, ArrowUpRight } from "lucide-react"

const ICONS: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  BarChart3,
  Smartphone,
}

const COLORS = [
  "var(--neon-violet)",
  "var(--neon-pink)",
  "var(--neon-cyan)",
  "var(--neon-green)",
]

export function Services({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const items = t.services.items

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section id="services" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-neon-violet/10 blur-[140px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-neon-cyan/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.services.label}</div>
          <h2 className="mb-5 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.services.title}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{t.services.subtitle}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {items.map((service, idx) => {
            const Icon = ICONS[service.icon] ?? Code
            const color = COLORS[idx % COLORS.length]

            return (
              <motion.article
                key={idx}
                variants={item}
                whileHover={{ y: -6 }}
                className="glass group relative overflow-hidden rounded-2xl p-7 sm:p-8"
              >
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-all group-hover:scale-110"
                    style={{
                      background: `color-mix(in oklch, ${color} 18%, transparent)`,
                      color,
                      boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 30%, transparent)`,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className="font-serif text-5xl font-medium leading-none"
                    style={{
                      WebkitTextStroke: `1px color-mix(in oklch, ${color} 40%, transparent)`,
                      color: "transparent",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title + desc */}
                <h3 className="mb-3 font-serif text-2xl font-medium leading-tight text-foreground sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {service.desc}
                </p>

                {/* Deliverables */}
                <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full ring-1"
                        style={{
                          background: `color-mix(in oklch, ${color} 15%, transparent)`,
                          color,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 30%, transparent)`,
                        }}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className="group/cta inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:text-foreground"
                >
                  <span>{lang === "es" ? "Hablar de este servicio" : "Discuss this service"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </a>

                {/* Gradient deco */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
                  style={{ background: color }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: 0.4,
                  }}
                />
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
