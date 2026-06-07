/**
 * Admin-editierbare Texte & Überschriften der öffentlichen Website, organisiert in Module.
 * Jedes Modul entspricht einem inhaltlichen Bereich (z.B. ein Abschnitt der Startseite oder
 * eine eigene Unterseite). Innerhalb eines Moduls gibt es mehrere Text-Felder ("Passagen").
 *
 * Hinweis zu Hervorhebungen: In Überschriften/Texten kann **so** für Fettdruck verwendet
 * werden (wird beim Anzeigen automatisch in <strong> umgewandelt, siehe RichText-Komponente).
 */

export interface BannerTexte {
  text: string;
  subtext: string;
  cta_label: string;
}

export interface HeroTexte {
  location: string;
  titel_zeile1: string;
  titel_zeile2: string;
  slogan: string;
  lead: string;
  cta1_label: string;
  cta2_label: string;
  pill1: string;
  pill2: string;
  pill3: string;
  karte_titel: string;
  karte_text: string;
  tag1: string;
  tag2: string;
}

export interface WillkommenTexte {
  kicker: string;
  text: string;
  signatur: string;
}

export interface AngebotTexte {
  kicker: string;
  titel: string;
  subtitel: string;
  karte1_titel: string;
  karte1_text: string;
  karte1_button: string;
  karte2_titel: string;
  karte2_text: string;
  karte2_button: string;
  karte3_titel: string;
  karte3_text: string;
  karte3_button: string;
}

export interface SommerkurseTexte {
  kicker: string;
  titel: string;
  subtitel: string;
  punkt1: string;
  punkt2: string;
  punkt3: string;
  punkt4: string;
  box_badge: string;
  box_titel: string;
}

export interface WannHilftTexte {
  kicker: string;
  titel: string;
  subtitel: string;
  chip1: string;
  chip2: string;
  chip3: string;
  chip4: string;
  chip5: string;
  chip6: string;
  vision_titel: string;
  vision_text: string;
}

export interface ProzessTexte {
  kicker: string;
  titel: string;
  schritt1_titel: string;
  schritt1_text: string;
  schritt2_titel: string;
  schritt2_text: string;
  schritt3_titel: string;
  schritt3_text: string;
  schritt4_titel: string;
  schritt4_text: string;
}

export interface CtaTexte {
  titel: string;
  tagline: string;
  text: string;
  button1_label: string;
  button2_label: string;
}

export interface BeratungTexte {
  kicker: string;
  titel: string;
  untertitel: string;
  absatz1: string;
  absatz2: string;
  absatz3: string;
  preis_hinweis: string;
  absatz4: string;
  absatz5: string;
  cta_titel: string;
  cta_text: string;
  cta_button1_label: string;
}

export interface WebsiteTexte {
  banner: BannerTexte;
  hero: HeroTexte;
  willkommen: WillkommenTexte;
  angebot: AngebotTexte;
  sommerkurse: SommerkurseTexte;
  wann_hilft: WannHilftTexte;
  prozess: ProzessTexte;
  cta: CtaTexte;
  beratung: BeratungTexte;
}

export const STANDARD_WEBSITE_TEXTE: WebsiteTexte = {
  banner: {
    text: "☀️ Sommerkurse 2026 – Jetzt buchbar!",
    subtext: "Kleine Gruppen · Juli & August · Eben im Pongau · Wenige Plätze frei!",
    cta_label: "Platz sichern →",
  },
  hero: {
    location: "🌿 Eben im Pongau · Salzburg",
    titel_zeile1: "Weniger Stress.",
    titel_zeile2: "**Mehr Erfolg.**",
    slogan: "Wo Lernen einfach wird.",
    lead: "Förderung in Deutsch, Mathe und bei Lese-Rechtschreibschwäche – für Kinder in der Volksschule und Mittelschule. **Individuell, einfühlsam und mit einem klaren Plan.**",
    cta1_label: "🗓 Erstgespräch anfragen",
    cta2_label: "Angebot ansehen",
    pill1: "Volksschule & Mittelschule",
    pill2: "Legasthenie & Dyskalkulie",
    pill3: "Sommerkurse",
    karte_titel: "Fortschritte dieser Woche",
    karte_text: "Schritt für Schritt zu mehr Sicherheit und Freude am Lernen.",
    tag1: "🌟 Individuell gefördert",
    tag2: "👨‍👩‍👧 Eltern einbezogen",
  },
  willkommen: {
    kicker: "Herzlich willkommen",
    text: [
      "Hausübungen sind für dein Kind schwierig, die Hausübungssituation ist immer angespannt?",
      "Du weißt nicht, wie du deinem Kind am besten helfen kannst?",
      "Lesen, Schreiben oder Rechnen ist für dein Kind anstrengend und mühsam?",
      "Egal wie oft Lernwörter geübt werden, dein Kind kann sie sich nicht merken oder einfache Rechnungen werden immer wieder falsch gerechnet?",
      "Dein Kind hört sich sehr gern Geschichten an, selber lesen mag es aber nicht?",
      "Dann bist du bei mir genau richtig. Mit meiner Förderung und Elternberatung legen wir gemeinsam eine solide Basis für eine entspannte und erfolgreiche Schulzeit.",
      "Lasst uns gemeinsam \"Einfach Lernen\".",
      "Als Primarstufenpädagogin, Betreuerin für Lese-Rechtschreib-Schwäche und diplomierte Legasthenie- und Dyskalkulietrainerin biete ich ab sofort Unterstützung.",
      "Ich begleite dich und dein Kind individuell und transparent auf dem Weg durch den Zahlen- und Buchstabendschungel um euren Weg durch die Schulzeit zu erleichtern.",
      "Ich freue mich darauf, Dich kennenzulernen.",
    ].join("\n\n"),
    signatur: "Anna Reichsöllner",
  },
  angebot: {
    kicker: "Mein Angebot",
    titel: "Was ich für **euer Kind** tue",
    subtitel: "Von der ersten Beratung bis zum gezielten Training – mit klaren Schritten, offener Kommunikation und echtem Interesse am Kind.",
    karte1_titel: "Elternberatung",
    karte1_text: "Wenn Lernen zuhause zur Belastung wird. Ich gebe Eltern Klarheit und Strategien – verständlich, ohne Fachchinesisch, mit Blick aufs große Ganze.",
    karte1_button: "Mehr erfahren →",
    karte2_titel: "Lernstandsanalyse",
    karte2_text: "Bevor wir fördern, schauen wir genau hin. Eine fundierte Analyse zeigt, wo das Kind wirklich steht – und wo wir konkret ansetzen.",
    karte2_button: "Zur Analyse →",
    karte3_titel: "Legasthenie & Dyskalkulie",
    karte3_text: "Gezielte Hilfe bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und auf jedes Kind individuell abgestimmt.",
    karte3_button: "Mehr zum Training →",
  },
  sommerkurse: {
    kicker: "Sommerkurse 2026",
    titel: "Die Ferien **sinnvoll nutzen** ☀️",
    subtitel: "Kein Druck, keine Noten – dafür echte Fortschritte. Kleine Gruppen, spielerisches Lernen, gezielte Förderung.",
    punkt1: "Entspannte Atmosphäre – Kinder lernen ohne Schulstress leichter",
    punkt2: "Kleine Gruppen – intensive, persönliche Begleitung",
    punkt3: "Gezielt dort fördern, wo wirklich Lücken bestehen",
    punkt4: "Entspannt ins neue Schuljahr starten",
    box_badge: "☀️ Sommer 2026",
    box_titel: "Kursplatz buchen",
  },
  wann_hilft: {
    kicker: "Für wen?",
    titel: "Wann **Einfach Lernen** hilft",
    subtitel: "Egal ob Deutsch, Mathe oder Lernen allgemein – ich finde heraus, wo dein Kind steht und was es wirklich braucht.",
    chip1: "Lesen & Rechtschreiben fällt schwer",
    chip2: "Unsicherheit beim Rechnen",
    chip3: "Hausaufgaben werden zum Streit",
    chip4: "Konzentrationsschwierigkeiten",
    chip5: "Überforderung im Familienalltag",
    chip6: "Wunsch nach klarem Förderweg",
    vision_titel: "Jedes Kind kann lernen.",
    vision_text: "Manchmal braucht es nur\nden richtigen Weg dorthin.",
  },
  prozess: {
    kicker: "So geht's los",
    titel: "In **vier Schritten** zum Erfolg",
    schritt1_titel: "Elternberatung",
    schritt1_text: "Erstes Gespräch – offen, kostenlos, ohne Druck.",
    schritt2_titel: "Lernstandsanalyse",
    schritt2_text: "Wo steht dein Kind wirklich? Wir schauen genau hin.",
    schritt3_titel: "Individuelle Förderung",
    schritt3_text: "Maßgeschneidertes Training – spielerisch und effektiv.",
    schritt4_titel: "Regelmäßige Rückmeldung",
    schritt4_text: "Eltern bleiben immer informiert – ehrlich und klar.",
  },
  cta: {
    titel: "Bereit für den ersten Schritt? **Melden Sie sich!**",
    tagline: "Wo Lernen einfach wird.",
    text: "Starte mit einer unverbindlichen **Elternberatung** –\negal ob Deutsch, Mathe oder Lernen allgemein.",
    button1_label: "✉️ Erstgespräch anfragen",
    button2_label: "☀️ Sommerkurs buchen",
  },
  beratung: {
    kicker: "Für Eltern",
    titel: "Beratung",
    untertitel: "Klarheit und Strategien für den Familienalltag – verständlich, einfühlsam, auf Augenhöhe.",
    absatz1: "Ich biete individuelle Beratung für Eltern und Erziehungsberechtigte zur optimalen Unterstützung deines Kindes.",
    absatz2: "Hausübungen bedeuten Stress für dich und deine Familie? Deinem Kind fällt eine spezielle Sache in der Schule sehr schwer und du möchtest wissen, wie du am besten unterstützen kannst? Von allgemeinen Themen, wie Schulstufenübertritt und Lernschwierigkeiten bis hin zu inhaltlichen Fragen zu schulischen Themen wie z.B. Lese- Rechtschreibschwäche oder Schwierigkeiten in Mathematik, gemeinsam suchen wir nach Lösungen für dein Anliegen.",
    absatz3: "Diese Beratung dauert 50 Minuten, damit wir genug Zeit für dein Anliegen haben. Ich sende dir vorab einen Fragebogen zu, damit ich optimal vorbereitet bin.",
    preis_hinweis: "Deine Investition: € 150/ 50 Minuten",
    absatz4: "Die Beratung kann entweder persönlich oder online stattfinden.",
    absatz5: "Bei einem kostenlosen Kennenlerngespräch (ca. 20 Minuten) gibt es die Möglichkeit mich kennenzulernen und zu erfahren, wie eine Elternberatung oder eine Lernförderung, Legasthenie- bzw. Dyskalkulietraining aussehen könnte. Ich freue mich auf dich!",
    cta_titel: "Lass uns **ins Gespräch kommen**",
    cta_text: "Vereinbare dein kostenloses Kennenlerngespräch – persönlich oder online, ganz ohne Druck.",
    cta_button1_label: "✉️ Termin anfragen",
  },
};

export interface ModulFeld {
  key: string;
  label: string;
  mehrzeilig?: boolean;
}

export interface TexteModul {
  key: keyof WebsiteTexte;
  titel: string;
  beschreibung: string;
  felder: ModulFeld[];
}

export const TEXTE_MODULE: TexteModul[] = [
  {
    key: "banner",
    titel: "Banner",
    beschreibung: "Laufband ganz oben auf der Startseite.",
    felder: [
      { key: "text", label: "Hervorgehobener Text" },
      { key: "subtext", label: "Untertext" },
      { key: "cta_label", label: "Button-Beschriftung" },
    ],
  },
  {
    key: "hero",
    titel: "Hero (Startbereich)",
    beschreibung: "Der große Aufmacher-Bereich direkt unter dem Header.",
    felder: [
      { key: "location", label: "Standort-Hinweis" },
      { key: "titel_zeile1", label: "Überschrift – Zeile 1" },
      { key: "titel_zeile2", label: "Überschrift – Zeile 2 (fett)" },
      { key: "slogan", label: "Slogan" },
      { key: "lead", label: "Einleitungstext", mehrzeilig: true },
      { key: "cta1_label", label: "Button 1 – Beschriftung" },
      { key: "cta2_label", label: "Button 2 – Beschriftung" },
      { key: "pill1", label: "Stichwort 1" },
      { key: "pill2", label: "Stichwort 2" },
      { key: "pill3", label: "Stichwort 3" },
      { key: "karte_titel", label: "Bildkarte – Überschrift" },
      { key: "karte_text", label: "Bildkarte – Text" },
      { key: "tag1", label: "Sprechblase 1" },
      { key: "tag2", label: "Sprechblase 2" },
    ],
  },
  {
    key: "willkommen",
    titel: "Willkommen",
    beschreibung: "Persönliche Begrüßung & Vorstellung auf der Startseite.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "text", label: "Begrüßungstext (Absätze durch Leerzeile trennen)", mehrzeilig: true },
      { key: "signatur", label: "Unterschrift" },
    ],
  },
  {
    key: "angebot",
    titel: "Mein Angebot",
    beschreibung: "Übersicht der drei Leistungen: Elternberatung, Lernstandsanalyse, Legasthenie & Dyskalkulie.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "titel", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "karte1_titel", label: "Karte 1 – Titel" },
      { key: "karte1_text", label: "Karte 1 – Text", mehrzeilig: true },
      { key: "karte1_button", label: "Karte 1 – Button-Beschriftung" },
      { key: "karte2_titel", label: "Karte 2 – Titel" },
      { key: "karte2_text", label: "Karte 2 – Text", mehrzeilig: true },
      { key: "karte2_button", label: "Karte 2 – Button-Beschriftung" },
      { key: "karte3_titel", label: "Karte 3 – Titel" },
      { key: "karte3_text", label: "Karte 3 – Text", mehrzeilig: true },
      { key: "karte3_button", label: "Karte 3 – Button-Beschriftung" },
    ],
  },
  {
    key: "sommerkurse",
    titel: "Sommerkurse – Vorstellung",
    beschreibung: "Einleitungstext neben der Buchungsbox auf der Startseite.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "titel", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "punkt1", label: "Vorteil 1" },
      { key: "punkt2", label: "Vorteil 2" },
      { key: "punkt3", label: "Vorteil 3" },
      { key: "punkt4", label: "Vorteil 4" },
      { key: "box_badge", label: "Buchungsbox – Badge" },
      { key: "box_titel", label: "Buchungsbox – Titel" },
    ],
  },
  {
    key: "wann_hilft",
    titel: "Wann Einfach Lernen hilft",
    beschreibung: "Bereich mit den typischen Anliegen, bei denen die Förderung hilft.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "titel", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "chip1", label: "Anliegen 1" },
      { key: "chip2", label: "Anliegen 2" },
      { key: "chip3", label: "Anliegen 3" },
      { key: "chip4", label: "Anliegen 4" },
      { key: "chip5", label: "Anliegen 5" },
      { key: "chip6", label: "Anliegen 6" },
      { key: "vision_titel", label: "Baum-Karte – Überschrift" },
      { key: "vision_text", label: "Baum-Karte – Text", mehrzeilig: true },
    ],
  },
  {
    key: "prozess",
    titel: "In vier Schritten zum Erfolg",
    beschreibung: "Ablauf-Übersicht mit den vier Prozessschritten.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "titel", label: "Überschrift" },
      { key: "schritt1_titel", label: "Schritt 1 – Titel" },
      { key: "schritt1_text", label: "Schritt 1 – Text" },
      { key: "schritt2_titel", label: "Schritt 2 – Titel" },
      { key: "schritt2_text", label: "Schritt 2 – Text" },
      { key: "schritt3_titel", label: "Schritt 3 – Titel" },
      { key: "schritt3_text", label: "Schritt 3 – Text" },
      { key: "schritt4_titel", label: "Schritt 4 – Titel" },
      { key: "schritt4_text", label: "Schritt 4 – Text" },
    ],
  },
  {
    key: "cta",
    titel: "Kontakt-Aufruf (Startseite)",
    beschreibung: "Abschließender Aufruf zur Kontaktaufnahme am Ende der Startseite.",
    felder: [
      { key: "titel", label: "Überschrift" },
      { key: "tagline", label: "Tagline" },
      { key: "text", label: "Text", mehrzeilig: true },
      { key: "button1_label", label: "Button 1 – Beschriftung" },
      { key: "button2_label", label: "Button 2 – Beschriftung" },
    ],
  },
  {
    key: "beratung",
    titel: "Beratung (Unterseite)",
    beschreibung: "Eigene Seite „Beratung\" mit Ablauf, Preis und Kontakt-Aufruf.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "titel", label: "Überschrift" },
      { key: "untertitel", label: "Untertitel", mehrzeilig: true },
      { key: "absatz1", label: "Absatz 1", mehrzeilig: true },
      { key: "absatz2", label: "Absatz 2", mehrzeilig: true },
      { key: "absatz3", label: "Absatz 3", mehrzeilig: true },
      { key: "preis_hinweis", label: "Preis-Hinweis" },
      { key: "absatz4", label: "Absatz 4", mehrzeilig: true },
      { key: "absatz5", label: "Absatz 5", mehrzeilig: true },
      { key: "cta_titel", label: "Kontakt-Aufruf – Überschrift" },
      { key: "cta_text", label: "Kontakt-Aufruf – Text", mehrzeilig: true },
      { key: "cta_button1_label", label: "Kontakt-Aufruf – Button-Beschriftung" },
    ],
  },
];
