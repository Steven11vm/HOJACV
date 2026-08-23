"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { SalesFunnel } from "@/components/sections/SalesFunnel"
import { SignatureLogo } from "@/components/ui/signature-logo"
import { CurrencyProvider } from "@/lib/currency"
import { CurrencySelector } from "@/components/ui/currency-selector"

/**
 * /arrancar — página en foco total para el funnel de ventas.
 *
 * Sin splash, sin video de intro, sin FloatingChat, sin secciones del sitio.
 * Solo un chrome mínimo (link volver + firma S + toggle idioma) y el
 * SalesFunnel centrado. Compartible por WhatsApp/email/LinkedIn.
 */
export default function ArrancarPage() {
  const [lang, setLang] = useState<Lang>("es")

  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang | null) ?? null
    if (saved === "en" || saved === "es") setLang(saved)
  }, [])

  const toggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es"
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* silent */
    }
  }

  return (
    <CurrencyProvider>
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* En /arrancar el selector aparece rápido — no hay splash ni audience selector previo */}
      <CurrencySelector lang={lang} delay={600} />
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
