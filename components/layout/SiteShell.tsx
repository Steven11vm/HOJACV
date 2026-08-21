"use client"
import { useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroWave } from "@/components/ui/dynamic-wave-canvas-background"
import { SplashScreen } from "@/components/ui/splash-screen"
import { AudienceProvider } from "@/lib/audience"
import { AudienceSelector } from "@/components/ui/audience-selector"

interface SiteShellProps {
  children: (ctx: { lang: Lang; openChat: () => void }) => ReactNode
  /**
   * Callback opcional para el observer de scroll — usado por la home para
   * resaltar la sección activa en el navbar. En rutas de una-sola-página
   * (p. ej. /proyectos) no hace falta y se puede omitir.
   */
  observeSectionIds?: string[]
  showSplash?: boolean
}

/**
 * Chrome reutilizable de todas las rutas del sitio: providers, background,
 * navbar (con navegación híbrida: scroll interno en `/`, router.push en el
 * resto), floating chat, footer y splash. Cada página pasa sus secciones
 * como `children({ lang, openChat })` y ya.
 */
export function SiteShell({ children, observeSectionIds, showSplash = true }: SiteShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === "/"

  const [activeSection, setActiveSection] = useState("intro")
  const [isDark, setIsDark] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [lang, setLang] = useState<Lang>("es")

  useEffect(() => {
    setIsVisible(true)
    setIsDark(document.documentElement.classList.contains("dark"))
    const saved = (localStorage.getItem(LANG_KEY) as Lang | null) ?? null
    if (saved === "en" || saved === "es") setLang(saved)
  }, [])

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark")
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    setIsDark(next)
  }

  const scrollToSection = (sectionId: string) => {
    // Ruta dedicada del carousel de proyectos.
    if (sectionId === "projects" && !isHome) {
      router.push("/proyectos")
      return
    }
    if (sectionId === "projects" && isHome && !document.getElementById("projects")) {
      router.push("/proyectos")
      return
    }

    // Fuera del home: volver a home con hash para que Next haga scroll.
    if (!isHome && sectionId !== "projects") {
      router.push(`/#${sectionId}`)
      return
    }

    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (!element) return
    const yOffset = -72
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset
    window.scrollTo({ top: y, behavior: "smooth" })
  }

  useEffect(() => {
    if (!observeSectionIds?.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-30% 0px -65% 0px" },
    )
    observeSectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [observeSectionIds])

  return (
    <AudienceProvider>
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
        {showSplash && <SplashScreen />}
        <AudienceSelector lang={lang} />
        <HeroWave />

        <Navbar
          lang={lang}
          setLang={setLang}
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          isVisible={isVisible}
        />

        <main className="relative z-10">
          {children({ lang, openChat: () => {} })}
        </main>

        <Footer />
      </div>
    </AudienceProvider>
  )
}
