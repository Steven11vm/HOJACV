"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import ShutterText from "@/components/ui/shutter-text"
import { ShineBorder } from "@/components/ui/shine-border"
import { SignatureLogo } from "@/components/ui/signature-logo"
import formalImage from "@/imagenes/image.png"

interface IntroProps {
  lang: Lang
  isDark: boolean
  toggleTheme: () => void
  scrollToSection: (id: string) => void
}

/**
 * Intro rehecho al estilo portfolio-hero (menu / firma / toggle · nombre
 * gigante centrado con foto encima · tagline · scroll cue), pero con
 * ShutterText en vez de BlurText y sin el verde neon del template.
 * Reutiliza el estado de tema del page.tsx (toggleTheme) y navega a las
 * mismas secciones (scrollToSection) para no duplicar logica ni fuentes.
 */
export function Intro({ lang, isDark, toggleTheme, scrollToSection }: IntroProps) {
  const t = translations[lang]
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [isMenuOpen])

  const menuItems: { id: string; label: string }[] = [
    { id: "intro", label: lang === "es" ? "INICIO" : "HOME" },
    { id: "about", label: (t.nav.about || "").toUpperCase() },
    { id: "experience", label: (t.nav.experience || "").toUpperCase() },
    { id: "skills", label: (t.nav.skills || "").toUpperCase() },
    { id: "services", label: (t.nav.services || "").toUpperCase() },
    { id: "process", label: (t.nav.process || "").toUpperCase() },
    { id: "projects", label: (t.nav.projects || "").toUpperCase() },
    { id: "ai", label: "AI" },
    { id: "contact", label: (t.nav.contact || "").toUpperCase() },
  ]

  const handleMenuClick = (id: string) => {
    setIsMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <section
      id="intro"
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background"
    >
      {/* Header propio del Intro */}
      <header className="absolute inset-x-0 top-0 z-50 px-6 py-6 sm:px-10 lg:px-16">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Menu button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {isMenuOpen ? <X className="h-7 w-7" strokeWidth={1.5} /> : <Menu className="h-7 w-7" strokeWidth={1.5} />}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-[220px] border border-hairline bg-background p-2 shadow-2xl"
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMenuClick(item.id)}
                      className="block w-full px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Signature "S" — marca personal grande */}
          <SignatureLogo
            animated
            className="text-6xl leading-none sm:text-7xl md:text-8xl"
          />

          {/* Theme toggle sincronizado con page.tsx */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t.aria.lightMode : t.aria.darkMode}
            className="relative h-8 w-16 border border-hairline transition-colors"
          >
            <span
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 bg-foreground transition-transform duration-300"
              style={{ transform: `translate(${isDark ? "2.25rem" : "0.25rem"}, -50%)` }}
              aria-hidden
            />
          </button>
        </nav>
      </header>

      {/* Nombre gigante centrado + foto encima */}
      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-6 flex justify-center sm:mb-8"
          >
            <ShineBorder
              borderRadius={999}
              borderWidth={1}
              duration={5}
              color={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.15)"]}
              className="h-auto min-h-0 w-auto min-w-0 rounded-full border border-hairline bg-transparent p-0 px-4 py-1.5 text-foreground dark:bg-transparent"
            >
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-foreground"
                  aria-hidden
                />
                {lang === "es" ? "Disponible · Nuevos proyectos" : "Available · New projects"}
              </span>
            </ShineBorder>
          </motion.div>

          <ShutterText
            key={`first-${lang}`}
            text="STEVEN"
            trigger="auto"
            className="justify-center whitespace-nowrap text-[70px] leading-[0.78] tracking-tighter sm:text-[110px] md:text-[160px] lg:text-[200px]"
          />
          <div className="mt-1">
            <ShutterText
              key={`last-${lang}`}
              text="VILLAMIZAR"
              trigger="auto"
              className="justify-center whitespace-nowrap text-[42px] leading-[0.78] tracking-tighter sm:text-[68px] md:text-[100px] lg:text-[130px]"
            />
          </div>

          {/* Foto sobre el nombre */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }}
              className="pointer-events-auto h-[110px] w-[65px] cursor-pointer overflow-hidden rounded-full border border-foreground/10 shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-[152px] sm:w-[90px] md:h-[185px] md:w-[110px] lg:h-[218px] lg:w-[129px]"
            >
              <Image
                src={formalImage}
                alt="Steven Villamizar"
                width={130}
                height={220}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute inset-x-0 bottom-20 z-10 mx-auto max-w-2xl px-6 text-center text-[15px] text-muted-foreground transition-colors hover:text-foreground sm:bottom-24 sm:text-lg md:bottom-28 lg:bottom-32"
        style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}
      >
        {lang === "es"
          ? "Diseño experiencias humanas en código."
          : "Designing human experiences in code."}
      </motion.p>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={() => scrollToSection("hero")}
        aria-label={lang === "es" ? "Bajar" : "Scroll down"}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground md:bottom-10"
      >
        <ChevronDown className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
      </button>

      {/* Marcadores editoriales */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-0 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60 sm:px-10 lg:px-16">
        <span>Nº 01 · MMXXV</span>
        <span>MEDELLÍN · CO</span>
      </div>
    </section>
  )
}
