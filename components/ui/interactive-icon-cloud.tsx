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
 * Adaptaciones sobre el template original:
 * - No usa `useTheme` de next-themes (mi tema global se maneja via classList
 *   en <html>). En su lugar leo el modo directamente del DOM y escucho
 *   cambios con MutationObserver.
 * - Colores del icono empatan con los tokens Muji: fondo #ffffff/#0a0a0a
 *   y fallback #111111/#f4f4f2. minContrastRatio mas alto en dark para que
 *   los logos oscuros (java, unity) no se pierdan.
 * - Estados: si el fetch falla o no hay data, el componente no renderiza
 *   (evita crash en TagCanvas si children esta vacio).
 */
export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
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

export function IconCloud({ iconSlugs }: { iconSlugs: string[] }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSimpleIcons>> | null>(null)
  const theme = useDomTheme()

  useEffect(() => {
    let cancelled = false
    fetchSimpleIcons({ slugs: iconSlugs })
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
    return () => {
      cancelled = true
    }
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null
    return Object.values(data.simpleIcons).map((icon) => renderIcon(icon, theme))
  }, [data, theme])

  if (!renderedIcons) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        cargando iconos…
      </div>
    )
  }

  return (
    // @ts-expect-error — Cloud from react-icon-cloud has loose typings
    <Cloud {...cloudProps}>
      <>{renderedIcons}</>
    </Cloud>
  )
}
