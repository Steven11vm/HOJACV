"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang } from "@/lib/translations"

type Message = { id: string; role: "user" | "assistant"; text: string }

/**
 * Fondo ambiental con snippets de codigo scrolleando en 3 columnas.
 * Puro decorativo — pointer-events-none, aria-hidden y opacidad baja para
 * que no compita con el contenido del chat.
 */
const CODE_COLUMNS = [
  [
    "// steven.villamizar",
    "import { useAI } from '@/hooks/ai'",
    "const model = 'claude-haiku-4-5'",
    "async function ask(q: string) {",
    "  const res = await fetch('/api/chat', {",
    "    method: 'POST',",
    "    body: JSON.stringify({ q }),",
    "  })",
    "  return res.json()",
    "}",
    "export default ask",
    "",
    "# python — data pipeline",
    "from anthropic import Anthropic",
    "client = Anthropic()",
    "def summarize(text):",
    "    return client.messages.create(",
    "        model='claude-haiku-4-5',",
    "        max_tokens=400,",
    "        messages=[{'role':'user','content':text}]",
    "    )",
  ],
  [
    "-- sql — usuarios activos",
    "SELECT id, name, created_at",
    "FROM users",
    "WHERE last_login > NOW() - INTERVAL '7 days'",
    "ORDER BY created_at DESC",
    "LIMIT 100;",
    "",
    "// typescript — types",
    "type Role = 'user' | 'assistant'",
    "interface Message {",
    "  id: string",
    "  role: Role",
    "  text: string",
    "  createdAt: Date",
    "}",
    "",
    "export const RATE_LIMIT = {",
    "  window: 60,",
    "  max: 20,",
    "} as const",
  ],
  [
    "# bash — deploy",
    "$ git add .",
    "$ git commit -m 'ship'",
    "$ vercel deploy --prod",
    "→ Building...",
    "→ Ready · 45s",
    "",
    "// react — floating chat",
    "export function FloatingChat() {",
    "  const [open, setOpen] = useState(false)",
    "  return <Drawer open={open} />",
    "}",
    "",
    "// docker",
    "FROM node:20-alpine",
    "WORKDIR /app",
    "COPY package.json .",
    "RUN npm ci --omit=dev",
    "CMD ['npm', 'start']",
  ],
]

function CodeLinesBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ maskImage: "linear-gradient(180deg, transparent 0, #000 15%, #000 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 15%, #000 85%, transparent 100%)" }}
    >
      <div className="grid h-full grid-cols-2 gap-0 sm:grid-cols-3">
        {CODE_COLUMNS.map((col, i) => (
          <div
            key={i}
            className={
              i === 2
                ? "relative hidden h-full overflow-hidden sm:block"
                : "relative h-full overflow-hidden"
            }
          >
            <div
              className="absolute inset-x-0 top-0 flex flex-col gap-2 whitespace-nowrap font-mono text-[10px] leading-[1.6] text-foreground/[0.07]"
              style={{
                animation: `chat-code-scroll ${i === 1 ? 80 : i === 0 ? 65 : 95}s linear infinite`,
                animationDirection: i === 1 ? "reverse" : "normal",
              }}
            >
              {[...col, ...col, ...col].map((line, j) => (
                <div key={j} className="px-2">
                  {line || " "}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const KNOWLEDGE_BASE = {
  es: [
    // Proyectos especificos — respuestas ricas por cada uno
    { keywords: ["tonsorium", "barberia", "barber"], answer: "Tonsorium — Spa for Men: barbería premium en Itagüí con reservas online, catálogo de servicios, panel administrativo, cuentas de cliente e integración con WhatsApp. Stack: React + PHP + SQL Server + Tailwind. Estética editorial oscura con dorado clásico. En vivo: https://tonsorium.online/" },
    { keywords: ["alien", "alienstyle", "alien style", "estampados", "estampado"], answer: "Alien Style 51: e-commerce de estampados personalizados con Studio interactivo (canvas HTML5 para diseñar en vivo sobre el producto), catálogo, checkout, cuenta de cliente y panel admin. Producción 48h. Stack: PHP + JS + HTML5 Canvas + MySQL. En vivo: https://alyenstyle.online/" },
    { keywords: ["vetalud", "eps", "mascotas", "mascota", "veterinaria", "veterinario", "pet", "epsmascotas"], answer: "Vetalud — EPS para mascotas: primera EPS digital de salud animal en Colombia. Afiliación personal y empresarial, historia clínica portable entre clínicas aliadas, telemedicina con triage IA, urgencias 24/7, farmacia digital, reembolsos en 48h y PQRS con SLA. Sustituye el 'pago por evento' por cobertura mensual. Stack: Next.js + Node + PostgreSQL + IA + Tailwind. En vivo: https://vetalud.vercel.app/" },
    { keywords: ["beat", "beats", "beatgenerator", "musica", "musical", "generador", "opium"], answer: "Beat Generator AI: plataforma conversacional que genera beats y patrones musicales personalizados a partir de prompts, combinando Gemini API con pipeline de audio en tiempo real. Stack: Next.js + Node + Gemini API + Python. En vivo: https://opiumm-gray.vercel.app/" },
    { keywords: ["finanzas", "finanzaspro", "financiero", "financial"], answer: "Finanzas Pro: app de finanzas personales con dashboards visuales, presupuestos automáticos, alertas de límite y análisis de tendencias de gasto. Stack: Next.js + React + TypeScript + Tailwind. En vivo: https://finanzaspro-nine.vercel.app/" },
    { keywords: ["inventory", "inventario", "saas"], answer: "Inventory SaaS: plataforma multi-tenant para gestión de inventario, ventas y reportes. Control de stock en tiempo real con validaciones que previenen sobreventa. Stack: React + Node + REST + MySQL. En vivo: https://saas-beta-peach.vercel.app/" },
    { keywords: ["enterprise", "dashboard", "empresarial", "rrhh", "hr", "analytics"], answer: "Enterprise Dashboard: dashboard ejecutivo con KPIs de empleados, generación de Excel/PDF en servidor y control granular de permisos por rol. Listo para auditorías. Stack: React + Node + Recharts + xlsx + pdf-lib. En vivo: https://empresarial-omega.vercel.app/" },
    { keywords: ["oral", "oralplus", "oral-plus", "pasarela", "pagos"], answer: "ORAL-PLUS Ecosystem: ecosistema completo web + app Android + pasarela de pagos + conciliación automática de facturas. En producción nacional. Stack: JavaScript + PHP + MySQL + Android. En vivo: https://oral-plus.com/index.html" },
    { keywords: ["cv", "portafolio", "portfolio", "sitio", "web"], answer: "Digital CV (este sitio): portafolio bilingüe con asistente IA integrado, modo oscuro, animaciones cinematográficas y documentación técnica por proyecto. Performance 95+ en Lighthouse. Stack: Next.js 14 + TypeScript + Tailwind + Framer Motion." },
    { keywords: ["orion", "reservas"], answer: "Barbería Orion: plataforma de gestión de citas con experiencia mobile-first y micro-interacciones que refuerzan la marca premium. Stack: React + Tailwind + Framer Motion." },

    // Generales
    { keywords: ["experiencia", "trabajo", "rol", "carrera", "años", "anos", "trayectoria"], answer: "Steven cuenta con más de 3 años enviando software real a producción (2022—2025). Su rol más reciente fue Full Stack en ORAL-PLUS (SKY S.A.S, 2024—2025): migró el sistema PHP legacy a Next.js + Node, redujo tiempos de carga en 60%, integró agentes IA con Gemini que resuelven el 40% del soporte y llevó a producción la pasarela de pagos con conciliación automática. Antes fue freelance (2023—2024) entregando SaaS de inventario y dashboards empresariales con export PDF/Excel — NPS > 9 con todos los clientes. Etapa formativa (2022—2023): 10+ proyectos de portafolio con code review, pair programming y fundamentos sólidos de SQL, algoritmos y ciberseguridad (OWASP)." },
    { keywords: ["habilidades", "stack", "tecnologias", "techs", "tecnologia", "lenguajes", "herramientas"], answer: "Stack principal: React, Next.js, Node.js, TypeScript, Python, MySQL, SQL Server, Docker, AWS. Especializado en integraciones con Gemini API, Claude y OpenAI. Frontend con Tailwind + Framer Motion." },
    { keywords: ["contacto", "llamar", "email", "correo", "whatsapp", "telefono", "linkedin"], answer: "Email: Stevenvilla10@gmail.com · Tel: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Responde en menos de 24 horas." },
    { keywords: ["hola", "saludos", "buenas", "buenos dias", "buenas tardes", "hey"], answer: "Hola. Soy el copiloto del portafolio. Puedes preguntar por experiencia, stack, cualquier proyecto (Tonsorium, Alien Style, Vetalud, Beat Generator AI, Finanzas Pro, Inventory SaaS, ORAL-PLUS…), tarifas o disponibilidad." },
    { keywords: ["ai", "ia", "inteligencia artificial", "gemini", "openai", "claude", "llm", "chatbot", "agente"], answer: "Steven ha integrado IA generativa en producción: chatbots con Gemini/Claude, automatizaciones de soporte que cubren 40% de tickets, agentes con RAG y el copiloto que estás usando ahora mismo (Claude Haiku 4.5)." },
    { keywords: ["proyecto", "proyectos", "trabajos"], answer: "Proyectos en producción: Tonsorium (barbería premium), Alien Style 51 (estampados), Vetalud (EPS digital para mascotas), Beat Generator AI (música + IA), Finanzas Pro (finanzas personales), Inventory SaaS (inventario multi-tenant), Enterprise Dashboard (analytics RRHH), ORAL-PLUS (ecosistema web + app + pagos), Digital CV (este sitio). Pregúntame por cualquiera para ver detalles." },
    { keywords: ["precio", "tarifa", "costo", "presupuesto", "cotizar", "cotizacion"], answer: "Trabaja por proyecto (fixed-price) o por sprint mensual. La llamada inicial de 30 min es gratuita. Rango típico: MVP web desde 1500 USD, integración de IA desde 800 USD, dashboards a medida desde 2000 USD." },
    { keywords: ["remoto", "ubicacion", "donde", "viaje", "relocacion", "colombia", "medellin"], answer: "Base en Medellín, Colombia. Trabaja remoto, híbrido o presencial. Abierto a relocación para roles full-time." },
    { keywords: ["disponible", "disponibilidad", "contratar", "puede", "empezar", "inicio"], answer: "Sí, disponible. Puede arrancar en menos de una semana. Escríbele a Stevenvilla10@gmail.com o al WhatsApp +57 304 646 7135." },
    { keywords: ["educacion", "estudios", "universidad", "certificaciones"], answer: "Formación autodidacta + proyectos reales en producción. Cursos y certificaciones en desarrollo full stack, IA generativa y bases de datos. Enfoque en aprender construyendo software que se envía." },
    { keywords: ["quien", "eres", "sos", "steven"], answer: "Soy el copiloto IA del portafolio de Steven Villamizar Mendoza — Full Stack Engineer & AI Specialist basado en Medellín. Responde en menos de 24 horas y arranca proyectos en menos de una semana." },
    { keywords: ["metodologia", "proceso", "trabaja", "como"], answer: "Metodología clara: descubrimiento (kickoff + objetivos), diseño (arquitectura + wireframes), build (2 sprints), test (QA + UX), deploy (CI/CD) y soporte post-launch. Reporte semanal y demo cada sprint." },
  ],
  en: [
    { keywords: ["tonsorium", "barbershop", "barber"], answer: "Tonsorium — Spa for Men: premium barbershop in Itagüí with online booking, service catalog, admin panel, customer accounts and WhatsApp integration. Stack: React + PHP + SQL Server + Tailwind. Live: https://tonsorium.online/" },
    { keywords: ["alien", "alienstyle", "alien style", "prints", "printing"], answer: "Alien Style 51: e-commerce for custom prints with interactive Studio (HTML5 canvas to design live on the product), catalog, checkout and admin panel. 48h production. Stack: PHP + JS + HTML5 Canvas + MySQL. Live: https://alyenstyle.online/" },
    { keywords: ["vetalud", "eps", "pets", "pet", "vet", "veterinary", "epsmascotas"], answer: "Vetalud — Pet Health EPS: Colombia's first digital pet health insurance. Personal and corporate memberships, portable medical records across partner clinics, AI-triaged telemedicine, 24/7 emergencies, digital pharmacy, 48h refunds and SLA-backed complaints. Replaces the 'pay-per-event' model with predictable monthly coverage. Stack: Next.js + Node + PostgreSQL + AI + Tailwind. Live: https://vetalud.vercel.app/" },
    { keywords: ["beat", "beats", "beatgenerator", "music", "generator", "opium"], answer: "Beat Generator AI: conversational platform that generates custom beats from prompts, combining Gemini API with a real-time audio pipeline. Stack: Next.js + Node + Gemini API + Python. Live: https://opiumm-gray.vercel.app/" },
    { keywords: ["finanzas", "finanzaspro", "finance", "financial"], answer: "Finanzas Pro: personal finance app with visual dashboards, automatic budgets, limit alerts and spending trend analysis. Stack: Next.js + React + TypeScript + Tailwind. Live: https://finanzaspro-nine.vercel.app/" },
    { keywords: ["inventory", "saas", "stock"], answer: "Inventory SaaS: multi-tenant platform for inventory, sales and reporting. Real-time stock control with validations that prevent overselling. Stack: React + Node + REST + MySQL. Live: https://saas-beta-peach.vercel.app/" },
    { keywords: ["enterprise", "dashboard", "hr", "analytics"], answer: "Enterprise Dashboard: executive dashboard with employee KPIs, server-side Excel/PDF generation and granular role-based permissions. Audit-ready. Stack: React + Node + Recharts + xlsx + pdf-lib. Live: https://empresarial-omega.vercel.app/" },
    { keywords: ["oral", "oralplus", "oral-plus", "payment", "gateway"], answer: "ORAL-PLUS Ecosystem: full ecosystem web + Android app + payment gateway + automatic invoice reconciliation. In national production. Stack: JavaScript + PHP + MySQL + Android. Live: https://oral-plus.com/index.html" },
    { keywords: ["cv", "portfolio", "site", "website"], answer: "Digital CV (this site): bilingual portfolio with integrated AI copilot, dark mode, cinematic animations and per-project technical docs. Lighthouse 95+. Stack: Next.js 14 + TypeScript + Tailwind + Framer Motion." },
    { keywords: ["orion", "booking"], answer: "Barbería Orion: appointment management platform with mobile-first UX and micro-interactions that reinforce the premium brand. Stack: React + Tailwind + Framer Motion." },

    { keywords: ["experience", "work", "role", "career", "years", "background"], answer: "Steven has 3+ years shipping real software to production (2022—2025). His most recent role was Full Stack at ORAL-PLUS (SKY S.A.S, 2024—2025): migrated the legacy PHP stack to Next.js + Node, cut load times by 60%, integrated Gemini AI agents that resolve 40% of support and shipped the payment gateway with automatic invoice reconciliation. Before that, freelance (2023—2024) delivering inventory SaaS and enterprise dashboards with PDF/Excel export — NPS > 9 with every client. Formative years (2022—2023): 10+ portfolio projects with code review, pair programming and solid fundamentals in SQL, algorithms and security (OWASP)." },
    { keywords: ["skills", "stack", "technologies", "techs", "languages", "tools"], answer: "Main stack: React, Next.js, Node.js, TypeScript, Python, MySQL, SQL Server, Docker, AWS. Specialized in Gemini API, Claude and OpenAI integrations. Frontend with Tailwind + Framer Motion." },
    { keywords: ["contact", "call", "email", "whatsapp", "phone", "linkedin"], answer: "Email: Stevenvilla10@gmail.com · Phone: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Replies under 24 hours." },
    { keywords: ["hello", "hi", "greetings", "hey"], answer: "Hi. I'm the portfolio copilot. Ask about experience, stack, any project (Tonsorium, Alien Style, Vetalud, Beat Generator AI, Finanzas Pro, Inventory SaaS, ORAL-PLUS…), rates or availability." },
    { keywords: ["ai", "artificial intelligence", "gemini", "openai", "claude", "llm", "chatbot", "agent"], answer: "Steven has shipped generative AI to production: Gemini/Claude chatbots, support automations covering 40% of tickets, RAG agents and the copilot you're using right now (Claude Haiku 4.5)." },
    { keywords: ["project", "projects", "works"], answer: "Projects in production: Tonsorium (premium barbershop), Alien Style 51 (custom prints), Vetalud (digital pet health EPS), Beat Generator AI (music + AI), Finanzas Pro (personal finance), Inventory SaaS (multi-tenant inventory), Enterprise Dashboard (HR analytics), ORAL-PLUS (web + app + payments), Digital CV (this site). Ask me about any of them for details." },
    { keywords: ["price", "rate", "cost", "budget", "quote"], answer: "Works per-project (fixed price) or by monthly sprint. First 30-min call is free. Typical range: web MVP from USD 1500, AI integration from USD 800, custom dashboards from USD 2000." },
    { keywords: ["remote", "location", "where", "relocation", "colombia", "medellin"], answer: "Based in Medellín, Colombia. Works remote, hybrid or onsite. Open to relocation for full-time roles." },
    { keywords: ["available", "availability", "hire", "start", "begin"], answer: "Yes, available. Can start in under a week. Email Stevenvilla10@gmail.com or WhatsApp +57 304 646 7135." },
    { keywords: ["education", "studies", "university", "certifications"], answer: "Self-taught + real projects in production. Courses and certifications in full stack development, generative AI and databases. Focus on learning by building shippable software." },
    { keywords: ["who", "are you"], answer: "I'm the AI copilot for Steven Villamizar Mendoza's portfolio — Full Stack Engineer & AI Specialist based in Medellín. Replies under 24 hours and starts projects in under a week." },
    { keywords: ["methodology", "process", "how", "work"], answer: "Clear methodology: discovery (kickoff + goals), design (architecture + wireframes), build (2 sprints), test (QA + UX), deploy (CI/CD) and post-launch support. Weekly report and demo per sprint." },
  ],
}

const DEFAULT_QUESTIONS = {
  es: ["¿Cuál es tu experiencia?", "¿Qué tecnologías dominas?", "Cuéntame de Tonsorium", "¿Estás disponible?"],
  en: ["What is your experience?", "What is your tech stack?", "Tell me about Tonsorium", "Are you available?"],
}

interface FloatingChatProps {
  lang: Lang
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Floating chat FAB + drawer lateral.
 * - Boton circular fijo en esquina inferior derecha (siempre visible),
 *   halo pulsando en foreground (paleta Muji, sin verde WhatsApp).
 * - Al click, drawer de max-w-md que entra desde la derecha con el chat
 *   completo (mensajes + quick questions + input).
 * - Estado `open` viene de fuera (page.tsx) para que la seccion AI pueda
 *   abrirlo desde su boton pitch.
 */
export function FloatingChat({ lang, open, onOpenChange }: FloatingChatProps) {
  const welcome =
    lang === "es"
      ? "Copiloto del portafolio. Puedes preguntar por experiencia, stack, proyectos, tarifas o disponibilidad."
      : "Portfolio copilot. Ask about experience, stack, projects, rates or availability."

  const [messages, setMessages] = useState<Message[]>([{ id: "1", role: "assistant", text: welcome }])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wasNearBottomRef = useRef(true)

  useLayoutEffect(() => {
    const el = messagesRef.current
    if (!el) {
      wasNearBottomRef.current = true
      return
    }
    const d = el.scrollHeight - el.scrollTop - el.clientHeight
    wasNearBottomRef.current = d < 120
  })

  useEffect(() => {
    if (!open) return
    const el = messagesRef.current
    if (!el) return
    if (!wasNearBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping, open])

  // ESC to close + prevent body scroll when open + focus input
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
    }
  }, [open, onOpenChange])

  // Sync welcome when lang changes (only if no user activity yet)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].role !== "assistant") return prev
      if (prev[0].text === welcome) return prev
      return [{ id: prev[0].id, role: "assistant", text: welcome }]
    })
  }, [lang, welcome])

  const findAnswer = (query: string) => {
    const normalized = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[¿¡?!.,;:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    const tokens = new Set(normalized.split(" ").filter(Boolean))
    const db = KNOWLEDGE_BASE[lang]
    let best: { score: number; answer: string } | null = null
    for (const entry of db) {
      let score = 0
      for (const kw of entry.keywords) {
        const kwNorm = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        if (kwNorm.includes(" ")) {
          if (normalized.includes(kwNorm)) score += 2
        } else if (tokens.has(kwNorm)) {
          score += 2
        } else if (kwNorm.length > 4 && new RegExp(`\\b${kwNorm}\\w*\\b`).test(normalized)) {
          score += 1
        }
      }
      if (score > 0 && (!best || score > best.score)) best = { score, answer: entry.answer }
    }
    if (best) return best.answer
    return lang === "es"
      ? "No tengo una respuesta directa para eso. Prueba con: experiencia, stack, proyectos, tarifas o disponibilidad."
      : "No direct answer for that. Try: experience, stack, projects, rates or availability."
  }

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault()
    const text = customText || input
    if (!text.trim()) return
    const trimmed = text.trim().slice(0, 2000)

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInput("")
    setIsTyping(true)

    const history = [...messages, userMsg]
      .slice(-9)
      .map((m) => ({ role: m.role, content: m.text }))

    const respond = (answer: string) => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: answer }])
      setIsTyping(false)
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 25000)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang, honeypot: "" }),
        signal: controller.signal,
        credentials: "same-origin",
      })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        respond(typeof data?.text === "string" && data.text.trim() ? data.text.trim() : findAnswer(trimmed))
        return
      }
      if (res.status === 429) {
        respond(
          lang === "es"
            ? "Demasiadas preguntas seguidas. Espera unos segundos e intenta de nuevo."
            : "Too many questions in a row. Wait a few seconds and try again.",
        )
        return
      }
      respond(findAnswer(trimmed))
    } catch {
      respond(findAnswer(trimmed))
    }
  }

  const canSend = input.trim().length > 0 && !isTyping

  return (
    <>
      {/* FAB — mismo tamano y estilo en movil y desktop */}
      <motion.button
        type="button"
        onClick={() => onOpenChange(!open)}
        initial={{ opacity: 0, scale: 0.6, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", damping: 18, stiffness: 220 }}
        aria-label={
          open
            ? lang === "es" ? "Cerrar chat" : "Close chat"
            : lang === "es" ? "Abrir chat" : "Open chat"
        }
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px) + 1rem)",
          right: "max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)",
        }}
        className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-black/5 transition-all hover:scale-[1.06] active:scale-95 sm:h-[60px] sm:w-[60px]"
      >
        {/* Halo pulsante — solo cerrado */}
        {!open && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-foreground/30"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex"
            >
              <X className="h-6 w-6" strokeWidth={1.75} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex"
            >
              <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span
              className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 0 2px var(--background)" }}
            />
          </span>
        )}
      </motion.button>

      {/* Drawer — misma animacion y tamano visual en movil y desktop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md"
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={lang === "es" ? "Chat con Steven AI" : "Chat with Steven AI"}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 240, mass: 0.9 }}
              style={{ height: "100dvh" }}
              className="fixed right-0 top-0 z-[90] flex w-full max-w-full flex-col border-l border-hairline bg-background shadow-[0_0_80px_rgba(0,0,0,0.6)] sm:max-w-[460px] lg:max-w-[500px] 2xl:max-w-[560px]"
            >
              {/* Accent gradient superior */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
              />

              {/* Fondo ambiental — snippets de codigo scrolleando */}
              <CodeLinesBackground />

              {/* Header — safe-area top para iOS notch */}
              <header
                style={{ paddingTop: "max(1rem, env(safe-area-inset-top, 0px) + 0.75rem)" }}
                className="relative z-10 flex items-center justify-between gap-3 border-b border-hairline bg-background/85 px-4 pb-4 backdrop-blur-sm sm:gap-4 sm:px-6 sm:pb-5"
              >
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="flex min-w-0 items-center gap-3 sm:gap-3.5"
                >
                  {/* Avatar S — mismo tamano exacto en movil y desktop */}
                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background ring-1 ring-black/10"
                    aria-hidden
                  >
                    <span className="font-serif text-[20px] font-semibold leading-none">S</span>
                    <span className="pointer-events-none absolute -right-0.5 -bottom-0.5 flex h-3 w-3">
                      <span className="pointer-events-none absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                      <span
                        className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"
                        style={{ boxShadow: "0 0 0 2px var(--background)" }}
                      />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[17px] leading-tight text-foreground sm:text-[18px]">
                      Steven AI
                    </p>
                    <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[9.5px] sm:tracking-[0.24em]">
                      {lang === "es" ? "Copiloto · En línea" : "Copilot · Online"}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onOpenChange(false)
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={lang === "es" ? "Cerrar" : "Close"}
                  style={{ pointerEvents: "auto" }}
                  className="relative z-[60] inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-hairline bg-background text-muted-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background active:scale-95"
                >
                  <X className="pointer-events-none h-5 w-5" strokeWidth={2} />
                </motion.button>
              </header>

              {/* Messages */}
              <div
                ref={messagesRef}
                className="relative z-10 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:space-y-6 sm:px-7 sm:py-6"
              >
                <AnimatePresence initial={false}>
                  {messages.map((m, idx) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1], delay: idx === 0 ? 0.25 : 0 }}
                      className={
                        m.role === "user"
                          ? "border-l-2 border-foreground/50 pl-4 sm:pl-5"
                          : "border-l border-hairline pl-4 sm:pl-5"
                      }
                    >
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                        {m.role === "user"
                          ? lang === "es" ? "Tú" : "You"
                          : "Steven AI"}
                      </p>
                      <p
                        className={
                          m.role === "user"
                            ? "whitespace-pre-wrap break-words text-[14.5px] leading-[1.65] text-foreground sm:text-[15px] sm:leading-[1.7]"
                            : "whitespace-pre-wrap break-words text-[14.5px] leading-[1.65] text-foreground/85 sm:text-[15px] sm:leading-[1.7]"
                        }
                      >
                        {m.text}
                      </p>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-l border-hairline pl-4 sm:pl-5"
                    >
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                        Steven AI
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 py-1"
                        aria-label={lang === "es" ? "Escribiendo" : "Typing"}
                      >
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60" />
                        <span
                          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick questions — scroll horizontal en movil, wrap en desktop */}
              <div className="relative z-10 border-t border-hairline bg-background/85 px-4 py-3.5 backdrop-blur-sm sm:px-6 sm:py-4">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                  {lang === "es" ? "Sugerencias" : "Suggestions"}
                </p>
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" style={{ scrollbarWidth: "none" }}>
                  {DEFAULT_QUESTIONS[lang].map((q, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
                      onClick={() => handleSubmit(undefined, q)}
                      className="shrink-0 whitespace-nowrap rounded-full border border-hairline px-3.5 py-2 text-[12px] text-muted-foreground transition-all hover:-translate-y-px hover:border-foreground hover:bg-foreground hover:text-background active:scale-95 sm:py-1.5"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Form — touch target 56px+ en movil, safe area para iOS */}
              <form
                onSubmit={handleSubmit}
                style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
                className="relative z-10 flex items-stretch border-t border-hairline bg-background"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={lang === "es" ? "Escribe tu pregunta…" : "Type your question…"}
                  maxLength={2000}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="min-h-[56px] flex-1 bg-transparent px-4 text-[16px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:min-h-[60px] sm:px-6 sm:text-[15px]"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  aria-label={lang === "es" ? "Enviar" : "Send"}
                  className={
                    canSend
                      ? "flex min-w-[56px] items-center justify-center border-l border-hairline bg-foreground text-background transition-all hover:opacity-90 active:scale-95 sm:min-w-[64px]"
                      : "flex min-w-[56px] cursor-not-allowed items-center justify-center border-l border-hairline text-muted-foreground/40 sm:min-w-[64px]"
                  }
                >
                  <Send className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </form>

              {/* Footer hint — solo desktop */}
              <div className="relative z-10 hidden border-t border-hairline bg-background px-6 py-2.5 sm:block">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {lang === "es" ? "ESC para cerrar · Enter para enviar" : "ESC to close · Enter to send"}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
