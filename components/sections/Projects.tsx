"use client"
import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { X, ArrowUpRight } from "lucide-react"

type Project = {
  title: string
  subtitle?: string
  description: string
  tech: string[]
  link?: string
  featured?: boolean
  hero?: boolean
  accent?: string
  image?: string
  imageAlt?: string
  doc?: {
    architecture?: string[]
    technicalDecisions?: string[]
    problemsSolved?: string[]
  }
}

export function Projects({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const projects = t.projectsData as unknown as Project[]
  const [docProject, setDocProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
          <div>
            <p className="eyebrow">{lang === "es" ? "06 · Trabajo" : "06 · Work"}</p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
            >
              {t.projects.title}
            </motion.h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t.projects.subtitle}
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-hairline">
          {projects.map((project, idx) => (
            <ProjectRow
              key={idx}
              project={project}
              idx={idx}
              t={t}
              onOpenDoc={setDocProject}
            />
          ))}
        </ol>
      </div>

      {/* Doc modal */}
      <AnimatePresence>
        {docProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocProject(null)}
              className="fixed inset-0 z-[100] bg-background/85"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="flex max-h-[85vh] flex-col overflow-hidden border border-foreground bg-background">
                <div className="flex items-start justify-between border-b border-hairline p-8">
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {t.projects.docTech}
                    </p>
                    <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                      {docProject.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocProject(null)}
                    aria-label="Close"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-10 overflow-y-auto p-8">
                  {docProject.doc?.architecture && (
                    <DocBlock
                      title={t.projects.docLabels.architecture}
                      items={docProject.doc.architecture}
                    />
                  )}
                  {docProject.doc?.technicalDecisions && (
                    <DocBlock
                      title={t.projects.docLabels.technicalDecisions}
                      items={docProject.doc.technicalDecisions}
                    />
                  )}
                  {docProject.doc?.problemsSolved && (
                    <DocBlock
                      title={t.projects.docLabels.problemsSolved}
                      items={docProject.doc.problemsSolved}
                    />
                  )}
                </div>

                {docProject.link && docProject.link !== "#" && (
                  <div className="border-t border-hairline p-6">
                    <a
                      href={docProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-plain btn-plain-inv w-full justify-center"
                    >
                      {t.projects.viewProject}
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectRow({
  project,
  idx,
  t,
  onOpenDoc,
}: {
  project: Project
  idx: number
  t: (typeof translations)[Lang]
  onOpenDoc: (p: Project) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasImage = Boolean(project.image)

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (idx % 4) * 0.04 }}
      className="group border-b border-hairline"
    >
      <div
        role={hasImage ? "button" : undefined}
        tabIndex={hasImage ? 0 : undefined}
        onClick={hasImage ? () => setExpanded((v) => !v) : undefined}
        onKeyDown={
          hasImage
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setExpanded((v) => !v)
                }
              }
            : undefined
        }
        className={`grid gap-4 py-10 transition-colors sm:grid-cols-[60px_1fr_200px_40px] sm:items-baseline sm:gap-8 ${
          hasImage ? "cursor-pointer hover:bg-muted" : ""
        }`}
      >
        <p className="index sm:pt-1">{String(idx + 1).padStart(2, "0")}</p>

        <div>
          <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{project.subtitle}</p>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-right">
          {project.tech.slice(0, 3).join(" · ")}
          {project.tech.length > 3 && " …"}
        </p>

        <p className="hidden text-right text-muted-foreground transition-transform group-hover:translate-x-1 sm:block">
          {hasImage ? (expanded ? "−" : "+") : project.link && project.link !== "#" ? "↗" : "·"}
        </p>
      </div>

      <AnimatePresence initial={false}>
        {expanded && hasImage && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-12 sm:grid-cols-[60px_1fr] sm:gap-8">
              <div />
              <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
                <div className="relative aspect-[5/4] w-full overflow-hidden border border-hairline bg-white">
                  <Image
                    src={project.image!}
                    alt={project.imageAlt ?? project.title}
                    fill
                    className="object-cover dark:invert"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="max-w-lg text-[15px] leading-[1.75] text-foreground/80">
                    {project.description}
                  </p>

                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {project.tech.join(" · ")}
                  </p>

                  <div
                    className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.link && project.link !== "#" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-plain btn-plain-inv"
                      >
                        {t.projects.viewProject}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.doc && (
                      <button
                        type="button"
                        onClick={() => onOpenDoc(project)}
                        className="link-r font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                      >
                        {t.projects.docTech}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!expanded && !hasImage && (
          <motion.div
            key="static"
            initial={false}
            className="grid gap-8 pb-10 sm:grid-cols-[60px_1fr] sm:gap-8"
          >
            <div />
            <div className="max-w-2xl">
              <p className="text-[15px] leading-[1.75] text-foreground/80">
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                {project.link && project.link !== "#" && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-r font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                  >
                    {t.projects.viewProject} ↗
                  </a>
                )}
                {project.doc && (
                  <button
                    type="button"
                    onClick={() => onOpenDoc(project)}
                    className="link-r font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                  >
                    {t.projects.docTech}
                  </button>
                )}
                {!project.link && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.projects.privateProject}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function DocBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-4 text-[15px] leading-[1.75] text-foreground/85">
            <span
              className="mt-[0.7rem] inline-block h-px w-3 shrink-0 bg-foreground"
              aria-hidden
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
