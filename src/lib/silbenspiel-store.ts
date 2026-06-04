/**
 * Datenzugriffs-Schicht für das Silbenspiel.
 *
 * Wenn DATABASE_URL gesetzt ist, werden alle Daten in PostgreSQL (Supabase) gespeichert.
 * Andernfalls läuft alles im In-Memory-Speicher (Demo-Modus).
 *
 * Benötigte Tabelle (einmalig in Supabase SQL-Editor ausführen):
 *
 *   CREATE TABLE silben_woerter (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     wort TEXT NOT NULL,
 *     silben TEXT[] NOT NULL,
 *     aktiv BOOLEAN NOT NULL DEFAULT true,
 *     erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 */

import { SilbenWort } from "@/types/silbenspiel";
import { getDb, isDbConfigured } from "./db";

// ── PostgreSQL-Operationen ────────────────────────────────────────────────────

async function dbGetAlle(): Promise<SilbenWort[]> {
  const sql = getDb()!;
  return sql<SilbenWort[]>`SELECT * FROM silben_woerter ORDER BY erstellt_am DESC`;
}

async function dbGetAktive(): Promise<SilbenWort[]> {
  const sql = getDb()!;
  return sql<SilbenWort[]>`SELECT * FROM silben_woerter WHERE aktiv = true ORDER BY erstellt_am DESC`;
}

async function dbCreate(data: Omit<SilbenWort, "id" | "erstellt_am">): Promise<SilbenWort> {
  const sql = getDb()!;
  const rows = await sql<SilbenWort[]>`
    INSERT INTO silben_woerter (wort, silben, aktiv)
    VALUES (${data.wort}, ${data.silben}, ${data.aktiv})
    RETURNING *
  `;
  return rows[0];
}

async function dbUpdate(id: string, patch: Partial<Omit<SilbenWort, "id" | "erstellt_am">>): Promise<SilbenWort | null> {
  const sql = getDb()!;
  if (Object.keys(patch).length === 0) {
    const rows = await sql<SilbenWort[]>`SELECT * FROM silben_woerter WHERE id = ${id}`;
    return rows[0] ?? null;
  }
  const rows = await sql<SilbenWort[]>`
    UPDATE silben_woerter SET ${sql(patch)} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ?? null;
}

async function dbDelete(id: string): Promise<boolean> {
  const sql = getDb()!;
  const result = await sql`DELETE FROM silben_woerter WHERE id = ${id}`;
  return result.count > 0;
}

// ── In-Memory Demo-Store (wenn keine DATABASE_URL gesetzt) ────────────────────

function demoWoerter(): SilbenWort[] {
  return [
    { id: "sw1", wort: "Schmetterling", silben: ["Schmet", "ter", "ling"], aktiv: true, erstellt_am: new Date().toISOString() },
    { id: "sw2", wort: "Kindergarten", silben: ["Kin", "der", "gar", "ten"], aktiv: true, erstellt_am: new Date().toISOString() },
    { id: "sw3", wort: "Sonnenschein", silben: ["Son", "nen", "schein"], aktiv: true, erstellt_am: new Date().toISOString() },
    { id: "sw4", wort: "Apfelbaum", silben: ["Ap", "fel", "baum"], aktiv: true, erstellt_am: new Date().toISOString() },
    { id: "sw5", wort: "Hausaufgabe", silben: ["Haus", "auf", "ga", "be"], aktiv: true, erstellt_am: new Date().toISOString() },
  ];
}

declare global {
  // eslint-disable-next-line no-var
  var __silbenStore: Map<string, SilbenWort> | undefined;
}

function getStore(): Map<string, SilbenWort> {
  if (!global.__silbenStore) {
    global.__silbenStore = new Map(demoWoerter().map((w) => [w.id, w]));
  }
  return global.__silbenStore;
}

// ── Öffentliche API ───────────────────────────────────────────────────────────

export async function getAlleSilbenWoerter(): Promise<SilbenWort[]> {
  if (isDbConfigured()) {
    try { return await dbGetAlle(); } catch { /* fall through */ }
  }
  return Array.from(getStore().values()).sort(
    (a, b) => b.erstellt_am.localeCompare(a.erstellt_am)
  );
}

export async function getAktiveSilbenWoerter(): Promise<SilbenWort[]> {
  if (isDbConfigured()) {
    try { return await dbGetAktive(); } catch { /* fall through */ }
  }
  return Array.from(getStore().values())
    .filter((w) => w.aktiv)
    .sort((a, b) => b.erstellt_am.localeCompare(a.erstellt_am));
}

export async function createSilbenWort(data: Omit<SilbenWort, "id" | "erstellt_am">): Promise<SilbenWort> {
  if (isDbConfigured()) return dbCreate(data);
  const wort: SilbenWort = { ...data, id: crypto.randomUUID(), erstellt_am: new Date().toISOString() };
  getStore().set(wort.id, wort);
  return wort;
}

export async function updateSilbenWort(id: string, patch: Partial<Omit<SilbenWort, "id" | "erstellt_am">>): Promise<SilbenWort | null> {
  if (isDbConfigured()) return dbUpdate(id, patch);
  const existing = getStore().get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  getStore().set(id, updated);
  return updated;
}

export async function deleteSilbenWort(id: string): Promise<boolean> {
  if (isDbConfigured()) return dbDelete(id);
  return getStore().delete(id);
}
