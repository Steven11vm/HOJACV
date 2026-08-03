"use client"
import { useEffect, useMemo, useState } from "react"
import {
  Cloud,
  fetchSimpleIcons,
  type ICloud,
  renderSimpleIcon,
  type SimpleIcon,
} from "react-icon-cloud"

/**
 * IconCloud — 3D rotating cloud de logos (Simple Icons).
 *
 * Notas de la libreria:
 * - `fetchSimpleIcons` hace fetch a cdn.jsdelivr.net (SVGs) y a raw.github (hex).
 *   La CSP de este proyecto los permite explicitamente en connect-src.
 * - TagCanvas (motor interno) necesita ALTURA EXPLICITA en el contenedor,
 *   si no colapsa a 0px y no dibuja nada. Aqui envuelvo el <Cloud> en un div
 *   con min-h para reservar espacio.
 * - Lee el tema del DOM (no de next-themes) para no depender de un provider
 *   que no esta wired en este proyecto.
 */
export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      minHeight: 400,
      paddingTop: 20,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
}

function useDomTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  useEffect(() => {
    const check = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return theme
}

const renderIcon = (icon: SimpleIcon, theme: "light" | "dark") => {
  const bgHex = theme === "light" ? "#ffffff" : "#0a0a0a"
  const fallbackHex = theme === "light" ? "#111111" : "#f4f4f2"
  const minContrastRatio = theme === "dark" ? 2 : 1.2
  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: MouseEvent) => e.preventDefault(),
    },
  })
}

type Status = "loading" | "ready" | "error"

export function IconCloud({ iconSlugs }: { iconSlugs: string[] }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSimpleIcons>> | null>(null)
  const [status, setStatus] = useState<Status>("loading")
  const theme = useDomTheme()

  useEffect(() => {
    let cancelled = false
    setStatus("loading")
    fetchSimpleIcons({ slugs: iconSlugs })
      .then((d) => {
        if (cancelled) return
        setData(d)
        setStatus("ready")
      })
      .catch(() => {
        if (cancelled) return
        setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null
    return Object.values(data.simpleIcons).map((icon) => renderIcon(icon, theme))
  }, [data, theme])

  return (
    <div className="relative flex min-h-[400px] w-full items-center justify-center">
      {status !== "ready" && (
        <p className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {status === "loading" ? "cargando iconos…" : "no se pudo cargar la nube"}
        </p>
      )}
      {status === "ready" && renderedIcons && (
        // @ts-expect-error — Cloud from react-icon-cloud has loose typings
        <Cloud {...cloudProps}>
          <>{renderedIcons}</>
        </Cloud>
      )}
    </div>
  )
}
