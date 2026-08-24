"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Volume2, VolumeX } from "lucide-react"

interface VideoIntroProps {
  /** Ruta al mp4 dentro de /public. Debe empezar con "/". */
  src: string
  /** Poster opcional que se muestra antes de reproducir. */
  poster?: string
  /** Se dispara cuando termina, se hace skip, o el archivo no existe. */
  onDone?: () => void
  /**
   * "cover"   — el video llena toda la pantalla (16:9 landscape típico).
   * "contain" — el video se centra sin recortarse (para reels 9:16).
   * @default "cover"
   */
  fit?: "cover" | "contain"
}

/**
 * VideoIntro — sustituye al SplashScreen cuando hay un reel cinematográfico
 * para presentar la hoja de vida al abrir el sitio.
 *
 * Comportamiento:
 * - Ocupa la pantalla completa (z-index 200).
 * - Autoplay muted playsInline (política Chrome/iOS).
 * - Bloquea el scroll de la página mientras está visible.
 * - Botón "Skip" arriba a la derecha, tecla ESC o cualquier click para skip.
 * - Al terminar (onEnded) o al hacer skip → fade+scale out 0.7s.
 * - Si el archivo no carga (404 / codec) → onDone inmediato sin pantalla vacía.
 */
export function VideoIntro({ src, poster, onDone, fit = "cover" }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)
  // Empieza muted por política de autoplay del navegador. El usuario activa
  // el sonido con un gesto (click) que satisface la restricción del browser.
  const [muted, setMuted] = useState(true)

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      const v = videoRef.current
      if (v) {
        v.muted = next
        // Al desmutear, algunos navegadores pausan si el gesto no basto —
        // forzar play devuelve una Promise que ignoramos si es rejected.
        if (!next) v.play().catch(() => {})
      }
      return next
    })
  }, [])

  const finish = useCallback(() => {
    setVisible(false)
    // Dejar que corra la animación de exit antes de notificar al padre.
    window.setTimeout(() => onDone?.(), 700)
  }, [onDone])

  // Bloquea scroll del body mientras el video está a pantalla completa.
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  // Tecla ESC salta el video.
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [visible, finish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="video-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black"
        >
          {fit === "cover" ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay
              muted={muted}
              playsInline
              preload="auto"
              onCanPlay={() => setReady(true)}
              onEnded={finish}
              onError={finish}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            // Reel vertical (9:16): centrado con object-contain para que no
            // se recorte. El fondo negro del contenedor hace letterbox en
            // desktop (aire negro a los lados) y respeta el aspect ratio
            // real del video.
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay
                muted={muted}
                playsInline
                preload="auto"
                onCanPlay={() => setReady(true)}
                onEnded={finish}
                onError={finish}
                className="pointer-events-auto h-full max-h-[min(100vh,100dvh)] w-auto max-w-full object-contain"
                style={{ aspectRatio: "9 / 16" }}
              />
            </div>
          )}

          {/* Overlay clickeable — cualquier click sobre el video lo cierra.
              z-[5] queda debajo de los controles (z-10) para que Skip/Mute
              tengan prioridad de gesto. */}
          <button
            type="button"
            onClick={finish}
            aria-label="Saltar video"
            className="absolute inset-0 z-[5] cursor-pointer bg-transparent"
          />

          {/* Vignette + degradado inferior para legibilidad del skip */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />

          {/* Corner accents editoriales */}
          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-white/30 sm:left-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-white/30 sm:right-10 sm:top-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-white/30 sm:bottom-10 sm:left-10 sm:h-14 sm:w-14" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-white/30 sm:bottom-10 sm:right-10 sm:h-14 sm:w-14" />

          {/* Metadata top-left */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: ready ? 1 : 0, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="pointer-events-none absolute left-14 top-14 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/75 sm:left-20 sm:top-20"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            <span>Portfolio Reel · MMXXV</span>
          </motion.div>

          {/* Controles top-right: mute/unmute + skip. z-10 sobre el overlay
              clickeable para que los botones respondan a su click propio.
              Skip visible desde el frame 1 (no espera ready) para que el
              usuario pueda saltar en cualquier momento. */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="absolute right-14 top-14 z-10 flex items-center gap-2 sm:right-20 sm:top-20"
          >
            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-2 border border-white/30 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-black/60"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              aria-pressed={!muted}
            >
              {muted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Sonido</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>On</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={finish}
              className="flex items-center gap-2 border border-white/30 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-black/60"
              aria-label="Saltar video de intro"
            >
              <span>Skip</span>
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          </motion.div>

          {/* Byline pie + hint para cerrar. pointer-events-none para que el
              overlay clickeable siga recibiendo el gesto detrás. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/70 sm:bottom-20"
          >
            <div className="flex items-center gap-4">
              <span>Steven Villamizar</span>
              <span aria-hidden>·</span>
              <span>Full Stack &amp; AI</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] tracking-[0.32em] text-white/50">
              <span>Click en cualquier lado o</span>
              <span className="border border-white/40 px-2 py-0.5">ESC</span>
              <span>para saltar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
