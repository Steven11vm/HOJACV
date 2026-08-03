"use client"

import { motion } from "framer-motion"
import { ThreeDMarquee } from "@/components/ui/three-d-marquee"
import { type Lang } from "@/lib/translations"

interface EcosystemProps {
  lang: Lang
}

const ECOSYSTEM_IMAGES = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1547658719-da2b51169166?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=970&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=970&auto=format&fit=crop&q=80",
]

export function Ecosystem({ lang }: EcosystemProps) {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden border-t border-hairline bg-background px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "05 · Ecosistema" : "05 · Ecosystem"}</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {lang === "es"
              ? "Un ecosistema en movimiento."
              : "An ecosystem in motion."}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            {lang === "es"
              ? "El entorno visual donde vivo cada día — editores, dashboards, servidores en producción, pipelines de IA y las interfaces que construyo. Movimiento constante, aprendizaje continuo."
              : "The visual environment I live in every day — editors, dashboards, servers in production, AI pipelines and the interfaces I build. Constant motion, continuous learning."}
          </motion.p>
        </div>
      </div>

      {/* Marquee 3D — mask fade en los bordes para integracion elegante */}
      <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
        <div
          className="relative overflow-hidden rounded-2xl border border-hairline bg-black/30"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          }}
        >
          <ThreeDMarquee images={ECOSYSTEM_IMAGES} />
        </div>

        {/* Stats overlay */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-hairline pt-8 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {lang === "es" ? "Repositorios" : "Repositories"}
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">40+</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {lang === "es" ? "Deploys mensuales" : "Monthly deploys"}
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">120+</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {lang === "es" ? "Modelos IA en prod" : "AI models in prod"}
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">6</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              Uptime
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">99.9%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
