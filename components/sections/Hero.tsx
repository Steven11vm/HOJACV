"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import formalImage from "@/imagenes/image.png"

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang]

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] px-6 pt-32 pb-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
        {/* Left — name + role + intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col justify-center"
        >
          <p className="eyebrow mb-10">
            <span
              className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground"
              aria-hidden
            />
            {t.hero.status}
          </p>

          <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Steven
            <br />
            Villamizar
            <span className="text-muted-foreground">.</span>
          </h1>

          <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
            {t.hero.intro}
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href="#projects" className="btn-plain btn-plain-inv">
              {lang === "es" ? "Ver trabajo" : "See work"}
              <span aria-hidden>→</span>
            </a>
            <a
              href="/CV/Hoja de vida.pdf"
              download="Steven_Villamizar_CV.pdf"
              className="link-r text-sm text-foreground"
            >
              {t.hero.downloadCV}
            </a>
            <a href="#contact" className="link-r text-sm text-foreground">
              {lang === "es" ? "Contacto" : "Contact"}
            </a>
          </div>

          <dl className="mt-20 grid grid-cols-3 gap-8 border-t border-hairline pt-8">
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.stats.years}
              </dt>
              <dd className="font-display text-3xl text-foreground">2+</dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.stats.projects}
              </dt>
              <dd className="font-display text-3xl text-foreground">20+</dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {lang === "es" ? "Base" : "Based"}
              </dt>
              <dd className="font-display text-3xl text-foreground">Medellín</dd>
            </div>
          </dl>
        </motion.div>

        {/* Right — portrait */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <figure className="relative w-full max-w-sm">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
              <Image
                src={formalImage}
                alt="Steven Villamizar"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 320px, 400px"
                priority
                quality={100}
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>Steven Villamizar · MMXXV</span>
              <span>Nº 01</span>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  )
}
