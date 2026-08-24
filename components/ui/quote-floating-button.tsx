"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

/**
 * Botón flotante persistente que lleva a /arrancar (funnel de ventas).
 * Se oculta en las rutas donde ya no aporta:
 *   - /arrancar  → ya estás en el funnel.
 *   - /estudio*  → panel privado, no debe verse.
 */
export function QuoteFloatingButton() {
  const pathname = usePathname()
  const hidden =
    pathname === "/arrancar" ||
    pathname === "/estudio" ||
    pathname.startsWith("/estudio/")

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="quote-fab"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 3.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 sm:bottom-10 sm:right-10"
        >
          <Link
            href="/arrancar"
            aria-label="Cotizar tu proyecto"
            className="group relative flex items-center gap-2 overflow-hidden border border-foreground bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 sm:gap-3 sm:px-6 sm:py-3.5"
          >
            {/* Pulse ring editorial detrás del botón — llama sin molestar */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 border border-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ animation: "quote-fab-pulse 2.4s ease-out infinite" }}
            />
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Cotizar</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <style jsx global>{`
            @keyframes quote-fab-pulse {
              0%   { transform: scale(1);    opacity: 0.7; }
              70%  { transform: scale(1.35); opacity: 0;   }
              100% { transform: scale(1.35); opacity: 0;   }
            }
            @media (prefers-reduced-motion: reduce) {
              @keyframes quote-fab-pulse {
                0%, 100% { transform: scale(1); opacity: 0; }
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
