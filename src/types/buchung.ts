export interface Zeitslot {
  id: string;
  titel: string;
  beschreibung?: string;
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
  max_teilnehmer: number;
  freigegeben: boolean;
  preis?: number | null;
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

