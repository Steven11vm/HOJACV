"use client"
import { SiteShell } from "@/components/layout/SiteShell"
import { Intro } from "@/components/sections/Intro"
import { PillarsTabs } from "@/components/sections/PillarsTabs"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Skills } from "@/components/sections/Skills"
import { Services } from "@/components/sections/Services"
import { Process } from "@/components/sections/Process"
import { AiAssistant } from "@/components/sections/AiAssistant"
import { Manifesto } from "@/components/sections/Manifesto"
import { Contact } from "@/components/sections/Contact"

const HOME_SECTION_IDS = [
  "intro",
  "hero",
  "about",
  "experience",
  "skills",
  "services",
  "process",
  "ai",
  "manifesto",
  "contact",
]

export default function CVPage() {
  return (
    <SiteShell observeSectionIds={HOME_SECTION_IDS}>
      {({ lang, openChat }) => (
        <>
          <Intro lang={lang} scrollToSection={(id) => {
            const el = document.getElementById(id)
            if (!el) return
            const y = el.getBoundingClientRect().top + window.scrollY - 72
            window.scrollTo({ top: y, behavior: "smooth" })
          }} />
          <PillarsTabs lang={lang} />
          <About lang={lang} />
          <Experience lang={lang} />
          <Skills lang={lang} />
          <Services lang={lang} />
          <Process lang={lang} />
          <AiAssistant lang={lang} onOpenChat={openChat} />
          <Manifesto lang={lang} />
          <Contact lang={lang} />
        </>
      )}
    </SiteShell>
  )
}
