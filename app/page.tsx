"use client"
import { useState, useEffect } from "react"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Intro } from "@/components/sections/Intro"
import { PillarsTabs } from "@/components/sections/PillarsTabs"
import { HeroWave } from "@/components/ui/dynamic-wave-canvas-background"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Skills } from "@/components/sections/Skills"
import { Services } from "@/components/sections/Services"
import { Process } from "@/components/sections/Process"
import { ProjectsParallax } from "@/components/sections/ProjectsParallax"
import { AiAssistant } from "@/components/sections/AiAssistant"
import { Manifesto } from "@/components/sections/Manifesto"
import { Contact } from "@/components/sections/Contact"
import { FloatingChat } from "@/components/ui/floating-chat"
import { SplashScreen } from "@/components/ui/splash-screen"
import { AudienceProvider } from "@/lib/audience"
import { AudienceSelector } from "@/components/ui/audience-selector"

export default function CVPage() {
  const [activeSection, setActiveSection] = useState("intro")
  const [isDark, setIsDark] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [lang, setLang] = useState<Lang>("es")
  const [chatOpen, setChatOpen] = useState(false)

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
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -72
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: "-30% 0px -65% 0px" },
    )
    const sections = [
      "intro",
      "hero",
      "about",
      "experience",
      "skills",
      "services",
      "process",
      "projects",
      "ai",
      "manifesto",
      "contact",
    ]
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <AudienceProvider>
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
        <SplashScreen />
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
          <Intro lang={lang} scrollToSection={scrollToSection} />
          <PillarsTabs lang={lang} />
          <About lang={lang} />
          <Experience lang={lang} />
          <Skills lang={lang} />
          <Services lang={lang} />
          <Process lang={lang} />
          <ProjectsParallax lang={lang} />
          <AiAssistant lang={lang} onOpenChat={() => setChatOpen(true)} />
          <Manifesto lang={lang} />
          <Contact lang={lang} />
        </main>

        <Footer />

        <FloatingChat lang={lang} open={chatOpen} onOpenChange={setChatOpen} />
      </div>
    </AudienceProvider>
  )
}
