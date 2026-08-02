"use client"
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer"

export function Footer() {
  const year = new Date().getFullYear()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <RuixenGradientFooter
      className="relative border-t border-hairline"
      gradientHeight="42vh"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 sm:flex-row sm:items-end sm:px-10 lg:px-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground">
            Steven Villamizar
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Full Stack Engineer · Medellín, Colombia.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            © {year}
          </p>
          <button
            onClick={scrollTop}
            className="link-r font-mono text-[10px] uppercase tracking-[0.24em] text-foreground"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </RuixenGradientFooter>
  )
}
