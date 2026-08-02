"use client"
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Muji-adapted LampContainer del template Aceternity.
 * - Los conic-gradients cyan del original van a blanco puro, asi el "haz"
 *   queda como spotlight de luz blanca, no como neon.
 * - Los blockers/masks pasan a #050505 (near-black fijo) porque esta seccion
 *   es intencionalmente oscura sin importar el tema global — funciona como
 *   "quote card" atmosferica sobre la que respira el sitio.
 * - Uso inline conic-gradient en style (no depende de utilidades Tailwind
 *   no-standard como bg-gradient-conic).
 */
export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const NEAR_BLACK = "#050505"
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden",
        className,
      )}
      style={{ backgroundColor: NEAR_BLACK }}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        {/* Left cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: "conic-gradient(from 70deg at center top, #ffffff, transparent 25%, transparent)",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible text-white"
        >
          <div
            className="absolute bottom-0 left-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ backgroundColor: NEAR_BLACK }}
          />
          <div
            className="absolute bottom-0 left-0 z-20 h-full w-40 [mask-image:linear-gradient(to_right,white,transparent)]"
            style={{ backgroundColor: NEAR_BLACK }}
          />
        </motion.div>

        {/* Right cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: "conic-gradient(from 290deg at center top, transparent, transparent 75%, #ffffff)",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
        >
          <div
            className="absolute bottom-0 right-0 z-20 h-full w-40 [mask-image:linear-gradient(to_left,white,transparent)]"
            style={{ backgroundColor: NEAR_BLACK }}
          />
          <div
            className="absolute bottom-0 right-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ backgroundColor: NEAR_BLACK }}
          />
        </motion.div>

        <div
          className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl"
          style={{ backgroundColor: NEAR_BLACK }}
        />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-white/70 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-white"
        />
        <div
          className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]"
          style={{ backgroundColor: NEAR_BLACK }}
        />
      </div>

      <div className="relative z-50 flex -translate-y-64 flex-col items-center px-5 md:-translate-y-80">
        {children}
      </div>
    </div>
  )
}
