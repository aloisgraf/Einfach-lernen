/**
 * Datenzugriffs-Schicht für Zeitslots und Buchungen.
 *
 * Wenn NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY gesetzt sind,
 * werden alle Daten in Supabase gespeichert.
 * Andernfalls läuft alles im In-Memory-Speicher (Demo-Modus).
 *
 * Benötigte Supabase-Tabellen:
 *   zeitslots (id uuid PK, titel text, beschreibung text, datum date,
 *              uhrzeit_von text, uhrzeit_bis text, max_teilnehmer int,
 *              freigegeben bool default false, erstellt_am timestamptz default now())
 *
 *   buchungen (id uuid PK, zeitslot_id uuid, vorname text, nachname text,
 *              email text, telefon text, name_kind text, schulstufe text,
 *              kind_staerken text, kind_lernen text, erstellt_am timestamptz default now())
 */

import { Buchung, Zeitslot } from "@/types/buchung";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function sfetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  return fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers as Record<string, string>),
    },
    cache: "no-store",
  });
}

// ── Supabase Slot-Operationen ─────────────────────────────────────────────────

async function sbGetAlleSlots(): Promise<Zeitslot[]> {
  const res = await sfetch("/zeitslots?order=datum.asc,uhrzeit_von.asc&select=*");
  if (!res.ok) throw new Error("Fehler beim Laden der Slots");
  return res.json();
}

async function sbGetSlot(id: string): Promise<Zeitslot | null> {
  const res = await sfetch(`/zeitslots?id=eq.${id}&select=*`);
  if (!res.ok) return null;
  const data: Zeitslot[] = await res.json();
  return data[0] ?? null;
}

async function sbCreateSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  const res = await sfetch("/zeitslots", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Slots");
  const created: Zeitslot[] = await res.json();
  return created[0];
}

async function sbUpdateSlot(id: string, patch: Partial<Zeitslot>): Promise<Zeitslot | null> {
  const res = await sfetch(`/zeitslots?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  if (!res.ok) return null;
  const updated: Zeitslot[] = await res.json();
  return updated[0] ?? null;
}

async function sbDeleteSlot(id: string): Promise<boolean> {
  const res = await sfetch(`/zeitslots?id=eq.${id}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  return res.ok;
}

// ── Supabase Buchungs-Operationen ─────────────────────────────────────────────

async function sbGetAlleBuchungen(): Promise<Buchung[]> {
  const res = await sfetch("/buchungen?order=erstellt_am.desc&select=*");
  if (!res.ok) throw new Error("Fehler beim Laden der Buchungen");
  return res.json();
}

async function sbGetBuchungenFuerSlot(slotId: string): Promise<Buchung[]> {
  const res = await sfetch(`/buchungen?zeitslot_id=eq.${slotId}&select=*`);
  if (!res.ok) return [];
  return res.json();
}

async function sbCreateBuchung(data: Omit<Buchung, "id" | "erstellt_am">): Promise<Buchung> {
  const res = await sfetch("/buchungen", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const created: Buchung[] = await res.json();
  return created[0];
}

// ── In-Memory Demo-Store ──────────────────────────────────────────────────────

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
      erstellt_am: new Date().toISOString(),
    },
  ];
}

declare global {
  // eslint-disable-next-line no-var
  var __slotsStore: Map<string, Zeitslot> | undefined;
  // eslint-disable-next-line no-var
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

// ── Öffentliche API (alle Funktionen async) ───────────────────────────────────

export async function getAlleSlots(): Promise<Zeitslot[]> {
  if (isConfigured()) return sbGetAlleSlots();
  return Array.from(getSlotsMap().values()).sort(
    (a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit_von.localeCompare(b.uhrzeit_von)
  );
}

export async function getFreigegebeneSlots(): Promise<Zeitslot[]> {
  const slots = await getAlleSlots();
  return slots.filter((s) => s.freigegeben);
}

export async function getSlot(id: string): Promise<Zeitslot | null> {
  if (isConfigured()) return sbGetSlot(id);
  return getSlotsMap().get(id) ?? null;
}

export async function createSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Promise<Zeitslot> {
  if (isConfigured()) return sbCreateSlot(data);
  const slot: Zeitslot = { ...data, id: crypto.randomUUID(), erstellt_am: new Date().toISOString() };
  getSlotsMap().set(slot.id, slot);
  return slot;
}

export async function updateSlot(id: string, patch: Partial<Zeitslot>): Promise<Zeitslot | null> {
  if (isConfigured()) return sbUpdateSlot(id, patch);
  const existing = getSlotsMap().get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  getSlotsMap().set(id, updated);
  return updated;
}

export async function deleteSlot(id: string): Promise<boolean> {
  if (isConfigured()) return sbDeleteSlot(id);
  return getSlotsMap().delete(id);
}

export async function getAlleBuchungen(): Promise<Buchung[]> {
  if (isConfigured()) return sbGetAlleBuchungen();
  return Array.from(getBuchungenMap().values()).sort(
    (a, b) => b.erstellt_am.localeCompare(a.erstellt_am)
  );
}

export async function getBuchungenFuerSlot(slotId: string): Promise<Buchung[]> {
  if (isConfigured()) return sbGetBuchungenFuerSlot(slotId);
  return (await getAlleBuchungen()).filter((b) => b.zeitslot_id === slotId);
}

export async function countBuchungenFuerSlot(slotId: string): Promise<number> {
  return (await getBuchungenFuerSlot(slotId)).length;
}

export async function createBuchung(
  data: Omit<Buchung, "id" | "erstellt_am">
): Promise<Buchung | { error: string }> {
  const slot = await getSlot(data.zeitslot_id);
  if (!slot) return { error: "Zeitslot nicht gefunden." };
  if (!slot.freigegeben) return { error: "Dieser Zeitslot ist nicht verfügbar." };

  const belegt = await countBuchungenFuerSlot(slot.id);
  if (belegt >= slot.max_teilnehmer) return { error: "Dieser Zeitslot ist bereits ausgebucht." };

  if (isConfigured()) return sbCreateBuchung(data);

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
