/**
 * Datenzugriffs-Schicht für Zeitslots und Buchungen.
 *
 * Wenn DATABASE_URL gesetzt ist, werden alle Daten in PostgreSQL (Supabase) gespeichert.
 * Andernfalls läuft alles im In-Memory-Speicher (Demo-Modus).
 *
 * Benötigte Tabellen (einmalig in Supabase SQL-Editor ausführen):
 *
 *   CREATE TABLE zeitslots (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     titel TEXT NOT NULL,
 *     beschreibung TEXT,
 *     datum DATE NOT NULL,
 *     uhrzeit_von TEXT NOT NULL,
 *     uhrzeit_bis TEXT NOT NULL,
 *     max_teilnehmer INTEGER NOT NULL DEFAULT 1,
 *     freigegeben BOOLEAN NOT NULL DEFAULT false,
 *     preis NUMERIC,
 *     kategorien TEXT[] NOT NULL DEFAULT '{}',
 *     erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 *
 *   -- Falls die Tabelle bereits existiert, zusätzlich ausführen:
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis NUMERIC;
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS kategorien TEXT[] NOT NULL DEFAULT '{}';
 *
 *   CREATE TABLE buchungen (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     zeitslot_id UUID REFERENCES zeitslots(id) ON DELETE SET NULL,
 *     vorname TEXT NOT NULL,
 *     nachname TEXT NOT NULL,
 *     email TEXT NOT NULL,
 *     telefon TEXT NOT NULL,
 *     name_kind TEXT NOT NULL,
 *     schulstufe TEXT NOT NULL,
 *     kind_staerken TEXT NOT NULL,
 *     kind_lernen TEXT NOT NULL,
 *     erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 */

import { Buchung, Zeitslot } from "@/types/buchung";
import { getDb, isDbConfigured } from "./db";

// ── PostgreSQL-Operationen ────────────────────────────────────────────────────

async function dbGetAlleSlots(): Promise<Zeitslot[]> {
  const sql = getDb()!;
  return sql<Zeitslot[]>`SELECT * FROM zeitslots ORDER BY datum ASC, uhrzeit_von ASC`;
}

async function dbGetSlot(id: string): Promise<Zeitslot | null> {
  const sql = getDb()!;
  const rows = await sql<Zeitslot[]>`SELECT * FROM zeitslots WHERE id = ${id}`;
  return rows[0] ?? null;
}

async function dbCreateSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  const sql = getDb()!;
  const rows = await sql<Zeitslot[]>`
    INSERT INTO zeitslots (titel, beschreibung, datum, uhrzeit_von, uhrzeit_bis, max_teilnehmer, freigegeben, preis, kategorien)
    VALUES (${data.titel}, ${data.beschreibung ?? null}, ${data.datum}, ${data.uhrzeit_von},
            ${data.uhrzeit_bis}, ${data.max_teilnehmer}, ${data.freigegeben},
            ${data.preis ?? null}, ${data.kategorien ?? []})
    RETURNING *
  `;
  return rows[0];
}

async function dbUpdateSlot(id: string, patch: Partial<Omit<Zeitslot, "id" | "erstellt_am">>): Promise<Zeitslot | null> {
  const sql = getDb()!;
  if (Object.keys(patch).length === 0) return dbGetSlot(id);
  const rows = await sql<Zeitslot[]>`
    UPDATE zeitslots SET ${sql(patch)} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ?? null;
}

async function dbDeleteSlot(id: string): Promise<boolean> {
  const sql = getDb()!;
  const result = await sql`DELETE FROM zeitslots WHERE id = ${id}`;
  return result.count > 0;
}

async function dbGetAlleBuchungen(): Promise<Buchung[]> {
  const sql = getDb()!;
  return sql<Buchung[]>`SELECT * FROM buchungen ORDER BY erstellt_am DESC`;
}

async function dbGetBuchungenFuerSlot(slotId: string): Promise<Buchung[]> {
  const sql = getDb()!;
  return sql<Buchung[]>`SELECT * FROM buchungen WHERE zeitslot_id = ${slotId}`;
}

async function dbCountBuchungenFuerSlot(slotId: string): Promise<number> {
  const sql = getDb()!;
  const rows = await sql<{ count: string }[]>`
    SELECT COUNT(*) as count FROM buchungen WHERE zeitslot_id = ${slotId}
  `;
  return parseInt(rows[0].count, 10);
}

async function dbCreateBuchung(data: Omit<Buchung, "id" | "erstellt_am">): Promise<Buchung> {
  const sql = getDb()!;
  const rows = await sql<Buchung[]>`
    INSERT INTO buchungen (zeitslot_id, vorname, nachname, email, telefon, name_kind, schulstufe, kind_staerken, kind_lernen)
    VALUES (${data.zeitslot_id}, ${data.vorname}, ${data.nachname}, ${data.email},
            ${data.telefon}, ${data.name_kind}, ${data.schulstufe}, ${data.kind_staerken}, ${data.kind_lernen})
    RETURNING *
  `;
  return rows[0];
}

// ── In-Memory Demo-Store (wenn keine DATABASE_URL gesetzt) ────────────────────

function demoSlots(): Zeitslot[] {
  const heute = new Date();
  const mkDatum = (offsetTage: number) => {
    const d = new Date(heute);
    d.setDate(d.getDate() + offsetTage);
    return d.toISOString().split("T")[0];
  };
  return [
    {
      id: "s1",
      titel: "Nachhilfe Mathematik",
      beschreibung: "Kleingruppenunterricht, max. 3 Schüler",
      datum: mkDatum(2),
      uhrzeit_von: "15:00",
      uhrzeit_bis: "16:30",
      max_teilnehmer: 3,
      freigegeben: true,
      preis: 180,
      kategorien: ["rechnen"],
      erstellt_am: new Date().toISOString(),
    },
    {
      id: "s2",
      titel: "Nachhilfe Deutsch",
      datum: mkDatum(3),
      uhrzeit_von: "14:00",
      uhrzeit_bis: "15:30",
      max_teilnehmer: 4,
      freigegeben: true,
      preis: 160,
      kategorien: ["lesen", "schreiben"],
      erstellt_am: new Date().toISOString(),
    },
    {
      id: "s3",
      titel: "Englisch Konversation",
      datum: mkDatum(5),
      uhrzeit_von: "16:00",
      uhrzeit_bis: "17:00",
      max_teilnehmer: 6,
      freigegeben: true,
      preis: 140,
      kategorien: ["konzentration"],
      erstellt_am: new Date().toISOString(),
    },
  ];
}

declare global {
  var __slotsStore: Map<string, Zeitslot> | undefined;
  var __buchungenStore: Map<string, Buchung> | undefined;
}

function getSlotsMap(): Map<string, Zeitslot> {
  if (!global.__slotsStore) {
    global.__slotsStore = new Map(demoSlots().map((s) => [s.id, s]));
  }
  return global.__slotsStore;
}

function getBuchungenMap(): Map<string, Buchung> {
  if (!global.__buchungenStore) {
    global.__buchungenStore = new Map();
  }
  return global.__buchungenStore;
}

// ── Öffentliche API ───────────────────────────────────────────────────────────

function memSlots(): Zeitslot[] {
  return Array.from(getSlotsMap().values()).sort(
    (a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit_von.localeCompare(b.uhrzeit_von)
  );
}

function memBuchungen(): Buchung[] {
  return Array.from(getBuchungenMap().values()).sort(
    (a, b) => b.erstellt_am.localeCompare(a.erstellt_am)
  );
}

export async function getAlleSlots(): Promise<Zeitslot[]> {
  if (isDbConfigured()) {
    try { return await dbGetAlleSlots(); } catch { /* fall through */ }
  }
  return memSlots();
}

export async function getFreigegebeneSlots(): Promise<Zeitslot[]> {
  if (isDbConfigured()) {
    try {
      const sql = getDb()!;
      return await sql<Zeitslot[]>`SELECT * FROM zeitslots WHERE freigegeben = true ORDER BY datum ASC, uhrzeit_von ASC`;
    } catch { /* fall through */ }
  }
  return Array.from(getSlotsMap().values()).filter((s) => s.freigegeben);
}

export async function getSlot(id: string): Promise<Zeitslot | null> {
  if (isDbConfigured()) {
    try { return await dbGetSlot(id); } catch { /* fall through */ }
  }
  return getSlotsMap().get(id) ?? null;
}

export async function createSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  if (isDbConfigured()) return dbCreateSlot(data);
  const slot: Zeitslot = { ...data, id: crypto.randomUUID(), erstellt_am: new Date().toISOString() };
  getSlotsMap().set(slot.id, slot);
  return slot;
}

export async function updateSlot(id: string, patch: Partial<Omit<Zeitslot, "id" | "erstellt_am">>): Promise<Zeitslot | null> {
  if (isDbConfigured()) return dbUpdateSlot(id, patch);
  const existing = getSlotsMap().get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  getSlotsMap().set(id, updated);
  return updated;
}

export async function deleteSlot(id: string): Promise<boolean> {
  if (isDbConfigured()) return dbDeleteSlot(id);
  return getSlotsMap().delete(id);
}

export async function getAlleBuchungen(): Promise<Buchung[]> {
  if (isDbConfigured()) {
    try { return await dbGetAlleBuchungen(); } catch { /* fall through */ }
  }
  return memBuchungen();
}

export async function getBuchungenFuerSlot(slotId: string): Promise<Buchung[]> {
  if (isDbConfigured()) {
    try { return await dbGetBuchungenFuerSlot(slotId); } catch { /* fall through */ }
  }
  return memBuchungen().filter((b) => b.zeitslot_id === slotId);
}

export async function countBuchungenFuerSlot(slotId: string): Promise<number> {
  if (isDbConfigured()) {
    try { return await dbCountBuchungenFuerSlot(slotId); } catch { /* fall through */ }
  }
  return memBuchungen().filter((b) => b.zeitslot_id === slotId).length;
}

export async function createBuchung(
  data: Omit<Buchung, "id" | "erstellt_am">
): Promise<Buchung | { error: string }> {
  const slot = await getSlot(data.zeitslot_id);
  if (!slot) return { error: "Zeitslot nicht gefunden." };
  if (!slot.freigegeben) return { error: "Dieser Zeitslot ist nicht verfügbar." };

  const belegt = await countBuchungenFuerSlot(slot.id);
  if (belegt >= slot.max_teilnehmer) return { error: "Dieser Zeitslot ist bereits ausgebucht." };

  if (isDbConfigured()) return dbCreateBuchung(data);

  const buchung: Buchung = {
    ...data,
    id: crypto.randomUUID(),
    erstellt_am: new Date().toISOString(),
  };
  getBuchungenMap().set(buchung.id, buchung);
  return buchung;
}

export async function getFreiePlaetze(slotId: string): Promise<number> {
  const slot = await getSlot(slotId);
  if (!slot) return 0;
  const belegt = await countBuchungenFuerSlot(slotId);
  return slot.max_teilnehmer - belegt;
}
