"use client"
import { useEffect, useRef } from "react"

/**
 * HeroWave — canvas 2D noise-wave background.
 *
 * Adaptaciones sobre el template original:
 * - Paleta acotada a tonos MUY oscuros (near-black + acentos violeta/azul muy
 *   apagados). Nada de psicodelia — el fondo debe sentirse vivo, no gritar.
 * - Fixed a viewport, pointer-events-none, z-[-10] para vivir DEBAJO de todo.
 * - SCALE alto (3) para renderizar a 1/3 de resolucion y upscale sin smoothing:
 *   trama sutil tipo grano, y ~9x menos calculos por frame.
 * - Throttle a ~30 fps (delta minimo entre frames) para no comerse la CPU.
 * - Pausa cuando la pestana pierde foco (document.visibilityState).
 * - Respeta prefers-reduced-motion: dibuja un solo frame estatico y para.
 * - Solo montado en modo oscuro via hidden dark:block; en claro no corre.
 */
export function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const SCALE = 3
    let width = 0
    let height = 0
    let imageData: ImageData | null = null
    let data: Uint8ClampedArray | null = null

    const dpr = 1 // canvas 2D no gana calidad con DPR aqui, gastamos CPU al pedo

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      width = Math.max(1, Math.floor(canvas.width / SCALE))
      height = Math.max(1, Math.floor(canvas.height / SCALE))
      imageData = ctx.createImageData(width, height)
      data = imageData.data
      // Rellenar el alpha una vez — luego solo tocamos RGB.
      for (let i = 3; i < data.length; i += 4) data[i] = 255
    }
    resize()
    window.addEventListener("resize", resize)

    const startTime = Date.now()

    const SIN_TABLE = new Float32Array(1024)
    const COS_TABLE = new Float32Array(1024)
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2
      SIN_TABLE[i] = Math.sin(angle)
      COS_TABLE[i] = Math.cos(angle)
    }
    const TWO_PI = Math.PI * 2
    const fastSin = (x: number) => {
      const idx = Math.floor(((x % TWO_PI) / TWO_PI) * 1024) & 1023
      return SIN_TABLE[idx < 0 ? idx + 1024 : idx]
    }
    const fastCos = (x: number) => {
      const idx = Math.floor(((x % TWO_PI) / TWO_PI) * 1024) & 1023
      return COS_TABLE[idx < 0 ? idx + 1024 : idx]
    }

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

    const drawFrame = (time: number) => {
      if (!data || !imageData) return
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const u_x = (2 * x - width) / height
          const u_y = (2 * y - height) / height

          let a = 0
          let d = 0
          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * u_x)
            d += fastSin(i * u_y + a)
          }

          const wave = (fastSin(a) + fastCos(d)) * 0.5
          const intensity = 0.18 + 0.22 * wave
          const baseVal = 0.045 + 0.06 * fastCos(u_x + u_y + time * 0.3)
          const blueAccent = 0.09 * fastSin(a * 1.5 + time * 0.2)
          const violetAccent = 0.07 * fastCos(d * 2 + time * 0.1)

          const r = Math.max(0, Math.min(0.16, baseVal + violetAccent * 0.9)) * intensity
          const g = Math.max(0, Math.min(0.14, baseVal + blueAccent * 0.55)) * intensity
          const b = Math.max(0, Math.min(0.22, baseVal + blueAccent * 1.15 + violetAccent * 0.5)) * intensity

          const index = (y * width + x) * 4
          data[index] = r * 255
          data[index + 1] = g * 255
          data[index + 2] = b * 255
        }
      }
      ctx.putImageData(imageData, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height)
    }

    if (prefersReducedMotion) {
      drawFrame(0)
      return () => window.removeEventListener("resize", resize)
    }

    const FRAME_INTERVAL_MS = 1000 / 30
    let rafId = 0
    let lastFrameAt = 0
    let running = true

    const loop = (now: number) => {
      if (!running) return
      if (now - lastFrameAt >= FRAME_INTERVAL_MS) {
        lastFrameAt = now
        drawFrame((Date.now() - startTime) * 0.001)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!running) {
        running = true
        lastFrameAt = 0
        rafId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Vinieta suave para que los bordes fundan al negro y no llame la atencion */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0a0a0a_100%)]" />
    </div>
  )
}
