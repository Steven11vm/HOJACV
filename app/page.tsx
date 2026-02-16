/**
 * Hoja de vida digital - Portafolio profesional
 * @author STEVEN VILLAMIZAR MENDOZA
 */
"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

// Fotos: formal primero, luego rotación con compañero de código (autor: STEVEN VILLAMIZAR MENDOZA)
import formalImage from "../imagenes/image.png"
import gatoImage from "../imagenes/gato.jpg"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Code,
  Briefcase,
  GraduationCap,
  User,
  Rocket,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Brain,
  Layers,
  Database,
  Smartphone,
  Server,
  Terminal,
  ChevronRight,
  Star,
  CheckCircle2,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
export default function CVPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isDark, setIsDark] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visibleExpIndexes, setVisibleExpIndexes] = useState<Set<number>>(new Set())
  const [projectsInView, setProjectsInView] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const experienceCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const projectsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    setIsDark(document.documentElement.classList.contains("dark"))
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
    setMobileMenuOpen(false)
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const FloatingCode = () => {
    const codeSnippets = [
      "const developer = new Developer('Steven');",
      "developer.skills = ['Full Stack', 'AI', 'Innovation'];",
      "async function buildFuture() { return innovation; }",
      "class Solution { solve(problem) { return success; } }",
      "import { creativity, expertise } from '@steven';",
    ]
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07] dark:opacity-[0.06] hidden sm:block">
        {codeSnippets.map((code, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs text-foreground"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animation: `floatCode ${20 + i * 5}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          >
            {code}
          </div>
        ))}
      </div>
    )
  }

  const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
  const skills = [
    { name: "JavaScript", logo: `${CDN}/javascript/javascript-original.svg` },
    { name: "TypeScript", logo: `${CDN}/typescript/typescript-original.svg` },
    { name: "React", logo: `${CDN}/react/react-original.svg` },
    { name: "Next.js", logo: `${CDN}/nextjs/nextjs-original.svg` },
    { name: "Node.js", logo: `${CDN}/nodejs/nodejs-original.svg` },
    { name: "Python", logo: `${CDN}/python/python-original.svg` },
    { name: "MongoDB", logo: `${CDN}/mongodb/mongodb-original.svg` },
    { name: "MySQL", logo: `${CDN}/mysql/mysql-original.svg` },
    { name: "Git", logo: `${CDN}/git/git-original.svg` },
    { name: "Android", logo: `${CDN}/android/android-original.svg` },
  ]
  const skillsSectionRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<(HTMLDivElement | null)[]>([])
  const [orbDeltas, setOrbDeltas] = useState<{ x: number; y: number }[]>(() => skills.map(() => ({ x: 0, y: 0 })))
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const onSkillsMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const refs = orbsRef.current
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const newDeltas = refs.map((el) => {
          if (!el) return { x: 0, y: 0 }
          const r = el.getBoundingClientRect()
          const ox = r.left + r.width / 2
          const oy = r.top + r.height / 2
          const dx = ox - mx
          const dy = oy - my
          const d = Math.hypot(dx, dy) || 1
          const force = Math.min(24, 1200 / (d + 40))
          const ux = dx / d
          const uy = dy / d
          return { x: ux * force, y: uy * force }
        })
        setOrbDeltas(newDeltas)
      })
    }
  }, [])

  const onSkillsMouseLeave = useCallback(() => {
    setOrbDeltas((prev) => prev.map(() => ({ x: 0, y: 0 })))
  }, [])

  const experiences = [
    {
      title: "Desarrollador Full Stack Senior",
      company: "Empresa Actual",
      period: "2025 - Presente",
      description:
        "Liderazgo técnico en desarrollo de aplicaciones web escalables, arquitectura de sistemas y mentoría de equipos.",
      achievements: ["Arquitectura de sistemas", "Mentoría técnica", "Optimización de rendimiento"],
      tech: ["React", "Node.js", "TypeScript", "AI Integration"],
    },
    {
      title: "Desarrollador de Software",
      company: "Empresa Actual",
      period: "2025 - Presente",
      description:
        "Desarrollo y mantenimiento de aplicaciones web con integración de Inteligencia Artificial.",
      achievements: ["Integración de IA", "Optimización de procesos", "Nuevas funcionalidades"],
      tech: ["JavaScript", "Python", "AI/ML", "Web Development"],
    },
    {
      title: "Desarrollador Frontend",
      period: "2020 - 2025",
      description: "Desarrollo de interfaces modernas y responsivas con enfoque en UX/UI.",
      achievements: ["Interfaces responsivas", "Optimización UX", "Mejora de rendimiento"],
      tech: ["React", "Tailwind CSS", "TypeScript"],
    },
    {
      title: "Desarrollador Junior",
      period: "2019 - 2025",
      description: "Desarrollo de funcionalidades web y colaboración en proyectos ágiles.",
      achievements: ["Aprendizaje continuo", "Colaboración en equipo", "Desarrollo ágil"],
      tech: ["JavaScript", "HTML", "CSS", "Git"],
    },
  ]

  // Animación al scroll: experiencia (aparecen al bajar)
  useEffect(() => {
    const refs = experienceCardRefs.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.findIndex((r) => r === entry.target)
          if (idx === -1) return
          setVisibleExpIndexes((prev) => {
            const next = new Set(prev)
            if (entry.isIntersecting) next.add(idx)
            else next.delete(idx)
            return next
          })
        })
      },
      { rootMargin: "-30px 0px -30px 0px", threshold: 0.08 }
    )
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i]
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [experiences.length])

  type ProjectDoc = {
    architecture?: string[]
    technicalDecisions?: string[]
    problemsSolved?: string[]
  }
  type Project = {
    title: string
    description: string
    tech: string[]
    link?: string
    featured: boolean
    doc?: ProjectDoc
  }
  const [docProject, setDocProject] = useState<Project | null>(null)

  const projects: Project[] = [
    {
      title: "CHAT BOT CON IA-GENERADOR DE BEATS",
      description:
        "Plataforma innovadora con inteligencia artificial para generación de música y beats personalizados",
      tech: ["Python", "Node.js", "App.js", "Api-gemini", "AI/ML"],
      link: "https://opiumm-gray.vercel.app/",
      featured: true,
      doc: {
        architecture: [
          "Frontend en React/Next con interfaz de chat y controles de generación.",
          "Backend en Node.js para orquestar llamadas a APIs de IA.",
          "Integración con API Gemini para procesamiento de lenguaje natural y generación de contenido.",
          "Pipeline de audio: generación de beats vía modelos/servicios de IA y reproducción en cliente.",
        ],
        technicalDecisions: [
          "Uso de API Gemini para respuestas conversacionales y contexto de generación musical.",
          "Separación entre capa de chat (NLU) y capa de generación de audio para escalar por partes.",
          "Node.js como puente entre frontend y APIs externas para ocultar claves y manejar rate limits.",
        ],
        problemsSolved: [
          "Unificar chat y generación de beats en una sola experiencia sin cambiar de aplicación.",
          "Manejo de latencia en generación de audio con feedback visual y estados de carga.",
          "Persistencia de preferencias de usuario (estilo, BPM) entre sesiones.",
        ],
      },
    },
    {
      title: "SaaS sistemas de inventario y ventas",
      description:
        "Aplicación web para gestión de inventario, control de stock y ventas. Desarrollada con React, Node.js y HTML.",
      tech: ["HTML", "React", "Node.js", "CSS", "JavaScript"],
      link: "https://saas-beta-peach.vercel.app/",
      featured: true,
      doc: {
        architecture: [
          "SPA en React con vistas: inventario, ventas, reportes y configuración.",
          "API REST en Node.js para CRUD de productos, movimientos y ventas.",
          "Base de datos (SQL o NoSQL según despliegue) para productos, stock y transacciones.",
        ],
        technicalDecisions: [
          "React para reutilización de componentes (tablas, formularios, modales) en todas las secciones.",
          "API REST stateless para permitir futura app móvil o integraciones.",
          "Validación en backend y frontend para evitar datos inconsistentes en stock.",
        ],
        problemsSolved: [
          "Sincronización de stock en tiempo real al registrar ventas o entradas/salidas.",
          "Evitar ventas por encima del stock disponible con validaciones y mensajes claros.",
          "Reportes de ventas e inventario exportables o visualizables en dashboard.",
        ],
      },
    },
    {
      title: "Dashboard profesional tipo empresarial",
      description:
        "Sistema empresarial con análisis de empleados, reportes, generación de Excel y PDF. Desarrollado con React, Node.js y HTML.",
      tech: ["HTML", "React", "Node.js", "CSS", "JavaScript", "Excel", "PDF"],
      link: "https://empresarial-omega.vercel.app/",
      featured: true,
      doc: {
        architecture: [
          "Frontend React con dashboards, tablas y gráficos (ej. Recharts).",
          "Backend Node.js con endpoints para empleados, reportes y generación de archivos.",
          "Generación de Excel y PDF en servidor (librerías como xlsx, pdf-lib o puppeteer) y descarga por el cliente.",
        ],
        technicalDecisions: [
          "Generación de Excel/PDF en backend para no sobrecargar el navegador y garantizar formato uniforme.",
          "Gráficos en el cliente con datos agregados desde la API para mejor tiempo de respuesta.",
          "Autenticación y roles para restringir acceso a reportes sensibles.",
        ],
        problemsSolved: [
          "Reportes pesados (muchos empleados/datos) sin bloquear la UI mediante jobs o streaming.",
          "Formato consistente de Excel y PDF para auditorías y presentaciones.",
          "Análisis de datos de empleados (KPIs, tendencias) con visualizaciones claras.",
        ],
      },
    },
    {
      title: "BARBERIA-ORION",
      description: "Plataforma web moderna para gestión de citas y servicios de barbería",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      link: "#",
      featured: false,
      doc: {
        architecture: [
          "Aplicación React con vistas de servicios, disponibilidad y reservas.",
          "Estilos con Tailwind y animaciones con Framer Motion para UX fluida.",
        ],
        technicalDecisions: [
          "Framer Motion para transiciones y micro-interacciones que refuercen la marca.",
          "Diseño responsivo primero para uso en móvil en punto de venta o por clientes.",
        ],
        problemsSolved: [
          "Visualización clara de horarios y servicios para reducir no-shows.",
          "Experiencia de reserva rápida y accesible desde cualquier dispositivo.",
        ],
      },
    },
    {
      title: "ORAL-PLUS Y APP ORAL-PLUS",
      description:
        "Solución completa web y móvil para la venta de productos bucales y pago de facturas",
      tech: ["JavaScript", "HTML","Php", "Css", "SQL", "Android"],
      link: "https://oral-plus.com/index.html",
      featured: true,
      doc: {
        architecture: [
          "Sitio web con PHP en el servidor, HTML/CSS/JS en el frontend.",
          "App Android nativa o híbrida para catálogo y pagos.",
          "Base de datos SQL compartida para productos, usuarios y facturas.",
        ],
        technicalDecisions: [
          "PHP para backend web y lógica de negocio en el servidor.",
          "App móvil para llegar a clientes que prefieren comprar desde el teléfono.",
          "Un solo modelo de datos para facturas en web y app para consistencia.",
        ],
        problemsSolved: [
          "Pago de facturas y compra de productos desde web y app con el mismo usuario.",
          "Sincronización de inventario y precios entre canal web y móvil.",
          "Experiencia de compra segura y clara para productos bucales.",
        ],
      },
    },
    {
      title: "HOJA DE VIDA DIGITAL",
      description: "Página web donde se muestran mis habilidades y proyectos",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      link: "https://cv-steven.vercel.app/",
      featured: true,
      doc: {
        architecture: [
          "Next.js App Router con una página principal (page.tsx) y componentes reutilizables.",
          "UI con Radix UI + Tailwind CSS; tema claro/oscuro persistido en localStorage.",
          "Secciones: Hero, Sobre mí, Experiencia, Habilidades, Proyectos (con documentación técnica), Contacto.",
        ],
        technicalDecisions: [
          "Single Page con scroll y navegación por anclas para evitar recargas y mejor UX.",
          "Intersection Observer para animaciones al scroll (experiencia, proyectos) sin librerías pesadas.",
          "Documentación técnica por proyecto en modal (Dialog) para no saturar la vista.",
        ],
        problemsSolved: [
          "Mostrar muchos proyectos sin saturar: destacados + grid secundario y doc técnica bajo demanda.",
          "Rendimiento en móvil: animaciones con CSS/RAF y lazy de imágenes con Next/Image.",
          "Accesibilidad: tema claro/oscuro, menú móvil y botones con labels.",
        ],
      },
    },
    {
      title: "PROYECTOS EMPRESARIALES PRIVADOS",
      description: "Sistemas empresariales personalizados con visualización de datos en tiempo real",
      tech: ["Python", "JavaScript", "MySQL"],
      featured: false,
      doc: {
        architecture: [
          "Backend en Python (Flask/Django o similar) para lógica y APIs.",
          "Frontend en JavaScript para dashboards y visualización en tiempo real.",
          "MySQL como almacenamiento transaccional y para reportes.",
        ],
        technicalDecisions: [
          "Python para integraciones, scripts y procesamiento de datos empresariales.",
          "Visualización en tiempo real mediante WebSockets o polling según requisitos.",
        ],
        problemsSolved: [
          "Datos en tiempo real para monitoreo y toma de decisiones.",
          "Sistemas a medida que se integran con procesos internos del cliente.",
        ],
      },
    },
  ]

  // Proyectos: efecto "cohetes" al entrar en vista (romper la 4.ª pared)
  useEffect(() => {
    const el = projectsSectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setProjectsInView(true)
      },
      { rootMargin: "-80px 0px -80px 0px", threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const stats = [
    { label: "Años de Experiencia", value: "1+", icon: TrendingUp },
    { label: "Proyectos Completados", value: "20+", icon: Target },
    { label: "Tecnologías Dominadas", value: "17+", icon: Brain },
  
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background text-foreground relative overflow-x-hidden transition-colors duration-300">
      {/* Grid sutil */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      <FloatingCode />

      {/* Barra de navegación: menú hamburguesa en móvil */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-top">
        <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <span className="truncate text-sm font-semibold text-foreground sm:text-base">Steven Villamizar</span>
          <nav className="hidden items-center gap-0.5 md:flex md:gap-1">
            {[
              { id: "hero", label: "Inicio" },
              { id: "about", label: "Sobre Mí" },
              { id: "experience", label: "Experiencia" },
              { id: "skills", label: "Habilidades" },
              { id: "projects", label: "Proyectos" },
              { id: "contact", label: "Contacto" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-muted touch-manipulation"
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-muted md:hidden touch-manipulation"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div
          className={`absolute left-0 right-0 top-full border-b border-border bg-card shadow-lg transition-all duration-200 md:hidden ${
            mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col p-3 pb-4">
            {[
              { id: "hero", label: "Inicio" },
              { id: "about", label: "Sobre Mí" },
              { id: "experience", label: "Experiencia" },
              { id: "skills", label: "Habilidades" },
              { id: "projects", label: "Proyectos" },
              { id: "contact", label: "Contacto" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`min-h-[2.75rem] rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors touch-manipulation ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 pt-14 sm:pt-16">
        {/* Hero horizontal: texto + foto de confianza */}
        <section
          ref={(el) => {
            sectionRefs.current.hero = el
          }}
          className="flex min-h-[100dvh] min-h-screen items-center px-3 py-8 sm:px-6 sm:py-12"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div
              className={`order-2 lg:order-1 transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <div className="mb-6 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>steven@developer:~$</span>
                <span className="animate-pulse">_</span>
              </div>
              <h1 className="mb-3 text-3xl font-black tracking-tight text-foreground sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl">
                STEVEN VILLAMIZAR
              </h1>
              <p className="mb-2 text-lg font-light text-muted-foreground sm:text-xl md:text-2xl">
                Full Stack Developer
              </p>
              <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-base font-medium">Innovación & Tecnología</span>
              </div>
              <p className="mb-8 max-w-xl text-muted-foreground leading-relaxed">
                Desarrollador apasionado por crear soluciones tecnológicas innovadoras.
              </p>
              <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
                {stats.map(({ label, value, icon: Icon }, idx) => (
                  <Card
                    key={idx}
                    className="border-border bg-card p-2 shadow-sm transition-all hover:border-primary/20 hover:shadow sm:p-4"
                  >
                    <Icon className="mb-0.5 h-4 w-4 text-primary sm:mb-2 sm:h-6 sm:w-6" />
                    <div className="text-base font-bold text-foreground sm:text-2xl">{value}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground sm:text-xs">{label}</div>
                  </Card>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button size="lg" className="min-h-[2.75rem] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation sm:min-h-0" asChild>
                  <a href="mailto:Stevenvilla10@gmail.com">
                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Contratar Ahora
                  </a>
                </Button>
                <a href="/CV/Hoja de vida.pdf" download="Steven_Villamizar_CV.pdf" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[2.75rem] border-primary/40 bg-transparent text-foreground hover:bg-muted hover:border-primary/60 touch-manipulation sm:min-h-0"
                  >
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Descargar CV
                  </Button>
                </a>
              </div>
              <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3">
                {[
                  { icon: Github, href: "https://github.com/Steven11vm", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/steven-villamizar-166b98388/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:Stevenvilla10@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex h-11 w-11 min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground touch-manipulation"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            {/* Solo foto del gato, más grande */}
            <div
              className={`order-1 flex justify-center lg:order-2 transition-all duration-1000 delay-150 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <Card className="w-full max-w-[200px] overflow-hidden border-border bg-card shadow-lg transition-shadow hover:shadow-xl sm:max-w-[260px] lg:max-w-[300px]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={gatoImage}
                    alt="Mi compañero de código"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
                    priority
                    quality={90}
                  />
                </div>
                <div className="border-t border-border bg-muted/50 px-4 py-3 text-center">
                  <p className="text-sm font-medium text-foreground">¡Hola! Mi compañero de código</p>
                </div>
              </Card>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 sm:flex sm:bottom-6">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Scroll</span>
            <div className="flex h-8 w-5 justify-center rounded-full border-2 border-border p-1.5">
              <div className="h-2 w-1 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        </section>

        {/* Sobre Mí */}
        <section
          ref={(el) => {
            sectionRefs.current.about = el
          }}
          className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Sobre Mí</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
                  <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-border shadow-md sm:h-32 sm:w-32">
                      <Image
                        src={formalImage}
                        alt="Steven Villamizar — Foto formal"
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                        quality={90}
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                      <h3 className="mb-2 flex flex-wrap items-center justify-center gap-3 text-2xl font-bold text-foreground sm:justify-start">
                        <Zap className="h-7 w-7 text-primary" />
                        Perfil Profesional
                      </h3>
                      <p className="text-sm text-muted-foreground">Steven Villamizar Mendoza</p>
                    </div>
                  </div>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    Soy <span className="font-semibold text-foreground">Steven Villamizar Mendoza</span>, tecnólogo en Análisis y Desarrollo de Software con más de{" "}
                    <span className="font-semibold text-foreground">1 año de experiencia</span> creando soluciones tecnológicas innovadoras.
                  </p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    Soy tecnoologo en analisis y desarrollo de software {" "}
                    <span className="font-semibold text-foreground">Trabajando actualmente en la empresa ORAL-PLUS(SKY S.A.S)
                      </span> y trabajo como desarrollador profesional.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Mi enfoque: código limpio, escalable y soluciones que generen valor real para las empresas ,la innovacion y al creatividad de siempre querer hacer las cosas nuevas y diferentes.
                  </p>
                </Card>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: MapPin, text: "Medellín, Colombia" },
                    { icon: Phone, text: "304 646 7135" },
                    { icon: Mail, text: "Stevenvilla10@gmail.com" },
                    { icon: GraduationCap, text: "Tecnólogo ADSO" },
                  ].map(({ icon: Icon, text }, idx) => (
                    <Card
                      key={idx}
                      className="border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/20 sm:p-4"
                    >
                      <Icon className="mb-1.5 h-4 w-4 text-primary sm:mb-2 sm:h-5 sm:w-5" />
                      <p className="text-xs text-muted-foreground sm:text-sm">{text}</p>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-border bg-muted/50 p-4 shadow-sm sm:p-6 md:p-8">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary">
                      <Target className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Mi Misión</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Transformar ideas complejas en soluciones tecnológicas elegantes que impulsen el crecimiento empresarial.
                    </p>
                  </div>
                </Card>
                <Card className="border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-foreground sm:text-xl">
                    <Brain className="h-6 w-6 text-primary" />
                    Por qué trabajar conmigo
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Experiencia probada en proyectos reales",
                      "Compromiso con la calidad y excelencia",
                      "Aprendizaje continuo y adaptabilidad",
                      "Enfoque en resultados y valor empresarial",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Experiencia — grid de 2 columnas con animación al scroll */}
        <section
          ref={(el) => {
            sectionRefs.current.experience = el
          }}
          className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Experiencia</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    experienceCardRefs.current[idx] = el
                  }}
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: visibleExpIndexes.has(idx) ? 1 : 0,
                    transform: visibleExpIndexes.has(idx) ? "translateY(0)" : "translateY(28px)",
                  }}
                >
                  <Card className="h-full border-border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-6 md:p-8">
                    <div className="mb-3 flex flex-col sm:mb-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="mb-2 text-base font-bold text-foreground sm:text-xl">{exp.title}</h3>
                        {exp.company && (
                          <p className="mb-2 text-base font-semibold text-primary sm:text-lg">{exp.company}</p>
                        )}
                        <Badge variant="outline" className="border-primary/30 text-foreground">
                          {exp.period}
                        </Badge>
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{exp.description}</p>
                    <div className="mb-4">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground sm:text-sm">Logros</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {exp.tech.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="border-border text-xs text-muted-foreground sm:text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Habilidades — bolitas con logos y física con el mouse */}
        <section
          ref={(el) => {
            sectionRefs.current.skills = el
          }}
          className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Habilidades</h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            </div>
            <div
              ref={skillsSectionRef}
              onMouseMove={onSkillsMouseMove}
              onMouseLeave={onSkillsMouseLeave}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10"
            >
              {skills.map((skill, idx) => (
                <div
                  key={skill.name}
                  ref={(el) => {
                    orbsRef.current[idx] = el
                  }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card shadow-md transition-shadow duration-200 hover:shadow-lg sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
                  style={{
                    transform: `translate(${orbDeltas[idx]?.x ?? 0}px, ${orbDeltas[idx]?.y ?? 0}px)`,
                    transition: "transform 0.15s ease-out, box-shadow 0.2s ease",
                  }}
                  title={skill.name}
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="h-7 w-7 object-contain sm:h-8 sm:w-8 md:h-9 md:w-9"
                    width={36}
                    height={36}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proyectos — romper la 4.ª pared: llegan como cohetes desde lejos */}
        <section
          ref={(el) => {
            sectionRefs.current.projects = el
          }}
          className="relative border-t border-border bg-muted/20 py-12 px-4 sm:py-16 sm:px-6 md:py-20 overflow-hidden"
        >
          <div
            ref={projectsSectionRef}
            className="mx-auto max-w-7xl"
            style={{ perspective: "1400px" }}
          >
            <div className="mb-8 text-center sm:mb-14">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary sm:text-sm">
                Portafolio
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Proyectos destacados
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                Soluciones reales desarrolladas con las mejores prácticas y tecnologías actuales.
              </p>
              <div className="mx-auto mt-6 h-1 w-16 bg-primary" />
            </div>

            {/* Proyectos destacados — entran como cohetes */}
            <div className="mb-8 space-y-4 sm:mb-10 sm:space-y-6" style={{ perspectiveOrigin: "50% 20%" }}>
              {projects
                .filter((p) => p.featured)
                .map((project, idx) => {
                  const globalIdx = projects.findIndex((p) => p === project)
                  return (
                    <div
                      key={globalIdx}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: projectsInView
                          ? "scale(1) translateZ(0) rotateX(0deg)"
                          : "scale(0.12) translateZ(-900px) rotateX(12deg)",
                        opacity: projectsInView ? 1 : 0,
                        transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease-out",
                        transitionDelay: `${idx * 120}ms`,
                      }}
                    >
                      <Card
                        className="group relative overflow-hidden border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
                      >
                      <div className="flex flex-col lg:flex-row lg:items-stretch">
                        <div className="flex shrink-0 items-center justify-center border-b border-border bg-muted/40 px-4 py-4 sm:px-8 sm:py-6 lg:w-48 lg:border-b-0 lg:border-r">
                          <span className="font-mono text-3xl font-bold tabular-nums text-primary/25 group-hover:text-primary/40 sm:text-5xl">
                            {String(globalIdx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                              Destacado
                            </Badge>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Proyecto {globalIdx + 1}
                            </span>
                          </div>
                          <h3 className="mb-3 text-lg font-bold text-foreground sm:text-xl md:text-2xl group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mb-5 sm:text-base">
                            {project.description}
                          </p>
                          <div className="mb-4 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2">
                            {project.tech.map((tech, i) => (
                              <span
                                key={i}
                                className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-medium text-foreground sm:px-2.5 sm:py-1 sm:text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto flex flex-wrap gap-2">
                            {project.doc && (
                              <Button
                                size="lg"
                                variant="outline"
                                className="min-h-[2.75rem] border-border touch-manipulation sm:min-h-0"
                                onClick={() => setDocProject(project)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Documentación técnica
                              </Button>
                            )}
                            {project.link ? (
                              <Button
                                size="lg"
                                className="w-full min-h-[2.75rem] bg-primary text-primary-foreground hover:bg-primary/90 group/btn touch-manipulation sm:w-auto sm:min-h-0 sm:flex-1 sm:flex-initial"
                                asChild
                              >
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  Ver proyecto
                                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </a>
                              </Button>
                            ) : (
                              <Button size="lg" variant="outline" className="w-full min-h-[2.75rem] touch-manipulation sm:w-auto sm:min-h-0" disabled>
                                Proyecto privado
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                    </div>
                  )
                })}
            </div>

            {/* Resto de proyectos — grid compacto, también como cohetes */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground">Más proyectos</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" style={{ perspectiveOrigin: "50% 30%" }}>
              {projects
                .filter((p) => !p.featured)
                .map((project, idx) => {
                  const globalIdx = projects.findIndex((p) => p === project)
                  const rocketIdx = projects.filter((p) => p.featured).length + idx
                  return (
                    <div
                      key={globalIdx}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: projectsInView
                          ? "scale(1) translateZ(0) rotateX(0deg)"
                          : "scale(0.15) translateZ(-700px) rotateX(8deg)",
                        opacity: projectsInView ? 1 : 0,
                        transition: "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-out",
                        transitionDelay: `${rocketIdx * 100}ms`,
                      }}
                    >
                      <Card
                        className="group relative overflow-hidden border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 sm:p-5"
                      >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <span className="font-mono text-2xl font-bold tabular-nums text-primary/20 group-hover:text-primary/35">
                          {String(globalIdx + 1).padStart(2, "0")}
                        </span>
                        <Rocket className="h-5 w-5 shrink-0 text-primary/60" />
                      </div>
                      <h3 className="mb-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-base">
                        {project.title}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:mb-4 sm:text-sm">
                        {project.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="rounded border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.doc && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[2.5rem] text-muted-foreground hover:text-foreground touch-manipulation sm:min-h-0"
                            onClick={() => setDocProject(project)}
                          >
                            <FileText className="mr-1 h-3.5 w-3.5" />
                            Doc. técnica
                          </Button>
                        )}
                        {project.link ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-h-[2.5rem] border-primary/30 text-foreground hover:bg-primary/5 hover:border-primary/50 touch-manipulation sm:min-h-0"
                            asChild
                          >
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                              Ver proyecto
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="flex-1" disabled>
                            Proyecto privado
                          </Button>
                        )}
                      </div>
                    </Card>
                    </div>
                  )
                })}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section
          ref={(el) => {
            sectionRefs.current.contact = el
          }}
          className="relative py-12 px-4 sm:py-16 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Contacto</h2>
            <div className="mx-auto mb-6 h-1 w-20 bg-primary" />
            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:mb-12 sm:text-xl">
              ¿Listo para llevar tu proyecto al siguiente nivel? Hablemos.
            </p>
            <div className="mb-8 grid gap-4 sm:mb-12 sm:gap-6 md:grid-cols-2">
              <Card className="border-border bg-card p-4 text-center shadow-sm transition-colors hover:border-primary/20 sm:p-6 md:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted sm:mb-4 sm:h-16 sm:w-16">
                  <Mail className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">Email</h3>
                <a href="mailto:Stevenvilla10@gmail.com" className="break-all text-sm text-primary hover:underline sm:text-base">
                  Stevenvilla10@gmail.com
                </a>
              </Card>
              <Card className="border-border bg-card p-4 text-center shadow-sm transition-colors hover:border-primary/20 sm:p-6 md:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted sm:mb-4 sm:h-16 sm:w-16">
                  <Phone className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">Teléfono</h3>
                <a href="tel:3046467135" className="text-primary hover:underline">304 646 7135</a>
              </Card>
            </div>
            <Button size="lg" className="min-h-[2.75rem] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation sm:min-h-0" asChild>
              <a href="mailto:Stevenvilla10@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Iniciar Conversación
              </a>
            </Button>
          </div>
        </section>

        <footer className="safe-area-bottom border-t border-border bg-muted/30 py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-sm text-muted-foreground sm:text-base">© 2025 Steven Villamizar Mendoza</p>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Desarrollado con Next.js y React · Autor: STEVEN VILLAMIZAR MENDOZA
            </p>
          </div>
        </footer>
      </div>

      {/* Modal de documentación técnica */}
      <Dialog open={!!docProject} onOpenChange={(open) => !open && setDocProject(null)}>
        <DialogContent className="max-h-[85dvh] max-w-2xl gap-0 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              {docProject?.title}
            </DialogTitle>
          </DialogHeader>
          {docProject?.doc && (
            <ScrollArea className="max-h-[60dvh] pr-4">
              <div className="space-y-6 pt-2">
                {docProject.doc.architecture && docProject.doc.architecture.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Layers className="h-4 w-4 text-primary" />
                      Arquitectura
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.architecture.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {docProject.doc.technicalDecisions && docProject.doc.technicalDecisions.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Code className="h-4 w-4 text-primary" />
                      Decisiones técnicas
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.technicalDecisions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {docProject.doc.problemsSolved && docProject.doc.problemsSolved.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Problemas resueltos
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {docProject.doc.problemsSolved.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes floatCode {
          0% {
            transform: translateX(-100px) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
