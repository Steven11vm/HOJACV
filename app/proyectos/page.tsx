"use client"
import { SiteShell } from "@/components/layout/SiteShell"
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase"

export default function ProyectosPage() {
  return (
    <SiteShell showSplash={false}>
      {({ lang }) => <ProjectsShowcase lang={lang} />}
    </SiteShell>
  )
}
