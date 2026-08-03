"use client"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

// Lazy import: react-icon-cloud usa TagCanvas (no soporta SSR).
const IconCloud = dynamic(
  () => import("@/components/ui/interactive-icon-cloud").then((m) => m.IconCloud),
  { ssr: false, loading: () => (
    <div className="flex h-[360px] w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
      cargando iconos…
    </div>
  ) },
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
  // Bases de datos
  "mysql",
  "microsoftsqlserver",
  "mongodb",
  "postgresql",
  // IA
  "openai",
  "googlegemini",
  // Herramientas & devops
  "git",
  "github",
  "vercel",
  "docker",
  "figma",
  "android",
  "linux",
  "postman",
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

      {/* IconCloud 3D */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mx-auto mt-6 flex w-full max-w-lg items-center justify-center"
      >
        <IconCloud iconSlugs={STACK_SLUGS} />
      </motion.div>

      <p className="mx-auto mt-8 max-w-xl text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {lang === "es"
          ? "· Simple Icons · " + STACK_SLUGS.length + " tecnologías ·"
          : "· Simple Icons · " + STACK_SLUGS.length + " technologies ·"}
      </p>
    </section>
  )
}
