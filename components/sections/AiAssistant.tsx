"use client"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, Bot, User, Trash2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Message = { id: string; role: "user" | "assistant"; text: string }

const KNOWLEDGE_BASE = {
  es: [
    {
      keywords: ["experiencia", "trabajo", "rol", "carrera"],
      answer:
        "Steven tiene 2+ años construyendo software profesional. Actualmente lidera el stack de ORAL-PLUS (SKY S.A.S) — migró el sistema legacy a Next.js + Node, integró agentes IA y maneja la pasarela de pagos.",
    },
    {
      keywords: ["habilidades", "stack", "tecnologias", "techs"],
      answer:
        "Stack principal: React, Next.js, Node.js, TypeScript, Python, MySQL y MongoDB. Especializado en integraciones con Gemini API y OpenAI para llevar IA a producto real.",
    },
    {
      keywords: ["contacto", "llamar", "email", "correo", "whatsapp"],
      answer:
        "Email: Stevenvilla10@gmail.com · Tel: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Responde en menos de 24 horas.",
    },
    {
      keywords: ["hola", "saludos", "buenas"],
      answer:
        "¡Hola! Soy el copiloto IA de Steven. Pregúntame por su experiencia, proyectos, stack o tarifas. ¿Por dónde empezamos?",
    },
    {
      keywords: ["ai", "ia", "inteligencia artificial", "gemini", "openai"],
      answer:
        "Steven ha integrado IA generativa en producción: chatbots con Gemini, automatizaciones de soporte que cubren 40% de tickets, y agentes con RAG. La IA no es un demo — es una palanca de negocio.",
    },
    {
      keywords: ["proyecto", "proyectos", "portafolio"],
      answer:
        "20+ proyectos en producción. Destacados: Beat Generator AI (música con IA), Finanzas Pro (control financiero), Inventory SaaS, Enterprise Dashboard, ORAL-PLUS (web + app + pagos).",
    },
    {
      keywords: ["precio", "tarifa", "costo", "presupuesto"],
      answer:
        "Trabaja por proyecto (fixed-price) o por sprint mensual. La llamada inicial de 30 min es gratuita para evaluar fit técnico y entregar una propuesta clara con alcance, tiempo y precio.",
    },
    {
      keywords: ["remoto", "ubicacion", "donde", "viaje", "relocacion"],
      answer:
        "Base en Medellín, Colombia. Trabaja remoto, híbrido o presencial según el proyecto. Abierto a relocación internacional para roles full-time.",
    },
    {
      keywords: ["disponible", "disponibilidad", "contratar"],
      answer:
        "Sí, disponible para nuevos proyectos. Capacidad para arrancar en menos de 1 semana. Escríbele a Stevenvilla10@gmail.com con el contexto del proyecto.",
    },
  ],
  en: [
    {
      keywords: ["experience", "work", "role", "career"],
      answer:
        "Steven has 2+ years building professional software. Currently leading the stack at ORAL-PLUS (SKY S.A.S) — migrated legacy systems to Next.js + Node, integrated AI agents and built the payment gateway.",
    },
    {
      keywords: ["skills", "stack", "technologies", "techs"],
      answer:
        "Main stack: React, Next.js, Node.js, TypeScript, Python, MySQL and MongoDB. Specialized in Gemini API and OpenAI integrations to ship AI into real product.",
    },
    {
      keywords: ["contact", "call", "email", "whatsapp"],
      answer:
        "Email: Stevenvilla10@gmail.com · Phone: +57 304 646 7135 · LinkedIn: linkedin.com/in/steven-villamizar-166b98388. Replies under 24 hours.",
    },
    {
      keywords: ["hello", "hi", "greetings"],
      answer:
        "Hi! I'm Steven's AI copilot. Ask me about his experience, projects, stack or rates. Where do we start?",
    },
    {
      keywords: ["ai", "artificial intelligence", "gemini", "openai"],
      answer:
        "Steven has shipped generative AI to production: Gemini chatbots, support automations covering 40% of tickets, and agents with RAG. AI isn't a demo — it's a business lever.",
    },
    {
      keywords: ["project", "projects", "portfolio"],
      answer:
        "20+ projects in production. Highlights: Beat Generator AI (music with AI), Finanzas Pro (personal finance), Inventory SaaS, Enterprise Dashboard, ORAL-PLUS (web + app + payments).",
    },
    {
      keywords: ["price", "rate", "cost", "budget"],
      answer:
        "Works per-project (fixed price) or by monthly sprint. The first 30 min call is free to evaluate technical fit and deliver a clear proposal with scope, timeline and price.",
    },
    {
      keywords: ["remote", "location", "where", "relocation"],
      answer:
        "Based in Medellín, Colombia. Works remote, hybrid or onsite depending on the project. Open to international relocation for full-time roles.",
    },
    {
      keywords: ["available", "availability", "hire"],
      answer:
        "Yes, available for new projects. Can kick off in less than 1 week. Email Stevenvilla10@gmail.com with project context.",
    },
  ],
}

const DEFAULT_QUESTIONS = {
  es: ["¿Cuál es tu experiencia?", "¿Qué tecnologías dominas?", "Cuéntame de tus proyectos con IA", "¿Estás disponible?"],
  en: ["What is your experience?", "What is your tech stack?", "Tell me about your AI projects", "Are you available?"],
}

export function AiAssistant({ lang }: { lang: "es" | "en" }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text:
        lang === "es"
          ? "👋 Soy el copiloto IA del portafolio de Steven. Puedo contarte sobre su experiencia, stack, proyectos, tarifas y disponibilidad. ¿Qué quieres saber?"
          : "👋 I'm Steven's portfolio AI copilot. I can tell you about his experience, stack, projects, rates and availability. What do you want to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const wasNearBottomRef = useRef(true)
  const pageScrollYRef = useRef<number | null>(null)

  // Track whether the user is "stuck at bottom" BEFORE the DOM updates.
  // If they scrolled up to read history, we must not yank them back down.
  useLayoutEffect(() => {
    const el = messagesContainerRef.current
    if (!el) {
      wasNearBottomRef.current = true
      return
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    wasNearBottomRef.current = distanceFromBottom < 120
  })

  // After paint, scroll the CHAT container (never the window) and restore
  // any page scroll the browser may have nudged during the state update.
  useEffect(() => {
    if (messages.length <= 1 && !isTyping) return
    const el = messagesContainerRef.current
    const savedPageY = pageScrollYRef.current

    // Restore window scroll if it shifted (defensive against focus-triggered nudges).
    if (savedPageY != null && Math.abs(window.scrollY - savedPageY) > 2) {
      // `instant` avoids the global `html { scroll-behavior: smooth }`.
      window.scrollTo({ top: savedPageY, left: 0, behavior: "instant" as ScrollBehavior })
    }
    pageScrollYRef.current = null

    if (!el) return
    if (!wasNearBottomRef.current) return
    // Direct scrollTop write — lowest-level scroll, cannot bubble, no animation.
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  // Keep the welcome message in sync with the active language.
  // Only swap when the chat has no user activity yet — never overwrite a real conversation.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].role !== "assistant") return prev
      const welcome =
        lang === "es"
          ? "👋 Soy el copiloto IA del portafolio de Steven. Puedo contarte sobre su experiencia, stack, proyectos, tarifas y disponibilidad. ¿Qué quieres saber?"
          : "👋 I'm Steven's portfolio AI copilot. I can tell you about his experience, stack, projects, rates and availability. What do you want to know?"
      if (prev[0].text === welcome) return prev
      return [{ id: prev[0].id, role: "assistant", text: welcome }]
    })
  }, [lang])

  const findAnswer = (query: string) => {
    const normalized = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[¿¡?!.,;:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    const tokens = new Set(normalized.split(" ").filter(Boolean))
    const has = (...words: string[]) => words.some((w) => tokens.has(w))

    // 1) Smart intents (date / time / weather / identity / thanks / off-topic)
    const now = new Date()
    const dateFmt = new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now)
    const timeFmt = new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now)

    if (has("dia", "fecha", "hoy", "date", "today", "day")) {
      return lang === "es"
        ? `Hoy es ${dateFmt}. Por cierto, si estás explorando el portafolio te puedo contar de la experiencia, stack o proyectos de Steven.`
        : `Today is ${dateFmt}. By the way, if you're exploring the portfolio I can tell you about Steven's experience, stack or projects.`
    }
    if (has("hora", "time", "clock")) {
      return lang === "es"
        ? `Son las ${timeFmt} (hora Colombia). ¿Quieres saber algo de Steven mientras tanto?`
        : `It's ${timeFmt} (Colombia time). Anything you'd like to know about Steven in the meantime?`
    }
    if (has("clima", "tiempo", "lluvia", "weather", "rain")) {
      return lang === "es"
        ? "No tengo acceso al clima en tiempo real 🌤️ — pero sí puedo contarte de los proyectos, stack y experiencia de Steven."
        : "I don't have real-time weather access 🌤️ — but I can tell you about Steven's projects, stack and experience."
    }
    if (
      /\b(quien eres|quien es esto|tu nombre|como te llamas|who are you|who is this|your name|what.s your name)\b/.test(
        normalized,
      )
    ) {
      return lang === "es"
        ? "Soy el copiloto IA del portafolio de Steven. Estoy aquí para responder lo que quieras saber sobre su experiencia, stack, proyectos o disponibilidad."
        : "I'm Steven's portfolio AI copilot. I'm here to answer anything about his experience, stack, projects or availability."
    }
    if (
      /\b(como estas|como te va|que tal|how are you|how.s it going)\b/.test(normalized)
    ) {
      return lang === "es"
        ? "¡Todo bien por aquí! 🚀 Listo para responderte sobre experiencia, stack, proyectos o tarifas de Steven."
        : "All good here! 🚀 Ready to tell you about Steven's experience, stack, projects or rates."
    }
    if (has("gracias", "thanks", "thank")) {
      return lang === "es"
        ? "¡Con gusto! Si quieres avanzar, puedes escribirle directo a Stevenvilla10@gmail.com — responde en menos de 24h."
        : "You're welcome! If you'd like to move forward, you can email Stevenvilla10@gmail.com — replies in under 24h."
    }
    if (has("edad", "anos", "age", "old")) {
      return lang === "es"
        ? "Steven prefiere que el trabajo hable por él — tiene 2+ años de experiencia profesional y 20+ proyectos en producción. ¿Quieres ver alguno?"
        : "Steven prefers letting the work speak — 2+ years of professional experience and 20+ projects in production. Want to see one?"
    }

    // 2) Scored keyword match against knowledge base (word-boundary, not substring)
    const db = KNOWLEDGE_BASE[lang]
    let best: { score: number; answer: string } | null = null
    for (const entry of db) {
      let score = 0
      for (const kw of entry.keywords) {
        const kwNorm = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        // Multi-word keywords: match as phrase. Single-word: match whole word.
        if (kwNorm.includes(" ")) {
          if (normalized.includes(kwNorm)) score += 2
        } else if (tokens.has(kwNorm)) {
          score += 2
        } else if (kwNorm.length > 4 && new RegExp(`\\b${kwNorm}\\w*\\b`).test(normalized)) {
          // Allow stems for longer keywords (proyecto → proyectos)
          score += 1
        }
      }
      if (score > 0 && (!best || score > best.score)) best = { score, answer: entry.answer }
    }
    if (best) return best.answer

    // 3) Friendly fallback that nudges back on-topic
    return lang === "es"
      ? "No tengo una respuesta directa para eso 🤔. Puedo contarte de la experiencia de Steven, su stack, proyectos, tarifas o disponibilidad. ¿O prefieres escribirle directo a Stevenvilla10@gmail.com?"
      : "I don't have a direct answer for that 🤔. I can tell you about Steven's experience, stack, projects, rates or availability. Or you can email him directly at Stevenvilla10@gmail.com."
  }

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault()
    const text = customText || input
    if (!text.trim()) return
    const trimmed = text.trim().slice(0, 2000)

    // Snapshot the page scroll position so we can restore it
    // if any focus/layout change nudges the window during the update.
    pageScrollYRef.current = window.scrollY

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInput("")
    setIsTyping(true)

    // Build conversation context: take last 8 messages + new user msg
    const history = [...messages, userMsg]
      .slice(-9)
      .map((m) => ({ role: m.role, content: m.text }))

    const respond = (answer: string) => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: answer,
      }
      // Snapshot again — by the time the response arrives the user may have
      // scrolled the page somewhere else; we restore THAT position, not the old one.
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
        const answer =
          typeof data?.text === "string" && data.text.trim().length > 0
            ? data.text.trim()
            : findAnswer(trimmed)
        respond(answer)
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

      // Any other error → graceful fallback to local matcher
      respond(findAnswer(trimmed))
    } catch {
      respond(findAnswer(trimmed))
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        text: lang === "es" ? "Chat reiniciado. ¿En qué te ayudo?" : "Chat cleared. How can I help?",
      },
    ])
  }

  return (
    <section id="ai" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 bg-[conic-gradient(from_0deg,transparent,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_30%)] opacity-50"
        />
      </div>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">
            <Wand2 className="h-3 w-3" />
            {lang === "es" ? "IA en acción" : "AI in action"}
          </div>
          <h2 className="mb-4 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {lang === "es" ? "Habla con mi copiloto IA" : "Talk to my AI Copilot"}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {lang === "es"
              ? "Una demo viva de cómo integro IA en producto. Pregúntale lo que quieras sobre mí, mi stack o cómo trabajo."
              : "A live demo of how I ship AI in product. Ask anything about me, my stack or how I work."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong relative mx-auto max-w-2xl overflow-hidden rounded-3xl shadow-2xl shadow-primary/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue text-primary-foreground shadow-lg shadow-primary/30">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-neon-green animate-pulse-ring" />
              </div>
              <div>
                <h3 className="font-serif text-base font-medium text-foreground">Steven AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="status-dot h-1.5 w-1.5" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {lang === "es" ? "En línea" : "Online"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 text-muted-foreground hover:bg-white/5 hover:text-destructive"
              title={lang === "es" ? "Limpiar" : "Clear"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat flow */}
          <div
            ref={messagesContainerRef}
            className="h-[400px] overflow-y-auto overscroll-contain p-6 space-y-4"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm ${
                        msg.role === "user"
                          ? "bg-white/10 text-foreground ring-1 ring-white/10"
                          : "bg-gradient-to-br from-neon-violet to-neon-blue text-primary-foreground"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "rounded-br-md bg-foreground text-background"
                          : "rounded-bl-md border border-white/10 bg-white/[0.04] text-foreground backdrop-blur-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full justify-start">
                  <div className="flex items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue text-primary-foreground">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="flex flex-wrap gap-2 border-t border-white/5 bg-white/[0.02] px-6 py-3">
            {DEFAULT_QUESTIONS[lang].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(undefined, q)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center border-t border-white/5 bg-white/[0.02] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "es" ? "Escribe tu pregunta…" : "Type your question…"}
              className="w-full rounded-full border border-white/10 bg-background/60 py-3 pl-4 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="absolute right-4 h-9 w-9 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </motion.div>

        <p className="mx-auto mt-6 max-w-md text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Sparkles className="mr-1 inline h-3 w-3" />
          {lang === "es"
            ? "IA personal entrenada con la info de Steven · Respuestas en tiempo real"
            : "Personal AI trained on Steven's info · Real-time answers"}
        </p>
      </div>
    </section>
  )
}
