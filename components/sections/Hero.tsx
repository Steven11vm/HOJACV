"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion"
import { ArrowDown, Download, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react"
import { type Lang, translations } from "@/lib/translations"

import formalImage from "@/imagenes/image.png"

const ROLES: Record<Lang, string[]> = {
  es: [
    "Full Stack Engineer",
    "AI Integration Specialist",
    "Product-minded Developer",
    "Problem Solver",
  ],
  en: [
    "Full Stack Engineer",
    "AI Integration Specialist",
    "Product-minded Developer",
    "Problem Solver",
  ],
}

const TECH_MARQUEE = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "Framer Motion",
  "Gemini AI",
  "OpenAI",
  "MySQL",
  "MongoDB",
  "REST API",
  "GraphQL",
  "Vercel",
  "Docker",
  "Git",
  "Figma",
  "Android",
]

function useTypewriter(words: string[], typingSpeed = 80, pause = 2000) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return

    if (!deleting && subIndex === words[index].length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const t = setTimeout(
      () => setSubIndex((s) => s + (deleting ? -1 : 1)),
      deleting ? typingSpeed / 2 : typingSpeed,
    )
    return () => clearTimeout(t)
  }, [subIndex, deleting, index, words, typingSpeed, pause])

  return words[index]?.substring(0, subIndex) ?? ""
}

function Counter({ from = 0, to, suffix = "", duration = 1.6 }: { from?: number; to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let started = false
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          const start = performance.now()
          const step = (now: number) => {
            const t = Math.min((now - start) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(from + (to - from) * eased))
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [from, to, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const typed = useTypewriter(ROLES[lang], 70, 1800)

  // Magnetic photo follows mouse subtly
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-50, 50], [6, -6]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [-50, 50], [-6, 6]), { stiffness: 150, damping: 15 })

  const stats = [
    { label: t.stats.years, value: 2, suffix: "+" },
    { label: t.stats.projects, value: 20, suffix: "+" },
    { label: t.stats.tech, value: 17, suffix: "+" },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 16 } },
  }

  return (
    <section id="hero" className="relative isolate flex min-h-[100dvh] items-center overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-neon-violet/20 blur-[140px] animate-aurora" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-neon-blue/20 blur-[120px] animate-aurora" style={{ animationDelay: "-7s" }} />
        <div className="absolute bottom-0 left-0 h-[400px] w-[500px] rounded-full bg-neon-cyan/15 blur-[140px] animate-aurora" style={{ animationDelay: "-14s" }} />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial opacity-50" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* LEFT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="mb-8 inline-flex">
            <div className="section-label">
              <span className="hidden sm:inline">{t.hero.status}</span>
              <span className="sm:hidden">{lang === "es" ? "Disponible" : "Available"}</span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="mb-4 font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            <span className="block text-foreground">Steven</span>
            <span className="block text-gradient">Villamizar.</span>
          </motion.h1>

          {/* Typewriter role */}
          <motion.div variants={itemVariants} className="mb-6 flex h-7 items-center text-base font-mono text-muted-foreground sm:text-lg">
            <span className="mr-2 text-primary">&gt;</span>
            <span className="text-foreground/90">{typed}</span>
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] bg-primary animate-blink" />
          </motion.div>

          {/* Intro */}
          <motion.p
            variants={itemVariants}
            className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t.hero.intro}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="mb-12 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-foreground px-7 text-sm font-semibold uppercase tracking-wider text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t.hero.hireNow}
              </span>
              <span className="shimmer absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            <a
              href="/CV/Hoja de vida.pdf"
              download="Steven_Villamizar_CV.pdf"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              {t.hero.downloadCV}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8 sm:gap-8"
          >
            {stats.map(({ label, value, suffix }, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                  <Counter to={value} suffix={suffix} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Social row */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang === "es" ? "Encuéntrame en" : "Find me"} —
            </span>
            {[
              { href: "https://github.com/Steven11vm", label: "GitHub", icon: Github },
              { href: "https://www.linkedin.com/in/steven-villamizar-166b98388/", label: "LinkedIn", icon: Linkedin },
              { href: "mailto:Stevenvilla10@gmail.com", label: "Email", icon: Mail },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:border-white/20 hover:bg-white/10 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Photo card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
          className="order-1 flex justify-center lg:order-2"
        >
          <motion.div
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              mx.set(e.clientX - rect.left - rect.width / 2)
              my.set(e.clientY - rect.top - rect.height / 2)
            }}
            onMouseLeave={() => {
              mx.set(0)
              my.set(0)
            }}
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-[360px] sm:max-w-[420px]"
          >
            {/* Glow halo */}
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-neon-violet/30 via-neon-blue/30 to-neon-cyan/30 opacity-60 blur-2xl" />

            {/* Frame */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md">
              <Image
                src={formalImage}
                alt="Steven Villamizar"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 360px, 420px"
                priority
                quality={100}
              />
              {/* Top status pill */}
              <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="status-dot" />
                <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-white">
                  {t.contact.available}
                </span>
              </div>

              {/* Bottom info overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-end justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                      {t.hero.currentlyAt}
                    </p>
                    <p className="font-serif text-sm font-medium text-white">ORAL-PLUS · SKY S.A.S</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                      <MapPin className="mr-0.5 inline h-3 w-3" /> {lang === "es" ? "Base" : "Based"}
                    </p>
                    <p className="font-mono text-xs text-white">Medellín · CO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-1/4 hidden rounded-xl border border-white/10 bg-card/80 px-3 py-2 shadow-2xl backdrop-blur-md sm:flex"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neon-violet/20 text-neon-violet">
                  <Sparkles className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">AI-Powered</p>
                  <p className="text-[11px] font-semibold text-foreground">Gemini · OpenAI</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-1/3 hidden rounded-xl border border-white/10 bg-card/80 px-3 py-2 shadow-2xl backdrop-blur-md sm:flex"
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Response</p>
                <p className="text-[11px] font-semibold text-foreground">&lt; 24h</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tech marquee bottom */}
      <div className="absolute inset-x-0 bottom-0 -z-10 overflow-hidden border-t border-white/5 bg-background/40 py-4 backdrop-blur-sm mask-fade-x">
        <div className="flex w-max gap-12 animate-marquee">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60"
            >
              {tech} <span className="ml-12 text-primary/40">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">{t.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  )
}
