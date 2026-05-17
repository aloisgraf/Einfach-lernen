/**
 * Supabase-Client – wird aktiviert sobald die Umgebungsvariablen gesetzt sind.
 *
 * Benötigte .env.local Variablen:
 *   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
 *
 * Tabellen (in Supabase anlegen):
 *   - kurse        (Kurs-Definition)
 *   - kurs_einheiten (einzelne Termine je Kurs)
 *   - anmeldungen  (Buchungen der Teilnehmer)
 */

import { Anmeldung, Kurs, KursEinheit } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

async function supabaseFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!isConfigured()) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  return fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

export async function getKurse(): Promise<Kurs[]> {
  if (!isConfigured()) return mockKurse;
  const res = await supabaseFetch("/kurse?aktiv=eq.true&select=*,einheiten:kurs_einheiten(*)");
  if (!res.ok) throw new Error("Fehler beim Laden der Kurse");
  return res.json();
}

export async function getKurs(id: string): Promise<Kurs | null> {
  if (!isConfigured()) return mockKurse.find((k) => k.id === id) ?? null;
  const res = await supabaseFetch(
    `/kurse?id=eq.${id}&select=*,einheiten:kurs_einheiten(*)`
  );
  if (!res.ok) return null;
  const data: Kurs[] = await res.json();
  return data[0] ?? null;
}

export async function createAnmeldung(anmeldung: Anmeldung): Promise<void> {
  if (!isConfigured()) {
    console.log("Demo-Anmeldung (Supabase nicht konfiguriert):", anmeldung);
    return;
  }
  const res = await supabaseFetch("/anmeldungen", {
    method: "POST",
    body: JSON.stringify(anmeldung),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anmeldung fehlgeschlagen: ${err}`);
  }
}

// ── Mock-Daten (werden verwendet bis Supabase konfiguriert ist) ──────────────

export const mockKurse: Kurs[] = [
  {
    id: "1",
    titel: "Nachhilfe Mathematik",
    beschreibung:
      "Individuelle Förderung in Mathematik für die Volksschule, Mittelschule und AHS. Wir erarbeiten Schwachstellen gezielt und nachhaltig.",
    kategorie: "nachhilfe",
    altersgruppe: "8–18 Jahre",
    max_teilnehmer: 6,
    preis_pro_einheit: 25,
    aktiv: true,
    erstellt_am: "2024-01-01",
    bild_url: "/images/mathe.jpg",
    einheiten: [
      {
        id: "e1",
        kurs_id: "1",
        datum: "2026-06-03",
        uhrzeit_von: "15:00",
        uhrzeit_bis: "16:30",
        ort: "Lernstudio Pongau",
        freie_plaetze: 4,
      },
      {
        id: "e2",
        kurs_id: "1",
        datum: "2026-06-10",
        uhrzeit_von: "15:00",
        uhrzeit_bis: "16:30",
        ort: "Lernstudio Pongau",
        freie_plaetze: 5,
      },
    ],
  },
  {
    id: "2",
    titel: "Deutsch & Lesen",
    beschreibung:
      "Lese- und Schreibkompetenz aufbauen, Grammatik festigen – spielerisch und motivierend für Kinder und Jugendliche.",
    kategorie: "nachhilfe",
    altersgruppe: "7–15 Jahre",
    max_teilnehmer: 6,
    preis_pro_einheit: 25,
    aktiv: true,
    erstellt_am: "2024-01-01",
    einheiten: [
      {
        id: "e3",
        kurs_id: "2",
        datum: "2026-06-04",
        uhrzeit_von: "14:00",
        uhrzeit_bis: "15:30",
        ort: "Lernstudio Pongau",
        freie_plaetze: 3,
      },
    ],
  },
  {
    id: "3",
    titel: "Englisch für Anfänger",
    beschreibung:
      "Spielerischer Einstieg in die englische Sprache – Wortschatz, Aussprache und erste Sätze auf unterhaltsame Art.",
    kategorie: "sprachen",
    altersgruppe: "8–12 Jahre",
    max_teilnehmer: 8,
    preis_pro_einheit: 20,
    aktiv: true,
    erstellt_am: "2024-01-01",
    einheiten: [
      {
        id: "e4",
        kurs_id: "3",
        datum: "2026-06-05",
        uhrzeit_von: "16:00",
        uhrzeit_bis: "17:00",
        ort: "Lernstudio Pongau",
        freie_plaetze: 6,
      },
    ],
  },
  {
    id: "4",
    titel: "Kreatives Schreiben",
    beschreibung:
      "Fantasie entfalten und Freude am Schreiben entwickeln. Geschichten, Gedichte und Texte kreativ gestalten.",
    kategorie: "kreativ",
    altersgruppe: "10–16 Jahre",
    max_teilnehmer: 8,
    preis_pro_einheit: 20,
    aktiv: true,
    erstellt_am: "2024-01-01",
    einheiten: [
      {
        id: "e5",
        kurs_id: "4",
        datum: "2026-06-06",
        uhrzeit_von: "10:00",
        uhrzeit_bis: "11:30",
        ort: "Lernstudio Pongau",
        freie_plaetze: 7,
      },
    ],
  },
  {
    id: "5",
    titel: "Prüfungsvorbereitung Matura",
    beschreibung:
      "Intensive Vorbereitung auf die Matura in den Fächern Mathematik, Deutsch und Englisch. Kleine Gruppen, maximaler Lernerfolg.",
    kategorie: "nachhilfe",
    altersgruppe: "17–19 Jahre",
    max_teilnehmer: 4,
    preis_pro_einheit: 35,
    aktiv: true,
    erstellt_am: "2024-01-01",
    einheiten: [
      {
        id: "e6",
        kurs_id: "5",
        datum: "2026-06-07",
        uhrzeit_von: "09:00",
        uhrzeit_bis: "11:00",
        ort: "Lernstudio Pongau",
        freie_plaetze: 2,
      },
    ],
  },
  {
    id: "6",
    titel: "Lerncoaching für Eltern",
    beschreibung:
      "Workshop für Eltern: Wie unterstütze ich mein Kind beim Lernen? Methoden, Motivation und häusliche Lernstruktur.",
    kategorie: "sonstiges",
    altersgruppe: "Erwachsene",
    max_teilnehmer: 12,
    preis_pro_einheit: 30,
    aktiv: true,
    erstellt_am: "2024-01-01",
    einheiten: [
      {
        id: "e7",
        kurs_id: "6",
        datum: "2026-06-14",
        uhrzeit_von: "18:00",
        uhrzeit_bis: "20:00",
        ort: "Lernstudio Pongau",
        freie_plaetze: 10,
      },
    ],
  },
];
