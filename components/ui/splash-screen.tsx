"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SCRIPT_FONT = "'Brush Script MT','Lucida Handwriting','Snell Roundhand','Apple Chancery',cursive"
const S_SIZE =
  "text-[min(70vw,55vh)] sm:text-[min(45vw,55vh)] md:text-[min(32vw,55vh)] lg:text-[min(26vw,55vh)]"
const S_LEADING = "leading-[1.35]"

const DURATION_MS = 1900

/**
 * SplashScreen — pagina de bienvenida al cargar/recargar la web.
 *
 * Marca personal: firma "S" (script) que se ensambla con un shutter de tres
 * slices horizontales sobre la letra principal (blur→0). Envuelto en un chrome
 * editorial (corner-accents, metadata top-left, byline pie) y con una barra
 * de progreso hairline abajo que anima 0→100% en `DURATION_MS`. Al terminar,
 * exit compuesto (opacity + scale + clip-path barrido) sobre el contenido real.
 */
export function SplashScreen({ onDone }: { onDone?: () => void } = {}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Bloquea el scroll mientras el splash esta arriba
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => setVisible(false), DURATION_MS)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = ""
      onDone?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          aria-hidden
        >
          {/* Corner accents */}
          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-hairline sm:left-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-hairline sm:right-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-hairline sm:bottom-10 sm:left-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-hairline sm:bottom-10 sm:right-10 sm:h-14 sm:w-14" />

          {/* Metadata top: Nº · MMXXV en el centro, LOCACIÓN a los lados en desktop */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="pointer-events-none absolute inset-x-0 top-14 flex items-center justify-between px-10 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 sm:top-20 sm:px-20"
          >
            <span className="hidden sm:inline">Medellín · CO</span>
            <span className="mx-auto sm:mx-0">Nº 01 · MMXXV</span>
            <span className="hidden sm:inline">Portfolio</span>
          </motion.div>

          {/* Firma "S" con shutter */}
          <div className={`relative inline-block overflow-hidden px-[0.15em] py-[0.12em] ${S_LEADING}`}>
            <motion.span
              initial={{ opacity: 0, filter: "blur(14px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
              className={`inline-block font-normal text-foreground ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT }}
            >
              S
            </motion.span>
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.05, ease: "easeInOut" }}
              className={`pointer-events-none absolute inset-0 inline-block font-normal text-muted-foreground ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT, clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
            >
              S
            </motion.span>
            <motion.span
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              className={`pointer-events-none absolute inset-0 inline-block font-normal text-foreground/70 ${S_LEADING} ${S_SIZE}`}
              style={{ fontFamily: SCRIPT_FONT, clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)" }}
            >
              S
            </motion.span>
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

          {/* Byline al pie */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.55 }}
            className="pointer-events-none absolute inset-x-0 bottom-20 flex flex-col items-center gap-5 sm:bottom-24"
          >
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span>Steven Villamizar</span>
              <span aria-hidden>·</span>
              <span>Full Stack &amp; AI</span>
            </div>

            {/* Barra de progreso: fill lineal de 0 a 100% durante DURATION_MS */}
            <div className="relative h-px w-40 overflow-hidden bg-hairline sm:w-56">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "left" }}
                className="absolute inset-y-0 left-0 w-full bg-foreground/80"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
