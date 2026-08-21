"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Lock } from "lucide-react"
import { type Lang, translations } from "@/lib/translations"

interface ProjectData {
  title: string
  subtitle?: string
  description?: string
  image?: string
  link?: string
  tech?: string[]
}

interface ProjectsGridProps {
  lang: Lang
}

/**
 * Genera una URL de screenshot on-the-fly con thum.io (servicio gratuito
 * sin API key). Cachea del lado de thum.io tras la primera visita.
 *
 * width/1200 y crop/900 dan 4:3 real; noanimate/ evita GIFs; wait/2/ le da
 * a la SPA 2s para hidratar y capturar el "arriba del fold" pintado.
 */
function screenshotUrl(link: string): string {
  const clean = link.replace(/^https?:\/\//, "https://")
  return `https://image.thum.io/get/width/1200/crop/900/noanimate/wait/2/${clean}`
}

/** Placeholder cinematográfico SVG cuando no hay link ni imagen. */
const ACCENTS = ["#7b61ff", "#ff4114", "#00c8ff", "#e5231b", "#2f7bff", "#ff2f9c", "#4356c8", "#f59e0b"]

function placeholderFor(title: string, index: number): string {
  const accent = ACCENTS[index % ACCENTS.length]
  const num = String(index + 1).padStart(2, "0")
  const safe = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <radialGradient id="r" cx="30%" cy="20%" r="90%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#0f1113" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#r)"/>
  <text x="60" y="180" font-family="ui-monospace, Menlo, monospace" font-size="22" letter-spacing="6" fill="rgba(255,255,255,0.55)">Nº ${num}</text>
  <text x="60" y="800" font-family="Georgia, serif" font-size="68" font-weight="700" fill="rgba(255,255,255,0.95)" letter-spacing="-2">${safe}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function ProjectsGrid({ lang }: ProjectsGridProps) {
  const t = translations[lang]
  const projects = t.projectsData as unknown as ProjectData[]

  return (
    <section id="projects" className="relative border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header editorial */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-wrap items-baseline justify-between gap-6 border-b border-hairline pb-6"
        >
          <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            <span>06 · {lang === "es" ? "Trabajo" : "Work"}</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60">
            Nº 08 · MMXXV
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:gap-x-10 lg:gap-y-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="md:col-span-2 lg:pr-8"
          >
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              {t.projects.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.projects.subtitle}
            </p>
          </motion.div>

          {projects.map((p, i) => (
            <ProjectCard key={`${p.title}-${i}`} project={p} index={i} lang={lang} viewLabel={t.projects.viewProject} privateLabel={t.projects.privateProject} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  lang,
  viewLabel,
  privateLabel,
}: {
  project: ProjectData
  index: number
  lang: Lang
  viewLabel: string
  privateLabel: string
}) {
  const hasLink = Boolean(project.link && project.link !== "#")
  const isExternal = hasLink && project.link!.startsWith("http")

  const primaryImg = isExternal
    ? screenshotUrl(project.link!)
    : project.image ?? placeholderFor(project.title, index)

  const fallbackImg = project.image ?? placeholderFor(project.title, index)
  const [src, setSrc] = useState(primaryImg)
  const [loaded, setLoaded] = useState(false)

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-hairline bg-muted">
        {/* Skeleton mientras carga la screenshot */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
              <span>Cargando</span>
              <span className="flex items-center gap-1" aria-hidden>
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50 animate-loader-dot" style={{ animationDelay: "0ms" }} />
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50 animate-loader-dot" style={{ animationDelay: "150ms" }} />
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50 animate-loader-dot" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={project.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (src !== fallbackImg) {
              setSrc(fallbackImg)
            } else {
              setLoaded(true)
            }
          }}
          className={`h-full w-full object-cover object-top transition-all duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-[1.03]`}
        />
        {/* Overlay hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Badge esquina */}
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 border border-white/25 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          {hasLink ? (
            <>
              <span>{viewLabel}</span>
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" strokeWidth={2} />
              <span>{privateLabel}</span>
            </>
          )}
        </div>
        {/* Index editorial esquina inferior izquierda */}
        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.32em] text-white/85 mix-blend-difference">
          Nº {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-foreground sm:text-[26px]">
            {project.title}
          </h3>
          {hasLink && (
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" strokeWidth={1.5} />
          )}
        </div>
        {project.subtitle && (
          <p className="text-sm text-muted-foreground">{project.subtitle}</p>
        )}
        {project.tech && project.tech.length > 0 && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {project.tech.slice(0, 4).join(" · ")}
            {project.tech.length > 4 && " …"}
          </p>
        )}
      </div>
    </>
  )

  const wrapperCls = "group block"
  const motionProps = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" as const },
    transition: { duration: 0.55, delay: (index % 4) * 0.05, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
  }

  if (isExternal) {
    return (
      <motion.a {...motionProps} href={project.link} target="_blank" rel="noopener noreferrer" className={wrapperCls} aria-label={`${project.title} — ${lang === "es" ? "Abrir en nueva pestaña" : "Open in new tab"}`}>
        {cardContent}
      </motion.a>
    )
  }
  return (
    <motion.div {...motionProps} className={wrapperCls}>
      {cardContent}
    </motion.div>
  )
}
