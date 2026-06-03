export interface Zeitslot {
  id: string;
  titel: string;
  beschreibung?: string;
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
  max_teilnehmer: number;
  freigegeben: boolean;
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

export const schulstufen = [
  "Volksschule 1. Klasse",
  "Volksschule 2. Klasse",
  "Volksschule 3. Klasse",
  "Volksschule 4. Klasse",
  "Mittelschule / NMS 1. Klasse",
  "Mittelschule / NMS 2. Klasse",
  "Mittelschule / NMS 3. Klasse",
  "Mittelschule / NMS 4. Klasse",
  "AHS Unterstufe 1. Klasse",
  "AHS Unterstufe 2. Klasse",
  "AHS Unterstufe 3. Klasse",
  "AHS Unterstufe 4. Klasse",
  "AHS Oberstufe 5. Klasse",
  "AHS Oberstufe 6. Klasse",
  "AHS Oberstufe 7. Klasse",
  "AHS Oberstufe 8. Klasse (Matura)",
  "BHS / HTL / HAK",
  "Erwachsener / Berufstätig",
];
