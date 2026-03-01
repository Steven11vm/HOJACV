/**
 * Hoja de vida digital - Portafolio profesional
 * @author STEVEN VILLAMIZAR MENDOZA
 */
"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

// Fotos: formal primero, luego rotación con compañero de código (autor: STEVEN VILLAMIZAR MENDOZA)
import formalImage from "../imagenes/image.png"
import gatoImage from "../imagenes/gato.jpg"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Code,
  Briefcase,
  GraduationCap,
  User,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Brain,
  Layers,
  Database,
  Smartphone,
  Server,
  Terminal,
  ChevronRight,
  Star,
  CheckCircle2,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { translations, type Lang, LANG_KEY } from "@/lib/translations"
import { Globe } from "lucide-react"
import { WaveSeparator } from "@/components/wave-separator"
export default function CVPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isDark, setIsDark] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visibleExpIndexes, setVisibleExpIndexes] = useState<Set<number>>(new Set())
  const [visibleProjectIndexes, setVisibleProjectIndexes] = useState<Set<number>>(new Set())
  const [projectsInView, setProjectsInView] = useState(false)
  const [aboutInView, setAboutInView] = useState(false)
  const [experienceInView, setExperienceInView] = useState(false)
  const [skillsInView, setSkillsInView] = useState(false)
  const [contactInView, setContactInView] = useState(false)
  const [lang, setLang] = useState<Lang>("es")
  const [showLangModal, setShowLangModal] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const experienceCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const projectsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  // Modal de idioma al entrar: si no hay preferencia guardada, mostrar
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(LANG_KEY) as Lang | null
    if (saved === "es" || saved === "en") {
      setLang(saved)
    } else {
      setShowLangModal(true)
    }
  }, [])

  const selectLanguage = (l: Lang) => {
    setLang(l)
    localStorage.setItem(LANG_KEY, l)
    setShowLangModal(false)
  }

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
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const FloatingCode = () => {
    const codeSnippets = [
      "const developer = new Developer('Steven');",
      "developer.skills = ['Full Stack', 'AI', 'Innovation'];",
      "async function buildFuture() { return innovation; }",
      "class Solution { solve(problem) { return success; } }",
      "import { creativity, expertise } from '@steven';",
    ]
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07] dark:opacity-[0.06] hidden sm:block">
        {codeSnippets.map((code, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs text-foreground"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animation: `floatCode ${20 + i * 5}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          >
            {code}
          </div>
        ))}
      </div>
    )
  }

  const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
  const skills = [
    { name: "JavaScript", logo: `${CDN}/javascript/javascript-original.svg` },
    { name: "TypeScript", logo: `${CDN}/typescript/typescript-original.svg` },
    { name: "React", logo: `${CDN}/react/react-original.svg` },
    { name: "Next.js", logo: `${CDN}/nextjs/nextjs-original.svg` },
    { name: "Node.js", logo: `${CDN}/nodejs/nodejs-original.svg` },
    { name: "Python", logo: `${CDN}/python/python-original.svg` },
    { name: "MongoDB", logo: `${CDN}/mongodb/mongodb-original.svg` },
    { name: "MySQL", logo: `${CDN}/mysql/mysql-original.svg` },
    { name: "Git", logo: `${CDN}/git/git-original.svg` },
    { name: "Android", logo: `${CDN}/android/android-original.svg` },
  ]

  const t = translations[lang]
  const experiences = t.experiences
  const projects = t.projectsData

  // Animación al scroll: experiencia (aparecen al bajar)
  useEffect(() => {
    const refs = experienceCardRefs.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.findIndex((r) => r === entry.target)
          if (idx === -1) return
          setVisibleExpIndexes((prev) => {
            const next = new Set(prev)
            if (entry.isIntersecting) next.add(idx)
            else next.delete(idx)
            return next
          })
        })
      },
      { rootMargin: "-30px 0px -30px 0px", threshold: 0.08 }
    )
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i]
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [experiences.length])

  type ProjectDoc = {
    architecture?: readonly string[]
    technicalDecisions?: readonly string[]
    problemsSolved?: readonly string[]
  }
  type Project = {
    title: string
    description: string
    tech: readonly string[]
    link?: string
    featured: boolean
    doc?: ProjectDoc
  }
  const [docProject, setDocProject] = useState<Project | null>(null)

  // Proyectos: animación al scroll (como experiencia)
  useEffect(() => {
    const el = projectsSectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setProjectsInView(true)
      },
      { rootMargin: "-80px 0px -80px 0px", threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Project cards: animación al entrar en vista (como experience)
  useEffect(() => {
    const refs = projectCardRefs.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.findIndex((r) => r === entry.target)
          if (idx === -1) return
          setVisibleProjectIndexes((prev) => {
            const next = new Set(prev)
            if (entry.isIntersecting) next.add(idx)
            else next.delete(idx)
            return next
          })
        })
      },
      { rootMargin: "-30px 0px -30px 0px", threshold: 0.08 }
    )
    refs.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [projects.length])

  // About, Experience, Skills, Contact: animaciones al entrar en vista
  useEffect(() => {
    const refs = [sectionRefs.current.about, sectionRefs.current.experience, sectionRefs.current.skills, sectionRefs.current.contact]
    const setters = [setAboutInView, setExperienceInView, setSkillsInView, setContactInView]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.findIndex((r) => r === entry.target)
          if (idx >= 0 && entry.isIntersecting) setters[idx](true)
        })
      },
      { rootMargin: "-50px 0px -50px 0px", threshold: 0.08 }
    )
    refs.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const stats = [
    { label: t.stats.years, value: "1+", icon: TrendingUp },
    { label: t.stats.projects, value: "20+", icon: Target },
    { label: t.stats.tech, value: "17+", icon: Brain },
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background text-foreground relative transition-colors duration-300">
      {/* Grid sutil */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      <FloatingCode />

      {/* Modal de idioma al entrar - animaciones desde los lados */}
      <Dialog open={showLangModal} onOpenChange={(open) => !open && setShowLangModal(false)}>
        <DialogContent
          className="max-w-md gap-6 sm:max-w-lg data-[state=open]:!animate-lang-modal"
        >
          <DialogHeader className="overflow-hidden">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl animate-lang-title">
              <Globe className="h-6 w-6 text-primary" />
              <span>{translations.es.langModal.title} / {translations.en.langModal.title}</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground animate-lang-subtitle">
            {translations.es.langModal.subtitle}<br />
            <span className="text-muted-foreground/80">{translations.en.langModal.subtitle}</span>
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 overflow-hidden">
            <Button
              size="lg"
              variant={lang === "es" ? "default" : "outline"}
              className="min-h-[4rem] text-lg font-semibold animate-lang-btn-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => selectLanguage("es")}
            >
              🇪🇸 {t.langModal.spanish}
            </Button>
            <Button
              size="lg"
              variant={lang === "en" ? "default" : "outline"}
              className="min-h-[4rem] text-lg font-semibold animate-lang-btn-right transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => selectLanguage("en")}
            >
              🇺🇸 {t.langModal.english}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Barra de navegación: entra desde arriba */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-top transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <span className="truncate text-sm font-semibold text-foreground sm:text-base">Steven Villamizar</span>
          <nav className="hidden items-center gap-0.5 md:flex md:gap-1">
            {[
              { id: "hero", label: t.nav.home },
              { id: "about", label: t.nav.about },
              { id: "experience", label: t.nav.experience },
              { id: "skills", label: t.nav.skills },
              { id: "projects", label: t.nav.projects },
              { id: "contact", label: t.nav.contact },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setShowLangModal(true)}
              className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-muted touch-manipulation"
              aria-label={lang === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
              title={lang === "es" ? "English" : "Español"}
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-muted touch-manipulation"
              aria-label={isDark ? t.aria.lightMode : t.aria.darkMode}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-muted md:hidden touch-manipulation"
              aria-label={mobileMenuOpen ? t.aria.closeMenu : t.aria.openMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div
          className={`absolute left-0 right-0 top-full border-b border-border bg-card shadow-lg transition-all duration-200 md:hidden ${
            mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col p-3 pb-4">
            {[
              { id: "hero", label: t.nav.home },
              { id: "about", label: t.nav.about },
              { id: "experience", label: t.nav.experience },
              { id: "skills", label: t.nav.skills },
              { id: "projects", label: t.nav.projects },
              { id: "contact", label: t.nav.contact },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`min-h-[2.75rem] rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors touch-manipulation ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 pt-14 sm:pt-16">
        {/* Hero horizontal: texto + foto de confianza */}
        <section
          ref={(el) => {
            sectionRefs.current.hero = el
          }}
          className="flex min-h-[100dvh] min-h-screen items-center px-3 py-8 sm:px-6 sm:py-12"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div
              className={`order-2 lg:order-1 transition-all duration-1000 ease-out ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="mb-6 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>steven@developer:~$</span>
                <span className="animate-pulse">_</span>
              </div>
              <h1 className="mb-3 text-3xl font-black tracking-tight text-foreground sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl">
                STEVEN VILLAMIZAR
              </h1>
              <p className="mb-2 text-lg font-light text-muted-foreground sm:text-xl md:text-2xl">
                Full Stack Developer
              </p>
              <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-base font-medium">{t.hero.tagline}</span>
              </div>
              <p className="mb-8 max-w-xl text-muted-foreground leading-relaxed">
                {t.hero.intro}
              </p>
              <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
                {stats.map(({ label, value, icon: Icon }, idx) => (
                  <Card
                    key={idx}
                    className="border-border bg-card p-2 shadow-sm transition-all hover:border-primary/20 hover:shadow sm:p-4"
                  >
                    <Icon className="mb-0.5 h-4 w-4 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                    <div className="text-base font-bold text-foreground sm:text-2xl">{value}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground sm:text-xs">{label}</div>
                  </Card>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button size="lg" className="min-h-[2.75rem] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation sm:min-h-0" asChild>
                  <a href="mailto:Stevenvilla10@gmail.com">
                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t.hero.hireNow}
                  </a>
                </Button>
                <a href="/CV/Hoja de vida.pdf" download="Steven_Villamizar_CV.pdf" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[2.75rem] border-primary/40 bg-transparent text-foreground hover:bg-muted hover:border-primary/60 touch-manipulation sm:min-h-0"
                  >
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t.hero.downloadCV}
                  </Button>
                </a>
              </div>
              <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
                {[
                  { icon: Github, href: "https://github.com/Steven11vm", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/steven-villamizar-166b98388/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:Stevenvilla10@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex h-11 w-11 min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground touch-manipulation"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            {/* Solo foto del gato, más grande */}
            <div
              className={`order-1 flex justify-center lg:order-2 transition-all duration-1000 ease-out delay-200 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              }`}
            >
              <Card className="w-full max-w-[200px] overflow-hidden border-border bg-card shadow-lg transition-shadow hover:shadow-xl sm:max-w-[260px] lg:max-w-[300px]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={gatoImage}
                    alt="Mi compañero de código"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
                    priority
                    quality={90}
                  />
                </div>
                <div className="border-t border-border bg-muted/50 px-4 py-3 text-center">
                  <p className="text-sm font-medium text-foreground">{t.hero.catCard}</p>
                </div>
              </Card>
            </div>
          </div>
          <div
            className={`absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 sm:flex sm:bottom-6 transition-all duration-700 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{t.hero.scroll}</span>
            <div className="flex h-8 w-5 justify-center rounded-full border-2 border-border p-1.5">
              <div className="h-2 w-1 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        </section>

        <WaveSeparator variant="down" isDark={isDark} />

        {/* Sobre Mí — entra desde los lados */}
        <section
          ref={(el) => {
            sectionRefs.current.about = el
          }}
          className={`relative py-12 px-4 sm:py-16 sm:px-6 md:py-20 ${isDark ? "bg-muted/10" : "bg-muted/30"}`}
        >
          <div className="mx-auto max-w-6xl">
            <div
              className={`mb-10 text-center sm:mb-16 transition-all duration-700 delay-100 ${
                aboutInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{t.about.title}</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              <div
                className={`space-y-4 sm:space-y-6 transition-all duration-700 delay-150 ${
                  aboutInView ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
              >
                <Card className="border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
                  <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-border shadow-md sm:h-32 sm:w-32">
                      <Image
                        src={formalImage}
                        alt="Steven Villamizar — Foto formal"
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                        quality={90}
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <h3 className="mb-2 flex flex-wrap items-center justify-center gap-3 text-2xl font-bold text-foreground sm:justify-start">
                        <Zap className="h-7 w-7 text-primary" />
                        {t.about.professionalProfile}
                      </h3>
                      <p className="text-sm text-muted-foreground">Steven Villamizar Mendoza</p>
                    </div>
                  </div>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    {t.about.bio1} <span className="font-semibold text-foreground">Steven Villamizar Mendoza</span>{t.about.bio1b}{" "}
                    <span className="font-semibold text-foreground">{t.about.bio1c}</span> {t.about.bio1d}
                  </p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    {t.about.bio2}{" "}
                    <span className="font-semibold text-foreground">{t.about.bio2b}
                      </span> {t.about.bio2c}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {t.about.bio3}
                  </p>
                </Card>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: MapPin, text: t.about.info.location },
                    { icon: Phone, text: "304 646 7135" },
                    { icon: Mail, text: "Stevenvilla10@gmail.com" },
                    { icon: GraduationCap, text: t.about.info.degree },
                  ].map(({ icon: Icon, text }, idx) => (
                    <Card
                      key={idx}
                      className="border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/20 sm:p-4"
                    >
                      <Icon className="mb-1.5 h-4 w-4 text-primary sm:mb-2 sm:h-5 sm:w-5" />
                      <p className="text-xs text-muted-foreground sm:text-sm">{text}</p>
                    </Card>
                  ))}
                </div>
              </div>
              <div
                className={`space-y-4 sm:space-y-6 transition-all duration-700 delay-200 ${
                  aboutInView ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
              >
                <Card className="border-border bg-muted/50 p-4 shadow-sm sm:p-6 md:p-8">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary">
                      <Target className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{t.about.missionTitle}</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {t.about.missionText}
                    </p>
                  </div>
                </Card>
                <Card className="border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-foreground sm:text-xl">
                    <Brain className="h-6 w-6 text-primary" />
                    {t.about.whyWork}
                  </h3>
                  <ul className="space-y-3">
                    {t.about.whyItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <WaveSeparator variant="up" isDark={isDark} />

        {/* Experiencia — cards entran desde los lados (izq/der alternos) */}
        <section
          ref={(el) => {
            sectionRefs.current.experience = el
          }}
          className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div
              className={`mb-10 text-center sm:mb-16 transition-all duration-700 ${
                experienceInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{t.experience.title}</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    experienceCardRefs.current[idx] = el
                  }}
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: visibleExpIndexes.has(idx) ? 1 : 0,
                    transform: visibleExpIndexes.has(idx)
                      ? "translateX(0)"
                      : idx % 2 === 0
                        ? "translateX(-60px)"
                        : "translateX(60px)",
                    transitionDelay: visibleExpIndexes.has(idx) ? `${(idx % 2) * 80}ms` : "0ms",
                  }}
                >
                  <Card className="h-full border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-6 md:p-8">
                    <div className="mb-3 flex flex-col sm:mb-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="mb-2 text-base font-bold text-foreground sm:text-xl">{exp.title}</h3>
                        {exp.company && (
                          <p className="mb-2 text-base font-semibold text-primary sm:text-lg">{exp.company}</p>
                        )}
                        <Badge variant="outline" className="border-primary/30 text-foreground">
                          {exp.period}
                        </Badge>
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{exp.description}</p>
                    <div className="mb-4">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground sm:text-sm">{t.experience.achievements}</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {exp.tech.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="border-border text-xs text-muted-foreground sm:text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveSeparator variant="small" isDark={isDark} />

        {/* Habilidades — entran desde los lados con efecto de dispersión */}
        <section
          ref={(el) => {
            sectionRefs.current.skills = el
          }}
          className={`relative py-12 px-4 sm:py-16 sm:px-6 md:py-20 ${isDark ? "bg-muted/10" : "bg-muted/20"}`}
        >
          <div className="mx-auto max-w-6xl">
            <div
              className={`mb-10 text-center sm:mb-16 transition-all duration-700 ${
                skillsInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{t.skills.title}</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
              {skills.map((skill, idx) => (
                <div
                  key={skill.name}
                  className={`transition-all duration-700 ease-out ${
                    skillsInView ? "translate-x-0 opacity-100" : idx % 2 === 0 ? "-translate-x-12 opacity-0" : "translate-x-12 opacity-0"
                  }`}
                  style={{ transitionDelay: skillsInView ? `${idx * 50}ms` : "0ms" }}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card shadow-md transition-shadow duration-200 hover:shadow-lg sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
                    title={skill.name}
                  >
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="h-7 w-7 object-contain sm:h-8 sm:w-8 md:h-9 md:w-9"
                      width={36}
                      height={36}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveSeparator variant="down" isDark={isDark} className="h-20 sm:h-28 md:h-36 lg:h-44" />

        {/* Proyectos — mismo estilo que Experiencia */}
        <section
          ref={(el) => {
            sectionRefs.current.projects = el
          }}
          className={`relative py-12 px-4 sm:py-16 sm:px-6 md:py-20 ${isDark ? "bg-card/60" : "bg-primary/[0.06]"}`}
        >
          <div ref={projectsSectionRef} className="mx-auto max-w-6xl">
            <div
              className={`mb-10 text-center sm:mb-16 transition-all duration-700 ${
                projectsInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary sm:text-sm">
                {t.projects.portfolio}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
                {t.projects.title}
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                {t.projects.subtitle}
              </p>
              <div className="mx-auto mt-6 h-1 w-20 bg-primary" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    projectCardRefs.current[idx] = el
                  }}
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: visibleProjectIndexes.has(idx) ? 1 : 0,
                    transform: visibleProjectIndexes.has(idx)
                      ? "translateX(0)"
                      : idx % 2 === 0
                        ? "translateX(-60px)"
                        : "translateX(60px)",
                    transitionDelay: visibleProjectIndexes.has(idx) ? `${(idx % 2) * 80}ms` : "0ms",
                  }}
                >
                  <Card className="h-full border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-6 md:p-8">
                    <div className="mb-3 flex flex-col sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                      <div>
                        <h3 className="mb-2 text-base font-bold text-foreground sm:text-xl">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 font-medium">
                            {t.projects.featured}
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono text-2xl font-bold tabular-nums text-primary/20 sm:text-3xl">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {project.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                      {project.tech.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="border-border text-xs text-muted-foreground sm:text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.doc && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-[2.5rem] border-border touch-manipulation sm:min-h-0"
                          onClick={() => setDocProject(project)}
                        >
                          <FileText className="mr-1.5 h-4 w-4" />
                          {t.projects.docTech}
                        </Button>
                      )}
                      {project.link && project.link !== "#" ? (
                        <Button
                          size="sm"
                          className="min-h-[2.5rem] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation sm:min-h-0"
                          asChild
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            {t.projects.viewProject}
                            <ExternalLink className="ml-1.5 h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="min-h-[2.5rem]" disabled>
                          {t.projects.privateProject}
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveSeparator variant="up" isDark={isDark} />

        {/* Contacto — entra desde los lados */}
        <section
          ref={(el) => {
            sectionRefs.current.contact = el
          }}
          className={`relative py-12 px-4 sm:py-16 sm:px-6 md:py-20 ${isDark ? "bg-muted/10" : "bg-muted/30"}`}
        >
          <div className="mx-auto max-w-4xl text-center">
            <div
              className={`mb-8 transition-all duration-700 ${
                contactInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{t.contact.title}</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:mb-12 sm:text-xl">
                {t.contact.subtitle}
              </p>
            </div>
            <div className="mb-8 grid gap-4 sm:mb-12 sm:gap-6 md:grid-cols-2">
              <div
                className={`transition-all duration-700 delay-150 ${
                  contactInView ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
              >
                <Card className="border-border bg-card p-4 text-center shadow-sm transition-colors hover:border-primary/20 sm:p-6 md:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted sm:mb-4 sm:h-16 sm:w-16">
                  <Mail className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">{t.contact.email}</h3>
                <a href="mailto:Stevenvilla10@gmail.com" className="break-all text-sm text-primary hover:underline sm:text-base">
                  Stevenvilla10@gmail.com
                </a>
              </Card>
              </div>
              <div
                className={`transition-all duration-700 delay-200 ${
                  contactInView ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
              >
                <Card className="border-border bg-card p-4 text-center shadow-sm transition-colors hover:border-primary/20 sm:p-6 md:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted sm:mb-4 sm:h-16 sm:w-16">
                  <Phone className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">{t.contact.phone}</h3>
                <a href="tel:3046467135" className="text-primary hover:underline">304 646 7135</a>
              </Card>
              </div>
            </div>
            <div
              className={`transition-all duration-700 delay-300 ${
                contactInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
            <Button size="lg" className="min-h-[2.75rem] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation sm:min-h-0" asChild>
              <a href="mailto:Stevenvilla10@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                {t.contact.startConversation}
              </a>
            </Button>
            </div>
          </div>
        </section>

        <WaveSeparator variant="small" isDark={isDark} />

        <footer
          className={`safe-area-bottom border-t border-border bg-muted/30 py-8 sm:py-12 transition-all duration-700 ${
            contactInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-sm text-muted-foreground sm:text-base">{t.footer.copyright}</p>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              {t.footer.built}
            </p>
          </div>
        </footer>
      </div>

      {/* Modal de documentación técnica */}
      <Dialog open={!!docProject} onOpenChange={(open) => !open && setDocProject(null)}>
        <DialogContent className="max-h-[85dvh] max-w-2xl gap-0 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              {docProject?.title}
            </DialogTitle>
          </DialogHeader>
          {docProject?.doc && (
            <ScrollArea className="max-h-[60dvh] pr-4">
              <div className="space-y-6 pt-2">
                {docProject.doc.architecture && docProject.doc.architecture.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Layers className="h-4 w-4 text-primary" />
                      {t.projects.docLabels.architecture}
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.architecture.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {docProject.doc.technicalDecisions && docProject.doc.technicalDecisions.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Code className="h-4 w-4 text-primary" />
                      {t.projects.docLabels.technicalDecisions}
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.technicalDecisions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {docProject.doc.problemsSolved && docProject.doc.problemsSolved.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {t.projects.docLabels.problemsSolved}
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.problemsSolved.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes floatCode {
          0% {
            transform: translateX(-100px) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
