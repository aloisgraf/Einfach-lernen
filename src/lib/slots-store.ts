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
 *     preis_5er NUMERIC,
 *     preis_10er NUMERIC,
 *     kategorien TEXT[] NOT NULL DEFAULT '{}',
 *     gruppe_id UUID,
 *     erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 *
 *   -- Falls die Tabelle bereits existiert, zusätzlich ausführen:
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis NUMERIC;
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_5er NUMERIC;
 *   -- ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_10er NUMERIC;
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
import { getDb, resetDb, isDbConfigured, mitTimeout } from "./db";

// ── Schema-Migration ──────────────────────────────────────────────────────────

declare global {
  var __slotsSchemaMigriert: Promise<void> | undefined;
}

function slotsSchemaSicherstellen(): Promise<void> {
  if (!global.__slotsSchemaMigriert) {
    const sql = getDb()!;
    global.__slotsSchemaMigriert = (async () => {
      const migrationen = [
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_2er NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_5er NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_10er NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_legasthenie NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS preis_dyskalkulie NUMERIC`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS kategorien TEXT[] NOT NULL DEFAULT '{}'`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS gruppe_id UUID`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS kurs TEXT`,
        sql`ALTER TABLE zeitslots ADD COLUMN IF NOT EXISTS notizen TEXT`,
        sql`ALTER TABLE buchungen ADD COLUMN IF NOT EXISTS kurs_name TEXT NOT NULL DEFAULT ''`,
        sql`ALTER TABLE buchungen ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'`,
        sql`ALTER TABLE buchungen ADD COLUMN IF NOT EXISTS batch_id TEXT NOT NULL DEFAULT ''`,
      ];
      for (const migration of migrationen) {
        try { await mitTimeout(migration, 8000); } catch (e) { console.error("Schema-Migration fehlgeschlagen:", e); }
      }
    })();
  }
  return global.__slotsSchemaMigriert;
}

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

/** Liest aus einer Postgres-"column does not exist"-Fehlermeldung den Spaltennamen heraus. */
function fehlendeSpalte(e: unknown): string | null {
  const code = (e as { code?: string })?.code;
  const msg = String(e);
  if (code !== "42703" && !msg.includes("does not exist")) return null;
  const match = msg.match(/column "?(\w+)"? (?:of relation "?\w+"? )?does not exist/);
  return match?.[1] ?? null;
}

async function dbCreateSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  await slotsSchemaSicherstellen();
  const sql = getDb()!;
  const felder: Record<string, unknown> = {
    titel: data.titel,
    beschreibung: data.beschreibung ?? null,
    kurs: (data as any).kurs ?? null,
    notizen: (data as any).notizen ?? null,
    datum: data.datum,
    uhrzeit_von: data.uhrzeit_von,
    uhrzeit_bis: data.uhrzeit_bis,
    max_teilnehmer: data.max_teilnehmer,
    freigegeben: data.freigegeben,
    preis: data.preis ?? null,
    preis_2er: (data as any).preis_2er ?? null,
    preis_5er: data.preis_5er ?? null,
    preis_10er: data.preis_10er ?? null,
    preis_legasthenie: (data as any).preis_legasthenie ?? null,
    preis_dyskalkulie: (data as any).preis_dyskalkulie ?? null,
    gruppe_id: data.gruppe_id ?? null,
  };
  for (let versuch = 0; versuch < Object.keys(felder).length; versuch++) {
    try {
      const rows = await sql<Zeitslot[]>`INSERT INTO zeitslots ${sql(felder)} RETURNING *`;
      if (!rows || !rows[0]) throw new Error("INSERT returned no rows");
      return rows[0];
    } catch (e) {
      const spalte = fehlendeSpalte(e);
      if (spalte && spalte in felder) {
        delete felder[spalte];
        continue;
      }
      throw e;
    }
  }
  throw new Error("INSERT fehlgeschlagen.");
}

async function dbUpdateSlot(id: string, patch: Partial<Omit<Zeitslot, "id" | "erstellt_am">>): Promise<Zeitslot | null> {
  await slotsSchemaSicherstellen();
  const sql = getDb()!;
  const felder: Record<string, unknown> = { ...patch };
  // Arrays müssen explizit als Postgres-Array übergeben werden, sonst
  // serialisiert postgres.js sie als kommagetrennten String ("malformed array literal").
  if (Array.isArray(felder.kategorien)) {
    felder.kategorien = sql.array(felder.kategorien as string[]);
  }
  if (Object.keys(felder).length === 0) return dbGetSlot(id);
  for (let versuch = 0; versuch < Object.keys(felder).length; versuch++) {
    if (Object.keys(felder).length === 0) return dbGetSlot(id);
    try {
      const rows = await sql<Zeitslot[]>`UPDATE zeitslots SET ${sql(felder)} WHERE id = ${id} RETURNING *`;
      return rows[0] ?? null;
    } catch (e) {
      const spalte = fehlendeSpalte(e);
      if (spalte && spalte in felder) {
        delete felder[spalte];
        continue;
      }
      throw e;
    }
  }
  return dbGetSlot(id);
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

async function dbCreateBuchung(data: CreateBuchungData): Promise<Buchung> {
  await slotsSchemaSicherstellen();
  const sql = getDb()!;
  const status = data.status ?? "pending";
  const batch_id = data.batch_id ?? "";
  const rows = await sql<Buchung[]>`
    INSERT INTO buchungen (zeitslot_id, vorname, nachname, email, telefon, name_kind, schulstufe, kind_staerken, kind_lernen, kurs_name, status, batch_id)
    VALUES (${data.zeitslot_id}, ${data.vorname}, ${data.nachname}, ${data.email},
            ${data.telefon}, ${data.name_kind}, ${data.schulstufe}, ${data.kind_staerken}, ${data.kind_lernen}, ${data.kurs_name}, ${status}, ${batch_id})
    RETURNING *
  `;
  return rows[0];
}

async function dbDeleteBuchung(id: string): Promise<boolean> {
  const sql = getDb()!;
  const result = await sql`DELETE FROM buchungen WHERE id = ${id}`;
  return result.count > 0;
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
      kurs: "Einzelstunde",
      notizen: "Kleingruppenunterricht, max. 3 Schüler",
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
      kurs: "Einzelstunde",
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
      kurs: "Einzelstunde",
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
    try { return await mitTimeout(dbGetAlleSlots()); } catch (e) {
      console.error("getAlleSlots DB-Fehler:", e);
      resetDb();
      return [];
    }
  }
  return memSlots();
}

export async function getFreigegebeneSlots(): Promise<Zeitslot[]> {
  if (isDbConfigured()) {
    try {
      const sql = getDb()!;
      return await mitTimeout(sql<Zeitslot[]>`SELECT * FROM zeitslots WHERE freigegeben = true ORDER BY datum ASC, uhrzeit_von ASC`);
    } catch (e) {
      console.error("getFreigegebeneSlots DB-Fehler:", e);
      resetDb();
      return [];
    }
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
    try { return await mitTimeout(dbGetAlleBuchungen()); } catch (e) {
      console.error("getAlleBuchungen DB-Fehler:", e);
      resetDb();
    }
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

/** Zählt unterschiedliche Anmelder (nicht Kinder) für einen Slot. */
async function countAnmeldernFuerSlot(slotId: string): Promise<number> {
  const buchungen = await getAlleBuchungen();
  const anmelder = new Set(
    buchungen
      .filter((b) => b.zeitslot_id === slotId)
      .map((b) => `${b.vorname}|${b.nachname}|${b.email}`)
  );
  return anmelder.size;
}

/** Prüft, ob ein bestimmter Anmelder bereits Kinder für einen Slot gebucht hat. */
async function anmelderHatBereitsGebucht(slotId: string, vorname: string, nachname: string, email: string): Promise<boolean> {
  const buchungen = await getAlleBuchungen();
  return buchungen.some((b) =>
    b.zeitslot_id === slotId &&
    b.vorname === vorname &&
    b.nachname === nachname &&
    b.email === email
  );
}

async function einzelnesSlotPruefen(slot: Zeitslot): Promise<string | null> {
  if (!slot.freigegeben) return "Dieser Termin ist nicht verfügbar.";
  const belegt = await countBuchungenFuerSlot(slot.id);
  if (belegt >= slot.max_teilnehmer) return "Dieser Termin ist bereits ausgebucht.";
  return null;
}

/** Prüft, ob ein Slot für einen bestimmten Anmelder verfügbar ist.
 *  - Wenn noch kein Anmelder gebucht hat: verfügbar
 *  - Wenn der gleiche Anmelder bereits gebucht hat: verfügbar (kann mehr Kinder hinzufügen)
 *  - Einzelstunde (kein gruppe_id): exklusiv für eine Familie – hat ein anderer Anmelder
 *    bereits gebucht, ist der Termin ausgebucht.
 *  - Gruppenkurs (gruppe_id gesetzt): mehrere Familien können buchen, bis max_teilnehmer
 *    erreicht ist.
 */
async function slotVerfuegbarFuerAnmelder(
  slot: Zeitslot,
  vorname: string,
  nachname: string,
  email: string
): Promise<string | null> {
  if (!slot.freigegeben) return "Dieser Termin ist nicht verfügbar.";

  // Prüfe, wie viele Kinder dieser Anmelder bereits gebucht hat
  const meineBuchungen = (await getAlleBuchungen()).filter((b) =>
    b.zeitslot_id === slot.id &&
    b.vorname === vorname &&
    b.nachname === nachname &&
    b.email === email
  );

  // Wenn ich bereits Kinder gebucht habe, prüfe nur, ob noch Platz für weitere Kinder ist
  if (meineBuchungen.length > 0) {
    if (meineBuchungen.length >= slot.max_teilnehmer) {
      return "Du hast bereits die maximale Anzahl von Kindern für diesen Termin angemeldet.";
    }
    return null; // Ich kann noch mehr Kinder hinzufügen
  }

  if (slot.gruppe_id) {
    // Gruppenkurs: mehrere Familien teilen sich die max_teilnehmer Plätze
    const belegt = await countBuchungenFuerSlot(slot.id);
    if (belegt >= slot.max_teilnehmer) {
      return "Dieser Termin ist bereits ausgebucht.";
    }
    return null;
  }

  // Einzelstunde: Wenn ich noch nicht gebucht habe, prüfe, ob jemand anderes bereits gebucht hat
  const andereAnmelder = await countAnmeldernFuerSlot(slot.id);
  if (andereAnmelder > 0) {
    return "Dieser Termin ist bereits von einer anderen Familie gebucht.";
  }

  return null;
}

export type CreateBuchungData = Omit<Buchung, "id" | "erstellt_am" | "status" | "batch_id"> & { status?: Buchung["status"]; batch_id?: string };

async function einzelneBuchungAnlegen(data: CreateBuchungData): Promise<Buchung> {
  if (isDbConfigured()) return dbCreateBuchung(data);
  const buchung: Buchung = {
    ...data,
    status: data.status ?? "pending",
    batch_id: data.batch_id ?? "",
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
  data: CreateBuchungData
): Promise<Buchung | { error: string }> {
  const slot = await getSlot(data.zeitslot_id);
  if (!slot) return { error: "Zeitslot nicht gefunden." };

  if (slot.gruppe_id) {
    const gruppenSlots = await getSlotsByGruppe(slot.gruppe_id);
    for (const s of gruppenSlots) {
      const fehler = await slotVerfuegbarFuerAnmelder(s, data.vorname, data.nachname, data.email);
      if (fehler) return { error: `${fehler} (Kurs besteht aus mehreren Terminen, die gemeinsam gebucht werden.)` };
    }
    let erste: Buchung | null = null;
    for (const s of gruppenSlots) {
      const buchung = await einzelneBuchungAnlegen({ ...data, zeitslot_id: s.id });
      if (!erste) erste = buchung;
    }
    return erste!;
  }

  const fehler = await slotVerfuegbarFuerAnmelder(slot, data.vorname, data.nachname, data.email);
  if (fehler) return { error: fehler };

  return einzelneBuchungAnlegen(data);
}

export async function deleteBuchung(id: string): Promise<boolean> {
  if (isDbConfigured()) {
    try { return await dbDeleteBuchung(id); } catch (e) { console.error("deleteBuchung DB-Fehler:", e); }
  }
  return getBuchungenMap().delete(id);
}

export async function getFreiePlaetze(slotId: string): Promise<number> {
  const slot = await getSlot(slotId);
  if (!slot) return 0;
  const belegt = await countBuchungenFuerSlot(slotId);
  return slot.max_teilnehmer - belegt;
}

export async function updateBuchungStatus(
  id: string,
  status: Buchung["status"]
): Promise<Buchung | null> {
  if (isDbConfigured()) {
    try {
      const sql = getDb()!;
      const rows = await sql<Buchung[]>`
        UPDATE buchungen SET status = ${status} WHERE id = ${id} RETURNING *
      `;
      return rows[0] ?? null;
    } catch (e) {
      console.error("updateBuchungStatus DB-Fehler:", e);
      return null;
    }
  }
  const buchung = getBuchungenMap().get(id);
  if (!buchung) return null;
  const updated = { ...buchung, status };
  getBuchungenMap().set(id, updated);
  return updated;
}
