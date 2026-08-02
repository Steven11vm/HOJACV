"use client"
import { cn } from "@/lib/utils"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * ShineBorder — borde animado. Un radial-gradient rota alrededor del
 * contenedor via background-position (keyframe `shine` en globals.css).
 *
 * Adaptado del template:
 * - Anadido `relative` al parent (el template asume before:absolute pero no
 *   ponia el context de posicion).
 * - `var(--…)` explicito en las arbitrary values (Tailwind 4 no expande el
 *   sugar `[background-image:--var]` como v3 lo hacia).
 * - Removido `before:bg-shine-size` (utility no definida en este proyecto).
 * - Defaults con color blanco monocromo; usar className para pill pequenos
 *   (override min-w/min-h/bg del contenedor externo).
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#ffffff",
  className,
  children,
}: ShineBorderProps) {
  const gradientColors = Array.isArray(color) ? color.join(",") : color

  return (
    <div
      style={{ "--border-radius": `${borderRadius}px` } as React.CSSProperties}
      className={cn(
        "relative min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white",
        className,
      )}
    >
      <div
        aria-hidden
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--duration": `${duration}s`,
            backgroundImage: `radial-gradient(transparent,transparent, ${gradientColors},transparent,transparent)`,
            backgroundSize: "300% 300%",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "var(--border-width)",
            willChange: "background-position",
          } as React.CSSProperties
        }
        className="pointer-events-none absolute inset-0 rounded-[--border-radius] motion-safe:animate-shine"
      />
      {children}
    </div>
  )
}
