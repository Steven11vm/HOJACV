"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, UserSearch } from "lucide-react"
import { useAudience, type Audience } from "@/lib/audience"
import type { Lang } from "@/lib/translations"

interface Props {
  lang: Lang
  /**
   * Delay antes de aparecer en la primera visita. Debe ser >= duracion del
   * splash (2000ms) + su exit animation (700ms) para no montarse encima.
   */
  delay?: number
}

/**
 * AudienceSelector — pregunta al visitante si es Cliente o Reclutador.
 * Aparece una unica vez (persistido en localStorage por [[audience]]) despues
 * del splash. La eleccion condiciona el orden de secciones, copys de Hero y
 * CTAs de Contact. Se puede reabrir desde el Navbar (menu > "Cambiar perfil").
 */
export function AudienceSelector({ lang, delay = 2800 }: Props) {
  const { audience, setAudience, ready } = useAudience()
  const [visible, setVisible] = useState(false)
  const [firstRunDone, setFirstRunDone] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (audience) {
      setFirstRunDone(true)
      return
    }
    // Primera visita: espera el splash. Cambios posteriores (switch manual
    // desde el Navbar) aparecen instantaneos.
    if (!firstRunDone) {
      const t = setTimeout(() => {
        setVisible(true)
        setFirstRunDone(true)
      }, delay)
      return () => clearTimeout(t)
    }
    setVisible(true)
  }, [ready, audience, delay, firstRunDone])

  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [visible])

  const choose = (a: Audience) => {
    setAudience(a)
    setVisible(false)
  }

  const copy = {
    es: {
      eyebrow: "Bienvenido",
      title: "¿Como te acompaño hoy?",
      subtitle:
        "Cuentame quien eres para acomodar el recorrido: enfocare la informacion en lo que realmente te importa.",
      client: {
        label: "Soy cliente",
        desc: "Busco construir un producto, contratar un servicio o resolver un problema de negocio.",
        hint: "Priorizo servicios, proceso y proyectos.",
      },
      recruiter: {
        label: "Soy reclutador",
        desc: "Estoy evaluando talento tecnico para una vacante o proceso de seleccion.",
        hint: "Priorizo experiencia, stack y CV.",
      },
      skip: "Ver todo tal cual",
    },
    en: {
      eyebrow: "Welcome",
      title: "How can I best serve you?",
      subtitle:
        "Tell me who you are so I can tailor the journey — I'll surface what matters most to you.",
      client: {
        label: "I'm a client",
        desc: "Looking to build a product, hire a service or solve a business problem.",
        hint: "Prioritizes services, process and projects.",
      },
      recruiter: {
        label: "I'm a recruiter",
        desc: "Evaluating engineering talent for a role or hiring process.",
        hint: "Prioritizes experience, stack and CV.",
      },
      skip: "See everything as-is",
    },
  }[lang]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="audience"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[210] flex items-center justify-center bg-background/95 px-6 backdrop-blur-md sm:px-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audience-title"
        >
          {/* Corner accents editoriales */}
          <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-hairline sm:left-10 sm:top-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-hairline sm:right-10 sm:top-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-hairline sm:bottom-10 sm:left-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-hairline sm:bottom-10 sm:right-10 sm:h-12 sm:w-12" />

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-3xl text-center"
          >
            <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
              <span>{copy.eyebrow}</span>
              <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            </p>

            <h2
              id="audience-title"
              className="mt-6 font-display text-3xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              {copy.title}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {copy.subtitle}
            </p>

            <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
              <AudienceCard
                icon={<Briefcase className="h-6 w-6" strokeWidth={1.5} />}
                label={copy.client.label}
                desc={copy.client.desc}
                hint={copy.client.hint}
                onClick={() => choose("client")}
              />
              <AudienceCard
                icon={<UserSearch className="h-6 w-6" strokeWidth={1.5} />}
                label={copy.recruiter.label}
                desc={copy.recruiter.desc}
                hint={copy.recruiter.hint}
                onClick={() => choose("recruiter")}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setAudience("client")
                setVisible(false)
              }}
              className="mt-10 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {copy.skip}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AudienceCard({
  icon,
  label,
  desc,
  hint,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  hint: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-start gap-4 border border-hairline bg-background/40 p-6 text-left transition-all hover:border-foreground hover:bg-foreground hover:text-background sm:p-8"
    >
      <span className="flex h-11 w-11 items-center justify-center border border-hairline text-foreground transition-colors group-hover:border-background group-hover:text-background">
        {icon}
      </span>
      <span className="font-display text-xl text-foreground transition-colors group-hover:text-background sm:text-2xl">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-background/80">
        {desc}
      </span>
      <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 transition-colors group-hover:text-background/70">
        {hint}
      </span>
      <span
        aria-hidden
        className="absolute right-6 top-6 font-mono text-[11px] text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-background"
      >
        →
      </span>
    </button>
  )
}
