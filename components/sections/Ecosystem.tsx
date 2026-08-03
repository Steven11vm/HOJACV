"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, ExternalLink } from "lucide-react"
import { ThreeDMarquee, type MarqueeItem } from "@/components/ui/three-d-marquee"
import { type Lang, translations } from "@/lib/translations"

interface EcosystemProps {
  lang: Lang
}

type EcosystemProject = {
  title: string
  subtitle?: string
  description: string
  tech: string[]
  link?: string
  screenshot: string
}

const thum = (url: string, extra: string = "") =>
  `https://image.thum.io/get/width/970/crop/700${extra}/${encodeURI(url)}`

const REAL_PROJECT_URLS: Record<string, string> = {
  "Tonsorium — Spa for Men": "https://tonsorium.online/",
  "Alien Style 51": "https://alyenstyle.online/",
  "Beat Generator AI": "https://opiumm-gray.vercel.app/",
  "Finanzas Pro": "https://finanzaspro-nine.vercel.app/",
  "Inventory SaaS": "https://saas-beta-peach.vercel.app/",
  "Enterprise Dashboard": "https://empresarial-omega.vercel.app/",
  "ORAL-PLUS Ecosystem": "https://oral-plus.com/index.html",
  "Digital CV": "https://cv-steven.vercel.app/",
}

export function Ecosystem({ lang }: EcosystemProps) {
  const t = translations[lang] as any
  const projectsData = t.projectsData as {
    title: string
    subtitle?: string
    description: string
    tech: string[]
    link?: string
  }[]

  const [selected, setSelected] = useState<EcosystemProject | null>(null)

  const realProjects: EcosystemProject[] = useMemo(() => {
    return projectsData
      .filter((p) => REAL_PROJECT_URLS[p.title])
      .map((p) => ({
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        tech: p.tech,
        link: REAL_PROJECT_URLS[p.title],
        screenshot: thum(REAL_PROJECT_URLS[p.title]),
      }))
  }, [projectsData])

  // Duplico los proyectos para llenar bien el marquee (4 cols × 6 filas idealmente)
  const marqueeItems: MarqueeItem[] = useMemo(() => {
    if (realProjects.length === 0) return []
    const target = 24
    const items: MarqueeItem[] = []
    let i = 0
    while (items.length < target) {
      const p = realProjects[i % realProjects.length]
      items.push({
        src: p.screenshot,
        alt: p.title,
        onClick: () => setSelected(p),
      })
      i++
    }
    return items
  }, [realProjects])

  // ESC cierra modal + bloquea scroll body
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [selected])

  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden border-t border-hairline bg-background px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "05 · Ecosistema" : "05 · Ecosystem"}</p>
        </div>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {lang === "es"
              ? "Proyectos en producción."
              : "Projects in production."}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            {lang === "es"
              ? "Screenshots reales de sitios en producción. Haz click en cualquiera para ver detalles, stack y abrir el proyecto."
              : "Real screenshots of live production sites. Click any one to see details, stack and open the project."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
          >
            {lang === "es"
              ? `${realProjects.length} sitios en vivo · click para explorar`
              : `${realProjects.length} live sites · click to explore`}
          </motion.p>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
        <div
          className="relative overflow-hidden rounded-2xl border border-hairline bg-black/30"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          }}
        >
          <ThreeDMarquee items={marqueeItems} />
        </div>

        {/* Chips de proyectos como fallback / atajo directo */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 border-t border-hairline pt-8">
          {realProjects.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => setSelected(p)}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-[11.5px] text-muted-foreground transition-all hover:-translate-y-px hover:border-foreground hover:bg-foreground hover:text-background active:scale-95"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Modal profesional con animaciones ricas */}
      <ProjectModal
        project={selected}
        onClose={() => setSelected(null)}
        lang={lang}
      />
    </section>
  )
}

function ProjectModal({
  project,
  onClose,
  lang,
}: {
  project: EcosystemProject | null
  onClose: () => void
  lang: Lang
}) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-hairline bg-background shadow-[0_0_100px_rgba(0,0,0,0.7)]"
            >
              {/* Accent gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5 sm:px-8 sm:py-6">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  className="min-w-0"
                >
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                    {lang === "es" ? "En producción" : "In production"}
                  </p>
                  <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      {project.subtitle}
                    </p>
                  )}
                </motion.div>

                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  onClick={onClose}
                  aria-label={lang === "es" ? "Cerrar" : "Close"}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-background text-muted-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background active:scale-95"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="grid gap-6 overflow-y-auto p-6 sm:gap-8 sm:p-8 lg:grid-cols-[1.35fr_1fr]">
                {/* Screenshot con hover parallax */}
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  className="group relative aspect-[970/700] overflow-hidden rounded-xl border border-hairline bg-black/40"
                >
                  <img
                    src={project.screenshot}
                    alt={project.title}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                    }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white">
                      {lang === "es" ? "Abrir sitio" : "Open site"}
                    </span>
                    <ExternalLink className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                </motion.a>

                <div className="flex flex-col">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-[14.5px] leading-[1.7] text-foreground/85 sm:text-[15px]"
                  >
                    {project.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="mt-6"
                  >
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.04, duration: 0.25 }}
                          className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground/80"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.35 }}
                      className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      {lang === "es" ? "Abrir proyecto" : "Open project"}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Footer hint */}
              <div className="hidden border-t border-hairline px-8 py-3 sm:block">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {lang === "es"
                    ? "ESC para cerrar · click fuera del modal cierra"
                    : "ESC to close · click outside closes"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
