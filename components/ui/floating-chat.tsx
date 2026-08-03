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
      <div className="grid h-full grid-cols-3 gap-0">
        {CODE_COLUMNS.map((col, i) => (
          <div key={i} className="relative h-full overflow-hidden">
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-black/5 transition-all hover:scale-[1.06] active:scale-95"
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
              className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md"
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
              className="fixed right-0 top-0 z-40 flex h-full w-full max-w-full flex-col border-l border-hairline bg-background shadow-[0_0_80px_rgba(0,0,0,0.6)] sm:max-w-[460px]"
            >
              {/* Accent gradient superior */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
              />

              {/* Fondo ambiental — snippets de codigo scrolleando */}
              <CodeLinesBackground />

              {/* Header — mismo layout y tamanos en todas las pantallas */}
              <header className="relative z-10 flex items-center justify-between gap-4 border-b border-hairline bg-background/85 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-5">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="flex min-w-0 items-center gap-3.5"
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
                    <p className="truncate font-serif text-[18px] leading-tight text-foreground">
                      Steven AI
                    </p>
                    <p className="mt-1 truncate font-mono text-[9.5px] uppercase tracking-[0.24em] text-muted-foreground">
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
                className="relative z-10 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7"
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
                          ? "border-l-2 border-foreground/50 pl-5"
                          : "border-l border-hairline pl-5"
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
                            ? "whitespace-pre-wrap text-[15px] leading-[1.7] text-foreground"
                            : "whitespace-pre-wrap text-[15px] leading-[1.7] text-foreground/85"
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
                      className="border-l border-hairline pl-5"
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

              {/* Quick questions */}
              <div className="relative z-10 border-t border-hairline bg-background/85 backdrop-blur-sm px-5 py-4 sm:px-6">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                  {lang === "es" ? "Sugerencias" : "Suggestions"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_QUESTIONS[lang].map((q, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
                      onClick={() => handleSubmit(undefined, q)}
                      className="rounded-full border border-hairline px-3.5 py-1.5 text-[12px] text-muted-foreground transition-all hover:-translate-y-px hover:border-foreground hover:bg-foreground hover:text-background active:scale-95"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Form — 56px touch en movil */}
              <form onSubmit={handleSubmit} className="relative z-10 flex items-stretch border-t border-hairline bg-background">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={lang === "es" ? "Escribe tu pregunta…" : "Type your question…"}
                  maxLength={2000}
                  autoComplete="off"
                  className="flex-1 bg-transparent px-5 py-5 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:px-6"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  aria-label={lang === "es" ? "Enviar" : "Send"}
                  className={
                    canSend
                      ? "flex items-center justify-center border-l border-hairline bg-foreground px-6 text-background transition-all hover:opacity-90 active:scale-95"
                      : "flex cursor-not-allowed items-center justify-center border-l border-hairline px-6 text-muted-foreground/40"
                  }
                >
                  <Send className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </form>

              {/* Footer hint — solo desktop (movil no tiene teclado fisico) */}
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
