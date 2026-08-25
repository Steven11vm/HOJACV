"use client"
import { useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroWave } from "@/components/ui/dynamic-wave-canvas-background"
import { SplashScreen } from "@/components/ui/splash-screen"
import { VideoIntro } from "@/components/ui/video-intro"
import { QuoteFloatingButton } from "@/components/ui/quote-floating-button"
import { useAudience } from "@/lib/audience"

const CLIENT_VIDEO_SRC = "/videodesarrollos.mp4"
const CLIENT_VIDEO_SEEN_KEY = "cv_client_video_seen"

/**
 * Ruta del reel cinematográfico dentro de /public. Si el archivo existe
 * al arrancar la web, se reproduce como intro (reemplaza al SplashScreen).
 * Si no carga (404 / codec / usuario sin internet), el onError del <video>
 * dispara el fallback y el sitio se muestra normal — nunca queda encallado.
 *
 * Para desactivar la intro sin borrar el mp4: cambia esta constante a "".
 */
const INTRO_VIDEO_SRC = "/video.mp4"
/** Key + TTL para no repetir el intro-video más de una vez cada 28h por visitante. */
const INTRO_VIDEO_SEEN_KEY = "cv_intro_video_seen_at"
const INTRO_VIDEO_TTL_MS = 28 * 60 * 60 * 1000 // 28h

/** ¿Debe mostrarse el intro-video en este mount? Se lee UNA VEZ al arrancar. */
function shouldPlayIntroVideo(): boolean {
  if (typeof window === "undefined") return false
  if (!INTRO_VIDEO_SRC) return false
  try {
    const last = window.localStorage.getItem(INTRO_VIDEO_SEEN_KEY)
    if (!last) return true
    const t = parseInt(last, 10)
    if (!Number.isFinite(t)) return true
    return Date.now() - t > INTRO_VIDEO_TTL_MS
  } catch {
    return true
  }
}
import { AudienceProvider } from "@/lib/audience"
import { AudienceSelector } from "@/components/ui/audience-selector"
import { CurrencyProvider } from "@/lib/currency"

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
  // Intro cinematográfica:
  //   - Primera visita  → arranca en "video" y al terminar salta a "splash".
  //   - Visitas siguientes dentro de 28h → arranca directo en "splash" (el
  //     visitante ya lo vio; que no lo re-consuma).
  //
  // NOTA sobre SSR: el server no puede leer localStorage; siempre renderiza
  // "video" para pintar el mismo HTML que el cliente antes de hidratar. Un
  // useEffect corrige a "splash" inmediatamente si corresponde, evitando
  // que se descargue el mp4 de 41 MB si no se va a mostrar.
  const [introPhase, setIntroPhase] = useState<"video" | "splash">(
    INTRO_VIDEO_SRC ? "video" : "splash",
  )

  useEffect(() => {
    if (introPhase === "video" && !shouldPlayIntroVideo()) {
      setIntroPhase("splash")
    }
    // Solo al mount — no queremos re-evaluar cuando cambia otro estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Video promocional para clientes — se dispara la PRIMERA vez que el
  // visitor elige (o cambia) su perfil a "client".
  const [clientVideoOpen, setClientVideoOpen] = useState(false)

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
      <CurrencyProvider>
      <ClientVideoWatcher onFire={() => setClientVideoOpen(true)} />
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
        {showSplash && introPhase === "video" && INTRO_VIDEO_SRC && (
          <VideoIntro
            src={INTRO_VIDEO_SRC}
            onDone={() => {
              try { window.localStorage.setItem(INTRO_VIDEO_SEEN_KEY, String(Date.now())) } catch { /* silent */ }
              setIntroPhase("splash")
            }}
          />
        )}
        {showSplash && introPhase === "splash" && <SplashScreen />}
        {clientVideoOpen && (
          <VideoIntro
            src={CLIENT_VIDEO_SRC}
            fit="contain"
            onDone={() => {
              setClientVideoOpen(false)
              try { localStorage.setItem(CLIENT_VIDEO_SEEN_KEY, "1") } catch { /* silent */ }
            }}
          />
        )}
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
        <QuoteFloatingButton />
      </div>
      </CurrencyProvider>
    </AudienceProvider>
  )
}

/**
 * ClientVideoWatcher — observa el audience dentro del AudienceProvider y
 * dispara `onFire` la primera vez que el visitor elige (o cambia a) "client".
 * Se persiste en localStorage para no repetirlo en visitas siguientes.
 * Sin JSX propio; solo lógica.
 */
function ClientVideoWatcher({ onFire }: { onFire: () => void }) {
  const { audience, ready } = useAudience()

  useEffect(() => {
    if (!ready) return
    if (audience !== "client") return
    try {
      if (localStorage.getItem(CLIENT_VIDEO_SEEN_KEY) === "1") return
    } catch { /* silent */ }
    // Delay corto para que se cierre suave el AudienceSelector antes de aparecer.
    const t = window.setTimeout(() => onFire(), 350)
    return () => window.clearTimeout(t)
  }, [audience, ready, onFire])

  return null
}
