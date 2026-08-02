"use client"
import { AnimatePresence, motion, useInView } from "framer-motion"
import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

interface ShutterTextProps extends HTMLAttributes<HTMLDivElement> {
  text?: string
  trigger?: "auto" | "scroll" | "click" | "hover"
}

/**
 * Muji-adapted ShutterText.
 * Efecto shutter con tres slice-layers desplazandose por clip-path.
 * Reemplazo los acentos indigo/emerald del template original por tokens del
 * tema (foreground y muted-foreground) para respetar la paleta monocroma.
 */
export default function ShutterText({
  text = "STEVEN",
  trigger = "auto",
  className = "",
  ...props
}: ShutterTextProps) {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(
    trigger === "auto" || trigger === "click" || trigger === "hover",
  )
  const [animating, setAnimating] = useState(trigger === "auto")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })
  const characters = text.split("")

  useEffect(() => {
    if (trigger === "scroll" && isInView) {
      setActive(true)
      setAnimating(true)
      setCount((c) => c + 1)
    }
    if (trigger === "scroll" && !isInView) {
      setActive(false)
      setAnimating(false)
    }
  }, [trigger, isInView])

  useEffect(() => {
    if (trigger === "auto") {
      setActive(true)
      setAnimating(true)
      setCount((c) => c + 1)
    }
  }, [trigger])

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      setAnimating(true)
      setCount((c) => c + 1)
    }
  }, [trigger])

  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setAnimating(true)
      setCount((c) => c + 1)
    }
  }, [trigger])

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") setAnimating(false)
  }, [trigger])

  // touch `active` so the linter/reader knows it drives interaction potential
  const interactive = active

  return (
    <div
      ref={ref}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-wrap items-center justify-center ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {animating ? (
          <motion.span key={count} className="flex flex-wrap items-center justify-center">
            {characters.map((char, i) => (
              <span key={i} className="relative inline-block overflow-hidden px-[0.1vw]">
                {/* Main character */}
                <motion.span
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                  className="inline-block font-black leading-none tracking-tighter text-foreground"
                >
                  {char === " " ? " " : char}
                </motion.span>

                {/* Top slice */}
                <motion.span
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none text-muted-foreground"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                >
                  {char}
                </motion.span>

                {/* Middle slice */}
                <motion.span
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: "-100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: i * 0.04 + 0.1, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none text-foreground/80"
                  style={{ clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)" }}
                >
                  {char}
                </motion.span>

                {/* Bottom slice */}
                <motion.span
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: i * 0.04 + 0.2, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-black leading-none text-muted-foreground"
                  style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)" }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </motion.span>
        ) : (
          <span className="flex flex-wrap items-center justify-center">
            {characters.map((char, i) => (
              <span key={i} className="relative inline-block overflow-hidden px-[0.1vw]">
                <span className="inline-block font-black leading-none tracking-tighter text-foreground">
                  {char === " " ? " " : char}
                </span>
              </span>
            ))}
          </span>
        )}
      </AnimatePresence>
    </div>
  )
}
