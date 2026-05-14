"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Layers, Code, CheckCircle2, X, Lock, ArrowUpRight } from "lucide-react"

export function Projects({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const projects = t.projectsData
  const [docProject, setDocProject] = useState<any | null>(null)

  return (
    <section id="projects" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-neon-blue/8 blur-[140px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-neon-violet/8 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.projects.portfolio}</div>
          <h2 className="mb-5 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.projects.title}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{t.projects.subtitle}</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (idx % 2) * 0.06 }}
              whileHover={{ y: -6 }}
              className="glass spotlight-card group relative flex flex-col overflow-hidden rounded-2xl p-7 sm:p-8"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
              }}
            >
              {/* Top row */}
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {project.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary ring-1 ring-primary/30">
                      <span className="status-dot" style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
                      {t.projects.featured}
                    </span>
                  )}
                  {project.link && project.link !== "#" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-green/12 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neon-green ring-1 ring-neon-green/30">
                      {t.projects.live}
                    </span>
                  )}
                </div>
                <span className="font-serif text-5xl font-medium leading-none num-outline">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-1 font-serif text-2xl font-medium leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                {project.title}
              </h3>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {(project as any).subtitle ?? ""}
              </p>
              <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="mb-6 flex flex-wrap gap-1.5">
                {project.tech.map((tech, i) => (
                  <span key={i} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                {project.doc && (
                  <button
                    type="button"
                    onClick={() => setDocProject(project)}
                    className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {t.projects.docTech}
                  </button>
                )}
                {project.link && project.link !== "#" ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    {t.projects.viewProject}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                ) : (
                  <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">
                    <Lock className="h-3 w-3" />
                    {t.projects.privateProject}
                  </span>
                )}
              </div>

              {/* Gradient border on hover */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {docProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocProject(null)}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent p-6">
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                      {t.projects.docTech}
                    </p>
                    <h2 className="font-serif text-2xl font-medium text-foreground">{docProject.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocProject(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-7 overflow-y-auto p-6 sm:p-8">
                  {docProject.doc?.architecture && (
                    <DocBlock
                      icon={Layers}
                      color="var(--neon-violet)"
                      title={t.projects.docLabels.architecture}
                      items={docProject.doc.architecture}
                      delay={0.05}
                    />
                  )}
                  {docProject.doc?.technicalDecisions && (
                    <DocBlock
                      icon={Code}
                      color="var(--neon-blue)"
                      title={t.projects.docLabels.technicalDecisions}
                      items={docProject.doc.technicalDecisions}
                      delay={0.1}
                    />
                  )}
                  {docProject.doc?.problemsSolved && (
                    <DocBlock
                      icon={CheckCircle2}
                      color="var(--neon-green)"
                      title={t.projects.docLabels.problemsSolved}
                      items={docProject.doc.problemsSolved}
                      delay={0.15}
                    />
                  )}
                </div>

                {docProject.link && docProject.link !== "#" && (
                  <div className="border-t border-white/5 bg-white/[0.02] p-5">
                    <Button
                      asChild
                      className="w-full rounded-full bg-foreground text-sm font-semibold uppercase tracking-widest text-background hover:bg-foreground/90"
                    >
                      <a href={docProject.link} target="_blank" rel="noopener noreferrer">
                        {t.projects.viewProject}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
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

function DocBlock({
  icon: Icon,
  color,
  title,
  items,
  delay,
}: {
  icon: React.ElementType
  color: string
  title: string
  items: string[]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <h4 className="mb-3 flex items-center gap-2 font-serif text-lg font-medium text-foreground">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg ring-1"
          style={{
            background: `color-mix(in oklch, ${color} 15%, transparent)`,
            color,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 30%, transparent)`,
          }}
        >
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h4>
      <ul className="space-y-2 pl-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
