export interface Kurs {
  id: string;
  titel: string;
  beschreibung: string;
  kategorie: KursKategorie;
  altersgruppe: string;
  max_teilnehmer: number;
  preis_pro_einheit: number;
  einheiten: KursEinheit[];
  bild_url?: string;
  aktiv: boolean;
  erstellt_am: string;
}

export interface KursEinheit {
  id: string;
  kurs_id: string;
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
  ort: string;
  freie_plaetze: number;
}

export interface Anmeldung {
  id?: string;
  kurs_id: string;
  einheit_id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  geburtsdatum?: string;
  nachricht?: string;
  erstellt_am?: string;
  status?: AnmeldungStatus;
}

export type KursKategorie =
  | "nachhilfe"
  | "sprachen"
  | "kreativ"
  | "bewegung"
  | "sonstiges";

export type AnmeldungStatus = "ausstehend" | "bestaetigt" | "storniert";

export const kategorieLabels: Record<KursKategorie, string> = {
  nachhilfe: "Nachhilfe",
  sprachen: "Sprachen",
  kreativ: "Kreatives",
  bewegung: "Bewegung",
  sonstiges: "Sonstiges",
};
