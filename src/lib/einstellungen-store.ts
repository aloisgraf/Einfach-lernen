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

import { getDb, isDbConfigured, mitTimeout } from "./db";
import { BuchungsformularTexte, STANDARD_FORMULAR_TEXTE } from "@/types/formular";
import { Kurskategorie, STANDARD_KURSKATEGORIEN } from "@/types/kategorie";
import { WebsiteTexte, STANDARD_WEBSITE_TEXTE } from "@/types/website-texte";

const FORMULAR_KEY = "buchungsformular_texte";
const KATEGORIEN_KEY = "kurskategorien";
const WEBSITE_TEXTE_KEY = "website_texte";

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
      const rows = await mitTimeout(sql<{ wert: string }[]>`SELECT wert FROM einstellungen WHERE schluessel = ${schluessel}`);
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

export async function getKurskategorien(): Promise<Kurskategorie[]> {
  const raw = await getEinstellung(KATEGORIEN_KEY);
  if (!raw) return STANDARD_KURSKATEGORIEN;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : STANDARD_KURSKATEGORIEN;
  } catch {
    return STANDARD_KURSKATEGORIEN;
  }
}

export async function setKurskategorien(kategorien: Kurskategorie[]): Promise<void> {
  await setEinstellung(KATEGORIEN_KEY, JSON.stringify(kategorien));
}

export async function getWebsiteTexte(): Promise<WebsiteTexte> {
  const raw = await getEinstellung(WEBSITE_TEXTE_KEY);
  if (!raw) return STANDARD_WEBSITE_TEXTE;
  try {
    const parsed = JSON.parse(raw);
    const ergebnis = { ...STANDARD_WEBSITE_TEXTE } as WebsiteTexte;
    for (const modul of Object.keys(STANDARD_WEBSITE_TEXTE) as (keyof WebsiteTexte)[]) {
      ergebnis[modul] = { ...STANDARD_WEBSITE_TEXTE[modul], ...(parsed?.[modul] ?? {}) } as never;
    }
    return ergebnis;
  } catch {
    return STANDARD_WEBSITE_TEXTE;
  }
}

export async function setWebsiteTexte(texte: WebsiteTexte): Promise<void> {
  await setEinstellung(WEBSITE_TEXTE_KEY, JSON.stringify(texte));
}
