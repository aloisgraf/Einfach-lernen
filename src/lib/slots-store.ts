/**
 * In-Memory Datenspeicher – funktioniert sofort ohne Datenbank.
 * Daten gehen bei Server-Neustart verloren.
 *
 * Supabase-Integration: Ersetze die Funktionen unten durch
 * Supabase-Aufrufe (gleiche Signaturen bleiben erhalten).
 *
 * Supabase-Tabellen:
 *   zeitslots (id, titel, beschreibung, datum, uhrzeit_von, uhrzeit_bis, max_teilnehmer, freigegeben, erstellt_am)
 *   buchungen  (id, zeitslot_id, vorname, nachname, alter, schulstufe, telefon, email, nachricht, erstellt_am)
 */

import { Buchung, Zeitslot } from "@/types/buchung";

// ── Demo-Daten (ab heute + ein paar Wochen) ─────────────────────────────────
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
    {
      id: "s4",
      titel: "Matura-Vorbereitung Mathematik",
      datum: mkDatum(7),
      uhrzeit_von: "09:00",
      uhrzeit_bis: "11:00",
      max_teilnehmer: 4,
      freigegeben: false,
      erstellt_am: new Date().toISOString(),
    },
    {
      id: "s5",
      titel: "Nachhilfe Mathematik",
      datum: mkDatum(9),
      uhrzeit_von: "15:00",
      uhrzeit_bis: "16:30",
      max_teilnehmer: 3,
      freigegeben: true,
      erstellt_am: new Date().toISOString(),
    },
    {
      id: "s6",
      titel: "Lerncoaching",
      datum: mkDatum(10),
      uhrzeit_von: "18:00",
      uhrzeit_bis: "19:00",
      max_teilnehmer: 1,
      freigegeben: true,
      erstellt_am: new Date().toISOString(),
    },
  ];
}

// Singleton-Store
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

// ── Slot-Operationen ─────────────────────────────────────────────────────────

export function getAlleSlots(): Zeitslot[] {
  return Array.from(getSlotsMap().values()).sort(
    (a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit_von.localeCompare(b.uhrzeit_von)
  );
}

export function getFreigegebeneSlots(): Zeitslot[] {
  return getAlleSlots().filter((s) => s.freigegeben);
}

export function getSlot(id: string): Zeitslot | null {
  return getSlotsMap().get(id) ?? null;
}

export function createSlot(data: Omit<Zeitslot, "id" | "erstellt_am">): Zeitslot {
  const slot: Zeitslot = {
    ...data,
    id: crypto.randomUUID(),
    erstellt_am: new Date().toISOString(),
  };
  getSlotsMap().set(slot.id, slot);
  return slot;
}

export function updateSlot(id: string, patch: Partial<Zeitslot>): Zeitslot | null {
  const existing = getSlotsMap().get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  getSlotsMap().set(id, updated);
  return updated;
}

export function deleteSlot(id: string): boolean {
  return getSlotsMap().delete(id);
}

// ── Buchungs-Operationen ─────────────────────────────────────────────────────

export function getAlleBuchungen(): Buchung[] {
  return Array.from(getBuchungenMap().values()).sort(
    (a, b) => b.erstellt_am.localeCompare(a.erstellt_am)
  );
}

export function getBuchungenFuerSlot(slotId: string): Buchung[] {
  return getAlleBuchungen().filter((b) => b.zeitslot_id === slotId);
}

export function countBuchungenFuerSlot(slotId: string): number {
  return getBuchungenFuerSlot(slotId).length;
}

export function createBuchung(data: Omit<Buchung, "id" | "erstellt_am">): Buchung | { error: string } {
  const slot = getSlot(data.zeitslot_id);
  if (!slot) return { error: "Zeitslot nicht gefunden." };
  if (!slot.freigegeben) return { error: "Dieser Zeitslot ist nicht verfügbar." };

  const belegt = countBuchungenFuerSlot(slot.id);
  if (belegt >= slot.max_teilnehmer) return { error: "Dieser Zeitslot ist bereits ausgebucht." };

  const buchung: Buchung = {
    ...data,
    id: crypto.randomUUID(),
    erstellt_am: new Date().toISOString(),
  };
  getBuchungenMap().set(buchung.id, buchung);
  return buchung;
}

export function getFreiePlaetze(slotId: string): number {
  const slot = getSlot(slotId);
  if (!slot) return 0;
  return slot.max_teilnehmer - countBuchungenFuerSlot(slotId);
}
