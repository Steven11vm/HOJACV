/**
 * PageLoader — server-safe loading state (sin "use client", sin framer-motion).
 *
 * Comparte lenguaje con SplashScreen: fondo bg-background, corner-accents
 * hairline, firma "S" en cursiva grande y metadata al pie. Animación puramente
 * CSS (definida en globals.css: `.dot-pulse` y `.hairline-sweep`) — no bloquea
 * el hilo principal y funciona antes de que hydrate el bundle de React.
 *
 * variant="full"    → pantalla completa (Suspense global, app/loading.tsx)
 * variant="compact" → sin corner accents, S más pequeña (dentro de contenedor)
 */
export function PageLoader({
  variant = "full",
  label,
}: {
  variant?: "full" | "compact"
  label?: string
}) {
  const isFull = variant === "full"
  const sizeCls = isFull
    ? "text-[min(50vw,40vh)] sm:text-[min(30vw,45vh)] md:text-[min(22vw,45vh)] lg:text-[min(18vw,45vh)]"
    : "text-[min(35vw,26vh)] sm:text-[min(18vw,26vh)] md:text-[min(12vw,26vh)]"

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`relative flex ${isFull ? "min-h-screen" : "min-h-[60vh]"} w-full items-center justify-center overflow-hidden bg-background text-foreground`}
    >
      {isFull && (
        <>
          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-hairline sm:left-10 sm:top-10 sm:h-14 sm:w-14" aria-hidden />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-hairline sm:right-10 sm:top-10 sm:h-14 sm:w-14" aria-hidden />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-hairline sm:bottom-10 sm:left-10 sm:h-14 sm:w-14" aria-hidden />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-hairline sm:bottom-10 sm:right-10 sm:h-14 sm:w-14" aria-hidden />

          <div className="pointer-events-none absolute inset-x-0 top-16 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 sm:top-20">
            <span>Nº 01</span>
            <span aria-hidden>·</span>
            <span>MMXXV</span>
          </div>
        </>
      )}

      {/* Firma S con fade in puro CSS */}
      <span
        className={`relative inline-block leading-[1.35] text-foreground animate-loader-fade ${sizeCls}`}
        style={{
          fontFamily:
            "'Brush Script MT','Lucida Handwriting','Snell Roundhand','Apple Chancery',cursive",
        }}
        aria-hidden
      >
        S
      </span>

      {/* Pie: label + dots pulsantes + progress hairline */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-4 sm:bottom-20">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>{label ?? (isFull ? "Steven Villamizar" : "Cargando")}</span>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/70 animate-loader-dot" style={{ animationDelay: "0ms" }} />
            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/70 animate-loader-dot" style={{ animationDelay: "150ms" }} />
            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/70 animate-loader-dot" style={{ animationDelay: "300ms" }} />
          </span>
        </div>

        {isFull && (
          <div className="relative h-px w-44 overflow-hidden bg-hairline sm:w-64">
            <span className="absolute inset-y-0 left-0 w-1/3 bg-foreground/70 animate-loader-bar" />
          </div>
        )}
      </div>

      <span className="sr-only">Cargando contenido…</span>
    </div>
  )
}
