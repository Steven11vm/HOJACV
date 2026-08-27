"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { SalesFunnel } from "@/components/sections/SalesFunnel"
import { SignatureLogo } from "@/components/ui/signature-logo"
import { CurrencyProvider } from "@/lib/currency"
import { CurrencySelector } from "@/components/ui/currency-selector"
import { VideoIntro } from "@/components/ui/video-intro"

const CLIENT_VIDEO_SRC = "/videodesarrollos.mp4"
const CLIENT_VIDEO_SEEN_KEY = "cv_client_video_seen"

/**
 * /arrancar — página en foco total para el funnel de ventas.
 *
 * Al abrir:
 *   1. Si el visitor no ha visto el video promo aún (localStorage flag),
 *      arranca el video reel vertical (fit="contain"). Al terminar,
 *      persiste el flag para no repetirse.
 *   2. Cuando el video termina (o si ya lo había visto), aparece el
 *      CurrencySelector con delay corto para elegir COP/USD.
 *   3. Debajo, chrome mínimo (link volver + firma S + toggle idioma)
 *      y el SalesFunnel centrado. Compartible por WhatsApp/email/LinkedIn.
 */
export default function ArrancarPage() {
  const [lang, setLang] = useState<Lang>("es")
  const [showVideo, setShowVideo] = useState(false)
  const [videoDone, setVideoDone] = useState(false)

  // Init: leer idioma. En /arrancar SIEMPRE se dispara el video promo,
  // sin chequear flag — el visitor llegó explícitamente a cotizar y la
  // promo forma parte del pitch. Si ya lo vio en otro contexto, puede
  // skipear con un click; es mejor UX que esconderlo silenciosamente.
  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang | null) ?? null
    if (saved === "en" || saved === "es") setLang(saved)
    setShowVideo(true)
  }, [])

  const finishVideo = () => {
    try { localStorage.setItem(CLIENT_VIDEO_SEEN_KEY, "1") } catch { /* silent */ }
    setShowVideo(false)
    setVideoDone(true)
  }

  const toggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es"
    setLang(next)
    try { localStorage.setItem(LANG_KEY, next) } catch { /* silent */ }
  }

  return (
    <CurrencyProvider>
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
        {/* Video promocional al abrir (una sola vez por visitante) */}
        {showVideo && (
          <VideoIntro
            src={CLIENT_VIDEO_SRC}
            fit="contain"
            onDone={finishVideo}
          />
        )}

        {/* CurrencySelector solo cuando el video ya terminó (o nunca hubo). */}
        {videoDone && <CurrencySelector lang={lang} delay={400} />}

        <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/75 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" strokeWidth={2} />
              <span>{lang === "es" ? "Volver al portafolio" : "Back to portfolio"}</span>
            </Link>

            <Link href="/" aria-label="Steven Villamizar" className="transition-opacity hover:opacity-70">
              <SignatureLogo className="text-3xl leading-none sm:text-4xl" />
            </Link>

            <button
              type="button"
              onClick={toggleLang}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
              aria-label={lang === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
            >
              {lang.toUpperCase()} → {lang === "es" ? "EN" : "ES"}
            </button>
          </nav>
        </header>

        <main className="pt-20">
          <SalesFunnel lang={lang} />
        </main>

        <footer className="border-t border-hairline px-6 py-8 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>Steven Villamizar · Medellín · MMXXV</span>
            <Link href="/" className="link-r text-foreground">
              {lang === "es" ? "Ver el portafolio completo →" : "See full portfolio →"}
            </Link>
          </div>
        </footer>
      </div>
    </CurrencyProvider>
  )
}
