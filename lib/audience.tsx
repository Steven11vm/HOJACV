"use client"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type Audience = "client" | "recruiter"
export const AUDIENCE_KEY = "cv_audience"

type AudienceCtx = {
  audience: Audience | null
  setAudience: (a: Audience) => void
  clearAudience: () => void
  ready: boolean
}

const Ctx = createContext<AudienceCtx | null>(null)

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUDIENCE_KEY)
      if (saved === "client" || saved === "recruiter") setAudienceState(saved)
    } catch {
      /* silent */
    }
    setReady(true)
  }, [])

  const setAudience = useCallback((a: Audience) => {
    setAudienceState(a)
    try {
      localStorage.setItem(AUDIENCE_KEY, a)
    } catch {
      /* silent */
    }
  }, [])

  const clearAudience = useCallback(() => {
    setAudienceState(null)
    try {
      localStorage.removeItem(AUDIENCE_KEY)
    } catch {
      /* silent */
    }
  }, [])

  return <Ctx.Provider value={{ audience, setAudience, clearAudience, ready }}>{children}</Ctx.Provider>
}

export function useAudience() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useAudience must be used within AudienceProvider")
  return c
}

/**
 * Renderiza `children` solo cuando el audience seleccionado coincide con `only`
 * (uno o varios). Mientras el provider hidrata desde localStorage renderiza
 * `fallback` (por defecto `null`) para evitar mostrar el bloque y luego
 * esconderlo cuando el audience real llegue. Útil para secciones que solo
 * aplican a un perfil, p. ej. Servicios comerciales para clientes.
 */
export function AudienceOnly({
  only,
  children,
  fallback = null,
}: {
  only: Audience | Audience[]
  children: ReactNode
  fallback?: ReactNode
}) {
  const { audience, ready } = useAudience()
  if (!ready) return <>{fallback}</>
  const allowed = Array.isArray(only) ? only : [only]
  if (!audience || !allowed.includes(audience)) return <>{fallback}</>
  return <>{children}</>
}
