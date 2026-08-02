"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { type Lang } from "@/lib/translations"

type Message = { id: string; role: "user" | "assistant"; text: string }

const KNOWLEDGE_BASE = {
  es: [
    { keywords: ["experiencia", "trabajo", "rol", "carrera"], answer: "Steven tiene 2+ años construyendo software profesional. Actualmente lidera el stack de ORAL-PLUS (SKY S.A.S) — migró el sistema legacy a Next.js + Node, integró agentes IA y maneja la pasarela de pagos." },
    { keywords: ["habilidades", "stack", "tecnologias", "techs"], answer: "Stack principal: React, Next.js, Node.js, TypeScript, Python, MySQL, SQL Server. Especializado en integraciones con Gemini API, Claude y OpenAI." },
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

  return (
    <>
      {/* FAB — siempre visible */}
      <motion.button
        type="button"
        onClick={() => onOpenChange(!open)}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label={
          open
            ? lang === "es" ? "Cerrar chat" : "Close chat"
            : lang === "es" ? "Abrir chat" : "Open chat"
        }
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl shadow-black/40 transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8"
      >
        {/* Halo pulsante */}
        {!open && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-foreground/40"
          />
        )}
        {/* Icono cambia segun estado */}
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

        {/* Punto de status online — no aparece cuando esta abierto */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/70" />
            <span
              className="relative inline-flex h-3 w-3 rounded-full bg-foreground"
              style={{ boxShadow: "0 0 0 2px var(--background)" }}
            />
          </span>
        )}
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm"
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={lang === "es" ? "Chat con Steven AI" : "Chat with Steven AI"}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l border-hairline bg-background shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
                    Steven AI
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-foreground"
                      aria-hidden
                    />
                    {lang === "es" ? "En línea" : "Online"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label={lang === "es" ? "Cerrar" : "Close"}
                  className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={messagesRef}
                className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-6"
              >
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {m.role === "user"
                          ? lang === "es" ? "Tú" : "You"
                          : "Steven AI"}
                      </p>
                      <p className="text-[15px] leading-[1.75] text-foreground/85">{m.text}</p>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        Steven AI
                      </p>
                      <p className="text-[15px] text-muted-foreground">
                        <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-foreground" />
                        <span
                          className="mx-1 inline-block h-1 w-1 animate-pulse rounded-full bg-foreground"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="inline-block h-1 w-1 animate-pulse rounded-full bg-foreground"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick questions */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline px-6 py-4">
                {DEFAULT_QUESTIONS[lang].map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSubmit(undefined, q)}
                    className="link-r text-xs text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex items-center border-t border-hairline">
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
                  aria-label={lang === "es" ? "Enviar" : "Send"}
                  className="border-l border-hairline px-5 py-4 text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
