"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

const STACK: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
  backend: ["Node.js", "Express", "Python", "PHP", "REST API"],
  database: ["MySQL", "SQL Server", "MongoDB", "PostgreSQL"],
  ai: ["Gemini API", "OpenAI", "Claude", "Prompt Engineering", "RAG"],
  tools: ["Git", "GitHub", "Vercel", "Docker", "Figma", "Android"],
}

export function Skills({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const categories = Object.keys(STACK) as Array<keyof typeof STACK>

  return (
    <section
      id="skills"
      className="relative border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
          <span>03 · Stack</span>
          <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
        </p>

        <p className="mt-6 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 sm:block">
          Nº 04 · MMXXV
        </p>

        <h2 className="mt-8 font-display text-4xl leading-tight text-foreground sm:mt-10 sm:text-5xl md:text-6xl">
          {t.skills.title}
        </h2>

        <div aria-hidden className="mt-10 h-px w-16 bg-foreground/40" />

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {lang === "es"
            ? "Herramientas con las que llevo software real a producción — probadas en clientes, no en tutoriales."
            : "Tools I use to ship real software into production — battle-tested on clients, not tutorials."}
        </p>
      </motion.div>

      {/* Bloques por categoria, apilados verticalmente con hairlines */}
      <div className="mx-auto mt-20 w-full max-w-3xl border-y border-hairline">
        {categories.map((catKey, idx) => {
          const items = STACK[catKey]
          const label = (t.skills.categories as Record<string, string>)[catKey] ?? catKey
          return (
            <motion.div
              key={catKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center gap-4 border-b border-hairline py-10 last:border-b-0 sm:py-12"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <span>{label}</span>
                <span aria-hidden className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground/70">
                  {items.length} {lang === "es" ? "techs" : "techs"}
                </span>
              </div>

              <div className="flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 text-center">
                {items.map((s, i) => (
                  <span
                    key={s}
                    className="inline-flex items-center font-display text-lg leading-tight text-foreground sm:text-xl"
                  >
                    {s}
                    {i < items.length - 1 && (
                      <span aria-hidden className="ml-6 hidden text-muted-foreground/40 sm:inline">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Meta al pie centrada */}
      <p className="mx-auto mt-12 max-w-xl text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {lang === "es"
          ? "Aprendo herramientas nuevas cuando el proyecto lo pide, no antes."
          : "New tools when the project asks for them, not before."}
      </p>
    </section>
  )
}
