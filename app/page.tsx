"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
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
  Award,
  User,
  Palette,
  Zap,
} from "lucide-react"

export default function CVPage() {
  const [activeSection, setActiveSection] = useState("about")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "HTML/CSS",
    "Tailwind CSS",
    "Git",
    "MongoDB",
    "Java",
    "HTML",
    "CSS",
    "SQL",
    "SQLite",
    "Android",
    "MySQL",
  ]

  const experiences = [
    {
      title: "Desarrollador Full Stack Senior",
      company: "TechCorp Solutions",
      period: "2022 - Presente",
      description:
        "Liderazgo de equipo de desarrollo, arquitectura de aplicaciones web escalables y mentorización de desarrolladores junior.",
    },
    {
      title: "Desarrollador de Software",
      company: "Empresa Actual",
      period: "2024 - Presente",
      description:
        "Desarrollo y mantenimiento de aplicaciones web, implementación de nuevas funcionalidades y optimización de procesos existentes.",
    },
    {
      title: "Desarrollador Frontend",
      company: "Digital Agency",
      period: "2020 - 2022",
      description:
        "Desarrollo de interfaces de usuario modernas y responsivas, optimización de rendimiento y experiencia de usuario.",
    },
    {
      title: "Desarrollador Junior",
      company: "StartupTech",
      period: "2019 - 2020",
      description: "Desarrollo de funcionalidades web, mantenimiento de código y colaboración en proyectos ágiles.",
    },
  ]

  const projects = [
    {
      title: "E-commerce Platform",
      description: "Plataforma completa de comercio electrónico con panel de administración",
      tech: ["React", "Node.js", "MongoDB"],
      link: "#",
    },
    {
      title: "Task Management App",
      description: "Aplicación de gestión de tareas con colaboración en tiempo real",
      tech: ["Next.js", "TypeScript", "Prisma"],
      link: "#",
    },
    {
      title: "Portfolio Website",
      description: "Sitio web personal con animaciones y diseño responsivo",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      link: "#",
    },
    {
      title: "Sistema de Gestión",
      description: "Aplicación web para gestión de procesos empresariales",
      tech: ["JavaScript", "HTML", "CSS", "SQL"],
      link: "#",
    },
    {
      title: "Aplicación Móvil",
      description: "App móvil para gestión de tareas y productividad",
      tech: ["Java", "SQLite", "Android"],
      link: "#",
    },
    {
      title: "Dashboard Analítico",
      description: "Panel de control con visualización de datos en tiempo real",
      tech: ["Python", "JavaScript", "MySQL"],
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-muted rounded-full opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent rounded-full opacity-30 animate-pulse-subtle"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-border rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-muted rounded-full flex items-center justify-center animate-float">
                <User className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">
              <span className="decorative-line">Steven Villamizar</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
              Tecnólogo en Análisis y Desarrollo de Software
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Desarrollador apasionado por crear soluciones tecnológicas innovadoras con 9 meses de experiencia
              profesional en el desarrollo de software.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" className="hover-lift" asChild>
                <a href="mailto:Stevenvilla10@gmail.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Contactar
                </a>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift bg-transparent">
                <Download className="w-5 h-5 mr-2" />
                Descargar CV
              </Button>
            </div>

            <div className="flex justify-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors hover-lift">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors hover-lift">
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:Stevenvilla10@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-8">
            {[
              { id: "about", label: "Sobre Mí", icon: User },
              { id: "experience", label: "Experiencia", icon: Briefcase },
              { id: "skills", label: "Habilidades", icon: Code },
              { id: "projects", label: "Proyectos", icon: Palette },
              { id: "contact", label: "Contacto", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover-lift ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* About Section */}
        {activeSection === "about" && (
          <section className="animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 decorative-line">Sobre Mí</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Soy Steven Villamizar Mendoza, tecnólogo en análisis y desarrollo de software con 9 meses de
                  experiencia profesional. Me apasiona crear soluciones tecnológicas eficientes y mantenerme actualizado
                  con las últimas tendencias en desarrollo.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Actualmente empleado y en constante crecimiento profesional, busco siempre la excelencia en cada
                  proyecto y la mejora continua de mis habilidades técnicas.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Medellín, Colombia</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>304 646 7135</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>Stevenvilla10@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span>Tecnólogo ADSO</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="p-8 hover-lift">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                      <Zap className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Mi Filosofía</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      "La tecnología debe servir para mejorar la vida de las personas. Cada línea de código debe tener
                      un propósito claro y generar valor real."
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === "experience" && (
          <section className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-12 text-center decorative-line">Experiencia Profesional</h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <Card key={index} className="p-8 hover-lift">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                      <p className="text-lg text-primary font-semibold">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {exp.period}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </Card>
              ))}

              <Card className="p-8 hover-lift border-2 border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Formación Académica</h3>
                    <p className="text-lg text-primary font-semibold">Técnico y Tecnólogo ADSO</p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    Completado
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Técnico y Tecnólogo en Análisis y Desarrollo de Sistemas de Información (ADSO). Formación integral en
                  desarrollo de software, bases de datos, programación y metodologías ágiles.
                </p>
              </Card>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <section className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-12 text-center decorative-line">Habilidades Técnicas</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-8 hover-lift">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Code className="w-6 h-6 mr-3 text-primary" />
                  Tecnologías
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-8 hover-lift">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-primary" />
                  Especialidades
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Desarrollo Full-Stack</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Diseño UI/UX</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Arquitectura de Software</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Optimización de Rendimiento</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Análisis y Desarrollo de Software</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Desarrollo Web</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Bases de Datos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Programación Orientada a Objetos</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === "projects" && (
          <section className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-12 text-center decorative-line">Proyectos Destacados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="p-6 hover-lift">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="ghost" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Proyecto
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === "contact" && (
          <section className="animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 decorative-line">Hablemos</h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                ¿Tienes un proyecto en mente? Me encantaría escuchar tus ideas y ayudarte a convertirlas en realidad.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="p-6 hover-lift">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-muted-foreground">Stevenvilla10@gmail.com</p>
                </Card>

                <Card className="p-6 hover-lift">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Teléfono</h3>
                  <p className="text-muted-foreground">304 646 7135</p>
                </Card>
              </div>

              <Button size="lg" className="hover-lift" asChild>
                <a href="mailto:Stevenvilla10@gmail.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </a>
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">© 2025 Steven Villamizar Mendoza. Diseñado y desarrollado con ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
