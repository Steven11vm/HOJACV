"use client"
import { motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { type Lang } from "@/lib/translations"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

const SWATCHES = [
  "#f4efe4", // crema (default)
  "#ffffff",
  "#111111",
  "#4d5b6f",
  "#7c8a86",
  "#d99a4a",
  "#4e8763",
  "#276b78",
  "#c8a34a",
  "#b93d4a",
]

export function AlienShowcase({ lang }: { lang: Lang }) {
  return (
    <section
      id="showcase"
      className="border-t border-hairline px-6 pb-10 pt-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {lang === "es" ? "En vivo · Alien Style 51" : "Live · Alien Style 51"}
              </p>
              <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
                {lang === "es" ? (
                  <>Diseña <span className="italic text-muted-foreground">en tu pantalla.</span></>
                ) : (
                  <>Design <span className="italic text-muted-foreground">on your screen.</span></>
                )}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
                {lang === "es"
                  ? "Studio 3D construido con HTML5 Canvas para personalizar producto en tiempo real. Escala, rota, sube tu arte y cierra el pedido en una sola pantalla."
                  : "3D Studio built with HTML5 Canvas to customize products in real time. Scale, rotate, upload your artwork and close the order on a single screen."}
              </p>
            </motion.div>
          }
        >
          <StudioMock lang={lang} />
        </ContainerScroll>

        <div className="mx-auto -mt-2 flex max-w-5xl flex-col items-start gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            PHP · JAVASCRIPT · HTML5 CANVAS · MYSQL · TAILWIND
          </p>
          <a
            href="https://alyenstyle.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-plain btn-plain-inv"
          >
            {lang === "es" ? "Prueba el Studio" : "Try the Studio"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

function StudioMock({ lang }: { lang: Lang }) {
  const tabs = ["Camisa", "Taza", "Gorra", "Llavero"]

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-[1.15fr_1fr]">
      {/* Left — T-shirt preview */}
      <div className="relative flex items-center justify-center border-b border-hairline bg-muted p-6 md:border-b-0 md:border-r">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,var(--foreground)_0,transparent_60%),radial-gradient(circle_at_70%_70%,var(--foreground)_0,transparent_60%)]" />
        </div>

        <svg
          viewBox="0 0 320 340"
          className="relative h-auto w-full max-w-[280px]"
          role="img"
          aria-label="Vista previa camiseta"
        >
          <path
            d="M40 60 L100 30 Q160 60 220 30 L280 60 L260 130 L220 120 L220 320 L100 320 L100 120 L60 130 Z"
            fill="var(--background)"
            stroke="var(--foreground)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M110 32 Q160 76 210 32"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1"
          />
          <rect
            x="120"
            y="140"
            width="80"
            height="140"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <text
            x="160"
            y="200"
            textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="9"
            letterSpacing="2"
            fill="var(--muted-foreground)"
          >
            +
          </text>
          <text
            x="160"
            y="220"
            textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="7"
            letterSpacing="3"
            fill="var(--muted-foreground)"
          >
            ZONA DE ESTAMPADO
          </text>
        </svg>
      </div>

      {/* Right — controls */}
      <div className="flex flex-col justify-between gap-4 overflow-y-auto p-4 md:p-6">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab, i) => (
            <div
              key={tab}
              className={`flex items-center justify-center border py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
                i === 0
                  ? "border-foreground bg-foreground text-background"
                  : "border-hairline text-muted-foreground"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Color */}
        <div>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            {lang === "es" ? "Color del producto" : "Product color"}
          </p>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((c, i) => (
              <div
                key={i}
                className={`h-5 w-5 rounded-full ring-1 ring-hairline ${
                  i === 0 ? "outline outline-1 outline-offset-2 outline-foreground" : ""
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Diseño */}
        <div>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            {lang === "es" ? "Diseño" : "Design"}
          </p>
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <div className="grid grid-rows-2 gap-2">
              <div className="h-8 border border-hairline bg-muted" />
              <div className="h-8 border border-hairline bg-muted" />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border border-dashed border-hairline py-4 text-muted-foreground">
              <Plus className="h-4 w-4" />
              <p className="text-[10px]">{lang === "es" ? "Sube tu diseño" : "Upload design"}</p>
              <p className="text-[9px] text-muted-foreground/70">
                PNG · {lang === "es" ? "fondo transparente" : "transparent bg"}
              </p>
            </div>
          </div>
        </div>

        {/* Ajustar */}
        <div>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            {lang === "es" ? "Ajustar" : "Adjust"}
          </p>
          <div className="space-y-2.5">
            <Slider label={lang === "es" ? "Escala" : "Scale"} value="100%" position={100} />
            <Slider label={lang === "es" ? "Rotación" : "Rotation"} value="0°" position={50} />
            <Slider label={lang === "es" ? "Opacidad" : "Opacity"} value="100%" position={100} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-1 border border-foreground bg-foreground py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-background">
          {lang === "es" ? "Hacer pedido con este diseño" : "Order with this design"}
        </div>
      </div>
    </div>
  )
}

function Slider({ label, value, position }: { label: string; value: string; position: number }) {
  return (
    <div className="grid grid-cols-[70px_1fr_40px] items-center gap-3">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="relative h-px bg-hairline">
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-foreground"
          style={{ left: `calc(${position}% - 5px)` }}
        />
      </div>
      <span className="text-right font-mono text-[10px] text-muted-foreground">{value}</span>
    </div>
  )
}
