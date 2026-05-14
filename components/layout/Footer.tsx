"use client"
import { Github, Linkedin, Mail, Sparkles, ArrowUp } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="safe-area-bottom relative border-t border-white/5 bg-background/60 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-violet to-neon-blue text-primary-foreground shadow-lg shadow-primary/30">
                <span className="font-mono text-sm font-bold">SV</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                steven<span className="text-primary">.</span>dev
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Full Stack Engineer & AI Specialist. Construyo productos digitales con resultados medibles.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-foreground">Navegación</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { id: "about", label: "Sobre Mí" },
                { id: "experience", label: "Experiencia" },
                { id: "skills", label: "Stack" },
                { id: "services", label: "Servicios" },
                { id: "process", label: "Proceso" },
                { id: "projects", label: "Proyectos" },
                { id: "ai", label: "AI Copilot" },
                { id: "contact", label: "Contacto" },
              ].map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-foreground">Conecta</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:Stevenvilla10@gmail.com"
                className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 transition-colors group-hover:text-primary" />
                Stevenvilla10@gmail.com
              </a>
              <a
                href="https://github.com/Steven11vm"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4 transition-colors group-hover:text-primary" />
                @Steven11vm
              </a>
              <a
                href="https://www.linkedin.com/in/steven-villamizar-166b98388/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-4 w-4 transition-colors group-hover:text-primary" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Steven Villamizar Mendoza ·{" "}
            <span className="inline-flex items-center gap-1 text-foreground/80">
              <Sparkles className="h-3 w-3 text-primary" /> Diseñado y construido con Next.js + IA
            </span>
          </p>

          <button
            onClick={scrollTop}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all hover:border-white/20 hover:bg-white/10 hover:text-foreground"
          >
            <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            Volver arriba
          </button>
        </div>
      </div>
    </footer>
  )
}
