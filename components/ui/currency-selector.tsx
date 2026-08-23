"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Coins } from "lucide-react"
import { useCurrency, type Currency } from "@/lib/currency"
import type { Lang } from "@/lib/translations"

interface Props {
  lang: Lang
  /** ms antes de aparecer en la primera visita (para no chocar con splash/otros modales). */
  delay?: number
}

/**
 * CurrencySelector — pregunta la moneda preferida al inicio y persiste
 * la elección en localStorage. Todo el SalesFunnel y cualquier lugar del
 * sitio que muestre precios lo usa via useCurrency().
 */
export function CurrencySelector({ lang, delay = 3400 }: Props) {
  const { currency, setCurrency, ready } = useCurrency()
  const [visible, setVisible] = useState(false)
  const [firstRunDone, setFirstRunDone] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (currency) {
      setFirstRunDone(true)
      return
    }
    if (!firstRunDone) {
      const t = setTimeout(() => {
        setVisible(true)
        setFirstRunDone(true)
      }, delay)
      return () => clearTimeout(t)
    }
    setVisible(true)
  }, [ready, currency, delay, firstRunDone])

  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  const choose = (c: Currency) => {
    setCurrency(c)
    setVisible(false)
  }

  const copy = {
    es: {
      eyebrow: "Un detalle más",
      title: "¿Cómo prefieres ver los precios?",
      subtitle: "Elige la moneda en la que te resulta más natural comparar. Puedes cambiarlo cuando quieras.",
      cop: {
        label: "Pesos colombianos",
        desc: "Ideal si estás en Colombia o presupuestas en COP. Conversión a la tasa de referencia.",
        symbol: "COP",
        hint: "$ pesos",
      },
      usd: {
        label: "Dólares",
        desc: "Ideal si comparas con el mercado internacional o presupuestas en USD.",
        symbol: "USD",
        hint: "US$ dólares",
      },
    },
    en: {
      eyebrow: "One more detail",
      title: "How do you prefer to see prices?",
      subtitle: "Pick the currency that feels natural to you. You can switch anytime.",
      cop: {
        label: "Colombian pesos",
        desc: "Best if you're in Colombia or budget in COP. Converted at reference rate.",
        symbol: "COP",
        hint: "$ pesos",
      },
      usd: {
        label: "US Dollars",
        desc: "Best if you compare with the international market or budget in USD.",
        symbol: "USD",
        hint: "US$ dollars",
      },
    },
  }[lang]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="currency"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[210] flex items-center justify-center bg-background/95 px-6 backdrop-blur-md sm:px-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="currency-title"
        >
          <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-hairline sm:left-10 sm:top-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-hairline sm:right-10 sm:top-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-hairline sm:bottom-10 sm:left-10 sm:h-12 sm:w-12" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-hairline sm:bottom-10 sm:right-10 sm:h-12 sm:w-12" />

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-3xl text-center"
          >
            <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
              <span>{copy.eyebrow}</span>
              <span aria-hidden className="inline-block h-px w-6 bg-muted-foreground/60" />
            </p>

            <h2
              id="currency-title"
              className="mt-6 font-display text-3xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              {copy.title}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {copy.subtitle}
            </p>

            <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
              <CurrencyCard
                icon={<Coins className="h-6 w-6" strokeWidth={1.5} />}
                label={copy.cop.label}
                desc={copy.cop.desc}
                symbol={copy.cop.symbol}
                hint={copy.cop.hint}
                onClick={() => choose("COP")}
              />
              <CurrencyCard
                icon={<DollarSign className="h-6 w-6" strokeWidth={1.5} />}
                label={copy.usd.label}
                desc={copy.usd.desc}
                symbol={copy.usd.symbol}
                hint={copy.usd.hint}
                onClick={() => choose("USD")}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CurrencyCard({
  icon,
  label,
  desc,
  symbol,
  hint,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  symbol: string
  hint: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-start gap-4 border border-hairline bg-background/40 p-6 text-left transition-all hover:border-foreground hover:bg-foreground hover:text-background sm:p-8"
    >
      <span className="flex h-11 w-11 items-center justify-center border border-hairline text-foreground transition-colors group-hover:border-background group-hover:text-background">
        {icon}
      </span>
      <span className="font-display text-xl text-foreground transition-colors group-hover:text-background sm:text-2xl">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-background/80">
        {desc}
      </span>
      <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 transition-colors group-hover:text-background/70">
        {hint}
      </span>
      <span
        aria-hidden
        className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-background"
      >
        {symbol} →
      </span>
    </motion.button>
  )
}
