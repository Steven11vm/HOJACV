"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Services({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const items = t.services.items

  return (
    <section
      id="services"
      className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow superior editorial — mismo lenguaje que About/Skills/Experience */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-16 flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            <span>04 · {lang === "es" ? "Servicios" : "Services"}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            Nº 07 · MMXXV
          </p>
        </motion.div>

        {/* GRID HORIZONTAL — titulo izq, meta+quote der */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col"
          >
            <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              {t.services.title}
            </h2>
            <div aria-hidden className="mt-8 h-px w-16 bg-foreground/40" />
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.services.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6 lg:items-end"
          >
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span>
                {items.length} {lang === "es" ? "servicios" : "services"}
              </span>
              <span aria-hidden>·</span>
              <span>{lang === "es" ? "Full stack + DevOps + IA" : "Full stack + DevOps + AI"}</span>
            </p>
            <p
              className="max-w-sm text-balance text-lg leading-relaxed text-foreground/90 sm:text-xl lg:text-right"
              style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
            >
              {lang === "es"
                ? "Precios cerrados, calendario claro, sin costos ocultos."
                : "Fixed pricing, clear timeline, no hidden costs."}
            </p>
          </motion.div>
        </div>

        {/* SERVICIOS — chapter cards */}
        <div className="mt-20 border-t border-hairline">
        {items.map((service, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid gap-6 border-b border-hairline py-12 sm:grid-cols-[110px_1fr] sm:gap-12 sm:py-14"
          >
            {/* Numero display gigante */}
            <div className="flex items-start sm:justify-end">
              <span
                className="font-display text-6xl leading-[0.85] text-foreground sm:text-7xl md:text-[5.5rem]"
                aria-hidden
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col">
              <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
                {service.title}
              </h3>

              <div aria-hidden className="mt-5 h-px w-10 bg-foreground/40" />

              <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground/80 sm:text-base">
                {service.desc}
              </p>

              {/* Deliverables en grid 2 col */}
              <ul className="mt-6 grid max-w-xl gap-x-8 gap-y-2 text-[14px] leading-[1.6] text-foreground/75 sm:grid-cols-2">
                {service.deliverables.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>

      </div>
    </section>
  )
}
