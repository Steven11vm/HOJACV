"use client"
import { useState, useEffect } from "react"
import { Globe, Sun, Moon, Menu, X, Sparkles } from "lucide-react"
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
    } catch {
      // localStorage can throw in private mode or when disabled — ignore.
    }
    setShowLangModal(false)
  }

  const quickToggleLanguage = () => {
    selectLanguage(lang === "es" ? "en" : "es")
  }

  const handleScroll = (id: string) => {
    scrollToSection(id)
    setMobileMenuOpen(false)
  }

  if (!mounted) return null

  const navItems = [
    { id: "hero", label: t.nav.home },
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
        <DialogContent className="max-w-md gap-6 sm:max-w-lg data-[state=open]:!animate-lang-modal border-white/10 bg-card/80 backdrop-blur-2xl">
          <DialogHeader className="overflow-hidden">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl animate-lang-title">
              <Globe className="h-6 w-6 text-primary" />
              <span>
                {translations.es.langModal.title} / {translations.en.langModal.title}
              </span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground animate-lang-subtitle">
            {translations.es.langModal.subtitle}
            <br />
            <span className="text-muted-foreground/80">{translations.en.langModal.subtitle}</span>
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 overflow-hidden">
            <Button
              size="lg"
              variant={lang === "es" ? "default" : "outline"}
              className="min-h-[4rem] text-lg font-semibold animate-lang-btn-left transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              onClick={() => selectLanguage("es")}
            >
              🇪🇸 {t.langModal.spanish}
            </Button>
            <Button
              size="lg"
              variant={lang === "en" ? "default" : "outline"}
              className="min-h-[4rem] text-lg font-semibold animate-lang-btn-right transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              onClick={() => selectLanguage("en")}
            >
              🇺🇸 {t.langModal.english}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -50, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/5 bg-background/70 backdrop-blur-xl"
            : "border-b border-transparent bg-background/30 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.button
            onClick={() => handleScroll("hero")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-violet to-neon-blue text-primary-foreground shadow-lg shadow-primary/30">
              <span className="font-mono text-sm font-bold">SV</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-violet to-neon-blue opacity-0 blur-md transition-opacity group-hover:opacity-70" />
            </div>
            <span className="hidden font-mono text-sm font-semibold tracking-tight text-foreground sm:inline">
              steven<span className="text-primary">.</span>dev
            </span>
          </motion.button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleScroll(id)}
                className="relative rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors"
              >
                <span
                  className={`relative z-10 transition-colors ${
                    activeSection === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </span>
                {activeSection === id && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full bg-white/5 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={quickToggleLanguage}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:border-white/20 hover:bg-white/10 hover:text-foreground"
              aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
              title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === "es" ? "ES" : "EN"}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            <Button
              size="sm"
              onClick={() => handleScroll("contact")}
              className="ml-2 hidden h-9 rounded-full bg-foreground px-4 text-xs font-semibold uppercase tracking-wider text-background hover:bg-foreground/90 lg:inline-flex"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              {t.hero.hireNow}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/5 lg:hidden"
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
              className="absolute left-0 right-0 top-full overflow-hidden border-b border-white/5 bg-background/95 backdrop-blur-2xl lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map(({ id, label }, idx) => (
                  <motion.button
                    key={id}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleScroll(id)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      activeSection === id
                        ? "bg-white/5 text-foreground ring-1 ring-white/10"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="uppercase tracking-wider">{label}</span>
                    {activeSection === id && <span className="status-dot" />}
                  </motion.button>
                ))}
                <Button
                  onClick={() => handleScroll("contact")}
                  className="mt-3 h-12 w-full rounded-lg bg-foreground text-sm font-semibold uppercase tracking-wider text-background"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t.hero.hireNow}
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
