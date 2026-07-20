"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Services({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const items = t.services.items

  return (
    <section id="services" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "04 · Servicios" : "04 · Services"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t.services.title}
          </motion.h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t.services.subtitle}
          </p>

          <ol className="mt-16 divide-y divide-hairline border-y border-hairline">
            {items.map((service, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
                className="grid gap-6 py-10 sm:grid-cols-[80px_1fr] sm:gap-12"
              >
                <p className="index pt-1">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-foreground/80">
                    {service.desc}
                  </p>
                  <ul className="mt-6 grid max-w-2xl gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    {service.deliverables.map((d, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 inline-block h-px w-3 shrink-0 bg-muted-foreground" aria-hidden />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
