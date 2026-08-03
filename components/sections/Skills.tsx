"use client"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

const IconCloud = dynamic(
  () => import("@/components/ui/interactive-icon-cloud").then((m) => m.IconCloud),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[400px] w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        cargando iconos…
      </div>
    ),
  },
)

const STACK_SLUGS = [
  // Frontend
  "react",
  "nextdotjs",
  "typescript",
  "javascript",
  "tailwindcss",
  "html5",
  "css3",
  // Backend
  "nodedotjs",
  "express",
  "python",
  "php",
  // Bases de datos SQL & NoSQL
  "mysql",
  "microsoftsqlserver",
  "mongodb",
  "postgresql",
  // IA
  "openai",
  "googlegemini",
  // DevOps · Contenedores · Cloud
  "docker",
  "amazonaws",
  "vercel",
  "cloudflare",
  "nginx",
  "githubactions",
  // Seguridad · Observabilidad
  "letsencrypt",
  "sentry",
  // Herramientas
  "git",
  "github",
  "linux",
  "postman",
  "figma",
  "android",
]

const STACK_GROUPS: { label: { es: string; en: string }; items: string[] }[] = [
  {
    label: { es: "Frontend", en: "Frontend" },
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion"],
  },
  {
    label: { es: "Backend", en: "Backend" },
    items: ["Node.js", "Express", "Python", "PHP", "REST API", "WebSockets"],
  },
  {
    label: { es: "Bases de datos & SQL", en: "Databases & SQL" },
    items: [
      "SQL Server",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Modelado relacional",
      "Query tuning",
      "Backups & restore",
    ],
  },
  {
    label: { es: "IA & Automatización", en: "AI & Automation" },
    items: ["Gemini API", "OpenAI", "Claude", "Prompt Engineering", "RAG", "Function calling"],
  },
  {
    label: { es: "DevOps & Cloud", en: "DevOps & Cloud" },
    items: [
      "Docker",
      "Docker Compose",
      "Vercel",
      "AWS (EC2, S3, RDS)",
      "GitHub Actions",
      "Nginx",
      "Cloudflare",
      "CI/CD",
    ],
  },
  {
    label: { es: "Seguridad web", en: "Web security" },
    items: [
      "OWASP Top 10",
      "Content Security Policy",
      "Rate limiting",
      "JWT & sesiones seguras",
      "HTTPS / TLS",
      "Sanitización de input",
      "Secret management",
    ],
  },
  {
    label: { es: "Herramientas", en: "Tools" },
    items: ["Git", "GitHub", "Linux", "Postman", "Figma", "Android"],
  },
]

export function Skills({ lang }: { lang: Lang }) {
  const t = translations[lang]

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
            ? "Herramientas con las que llevo software real a producción — arrastra la nube para explorarlas."
            : "Tools I use to ship real software into production — drag the cloud to explore them."}
        </p>
      </motion.div>

      {/* IconCloud con altura reservada */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mx-auto mt-6 w-full max-w-lg"
      >
        <IconCloud iconSlugs={STACK_SLUGS} />
      </motion.div>

      {/* Grilla textual — SIEMPRE visible, no depende de que el cloud cargue */}
      <div className="mx-auto mt-16 w-full max-w-3xl border-y border-hairline">
        {STACK_GROUPS.map((group, idx) => (
          <motion.div
            key={group.label.en}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid gap-4 border-b border-hairline py-6 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-10 sm:py-7"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {group.label[lang]}
              <span className="ml-2 text-muted-foreground/50">· {group.items.length}</span>
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground sm:text-[15px]">
              {group.items.map((it, i) => (
                <span key={it} className="inline-flex items-center">
                  {it}
                  {i < group.items.length - 1 && (
                    <span aria-hidden className="ml-4 text-muted-foreground/40">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {lang === "es"
          ? `Simple Icons · ${STACK_SLUGS.length} tecnologías activas`
          : `Simple Icons · ${STACK_SLUGS.length} active technologies`}
      </p>
    </section>
  )
}
