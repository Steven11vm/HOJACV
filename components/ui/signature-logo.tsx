"use client"
import { motion } from "framer-motion"

/**
 * SignatureLogo — la "S" script que hace de marca personal.
 * Misma pieza en el Intro (grande, con reveal) y en el Navbar (pequena,
 * fija). Fuente de sistema, sin dependencia externa, sin CSP hit.
 */
export function SignatureLogo({
  className = "",
  animated = false,
  ariaLabel = "Steven Villamizar",
}: {
  className?: string
  animated?: boolean
  ariaLabel?: string
}) {
  const style = {
    fontFamily: "'Brush Script MT','Lucida Handwriting','Snell Roundhand','Apple Chancery',cursive",
    lineHeight: 1,
  } as React.CSSProperties

  if (!animated) {
    return (
      <span
        aria-label={ariaLabel}
        role="img"
        className={`select-none text-foreground ${className}`}
        style={style}
      >
        S
      </span>
    )
  }

  return (
    <motion.span
      aria-label={ariaLabel}
      role="img"
      initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className={`select-none text-foreground ${className}`}
      style={style}
    >
      S
    </motion.span>
  )
}
