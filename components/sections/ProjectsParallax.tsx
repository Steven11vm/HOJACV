"use client"
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel"
import { type Lang, translations } from "@/lib/translations"

interface ProjectData {
  title: string
  subtitle?: string
  image?: string
  link?: string
  tech?: string[]
  accent?: string
}

interface ProjectsParallaxProps {
  lang: Lang
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

export function ProjectsParallax({ lang }: ProjectsParallaxProps) {
  const t = translations[lang]
  const raw = t.projectsData as unknown as ProjectData[]

  const items: HeroCarouselItem[] = raw.map((p, i) => ({
    id: i,
    title: p.title,
    image: p.image ?? cinematicFallback(p.title, i),
    credit: p.subtitle ? `— ${p.subtitle.toUpperCase()}` : undefined,
    meta: p.tech?.slice(0, 3),
    accent: p.accent ?? ACCENTS[i % ACCENTS.length],
  }))

  return (
    <section id="projects" className="relative border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 pt-24 sm:px-10 lg:px-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {lang === "es" ? "06 · Trabajo" : "06 · Work"}
        </p>
        <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
          {t.projects.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.projects.subtitle}
        </p>
      </div>

      <div className="mt-16 h-[100svh] min-h-[600px] w-full">
        <HeroCarousel
          items={items}
          brand="STEVEN VILLAMIZAR"
          defaultIndex={Math.min(2, items.length - 1)}
        />
      </div>
    </section>
  )
}
