"use client"
import { motion, type Variants } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Code2, Server, Database, Sparkles, Wrench } from "lucide-react"

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"

type Skill = { name: string; logo: string; level?: number }

const STACK: Record<string, Skill[]> = {
  frontend: [
    { name: "React", logo: `${CDN}/react/react-original.svg`, level: 95 },
    { name: "Next.js", logo: `${CDN}/nextjs/nextjs-original.svg`, level: 92 },
    { name: "TypeScript", logo: `${CDN}/typescript/typescript-original.svg`, level: 90 },
    { name: "JavaScript", logo: `${CDN}/javascript/javascript-original.svg`, level: 95 },
    { name: "Tailwind", logo: `${CDN}/tailwindcss/tailwindcss-original.svg`, level: 95 },
    { name: "HTML5", logo: `${CDN}/html5/html5-original.svg`, level: 98 },
    { name: "CSS3", logo: `${CDN}/css3/css3-original.svg`, level: 95 },
  ],
  backend: [
    { name: "Node.js", logo: `${CDN}/nodejs/nodejs-original.svg`, level: 88 },
    { name: "Express", logo: `${CDN}/express/express-original.svg`, level: 85 },
    { name: "Python", logo: `${CDN}/python/python-original.svg`, level: 82 },
    { name: "PHP", logo: `${CDN}/php/php-original.svg`, level: 80 },
    { name: "REST API", logo: `${CDN}/postman/postman-original.svg`, level: 92 },
  ],
  database: [
    { name: "MySQL", logo: `${CDN}/mysql/mysql-original.svg`, level: 90 },
    { name: "MongoDB", logo: `${CDN}/mongodb/mongodb-original.svg`, level: 80 },
    { name: "PostgreSQL", logo: `${CDN}/postgresql/postgresql-original.svg`, level: 75 },
  ],
  ai: [
    { name: "Gemini", logo: `${CDN}/google/google-original.svg`, level: 88 },
    { name: "OpenAI", logo: `${CDN}/openai/openai-original.svg`, level: 80 },
    { name: "Prompt Eng.", logo: `${CDN}/python/python-original.svg`, level: 85 },
  ],
  tools: [
    { name: "Git", logo: `${CDN}/git/git-original.svg`, level: 92 },
    { name: "GitHub", logo: `${CDN}/github/github-original.svg`, level: 92 },
    { name: "Vercel", logo: `${CDN}/vercel/vercel-original.svg`, level: 90 },
    { name: "Docker", logo: `${CDN}/docker/docker-original.svg`, level: 70 },
    { name: "Figma", logo: `${CDN}/figma/figma-original.svg`, level: 80 },
    { name: "Android", logo: `${CDN}/android/android-original.svg`, level: 75 },
  ],
}

const CAT_META = {
  frontend: { icon: Code2, color: "var(--neon-violet)" },
  backend: { icon: Server, color: "var(--neon-blue)" },
  database: { icon: Database, color: "var(--neon-cyan)" },
  ai: { icon: Sparkles, color: "var(--neon-pink)" },
  tools: { icon: Wrench, color: "var(--neon-green)" },
}

export function Skills({ lang }: { lang: Lang }) {
  const t = translations[lang]

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  }

  return (
    <section id="skills" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-neon-pink/8 blur-[140px]" />
        <div className="absolute right-0 bottom-1/3 h-96 w-96 rounded-full bg-neon-cyan/8 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.skills.subtitle}</div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.skills.title}
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(STACK) as Array<keyof typeof STACK>).map((catKey) => {
            const Icon = CAT_META[catKey as keyof typeof CAT_META].icon
            const color = CAT_META[catKey as keyof typeof CAT_META].color
            const skills = STACK[catKey]
            const catLabel = (t.skills.categories as Record<string, string>)[catKey] ?? catKey

            return (
              <motion.div
                key={catKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass group relative overflow-hidden rounded-2xl p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl ring-1"
                      style={{
                        background: `color-mix(in oklch, ${color} 18%, transparent)`,
                        color,
                        boxShadow: `0 0 0 1px color-mix(in oklch, ${color} 30%, transparent) inset`,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground">{catLabel}</h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {skills.length} {lang === "es" ? "techs" : "techs"}
                  </span>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {skills.map((skill) => (
                    <motion.div key={skill.name} variants={item} className="group/row">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={skill.logo}
                            alt={skill.name}
                            className="h-5 w-5 object-contain transition-transform group-hover/row:scale-110"
                            loading="lazy"
                            width={20}
                            height={20}
                          />
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${color}, color-mix(in oklch, ${color} 60%, white))`,
                            boxShadow: `0 0 8px color-mix(in oklch, ${color} 50%, transparent)`,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Gradient deco */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
                  style={{ background: color }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
