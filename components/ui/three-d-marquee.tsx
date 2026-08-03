"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MarqueeItem {
  src: string
  onClick?: () => void
  alt?: string
}

interface ThreeDMarqueeProps {
  items: MarqueeItem[]
  className?: string
}

export function ThreeDMarquee({ items, className }: ThreeDMarqueeProps) {
  const chunkSize = Math.ceil(items.length / 4)
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize
    return items.slice(start, start + chunkSize)
  })

  return (
    <div
      className={cn(
        "mx-auto block h-[520px] overflow-hidden rounded-2xl sm:h-[600px]",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((item, imageIndex) => (
                  <div className="relative" key={imageIndex + item.src}>
                    <GridLineHorizontal className="-top-4" offset="20px" />
                    <motion.button
                      type="button"
                      onClick={item.onClick}
                      whileHover={{ y: -12, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      aria-label={item.alt || `Item ${imageIndex + 1}`}
                      className={cn(
                        "group relative block aspect-[970/700] w-[970px] max-w-[970px] overflow-hidden rounded-lg ring-1 ring-white/10",
                        item.onClick && "cursor-pointer",
                      )}
                    >
                      <img
                        src={item.src}
                        alt={item.alt || `Screenshot ${imageIndex + 1}`}
                        loading="lazy"
                        width={970}
                        height={700}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:brightness-110"
                      />
                      {item.onClick && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 flex items-end justify-start p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, transparent 70%)",
                          }}
                        >
                          <span className="font-mono text-xs uppercase tracking-[0.24em] text-white">
                            {item.alt} →
                          </span>
                        </span>
                      )}
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GridLineHorizontal({
  className,
  offset,
}: {
  className?: string
  offset?: string
}) {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  )
}

function GridLineVertical({
  className,
  offset,
}: {
  className?: string
  offset?: string
}) {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  )
}
