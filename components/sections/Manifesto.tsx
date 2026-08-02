"use client"
import { motion } from "framer-motion"
import { type Lang } from "@/lib/translations"
import { LampContainer } from "@/components/ui/lamp"

/**
 * Momento de respiro atmosferico entre AI y Contact.
 * Un solo mensaje bajo el spotlight del LampContainer — no compite con la
 * lista de proyectos ni con el chat, es una pausa antes del CTA de contacto.
 */
export function Manifesto({ lang }: { lang: Lang }) {
  return (
    <section id="manifesto" className="border-t border-hairline">
      <LampContainer>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/60"
        >
          {lang === "es" ? "Manifiesto" : "Manifesto"}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0.4, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          className="max-w-3xl bg-gradient-to-br from-white to-white/40 bg-clip-text text-center font-display text-4xl font-medium leading-[1.05] tracking-tight text-transparent sm:text-5xl md:text-6xl"
        >
          {lang === "es" ? (
            <>
              Software que respeta
              <br />
              a quien lo usa.
            </>
          ) : (
            <>
              Software that respects
              <br />
              the people who use it.
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-8 max-w-md text-center text-sm leading-relaxed text-white/50"
        >
          {lang === "es"
            ? "Cada linea, cada boton, cada carga. Diseñado para que el humano al otro lado no tenga que pensar en el codigo."
            : "Every line, every button, every load. Designed so the human on the other side never has to think about the code."}
        </motion.p>
      </LampContainer>
    </section>
  )
}
