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

  return (
    <section id="skills" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "03 · Stack" : "03 · Stack"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t.skills.title}
          </motion.h2>

          <dl className="mt-16 divide-y divide-hairline border-y border-hairline">
            {(Object.keys(STACK) as Array<keyof typeof STACK>).map((catKey, idx) => {
              const items = STACK[catKey]
              const label = (t.skills.categories as Record<string, string>)[catKey] ?? catKey
              return (
                <motion.div
                  key={catKey}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  className="grid gap-4 py-8 sm:grid-cols-[160px_1fr] sm:gap-10"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-foreground">
                    {items.map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </dd>
                </motion.div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
