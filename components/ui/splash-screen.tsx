"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SCRIPT_FONT = "'Brush Script MT','Lucida Handwriting','Snell Roundhand','Apple Chancery',cursive"
// Tamaño con piso robusto en movil: usa el mayor lado (vmax) para no encogerse
// en pantallas estrechas, y limita en desktop.
const S_SIZE =
  "text-[min(70vw,55vh)] sm:text-[min(45vw,55vh)] md:text-[min(32vw,55vh)] lg:text-[min(26vw,55vh)]"
const S_LEADING = "leading-[1.35]"

/**
 * SplashScreen — pagina de bienvenida al cargar/recargar la web.
 * La firma "S" (marca personal) aparece con el mismo efecto shutter que uso
 * en el Intro para "STEVEN/VILLAMIZAR": una capa principal con blur→0 y
 * tres slice-layers que atraviesan por clip-path.
 * Se auto-descarta a los ~2s y hace fade+scale-out sobre el contenido real.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Bloquea el scroll mientras el splash esta arriba
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => setVisible(false), 2000)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      // Restaurar scroll cuando desaparece
      document.body.style.overflow = ""
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          aria-hidden
        >
          {/* Corner accents */}
          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-hairline sm:left-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-hairline sm:right-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-hairline sm:bottom-10 sm:left-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-hairline sm:bottom-10 sm:right-10 sm:h-14 sm:w-14" />

          {/* Firma "S" con shutter */}
          <div className={`relative inline-block overflow-hidden px-[0.15em] py-[0.12em] ${S_LEADING}`}>
            {/* Capa principal */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(14px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
              className={`inline-block font-normal text-foreground ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT }}
            >
              S
            </motion.span>
            {/* Top slice */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.05, ease: "easeInOut" }}
              className={`pointer-events-none absolute inset-0 inline-block font-normal text-muted-foreground ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT, clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
            >
              S
            </motion.span>
            {/* Middle slice */}
            <motion.span
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              className={`pointer-events-none absolute inset-0 inline-block font-normal text-foreground/70 ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT, clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)" }}
            >
              S
            </motion.span>
            {/* Bottom slice */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeInOut" }}
              className={`pointer-events-none absolute inset-0 inline-block font-normal text-muted-foreground ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT, clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)" }}
            >
              S
            </motion.span>
          </div>

          {/* Metadatos al pie */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="pointer-events-none absolute inset-x-0 bottom-16 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground sm:bottom-20"
          >
            <span>Steven Villamizar</span>
            <span aria-hidden>·</span>
            <span>MMXXV</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
