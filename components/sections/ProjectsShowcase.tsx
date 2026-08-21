"use client"
import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { type Lang, translations } from "@/lib/translations"
import type { HeroCarouselItem } from "@/components/ui/hero-carousel"

// Carousel se carga en cliente y con code-split: usa window, ResizeObserver,
// wheel listener y motion values costosos. Fuera del bundle inicial.
const HeroCarousel = dynamic(
  () => import("@/components/ui/hero-carousel").then((m) => m.HeroCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-black text-xs uppercase tracking-[0.24em] text-white/40">
        Loading…
      </div>
    ),
  },
)

interface ProjectData {
  title: string
  subtitle?: string
  description?: string
  image?: string
  link?: string
  tech?: string[]
  accent?: string
}

const ACCENTS = [
  "#7b61ff",
  "#ff4114",
  "#00c8ff",
  "#e5231b",
  "#2f7bff",
  "#ff2f9c",
  "#4356c8",
  "#14307a",
  "#ff3b6b",
  "#f59e0b",
  "#10b981",
]

function cinematicFallback(title: string, index: number): string {
  const accent = ACCENTS[index % ACCENTS.length]
  const num = String(index + 1).padStart(2, "0")
  const safe = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <radialGradient id="r" cx="30%" cy="20%" r="90%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#0f1113" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="l" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.2"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.2" fill="rgba(255,255,255,0.08)"/>
    </pattern>
  </defs>
  <rect width="600" height="800" fill="url(#r)"/>
  <rect width="600" height="800" fill="url(#l)"/>
  <rect width="600" height="800" fill="url(#dots)"/>
  <text x="40" y="120" font-family="ui-monospace, Menlo, monospace" font-size="18" letter-spacing="4" fill="rgba(255,255,255,0.55)">Nº ${num}</text>
  <text x="40" y="700" font-family="Georgia, serif" font-size="46" font-weight="700" fill="rgba(255,255,255,0.95)" letter-spacing="-1">${safe}</text>
  <text x="40" y="740" font-family="ui-monospace, Menlo, monospace" font-size="12" letter-spacing="3" fill="rgba(255,255,255,0.4)">STEVEN VILLAMIZAR · MMXXV</text>
  <line x1="40" y1="760" x2="180" y2="760" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function ProjectsShowcase({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const projects = t.projectsData as unknown as ProjectData[]
  const [index, setIndex] = useState(0)

  const items: HeroCarouselItem[] = useMemo(
    () =>
      projects.map((p, i) => ({
        id: i,
        title: p.title,
        image: p.image ?? cinematicFallback(p.title, i),
        credit: p.subtitle ? `— ${p.subtitle.toUpperCase()}` : undefined,
        meta: p.tech?.slice(0, 3),
        accent: p.accent ?? ACCENTS[i % ACCENTS.length],
      })),
    [projects],
  )

  const active = projects[index]
  const isExternal = Boolean(active?.link && active.link.startsWith("http"))

  return (
    <section id="projects" className="relative">
      {/* Header editorial */}
      <div className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          {lang === "es" ? "Nº 06 · Trabajo" : "Nº 06 · Work"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
        >
          {t.projects.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t.projects.subtitle}
        </motion.p>
      </div>

      {/* Carousel */}
      <div className="mt-16 h-[80svh] min-h-[520px] w-full">
        <HeroCarousel
          items={items}
          index={index}
          onIndexChange={setIndex}
          brand={lang === "es" ? "STEVEN · TRABAJO" : "STEVEN · WORK"}
        />
      </div>

      {/* Panel de detalle sincronizado con la card enfocada */}
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-20"
          >
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </p>
              <div className="hidden h-px w-16 bg-foreground/40 lg:block" aria-hidden />
              {active?.tech && (
                <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground lg:block">
                  {active.tech.join(" · ")}
                </p>
              )}
            </div>

            <div>
              <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
                {active?.title}
              </h2>
              {active?.subtitle && (
                <p className="mt-3 text-lg text-muted-foreground">{active.subtitle}</p>
              )}
              {active?.description && (
                <p className="mt-8 max-w-2xl text-[15px] leading-[1.85] text-foreground/85 sm:text-base">
                  {active.description}
                </p>
              )}
              {active?.tech && (
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
                  {active.tech.join(" · ")}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {active?.link && active.link !== "#" ? (
                  isExternal ? (
                    <a
                      href={active.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-plain btn-plain-inv"
                    >
                      {t.projects.viewProject}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <a href={active.link} className="btn-plain btn-plain-inv">
                      {t.projects.viewProject}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.projects.privateProject}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Proyecto ${i + 1}`}
                      className={`h-1.5 transition-all ${
                        i === index ? "w-8 bg-foreground" : "w-4 bg-foreground/25 hover:bg-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
