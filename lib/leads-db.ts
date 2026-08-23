/**
 * leads-db — capa mínima sobre @vercel/postgres.
 *
 * Si POSTGRES_URL no está configurada (Vercel Storage no creado aún),
 * las funciones devuelven un fallback silencioso y el sitio sigue
 * funcionando sin persistencia. Cuando Steven cree la DB en Vercel
 * dashboard, todo se activa sin cambios de código.
 */
import { sql } from "@vercel/postgres"

export interface Lead {
  id: number
  created_at: string
  project_type: string | null
  plan: string | null
  currency: string | null
  month_label: string | null
  client_brief: string | null
  summary: string | null
  lang: string | null
  ip: string | null
  referer: string | null
  commit1: boolean | null
  commit2: boolean | null
  commit3: boolean | null
  contacted: boolean
}

function dbAvailable(): boolean {
  return Boolean(process.env.POSTGRES_URL)
}

let tableReady = false

async function ensureTable(): Promise<void> {
  if (tableReady || !dbAvailable()) return
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id           SERIAL PRIMARY KEY,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      project_type TEXT,
      plan         TEXT,
      currency     TEXT,
      month_label  TEXT,
      client_brief TEXT,
      summary      TEXT,
      lang         TEXT,
      ip           TEXT,
      referer      TEXT,
      commit1      BOOLEAN,
      commit2      BOOLEAN,
      commit3      BOOLEAN,
      contacted    BOOLEAN NOT NULL DEFAULT false
    )
  `
  tableReady = true
}

export async function insertLead(input: {
  projectType: string
  plan: string
  currency: string
  monthLabel: string
  clientBrief: string
  summary: string
  lang: string
  ip: string
  referer: string
  commit1: boolean | null
  commit2: boolean | null
  commit3: boolean | null
}): Promise<boolean> {
  if (!dbAvailable()) return false
  try {
    await ensureTable()
    await sql`
      INSERT INTO leads (
        project_type, plan, currency, month_label, client_brief, summary,
        lang, ip, referer, commit1, commit2, commit3
      ) VALUES (
        ${input.projectType}, ${input.plan}, ${input.currency}, ${input.monthLabel},
        ${input.clientBrief}, ${input.summary}, ${input.lang}, ${input.ip},
        ${input.referer}, ${input.commit1}, ${input.commit2}, ${input.commit3}
      )
    `
    return true
  } catch (err) {
    console.error("[leads-db] insertLead failed:", err)
    return false
  }
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  if (!dbAvailable()) return []
  try {
    await ensureTable()
    const { rows } = await sql<Lead>`
      SELECT * FROM leads ORDER BY created_at DESC LIMIT ${limit}
    `
    return rows
  } catch (err) {
    console.error("[leads-db] listLeads failed:", err)
    return []
  }
}

export async function markContacted(id: number, contacted: boolean): Promise<boolean> {
  if (!dbAvailable()) return false
  try {
    await ensureTable()
    await sql`UPDATE leads SET contacted = ${contacted} WHERE id = ${id}`
    return true
  } catch (err) {
    console.error("[leads-db] markContacted failed:", err)
    return false
  }
}

export async function deleteLead(id: number): Promise<boolean> {
  if (!dbAvailable()) return false
  try {
    await ensureTable()
    await sql`DELETE FROM leads WHERE id = ${id}`
    return true
  } catch (err) {
    console.error("[leads-db] deleteLead failed:", err)
    return false
  }
}

export { dbAvailable }
