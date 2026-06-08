export interface Zeitslot {
  id: string;
  titel: string;
  beschreibung?: string; // Veraltet, für Backwards Compat - nutze stattdessen kurs und notizen
  kurs?: string; // z.B. "Einzelstunde", "Legasthenie", "Dyskalkulie"
  notizen?: string; // Optional, interne Notizen
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
  max_teilnehmer: number;
  freigegeben: boolean;
  preis?: number | null;
  /** Preis für 2 Kinder pro Stunde */
  preis_2er?: number | null;
  /** Vergünstigter Gesamtpreis ab 5 gebuchten Terminen – wird dem Kunden als Hinweis angezeigt. */
  preis_5er?: number | null;
  /** Vergünstigter Gesamtpreis ab 10 gebuchten Terminen – wird dem Kunden als Hinweis angezeigt. */
  preis_10er?: number | null;
  /** Preis pro Stunde für Legasthenietraining (optional, falls abweichend vom Normalpreis). */
  preis_legasthenie?: number | null;
  /** Preis pro Stunde für Dyskalkulietraining (optional, falls abweichend vom Normalpreis). */
  preis_dyskalkulie?: number | null;
  kategorien?: string[];
  /** Verknüpft Termine eines mehrtägigen Kurses – Buchung eines Termins bucht alle Termine der Gruppe. */
  gruppe_id?: string | null;
  erstellt_am: string;
}

export interface Buchung {
  id: string;
  zeitslot_id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  name_kind: string;
  schulstufe: string;
  kind_staerken: string;
  kind_lernen: string;
  erstellt_am: string;
}

export const schwerpunkte = [
  "Deutsch",
  "Mathematik",
  "Legasthenietraining",
  "Dyskalkulietraining",
  "Konzentrationstraining",
];

