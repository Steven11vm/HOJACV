"use client"
import { motion } from "framer-motion"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { type Lang } from "@/lib/translations"

interface AiAssistantProps {
  lang: Lang
  onOpenChat: () => void
}

/**
 * Seccion pitch para el copiloto IA. El chat completo vive en FloatingChat
 * (FAB + drawer), esta seccion solo describe la demo y ofrece un CTA que
 * dispara el mismo drawer via onOpenChat.
 */
export function AiAssistant({ lang, onOpenChat }: AiAssistantProps) {
  return (
    <section id="ai" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "07 · IA" : "07 · AI"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {lang === "es" ? "Habla con el copiloto." : "Talk to the copilot."}
          </motion.h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {lang === "es"
              ? "Una demo viva de como integro IA en producto. Preguntale por mi experiencia, stack, proyectos, tarifas o disponibilidad."
              : "A live demo of how I ship AI in product. Ask about my experience, stack, projects, rates or availability."}
          </p>

          <button type="button" onClick={onOpenChat} className="btn-plain btn-plain-inv mt-10">
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            {lang === "es" ? "Abrir copiloto" : "Open copilot"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            {lang === "es"
              ? "Tambien disponible en el boton flotante ↘"
              : "Also available in the floating button ↘"}
          </p>
        </div>
      </div>
    </section>
  )
}
