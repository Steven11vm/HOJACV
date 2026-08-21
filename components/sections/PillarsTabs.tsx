"use client"
import { Code2, Sparkles, ShieldCheck } from "lucide-react"
import { Feature108 } from "@/components/blocks/shadcnblocks-com-feature108"
import type { Lang } from "@/lib/translations"

interface PillarsTabsProps {
  lang: Lang
}

export function PillarsTabs({ lang }: PillarsTabsProps) {
  const copy =
    lang === "es"
      ? {
          badge: "Pilares · MMXXV",
          heading: "Lo que construyo.",
          description:
            "Tres frentes con un mismo estándar: producto que llega a producción, seguro por defecto, y con IA cuando aporta valor real.",
          tabs: [
            {
              value: "fullstack",
              label: "Full Stack Web",
              badge: "Producción",
              title: "Web apps que escalan sin drama.",
              description:
                "React, Next.js, Node y SQL. Frontends rápidos, backends limpios y despliegues automatizados. Sin frameworks de moda: solo lo que resiste tráfico real.",
              buttonText: "Ver proyectos",
              buttonHref: "/proyectos",
            },
            {
              value: "ai",
              label: "Integraciones IA",
              badge: "IA aplicada",
              title: "IA que resuelve, no que impresiona.",
              description:
                "Chatbots con Claude o Gemini, agentes con RAG, automatizaciones de soporte que cubren 40 % de los tickets. La IA como palanca de negocio, no como demo.",
              buttonText: "Ver servicios",
              buttonHref: "#services",
            },
            {
              value: "cloud",
              label: "Cloud & Seguridad",
              badge: "OWASP · CI/CD",
              title: "Deploy con seguridad por defecto.",
              description:
                "Docker, GitHub Actions, AWS y Vercel. CSP, headers, OWASP Top 10 y observabilidad desde el día uno. Lo que ship, ship seguro.",
              buttonText: "Hablemos",
              buttonHref: "#contact",
            },
          ],
        }
      : {
          badge: "Pillars · MMXXV",
          heading: "What I build.",
          description:
            "Three fronts, one standard: product that ships to production, secure by default, and AI wherever it genuinely helps.",
          tabs: [
            {
              value: "fullstack",
              label: "Full Stack Web",
              badge: "Production",
              title: "Web apps that scale without drama.",
              description:
                "React, Next.js, Node and SQL. Fast frontends, clean backends and automated deploys. No trendy frameworks — only what survives real traffic.",
              buttonText: "See projects",
              buttonHref: "/proyectos",
            },
            {
              value: "ai",
              label: "AI Integrations",
              badge: "Applied AI",
              title: "AI that solves, not that dazzles.",
              description:
                "Claude/Gemini chatbots, RAG agents, support automations covering 40 % of tickets. AI as business leverage, not a demo.",
              buttonText: "See services",
              buttonHref: "#services",
            },
            {
              value: "cloud",
              label: "Cloud & Security",
              badge: "OWASP · CI/CD",
              title: "Ship with security by default.",
              description:
                "Docker, GitHub Actions, AWS and Vercel. CSP, hardened headers, OWASP Top 10 and observability from day one. What ships, ships safe.",
              buttonText: "Get in touch",
              buttonHref: "#contact",
            },
          ],
        }

  const icons = [
    <Code2 key="c" className="h-4 w-4 shrink-0" strokeWidth={1.6} />,
    <Sparkles key="s" className="h-4 w-4 shrink-0" strokeWidth={1.6} />,
    <ShieldCheck key="sh" className="h-4 w-4 shrink-0" strokeWidth={1.6} />,
  ]

  return (
    <div id="hero">
      <Feature108
        badge={copy.badge}
        heading={copy.heading}
        description={copy.description}
        tabs={copy.tabs.map((t, i) => ({
          value: t.value,
          icon: icons[i],
          label: t.label,
          content: {
            badge: t.badge,
            title: t.title,
            description: t.description,
            buttonText: t.buttonText,
            buttonHref: t.buttonHref,
          },
        }))}
      />
    </div>
  )
}
