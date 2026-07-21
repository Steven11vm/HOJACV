"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Intro({ lang }: { lang: Lang }) {
  const t = translations[lang]

  return (
    <section
      id="intro"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 sm:px-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-6 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:px-10">
        <span>Nº 01 · MMXXV</span>
        <span>{lang === "es" ? "Portafolio" : "Portfolio"}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          {t.hero.status}
        </p>
        <h1 className="font-display text-[15vw] leading-[0.92] tracking-tight text-foreground sm:text-[10vw] md:text-[9rem] lg:text-[11rem]">
          Steven
          <br />
          <span className="italic text-muted-foreground">Villamizar</span>
        </h1>
        <p className="mt-10 max-w-md font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Full Stack Engineer · Medellín, Colombia
        </p>

        <a
          href="#hero"
          className="pointer-events-auto mt-16 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground"
        >
          <span className="link-r">↓ {lang === "es" ? "Bajar" : "Scroll"}</span>
        </a>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:px-10">
        <span>MEDELLÍN · CO</span>
        <span>STEVENVILLA10@GMAIL.COM</span>
      </div>
    </section>
  )
}
