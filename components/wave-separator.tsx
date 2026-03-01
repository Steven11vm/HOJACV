"use client"

/**
 * Separadores tipo gota/onda entre secciones — elegantes y profesionales
 * Variantes: down (ola que baja), up (ola que sube), small (sutil)
 */
export function WaveSeparator({
  variant = "down",
  isDark,
  className = "",
}: {
  variant?: "down" | "up" | "small"
  isDark: boolean
  className?: string
}) {
  const height = variant === "small" ? "h-10 sm:h-14 md:h-16" : "h-14 sm:h-20 md:h-24 lg:h-28"
  const flip = variant === "up" ? "scale-y-[-1]" : ""

  const fillPrimary = isDark ? "fill-card/80" : "fill-primary/[0.06]"
  const fillSecondary = isDark ? "fill-muted/25" : "fill-primary/[0.10]"

  return (
    <div
      className={`relative w-full overflow-hidden ${height} ${className}`}
      aria-hidden
    >
      <svg
        className={`w-full h-full pointer-events-none transition-colors duration-300 ${flip}`}
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L0,45 C320,95 520,15 720,50 C920,85 1120,20 1440,50 L1440,100 L0,100 Z"
          className={fillPrimary}
        />
        <path
          d="M0,55 C260,98 460,25 680,58 C920,95 1180,38 1440,60 L1440,100 L0,100 Z"
          className={fillSecondary}
        />
      </svg>
    </div>
  )
}
