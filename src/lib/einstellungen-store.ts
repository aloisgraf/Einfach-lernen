/**
 * Generischer Key-Value-Store für admin-editierbare Texte (z.B. Formular-Beschriftungen).
 *
 * Benötigte Tabelle (einmalig in Supabase SQL-Editor ausführen):
 *
 *   CREATE TABLE einstellungen (
 *     schluessel TEXT PRIMARY KEY,
 *     wert TEXT NOT NULL,
 *     aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT now()
 *   );
 */

import { getDb, isDbConfigured } from "./db";
import { BuchungsformularTexte, STANDARD_FORMULAR_TEXTE } from "@/types/formular";

const FORMULAR_KEY = "buchungsformular_texte";

declare global {
  var __einstellungenStore: Map<string, string> | undefined;
}

function getStore(): Map<string, string> {
  if (!global.__einstellungenStore) global.__einstellungenStore = new Map();
  return global.__einstellungenStore;
}

async function getEinstellung(schluessel: string): Promise<string | null> {
  if (isDbConfigured()) {
    try {
      const sql = getDb()!;
      const rows = await sql<{ wert: string }[]>`SELECT wert FROM einstellungen WHERE schluessel = ${schluessel}`;
      return rows[0]?.wert ?? null;
    } catch { /* fall through */ }
  }
  return getStore().get(schluessel) ?? null;
}

async function setEinstellung(schluessel: string, wert: string): Promise<void> {
  if (isDbConfigured()) {
    try {
      const sql = getDb()!;
      await sql`
        INSERT INTO einstellungen (schluessel, wert, aktualisiert_am)
        VALUES (${schluessel}, ${wert}, now())
        ON CONFLICT (schluessel) DO UPDATE SET wert = ${wert}, aktualisiert_am = now()
      `;
      return;
    } catch { /* fall through */ }
  }
  getStore().set(schluessel, wert);
}

export async function getBuchungsformularTexte(): Promise<BuchungsformularTexte> {
  const raw = await getEinstellung(FORMULAR_KEY);
  if (!raw) return STANDARD_FORMULAR_TEXTE;
  try {
    return { ...STANDARD_FORMULAR_TEXTE, ...JSON.parse(raw) };
  } catch {
    return STANDARD_FORMULAR_TEXTE;
  }
}

export async function setBuchungsformularTexte(texte: BuchungsformularTexte): Promise<void> {
  await setEinstellung(FORMULAR_KEY, JSON.stringify(texte));
}
