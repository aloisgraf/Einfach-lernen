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
 *     gruppe_id UUID,
 *     erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 *
 *   -- Falls die Tabelle bereits existiert, zusätzlich ausführen:
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis NUMERIC;
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS kategorien TEXT[] NOT NULL DEFAULT '{}';
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS gruppe_id UUID;
 *
 *   -- gruppe_id verknüpft die Termine eines mehrtägigen Kurses: bucht ein Kunde
 *   -- einen Termin mit gesetzter gruppe_id, werden automatisch alle Termine
 *   -- derselben Gruppe für ihn gebucht (siehe createBuchung unten).
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

async function dbGetSlotsByGruppe(gruppeId: string): Promise<Zeitslot[]> {
  const sql = getDb()!;
  return sql<Zeitslot[]>`SELECT * FROM zeitslots WHERE gruppe_id = ${gruppeId} ORDER BY datum ASC`;
}

async function dbCreateSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  const sql = getDb()!;
  const felder: Record<string, unknown> = {
    titel: data.titel,
    beschreibung: data.beschreibung ?? null,
    datum: data.datum,
    uhrzeit_von: data.uhrzeit_von,
    uhrzeit_bis: data.uhrzeit_bis,
    max_teilnehmer: data.max_teilnehmer,
    freigegeben: data.freigegeben,
    preis: data.preis ?? null,
    kategorien: data.kategorien ?? [],
    gruppe_id: data.gruppe_id ?? null,
  };
  try {
    const rows = await sql<Zeitslot[]>`INSERT INTO zeitslots ${sql(felder)} RETURNING *`;
    return rows[0];
  } catch (e) {
    if ((e as { code?: string })?.code === "42703") {
      delete felder.gruppe_id;
      const rows = await sql<Zeitslot[]>`INSERT INTO zeitslots ${sql(felder)} RETURNING *`;
      return rows[0];
    }
    throw e;
  }
}

async function dbUpdateSlot(id: string, patch: Partial<Omit<Zeitslot, "id" | "erstellt_am">>): Promise<Zeitslot | null> {
  const sql = getDb()!;
  if (Object.keys(patch).length === 0) return dbGetSlot(id);
  try {
    const rows = await sql<Zeitslot[]>`
      UPDATE zeitslots SET ${sql(patch)} WHERE id = ${id} RETURNING *
    `;
    return rows[0] ?? null;
  } catch (e) {
    if ((e as { code?: string })?.code === "42703" && "gruppe_id" in patch) {
      const ohneGruppe = { ...patch };
      delete ohneGruppe.gruppe_id;
      if (Object.keys(ohneGruppe).length === 0) return dbGetSlot(id);
      const rows = await sql<Zeitslot[]>`
        UPDATE zeitslots SET ${sql(ohneGruppe)} WHERE id = ${id} RETURNING *
      `;
      return rows[0] ?? null;
    }
    throw e;
  }
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

export async function getSlotsByGruppe(gruppeId: string): Promise<Zeitslot[]> {
  if (isDbConfigured()) {
    try { return await dbGetSlotsByGruppe(gruppeId); } catch { /* fall through */ }
  }
  return memSlots().filter((s) => s.gruppe_id === gruppeId);
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

async function einzelnesSlotPruefen(slot: Zeitslot): Promise<string | null> {
  if (!slot.freigegeben) return "Dieser Termin ist nicht verfügbar.";
  const belegt = await countBuchungenFuerSlot(slot.id);
  if (belegt >= slot.max_teilnehmer) return "Dieser Termin ist bereits ausgebucht.";
  return null;
}

async function einzelneBuchungAnlegen(data: Omit<Buchung, "id" | "erstellt_am">): Promise<Buchung> {
  if (isDbConfigured()) return dbCreateBuchung(data);
  const buchung: Buchung = {
    ...data,
    id: crypto.randomUUID(),
    erstellt_am: new Date().toISOString(),
  };
  getBuchungenMap().set(buchung.id, buchung);
  return buchung;
}

/**
 * Bucht einen Zeitslot. Gehört der Slot zu einer Gruppe (mehrtägiger Kurs),
 * werden automatisch alle Termine der Gruppe für denselben Kunden gebucht –
 * entweder alle oder keiner (jeder Termin braucht einen freien Platz).
 */
export async function createBuchung(
  data: Omit<Buchung, "id" | "erstellt_am">
): Promise<Buchung | { error: string }> {
  const slot = await getSlot(data.zeitslot_id);
  if (!slot) return { error: "Zeitslot nicht gefunden." };

  if (slot.gruppe_id) {
    const gruppenSlots = await getSlotsByGruppe(slot.gruppe_id);
    for (const s of gruppenSlots) {
      const fehler = await einzelnesSlotPruefen(s);
      if (fehler) return { error: `${fehler} (Kurs besteht aus mehreren Terminen, die gemeinsam gebucht werden.)` };
    }
    let erste: Buchung | null = null;
    for (const s of gruppenSlots) {
      const buchung = await einzelneBuchungAnlegen({ ...data, zeitslot_id: s.id });
      if (!erste) erste = buchung;
    }
    return erste!;
  }

  const fehler = await einzelnesSlotPruefen(slot);
  if (fehler) return { error: fehler };

  return einzelneBuchungAnlegen(data);
}

export async function getFreiePlaetze(slotId: string): Promise<number> {
  const slot = await getSlot(slotId);
  if (!slot) return 0;
  const belegt = await countBuchungenFuerSlot(slotId);
  return slot.max_teilnehmer - belegt;
}
