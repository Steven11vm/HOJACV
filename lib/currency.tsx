"use client"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type Currency = "COP" | "USD"
export const CURRENCY_KEY = "cv_currency"
export const USD_TO_COP = 4200

type CurrencyCtx = {
  currency: Currency | null
  setCurrency: (c: Currency) => void
  clearCurrency: () => void
  ready: boolean
}

const Ctx = createContext<CurrencyCtx | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)
      if (saved === "COP" || saved === "USD") setCurrencyState(saved)
    } catch {
      /* silent */
    }
    setReady(true)
  }, [])

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c)
    try {
      localStorage.setItem(CURRENCY_KEY, c)
    } catch {
      /* silent */
    }
  }, [])

  const clearCurrency = useCallback(() => {
    setCurrencyState(null)
    try {
      localStorage.removeItem(CURRENCY_KEY)
    } catch {
      /* silent */
    }
  }, [])

  return <Ctx.Provider value={{ currency, setCurrency, clearCurrency, ready }}>{children}</Ctx.Provider>
}

/**
 * Devuelve el contexto de moneda si hay provider en el árbol, o un fallback
 * seguro si no lo hay. Fallback:
 *  - Necesario durante el pre-render estático de Next: los componentes se
 *    renderizan primero como HTML sin el provider hidratado aún, y un
 *    throw haría fallar el build.
 *  - Cualquier setter/clear es no-op en el fallback (el estado se aplicará
 *    cuando el cliente hidrate y encuentre el provider real).
 */
export function useCurrency(): CurrencyCtx {
  const c = useContext(Ctx)
  if (c) return c
  return {
    currency: null,
    setCurrency: () => {},
    clearCurrency: () => {},
    ready: false,
  }
}

/**
 * Formatea un valor USD según la moneda elegida (utility legacy).
 */
export function fmtSingle(usd: number, currency: Currency | null): string {
  const c: Currency = currency ?? "USD"
  if (c === "USD") return `US$ ${usd.toLocaleString("en-US")}`
  const cop = usd * USD_TO_COP
  return `$ ${cop.toLocaleString("es-CO")}`
}

/**
 * Formatea un rango USD según la moneda elegida (utility legacy).
 */
export function fmtRange(minUsd: number, maxUsd: number, currency: Currency | null): string {
  const c: Currency = currency ?? "USD"
  if (c === "USD") {
    const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)
    return `US$ ${fmt(minUsd)} – ${fmt(maxUsd)}`
  }
  const minM = Math.round((minUsd * USD_TO_COP) / 1_000_000)
  const maxM = Math.round((maxUsd * USD_TO_COP) / 1_000_000)
  return `$ ${minM} – ${maxM} M`
}

/**
 * Pricebook — precios INDEPENDIENTES por moneda, NO conversión matemática.
 *
 * En COP los precios son intencionalmente más bajos que la conversión
 * directa USD → COP (donde $600 000 COP ≈ US$ 143, muy por debajo del
 * conversion baseline de US$ 400). Motivo: Steven prioriza construir
 * cartera de clientes colombianos primero, y los cobra a "precio vecino"
 * sin markup por diferencial de tasa de cambio.
 *
 * USD conserva el pricing internacional para el visitante que compara
 * contra freelance USA o agencias LATAM.
 */
export function pricebook(currency: Currency | null) {
  const isCop = currency === "COP"
  if (isCop) {
    return {
      starter:      "$ 600.000",
      starterFirst: "$ 570.000",           // descuento primer landing
      starterSave:  "− $ 30.000",          // ahorro visible
      growth:       "$ 1.800.000",
      complete:     "$ 3.800.000",
      rangeLo:      "$ 570.000",
      rangeHi:      "$ 3.800.000",
      anchorSteven: "desde $ 570.000",
      anchorAgency: "$ 30 – 60 M",
      anchorUsFree: "$ 12 – 25 M",
      isCop:        true as const,
    }
  }
  return {
    starter:      "US$ 400",
    starterFirst: "US$ 380",               // descuento primer landing
    starterSave:  "− US$ 20",              // ahorro visible
    growth:       "US$ 1 200",
    complete:     "US$ 2 200",
    rangeLo:      "US$ 380",
    rangeHi:      "US$ 2 200",
    anchorSteven: "desde US$ 380",
    anchorAgency: "US$ 8k – 15k",
    anchorUsFree: "US$ 3k – 6k",
    isCop:        false as const,
  }
}
