"use client"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import stevenPhoto from "@/imagenes/stevenelegante.png"

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
  const reduced = useReducedMotion()

  return (
    <section
      id="about"
      className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow superior — un solo bloque, no dos */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-16 flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            <span>02 · {lang === "es" ? "Sobre mí" : "About"}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            Nº 03 · MMXXV
          </p>
        </motion.div>

        {/* GRID HORIZONTAL — foto flotante a la izquierda, texto a la derecha */}
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-24">
          {/* Foto flotando */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:mx-0"
          >
            {/* Marca de agua Nº grande detrás */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-8 -top-10 font-display text-[160px] leading-none text-foreground/[0.04] sm:text-[220px]"
              style={{ fontStyle: "italic", fontWeight: 900 }}
            >
              02
            </div>

            {/* Contenedor de la foto con animación float */}
            <motion.div
              animate={
                reduced
                  ? undefined
                  : { y: [0, -14, 0] }
              }
              transition={
                reduced
                  ? undefined
                  : { duration: 6, ease: "easeInOut", repeat: Infinity }
              }
              className="relative aspect-[3/4] w-full overflow-hidden border border-hairline bg-muted shadow-2xl"
            >
              <Image
                src={stevenPhoto}
                alt="Steven Villamizar Mendoza"
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                priority
                className="object-cover"
              />
              {/* Gradient overlay bottom para peso visual */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
              />
            </motion.div>

            {/* Credit debajo de la foto */}
            <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {lang === "es" ? "Retrato · MMXXV" : "Portrait · MMXXV"}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
                MDE · CO
              </p>
            </div>
          </motion.div>

          {/* Bloque de texto */}
          <div className="flex flex-col">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl"
            >
              {t.about.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 h-px w-16 origin-left bg-foreground/40"
              aria-hidden
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 text-lg leading-[1.7] text-foreground/90 sm:text-xl sm:leading-[1.65]"
            >
              {t.about.bio1}{" "}
              <span className="text-foreground">Steven Villamizar Mendoza</span>
              {t.about.bio1b} <span className="text-foreground">{t.about.bio1c}</span>{" "}
              {t.about.bio1d}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-6 text-[15px] leading-[1.85] text-foreground/80 sm:text-base"
            >
              {t.about.bio2}{" "}
              <span className="text-foreground">{t.about.bio2b}</span> {t.about.bio2c}
            </motion.p>

            {/* Pull quote — italica serif, marcada por rules verticales */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="mt-12 grid grid-cols-[auto_1fr] items-start gap-4"
            >
              <span
                className="mt-2 inline-block h-8 w-px bg-foreground/40"
                aria-hidden
              />
              <p
                className="text-balance text-lg leading-relaxed text-foreground sm:text-xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
              >
                {t.about.bio3}
              </p>
            </motion.div>

            {/* Specialties chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="mt-14"
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {lang === "es" ? "Enfoque" : "Focus"}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {SPECIALTIES.map((sp, i) => (
                  <motion.span
                    key={sp.en}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: 0.5 + i * 0.03 }}
                    className="inline-flex items-center gap-2 border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/90"
                  >
                    <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-foreground" />
                    {sp[lang]}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Credentials — tabla horizontal compacta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.52 }}
              className="mt-12 border-t border-hairline pt-8"
            >
              <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0">
                {[
                  { label: lang === "es" ? "Ubicación" : "Location", value: t.about.info.location },
                  { label: lang === "es" ? "Formación" : "Education", value: t.about.info.degree },
                  { label: lang === "es" ? "Modalidad" : "Mode", value: t.about.info.availability },
                  { label: lang === "es" ? "Idiomas" : "Languages", value: t.about.info.languages },
                ].map((it, i, arr) => (
                  <div
                    key={it.label}
                    className={`px-3 ${
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
          </div>
        </div>
      </div>
    </section>
  )
}
