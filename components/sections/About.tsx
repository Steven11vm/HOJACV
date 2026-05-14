"use client"
import { motion, type Variants } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import {
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Target,
  CheckCircle2,
  Zap,
  Languages,
  Briefcase,
} from "lucide-react"

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang]

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section id="about" className="relative overflow-hidden px-4 py-28 sm:px-6">
      {/* Bg decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-neon-violet/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-neon-blue/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">{t.about.subtitle}</div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.about.title}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8"
        >
          {/* Bio card */}
          <motion.div variants={item} className="space-y-6">
            <div className="glass relative overflow-hidden rounded-2xl p-8 sm:p-10">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-violet/20 to-neon-blue/20 text-primary ring-1 ring-primary/30">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  {t.about.professionalProfile}
                </h3>
              </div>

              <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  {t.about.bio1}{" "}
                  <span className="font-semibold text-foreground">Steven Villamizar Mendoza</span>
                  {t.about.bio1b}{" "}
                  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-primary ring-1 ring-primary/20">
                    {t.about.bio1c}
                  </span>{" "}
                  {t.about.bio1d}
                </p>
                <p>
                  {t.about.bio2}{" "}
                  <span className="font-semibold text-foreground">{t.about.bio2b}</span>{" "}
                  {t.about.bio2c}
                </p>
                <p className="border-l-2 border-primary/40 pl-5 font-serif italic text-foreground/85">
                  {t.about.bio3}
                </p>
              </div>

              {/* Decorative gradient corner */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-neon-violet/20 to-neon-blue/20 blur-2xl" />
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {[
                { icon: MapPin, label: lang === "es" ? "Ubicación" : "Location", text: t.about.info.location },
                { icon: GraduationCap, label: lang === "es" ? "Formación" : "Education", text: t.about.info.degree },
                { icon: Briefcase, label: lang === "es" ? "Modalidad" : "Mode", text: t.about.info.availability },
                { icon: Languages, label: lang === "es" ? "Idiomas" : "Languages", text: t.about.info.languages },
              ].map(({ icon: Icon, label, text }, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
                    <Icon className="h-4 w-4" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Mission + Why */}
          <motion.div variants={item} className="space-y-6">
            {/* Mission */}
            <div className="glass relative overflow-hidden rounded-2xl p-8 sm:p-10">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 text-neon-cyan ring-1 ring-neon-cyan/30">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">{t.about.missionTitle}</h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{t.about.missionText}</p>
            </div>

            {/* Why work with me */}
            <div className="glass relative overflow-hidden rounded-2xl p-8 sm:p-10">
              <h3 className="mb-6 font-serif text-xl font-medium text-foreground">{t.about.whyWork}</h3>
              <ul className="space-y-4">
                {t.about.whyItems.map((it, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>{it}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Quick contact */}
              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/5 pt-6">
                <a
                  href="mailto:Stevenvilla10@gmail.com"
                  className="group flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                  <span className="font-mono truncate">Stevenvilla10@gmail.com</span>
                </a>
                <a
                  href="tel:+573046467135"
                  className="group flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                  <span className="font-mono">+57 304 646 7135</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
