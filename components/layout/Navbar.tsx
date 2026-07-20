"use client"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { translations, type Lang, LANG_KEY } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"

interface NavbarProps {
  lang: Lang
  setLang: (lang: Lang) => void
  isDark: boolean
  toggleTheme: () => void
  activeSection: string
  scrollToSection: (id: string) => void
  isVisible: boolean
}

export function Navbar({
  lang,
  setLang,
  isDark,
  toggleTheme,
  activeSection,
  scrollToSection,
  isVisible,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(LANG_KEY) as Lang | null
    if (!saved) setShowLangModal(true)

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const selectLanguage = (l: Lang) => {
    setLang(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {}
    setShowLangModal(false)
  }

  const quickToggleLanguage = () => selectLanguage(lang === "es" ? "en" : "es")

  const handleScroll = (id: string) => {
    scrollToSection(id)
    setMobileMenuOpen(false)
  }

  if (!mounted) return null

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "experience", label: t.nav.experience },
    { id: "skills", label: t.nav.skills },
    { id: "services", label: t.nav.services },
    { id: "process", label: t.nav.process },
    { id: "projects", label: t.nav.projects },
    { id: "ai", label: "AI" },
    { id: "contact", label: t.nav.contact },
  ]

  return (
    <>
      <Dialog open={showLangModal} onOpenChange={(open) => !open && setShowLangModal(false)}>
        <DialogContent className="max-w-md gap-6 border border-foreground bg-background sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-normal text-foreground sm:text-2xl">
              {translations.es.langModal.title}
              <br />
              <span className="text-muted-foreground">{translations.en.langModal.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="btn-plain justify-center"
              onClick={() => selectLanguage("es")}
            >
              {t.langModal.spanish}
            </button>
            <button
              className="btn-plain justify-center"
              onClick={() => selectLanguage("en")}
            >
              {t.langModal.english}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-hairline bg-background/90 backdrop-blur"
            : "border-b border-transparent bg-background/60 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
          <button
            onClick={() => handleScroll("hero")}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-foreground"
          >
            Steven Villamizar
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleScroll(id)}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  activeSection === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={quickToggleLanguage}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.aria.lightMode : t.aria.darkMode}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {isDark ? "Light" : "Dark"}
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="h-9 w-9 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label={mobileMenuOpen ? t.aria.closeMenu : t.aria.openMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-b border-hairline bg-background lg:hidden"
            >
              <nav className="mx-auto flex max-w-6xl flex-col px-6 py-6 sm:px-10">
                {navItems.map(({ id, label }, idx) => (
                  <motion.button
                    key={id}
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => handleScroll(id)}
                    className={`flex items-center justify-between border-b border-hairline py-4 text-left font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      activeSection === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{label}</span>
                    {activeSection === id && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden />
                    )}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
