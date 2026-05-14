"use client"
import { useState, useEffect } from "react"
import { type Lang, LANG_KEY } from "@/lib/translations"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Skills } from "@/components/sections/Skills"
import { Services } from "@/components/sections/Services"
import { Process } from "@/components/sections/Process"
import { Projects } from "@/components/sections/Projects"
import { AiAssistant } from "@/components/sections/AiAssistant"
import { Contact } from "@/components/sections/Contact"

export default function CVPage() {
  const [activeSection, setActiveSection] = useState("hero")
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
    const sections = ["hero", "about", "experience", "skills", "services", "process", "projects", "ai", "contact"]
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
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
        <Hero lang={lang} />
        <About lang={lang} />
        <Experience lang={lang} />
        <Skills lang={lang} />
        <Services lang={lang} />
        <Process lang={lang} />
        <Projects lang={lang} />
        <AiAssistant lang={lang} />
        <Contact lang={lang} />
      </main>

      <Footer />
    </div>
  )
}
