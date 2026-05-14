"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight, Calendar, Github, Linkedin } from "lucide-react"

export function Contact({ lang }: { lang: Lang }) {
  const t = translations[lang]

  const channels = [
    {
      icon: Mail,
      label: t.contact.email,
      value: "Stevenvilla10@gmail.com",
      href: "mailto:Stevenvilla10@gmail.com",
      color: "var(--neon-violet)",
      cta: t.contact.sendEmail,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+57 304 646 7135",
      href: "https://wa.me/573046467135",
      color: "var(--neon-green)",
      cta: t.contact.whatsapp,
    },
    {
      icon: Phone,
      label: t.contact.phone,
      value: "+57 304 646 7135",
      href: "tel:+573046467135",
      color: "var(--neon-cyan)",
      cta: lang === "es" ? "Llamar" : "Call",
    },
  ]

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <div className="section-label mb-5">
            {t.contact.available} · {t.contact.responseTime}
          </div>
          <h2 className="mb-5 font-serif text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {t.contact.title}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{t.contact.subtitle}</p>
        </motion.div>

        {/* Channels grid */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {channels.map((ch, idx) => {
            const Icon = ch.icon
            return (
              <motion.a
                key={idx}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass group relative overflow-hidden rounded-2xl p-6 transition-all"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-110"
                    style={{
                      background: `color-mix(in oklch, ${ch.color} 18%, transparent)`,
                      color: ch.color,
                      boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ch.color} 30%, transparent)`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {ch.label}
                </p>
                <p className="font-serif text-lg font-medium text-foreground">{ch.value}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-foreground/60">
                  {ch.cta} →
                </p>

                {/* Hover gradient */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30"
                  style={{ background: ch.color }}
                />
              </motion.a>
            )
          })}
        </div>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-primary">
                <Calendar className="mr-1 inline h-3 w-3" />
                {lang === "es" ? "Primera reunión gratuita · 30 min" : "First meeting free · 30 min"}
              </p>
              <h3 className="mb-3 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
                {lang === "es"
                  ? "¿Listo para llevar tu producto al siguiente nivel?"
                  : "Ready to take your product to the next level?"}
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                {lang === "es"
                  ? "Cuéntame tu idea o reto. En 24 horas recibirás una propuesta inicial concreta."
                  : "Tell me about your idea or challenge. You'll get an initial proposal within 24 hours."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a
                href="mailto:Stevenvilla10@gmail.com"
                className="group inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-7 text-sm font-semibold uppercase tracking-widest text-background transition-transform hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                {t.contact.startConversation}
              </a>
              <a
                href="https://wa.me/573046467135?text=Hola%20Steven%2C%20me%20gustar%C3%ADa%20agendar%20una%20llamada"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 text-sm font-semibold uppercase tracking-widest text-foreground backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
              >
                <Calendar className="h-4 w-4" />
                {t.contact.scheduleCall}
              </a>
            </div>
          </div>

          {/* Decorative gradient */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-neon-violet/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-neon-blue/20 blur-3xl" />
        </motion.div>

        {/* Bottom links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Medellín, Colombia
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <a
            href="https://github.com/Steven11vm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" /> @Steven11vm
          </a>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <a
            href="https://www.linkedin.com/in/steven-villamizar-166b98388/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
