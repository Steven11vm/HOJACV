"use client"
import React, { useRef } from "react"
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion"

/**
 * Muji-adapted scroll container.
 * - No gray Mac frame, no chrome shadow, no thick radius.
 * - Hairline border + theme background so it disappears into the page.
 * - Same scroll-driven perspective tilt + scale + header lift.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const scaleDims = () => (isMobile ? [0.88, 0.98] : [1.02, 1])

  const rotate = useTransform(scrollYProgress, [0, 1], [16, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDims())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <div
      ref={containerRef}
      className="relative flex h-[42rem] items-center justify-center md:h-[54rem]"
    >
      <div
        className="relative w-full py-10 md:py-16"
        style={{ perspective: "1200px" }}
      >
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>
  children: React.ReactNode
}) {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-3xl text-center">
      {children}
    </motion.div>
  )
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: React.ReactNode
}) {
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className="relative mx-auto mt-10 h-[24rem] w-full max-w-5xl border border-foreground bg-background p-1.5 md:mt-14 md:h-[36rem] md:p-2"
    >
      <div className="relative h-full w-full overflow-hidden border border-hairline bg-background">
        {children}
      </div>
    </motion.div>
  )
}
