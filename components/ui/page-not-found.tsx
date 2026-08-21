"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function NotFoundPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-x-hidden bg-black">
      <MessageDisplay />
      <CharactersAnimation />
      <CircleAnimation />
    </div>
  )
}

function MessageDisplay() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute z-[100] flex h-[90%] w-[90%] flex-col items-center justify-center">
      <div
        className={`flex flex-col items-center transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="m-[1%] text-[35px] font-semibold text-black">Page Not Found</div>
        <div className="m-[1%] text-[80px] font-bold leading-none text-black">404</div>
        <div className="m-[1%] w-1/2 min-w-[40%] text-center text-[15px] text-black">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </div>
        <div className="mt-8 flex gap-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-auto items-center gap-2 border-2 border-black px-6 py-2 text-base font-medium text-black transition-all duration-300 ease-in-out hover:scale-105 hover:bg-black hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Go Back
          </button>
          <Link
            href="/"
            className="flex h-auto items-center gap-2 bg-black px-6 py-2 text-base font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

type StickFigure = {
  top?: string
  bottom?: string
  src: string
  transform?: string
  speedX: number
  speedRotation?: number
}

function CharactersAnimation() {
  const charactersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = charactersRef.current
    if (!container) return

    const stickFigures: StickFigure[] = [
      {
        top: "0%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        transform: "rotateZ(-90deg)",
        speedX: 1500,
      },
      {
        top: "10%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick1.svg",
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: "20%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick2.svg",
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: "25%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: "35%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: "5%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick3.svg",
        speedX: 0,
      },
    ]

    container.innerHTML = ""

    stickFigures.forEach((figure, index) => {
      const stick = document.createElement("img")
      stick.classList.add("characters")
      stick.style.position = "absolute"
      stick.style.width = "18%"
      stick.style.height = "18%"
      if (figure.top) stick.style.top = figure.top
      if (figure.bottom) stick.style.bottom = figure.bottom
      stick.src = figure.src
      if (figure.transform) stick.style.transform = figure.transform
      container.appendChild(stick)

      if (index === 5) return

      stick.animate([{ left: "100%" }, { left: "-20%" }], {
        duration: figure.speedX,
        easing: "linear",
        fill: "forwards",
      })

      if (index === 0) return
      if (figure.speedRotation) {
        stick.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }],
          { duration: figure.speedRotation, iterations: Infinity, easing: "linear" },
        )
      }
    })

    return () => {
      container.innerHTML = ""
    }
  }, [])

  return <div ref={charactersRef} className="absolute h-[95%] w-[99%]" />
}

interface Circulo {
  x: number
  y: number
  size: number
}

function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestIdRef = useRef<number | undefined>(undefined)
  const timerRef = useRef(0)
  const circulosRef = useRef<Circulo[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const initArr = () => {
      circulosRef.current = []
      for (let index = 0; index < 300; index++) {
        const randomX =
          Math.floor(Math.random() * (canvas.width * 3 - (canvas.width * 1.2) + 1)) +
          canvas.width * 1.2
        const randomY =
          Math.floor(Math.random() * (canvas.height - (canvas.height * -0.2 + 1))) +
          canvas.height * -0.2
        const size = canvas.width / 1000
        circulosRef.current.push({ x: randomX, y: randomY, size })
      }
    }

    const draw = () => {
      const context = canvas.getContext("2d")
      if (!context) return

      timerRef.current++
      context.setTransform(1, 0, 0, 1, 0, 0)

      const distanceX = canvas.width / 80
      const growthRate = canvas.width / 1000

      context.fillStyle = "white"
      context.clearRect(0, 0, canvas.width, canvas.height)

      circulosRef.current.forEach((circulo) => {
        context.beginPath()
        if (timerRef.current < 65) {
          circulo.x = circulo.x - distanceX
          circulo.size = circulo.size + growthRate
        }
        if (timerRef.current > 65 && timerRef.current < 500) {
          circulo.x = circulo.x - distanceX * 0.02
          circulo.size = circulo.size + growthRate * 0.2
        }
        context.arc(circulo.x, circulo.y, circulo.size, 0, 360)
        context.fill()
      })

      if (timerRef.current > 500) {
        if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current)
        return
      }
      requestIdRef.current = requestAnimationFrame(draw)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    timerRef.current = 0
    initArr()
    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      timerRef.current = 0
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current)
      const context = canvas.getContext("2d")
      if (context) context.reset()
      initArr()
      draw()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
