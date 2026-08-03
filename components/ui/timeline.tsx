"use client"

import { useMotionValueEvent, useScroll, useTransform, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"

export interface TimelineEntry {
  title: string
  subtitle?: string
  content: React.ReactNode
}

interface TimelineProps {
  data: TimelineEntry[]
  className?: string
}

/**
 * Timeline vertical con:
 * - Titulo (periodo) sticky en la izquierda que sigue al scroll
 * - Linea vertical que se rellena progresivamente segun el scroll
 * - Nodo circular animado en cada hito, se activa cuando entra en viewport
 * - Estilo Muji: sin gradientes de color, solo foreground/muted
 */
export function Timeline({ data, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const measure = () => {
      if (ref.current) setHeight(ref.current.getBoundingClientRect().height)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ref.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  return (
    <div ref={containerRef} className={className}>
      <div ref={ref} className="relative mx-auto w-full max-w-5xl">
        {data.map((item, index) => (
          <TimelineRow
            key={index}
            item={item}
            index={index}
            scrollYProgress={scrollYProgress}
            total={data.length}
          />
        ))}

        {/* Linea de fondo */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-6 top-0 w-px overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,var(--hairline)_10%,var(--hairline)_90%,transparent_100%)] sm:left-8 md:left-10"
        >
          {/* Linea progresiva foreground */}
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-px rounded-full bg-gradient-to-t from-foreground via-foreground/60 to-transparent"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Cada fila con hover-lift, active-dot y aparicion escalonada.
 */
function TimelineRow({
  item,
  index,
  scrollYProgress,
  total,
}: {
  item: TimelineEntry
  index: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  total: number
}) {
  const [active, setActive] = useState(false)
  const rowStart = index / total
  const rowEnd = (index + 0.4) / total

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(v >= rowStart && v >= rowEnd * 0.4)
  })

  return (
    <div className="flex justify-start pt-12 md:gap-12 md:pt-28">
      {/* Titulo sticky con nodo */}
      <div className="sticky top-24 z-30 flex max-w-xs shrink-0 flex-col items-start self-start md:top-32 md:w-[240px] md:max-w-none">
        <div className="relative flex items-center">
          {/* Nodo circular */}
          <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background sm:left-5 md:left-7">
            <motion.div
              animate={{
                scale: active ? 1 : 0.75,
                backgroundColor: active ? "var(--foreground)" : "var(--muted)",
                borderColor: active ? "var(--foreground)" : "var(--hairline-strong)",
              }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-3 w-3 rounded-full border"
            />
          </div>

          {/* Periodo — solo desktop */}
          <div className="hidden md:block md:pl-24">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-4xl leading-none text-foreground xl:text-5xl">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {item.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido — con periodo inline en mobile */}
      <div className="relative w-full pl-20 pr-4 md:pl-4 md:pr-0">
        <div className="mb-6 md:hidden">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="font-display text-3xl leading-tight text-foreground">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {item.subtitle}
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {item.content}
        </motion.div>
      </div>
    </div>
  )
}
