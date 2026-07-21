"use client"
import { motion } from "framer-motion"
import { type Lang, translations } from "@/lib/translations"

export function Contact({ lang }: { lang: Lang }) {
  const t = translations[lang]

  const channels = [
    { label: "Email", value: "Stevenvilla10@gmail.com", href: "mailto:Stevenvilla10@gmail.com" },
    { label: "WhatsApp", value: "+57 304 646 7135", href: "https://wa.me/573046467135" },
    { label: "LinkedIn", value: "steven-villamizar", href: "https://www.linkedin.com/in/steven-villamizar-166b98388/" },
    { label: "GitHub", value: "@Steven11vm", href: "https://github.com/Steven11vm" },
  ]

  return (
    <section id="contact" className="border-t border-hairline px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">
        <div>
          <p className="eyebrow">{lang === "es" ? "09 · Contacto" : "09 · Contact"}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="max-w-4xl font-display text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            {lang === "es"
              ? "¿Tienes una idea? Empecemos a hablar."
              : "Got an idea? Let's start talking."}
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t.contact.subtitle}
          </p>

          <div className="mt-16 flex flex-wrap items-center gap-6">
            <a
              href="mailto:Stevenvilla10@gmail.com"
              className="btn-plain btn-plain-inv"
            >
              {t.contact.startConversation}
              <span aria-hidden>→</span>
            </a>
            <a
              href="https://wa.me/573046467135?text=Hola%20Steven%2C%20me%20gustar%C3%ADa%20agendar%20una%20llamada"
              target="_blank"
              rel="noopener noreferrer"
              className="link-r text-sm text-foreground"
            >
              {t.contact.scheduleCall}
            </a>
          </div>

          <dl className="mt-20 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <div key={i}>
                <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {c.label}
                </dt>
                <dd>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="link-r text-sm text-foreground"
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {lang === "es" ? "Ubicación" : "Location"}
              </p>
              <p className="text-sm text-foreground">Medellín, Colombia</p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {lang === "es" ? "Disponibilidad" : "Availability"}
              </p>
              <p className="text-sm text-foreground">{t.contact.available}</p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {lang === "es" ? "Respuesta" : "Response"}
              </p>
              <p className="text-sm text-foreground">{t.contact.responseTime}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
