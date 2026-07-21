"use client"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang } from "@/lib/translations"

type Message = { id: string; role: "user" | "assistant"; text: string }

const KNOWLEDGE_BASE = {
  es: [
    { keywords: ["experiencia", "trabajo", "rol", "carrera"], answer: "Steven tiene 2+ años construyendo software profesional. Actualmente lidera el stack de ORAL-PLUS (SKY S.A.S) — migró el sistema legacy a Next.js + Node, integró agentes IA y maneja la pasarela de pagos." },
    { keywords: ["habilidades", "stack", "tecnologias", "techs"], answer: "Stack principal: React, Next.js, Node.js, TypeScript, Python, MySQL, SQL Server. Especializado en integraciones con Gemini API, Claude y OpenAI para llevar IA a producto real." },
    { keywords: ["contacto", "llamar", "email", "correo", "whatsapp"], answer: "Email: Stevenvilla10@gmail.com · Tel: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Responde en menos de 24 horas." },
    { keywords: ["hola", "saludos", "buenas"], answer: "Hola. Soy el copiloto del portafolio. Pregunta por experiencia, stack, proyectos o tarifas." },
    { keywords: ["ai", "ia", "inteligencia artificial", "gemini", "openai", "claude"], answer: "Steven ha integrado IA generativa en producción: chatbots con Gemini/Claude, automatizaciones de soporte que cubren 40% de tickets, y agentes con RAG." },
    { keywords: ["proyecto", "proyectos", "portafolio"], answer: "Trabajos recientes: Tonsorium (barbería premium, React + PHP + SQL Server), Beat Generator AI, Finanzas Pro, Inventory SaaS, Enterprise Dashboard, ORAL-PLUS." },
    { keywords: ["precio", "tarifa", "costo", "presupuesto"], answer: "Trabaja por proyecto (fixed-price) o por sprint mensual. La llamada inicial de 30 min es gratuita." },
    { keywords: ["remoto", "ubicacion", "donde", "viaje", "relocacion"], answer: "Base en Medellín, Colombia. Trabaja remoto, híbrido o presencial. Abierto a relocación para roles full-time." },
    { keywords: ["disponible", "disponibilidad", "contratar"], answer: "Sí, disponible. Puede arrancar en menos de una semana. Escríbele a Stevenvilla10@gmail.com." },
  ],
  en: [
    { keywords: ["experience", "work", "role", "career"], answer: "Steven has 2+ years building professional software. Currently leading the stack at ORAL-PLUS (SKY S.A.S) — migrated legacy systems to Next.js + Node, integrated AI agents and built the payment gateway." },
    { keywords: ["skills", "stack", "technologies", "techs"], answer: "Main stack: React, Next.js, Node.js, TypeScript, Python, MySQL, SQL Server. Specialized in Gemini API, Claude and OpenAI integrations." },
    { keywords: ["contact", "call", "email", "whatsapp"], answer: "Email: Stevenvilla10@gmail.com · Phone: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Replies under 24 hours." },
    { keywords: ["hello", "hi", "greetings"], answer: "Hi. I'm the portfolio copilot. Ask about experience, stack, projects or rates." },
    { keywords: ["ai", "artificial intelligence", "gemini", "openai", "claude"], answer: "Steven has shipped generative AI to production: Gemini/Claude chatbots, support automations covering 40% of tickets, and RAG agents." },
    { keywords: ["project", "projects", "portfolio"], answer: "Recent work: Tonsorium (premium barbershop, React + PHP + SQL Server), Beat Generator AI, Finanzas Pro, Inventory SaaS, Enterprise Dashboard, ORAL-PLUS." },
    { keywords: ["price", "rate", "cost", "budget"], answer: "Works per-project (fixed price) or by monthly sprint. First 30-min call is free." },
    { keywords: ["remote", "location", "where", "relocation"], answer: "Based in Medellín, Colombia. Works remote, hybrid or onsite. Open to relocation for full-time roles." },
    { keywords: ["available", "availability", "hire"], answer: "Yes, available. Can start in under a week. Email Stevenvilla10@gmail.com." },
  ],
}

const DEFAULT_QUESTIONS = {
  es: ["¿Cuál es tu experiencia?", "¿Qué tecnologías dominas?", "Cuéntame de Tonsorium", "¿Estás disponible?"],
  en: ["What is your experience?", "What is your tech stack?", "Tell me about Tonsorium", "Are you available?"],
}

export function AiAssistant({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: lang === "es"
        ? "Copiloto del portafolio. Puedes preguntar por experiencia, stack, proyectos, tarifas o disponibilidad."
        : "Portfolio copilot. Ask about experience, stack, projects, rates or availability.",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const wasNearBottomRef = useRef(true)
  const pageScrollYRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const el = messagesContainerRef.current
    if (!el) {
      wasNearBottomRef.current = true
      return
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    wasNearBottomRef.current = distanceFromBottom < 120
  })

  useEffect(() => {
    if (messages.length <= 1 && !isTyping) return
    const el = messagesContainerRef.current
    const savedPageY = pageScrollYRef.current
    if (savedPageY != null && Math.abs(window.scrollY - savedPageY) > 2) {
      window.scrollTo({ top: savedPageY, left: 0, behavior: "instant" as ScrollBehavior })
    }
    pageScrollYRef.current = null
    if (!el) return
    if (!wasNearBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].role !== "assistant") return prev
      const welcome = lang === "es"
        ? "Copiloto del portafolio. Puedes preguntar por experiencia, stack, proyectos, tarifas o disponibilidad."
        : "Portfolio copilot. Ask about experience, stack, projects, rates or availability."
      if (prev[0].text === welcome) return prev
      return [{ id: prev[0].id, role: "assistant", text: welcome }]
    })
  }, [lang])

  const findAnswer = (query: string) => {
    const normalized = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿¡?!.,;:]/g, " ").replace(/\s+/g, " ").trim()
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

    pageScrollYRef.current = window.scrollY

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInput("")
    setIsTyping(true)

    const history = [...messages, userMsg].slice(-9).map((m) => ({ role: m.role, content: m.text }))

    const respond = (answer: string) => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: answer }
      pageScrollYRef.current = window.scrollY
      setMessages((prev) => [...prev, aiMsg])
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
        const answer = typeof data?.text === "string" && data.text.trim().length > 0 ? data.text.trim() : findAnswer(trimmed)
        respond(answer)
        return
      }
      if (res.status === 429) {
        respond(lang === "es" ? "Demasiadas preguntas seguidas. Espera unos segundos e intenta de nuevo." : "Too many questions in a row. Wait a few seconds and try again.")
        return
      }
      respond(findAnswer(trimmed))
    } catch {
      respond(findAnswer(trimmed))
    }
  }

  return (
    <section id="ai" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "08 · IA" : "08 · AI"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {lang === "es" ? "Habla con el copiloto." : "Talk to the copilot."}
          </motion.h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {lang === "es"
              ? "Una demo viva de cómo integro IA en producto. Pregúntale lo que quieras."
              : "A live demo of how I ship AI in product. Ask anything."}
          </p>

          <div className="mt-16 max-w-2xl border border-hairline">
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
                Steven AI
              </p>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden />
                {lang === "es" ? "En línea" : "Online"}
              </p>
            </div>

            <div
              ref={messagesContainerRef}
              className="h-[400px] space-y-5 overflow-y-auto overscroll-contain p-6"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {msg.role === "user"
                        ? lang === "es" ? "Tú" : "You"
                        : "Steven AI"}
                    </p>
                    <p className="text-[15px] leading-[1.75] text-foreground/85">
                      {msg.text}
                    </p>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Steven AI
                    </p>
                    <p className="text-[15px] text-muted-foreground">
                      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-foreground" />
                      <span className="mx-1 inline-block h-1 w-1 animate-pulse rounded-full bg-foreground" style={{ animationDelay: "0.2s" }} />
                      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-foreground" style={{ animationDelay: "0.4s" }} />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline px-6 py-4">
              {DEFAULT_QUESTIONS[lang].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(undefined, q)}
                  className="link-r text-xs text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center border-t border-hairline"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "es" ? "Escribe tu pregunta…" : "Type your question…"}
                className="flex-1 bg-transparent px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="border-l border-hairline px-6 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {lang === "es" ? "Enviar" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
