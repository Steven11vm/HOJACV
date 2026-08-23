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
 * Formatea un valor USD según la moneda elegida:
 *  fmtSingle(400, "USD") → "US$ 400"
 *  fmtSingle(400, "COP") → "$ 1.680.000"
 */
export function fmtSingle(usd: number, currency: Currency | null): string {
  const c: Currency = currency ?? "USD"
  if (c === "USD") return `US$ ${usd.toLocaleString("en-US")}`
  const cop = usd * USD_TO_COP
  return `$ ${cop.toLocaleString("es-CO")}`
}

/**
 * Formatea un rango USD según la moneda elegida:
 *  fmtRange(8000, 15000, "USD") → "US$ 8k – 15k"
 *  fmtRange(8000, 15000, "COP") → "$ 34 – 63 M"
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
