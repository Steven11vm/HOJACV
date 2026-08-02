"use client"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { translations, type Lang, LANG_KEY } from "@/lib/translations"
import { SignatureLogo } from "@/components/ui/signature-logo"

interface NavbarProps {
  lang: Lang
  setLang: (lang: Lang) => void
  isDark: boolean
  toggleTheme: () => void
  activeSection: string
  scrollToSection: (id: string) => void
  isVisible: boolean
}

/**
 * Navbar unificado — mismo layout siempre, tanto al cargar como al scrollear:
 * hamburguesa (con dropdown de secciones + toggle idioma) a la izquierda,
 * firma "S" al centro, theme toggle a la derecha. Sin cambio de estilo por
 * scroll — es la marca personal persistente.
 */
export function Navbar({
  lang,
  setLang,
  isDark,
  toggleTheme,
  activeSection,
  scrollToSection,
  isVisible,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const t = translations[lang]

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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

  if (!mounted) return null

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

  const toggleLanguage = () => {
    const next: Lang = lang === "es" ? "en" : "es"
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* silent */
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        {/* Menu button */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? t.aria.closeMenu : t.aria.openMenu}
            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isMenuOpen ? (
              <X className="h-7 w-7" strokeWidth={1.5} />
            ) : (
              <Menu className="h-7 w-7" strokeWidth={1.5} />
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 top-full mt-2 w-[240px] border border-hairline bg-background p-2 shadow-2xl"
              >
                {menuItems.map((item) => {
                  const active = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMenuClick(item.id)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:bg-foreground hover:text-background ${
                        active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full bg-foreground"
                          aria-hidden
                        />
                      )}
                    </button>
                  )
                })}
                <div className="my-1 border-t border-hairline" />
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  <span>{lang === "es" ? "Idioma" : "Language"}</span>
                  <span>
                    {lang.toUpperCase()} → {lang === "es" ? "EN" : "ES"}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Signature logo (center) */}
        <button
          type="button"
          onClick={() => scrollToSection("intro")}
          aria-label="Steven Villamizar — Inicio"
          className="transition-opacity hover:opacity-70"
        >
          <SignatureLogo className="text-4xl leading-none sm:text-5xl" />
        </button>

        {/* Theme toggle (right) */}
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
    </motion.header>
  )
}
