/**
 * Admin-editierbare Texte & Überschriften der öffentlichen Website, organisiert in Module.
 * Jedes Modul entspricht einem inhaltlichen Bereich (z.B. ein Abschnitt der Startseite oder
 * eine eigene Unterseite). Größere Textblöcke sind zusammengefasst.
 *
 * Hinweis zu Hervorhebungen: In Überschriften/Texten kann **so** für Fettdruck verwendet
 * werden (wird beim Anzeigen automatisch in <strong> umgewandelt, siehe RichText-Komponente).
 * Mehrere Items (Buttons, Punkte, Chips, Schritte) durch Leerzeilen voneinander trennen.
 */

export interface BannerTexte {
  text: string;
  subtext: string;
  cta_label: string;
}

export interface HeroTexte {
  location: string;
  heading: string; // "Weniger Stress.\n**Mehr Erfolg.**"
  slogan: string;
  lead: string;
  buttons: string; // "🗓 Erstgespräch anfragen\nAngebot ansehen"
  pills: string; // "Volksschule & Mittelschule\nLegasthenie & Dyskalkulie\nSommerkurse"
  card_heading: string;
  card_text: string;
  tags: string; // "🌟 Individuell gefördert\n👨‍👩‍👧 Eltern einbezogen"
}

export interface WillkommenTexte {
  kicker: string;
  text: string; // Absätze durch Leerzeile getrennt
  signatur: string;
}

export interface AngebotTexte {
  kicker: string;
  heading: string; // "Was ich für **euer Kind** tue"
  lead: string;
  cards: string; // "Elternberatung\nWenn Lernen zuhause...\nMehr erfahren →\n\nLernstandsanalyse\n..."
}

export interface SommerkurseTexte {
  kicker: string;
  heading: string;
  subtitel: string;
  points: string; // Punkte durch Leerzeile getrennt
  box_badge: string;
  box_title: string;
}

export interface WannHilftTexte {
  kicker: string;
  heading: string; // "Wann **Einfach Lernen** hilft"
  subtitel: string;
  chips: string; // 6 Anliegen durch Leerzeile getrennt
  vision_heading: string;
  vision_text: string;
}

export interface ProzessTexte {
  kicker: string;
  heading: string; // "In **vier Schritten** zum Erfolg"
  steps: string; // "Elternberatung\nErstes Gespräch – offen, kostenlos, ohne Druck.\n\nLernstandsanalyse\n..."
}

export interface CtaTexte {
  heading: string; // "Bereit für den ersten Schritt? **Melden Sie sich!**"
  tagline: string;
  text: string;
  buttons: string; // "✉️ Erstgespräch anfragen\n☀️ Sommerkurs buchen"
}

export interface BeratungTexte {
  kicker: string;
  heading: string;
  subheading: string;
  content: string; // Alle Absätze durch Leerzeile getrennt
  price: string;
  cta_heading: string;
  cta_text: string;
  cta_button: string;
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
    heading: "Weniger Stress.\n**Mehr Erfolg.**",
    slogan: "Wo Lernen einfach wird.",
    lead: "Förderung in Deutsch, Mathe und bei Lese-Rechtschreibschwäche – für Kinder in der Volksschule und Mittelschule. **Individuell, einfühlsam und mit einem klaren Plan.**",
    buttons: "🗓 Erstgespräch anfragen\nAngebot ansehen",
    pills: "Volksschule & Mittelschule\nLegasthenie & Dyskalkulie\nSommerkurse",
    card_heading: "Fortschritte dieser Woche",
    card_text: "Schritt für Schritt zu mehr Sicherheit und Freude am Lernen.",
    tags: "🌟 Individuell gefördert\n👨‍👩‍👧 Eltern einbezogen",
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
    heading: "Was ich für **euer Kind** tue",
    lead: "Von der ersten Beratung bis zum gezielten Training – mit klaren Schritten, offener Kommunikation und echtem Interesse am Kind.",
    cards: "Elternberatung\nWenn Lernen zuhause zur Belastung wird. Ich gebe Eltern Klarheit und Strategien – verständlich, ohne Fachchinesisch, mit Blick aufs große Ganze.\nMehr erfahren →\n\nLernstandsanalyse\nBevor wir fördern, schauen wir genau hin. Eine fundierte Analyse zeigt, wo das Kind wirklich steht – und wo wir konkret ansetzen.\nZur Analyse →\n\nLegasthenie & Dyskalkulie\nGezielte Hilfe bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und auf jedes Kind individuell abgestimmt.\nMehr zum Training →",
  },
  sommerkurse: {
    kicker: "Sommerkurse 2026",
    heading: "Die Ferien **sinnvoll nutzen** ☀️",
    subtitel: "Kein Druck, keine Noten – dafür echte Fortschritte. Kleine Gruppen, spielerisches Lernen, gezielte Förderung.",
    points: "Entspannte Atmosphäre – Kinder lernen ohne Schulstress leichter\n\nKleine Gruppen – intensive, persönliche Begleitung\n\nGezielt dort fördern, wo wirklich Lücken bestehen\n\nEntspannt ins neue Schuljahr starten",
    box_badge: "☀️ Sommer 2026",
    box_title: "Kursplatz buchen",
  },
  wann_hilft: {
    kicker: "Für wen?",
    heading: "Wann **Einfach Lernen** hilft",
    subtitel: "Egal ob Deutsch, Mathe oder Lernen allgemein – ich finde heraus, wo dein Kind steht und was es wirklich braucht.",
    chips: "Lesen & Rechtschreiben fällt schwer\n\nUnsicherheit beim Rechnen\n\nHausaufgaben werden zum Streit\n\nKonzentrationsschwierigkeiten\n\nÜberforderung im Familienalltag\n\nWunsch nach klarem Förderweg",
    vision_heading: "Jedes Kind kann lernen.",
    vision_text: "Manchmal braucht es nur\nden richtigen Weg dorthin.",
  },
  prozess: {
    kicker: "So geht's los",
    heading: "In **vier Schritten** zum Erfolg",
    steps: "Elternberatung\nErstes Gespräch – offen, kostenlos, ohne Druck.\n\nLernstandsanalyse\nWo steht dein Kind wirklich? Wir schauen genau hin.\n\nIndividuelle Förderung\nMaßgeschneidertes Training – spielerisch und effektiv.\n\nRegelmäßige Rückmeldung\nEltern bleiben immer informiert – ehrlich und klar.",
  },
  cta: {
    heading: "Bereit für den ersten Schritt? **Melden Sie sich!**",
    tagline: "Wo Lernen einfach wird.",
    text: "Starte mit einer unverbindlichen **Elternberatung** –\negal ob Deutsch, Mathe oder Lernen allgemein.",
    buttons: "✉️ Erstgespräch anfragen\n☀️ Sommerkurs buchen",
  },
  beratung: {
    kicker: "Für Eltern",
    heading: "Beratung",
    subheading: "Klarheit und Strategien für den Familienalltag – verständlich, einfühlsam, auf Augenhöhe.",
    content: "Ich biete individuelle Beratung für Eltern und Erziehungsberechtigte zur optimalen Unterstützung deines Kindes.\n\nHausübungen bedeuten Stress für dich und deine Familie? Deinem Kind fällt eine spezielle Sache in der Schule sehr schwer und du möchtest wissen, wie du am besten unterstützen kannst? Von allgemeinen Themen, wie Schulstufenübertritt und Lernschwierigkeiten bis hin zu inhaltlichen Fragen zu schulischen Themen wie z.B. Lese- Rechtschreibschwäche oder Schwierigkeiten in Mathematik, gemeinsam suchen wir nach Lösungen für dein Anliegen.\n\nDiese Beratung dauert 50 Minuten, damit wir genug Zeit für dein Anliegen haben. Ich sende dir vorab einen Fragebogen zu, damit ich optimal vorbereitet bin.\n\nDie Beratung kann entweder persönlich oder online stattfinden.\n\nBei einem kostenlosen Kennenlerngespräch (ca. 20 Minuten) gibt es die Möglichkeit mich kennenzulernen und zu erfahren, wie eine Elternberatung oder eine Lernförderung, Legasthenie- bzw. Dyskalkulietraining aussehen könnte. Ich freue mich auf dich!",
    price: "Deine Investition: € 150/ 50 Minuten",
    cta_heading: "Lass uns **ins Gespräch kommen**",
    cta_text: "Vereinbare dein kostenloses Kennenlerngespräch – persönlich oder online, ganz ohne Druck.",
    cta_button: "✉️ Termin anfragen",
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
      { key: "heading", label: "Überschrift (2 Zeilen mit \\n trennen)", mehrzeilig: true },
      { key: "slogan", label: "Slogan" },
      { key: "lead", label: "Einleitungstext", mehrzeilig: true },
      { key: "buttons", label: "Buttons (durch \\n trennen)", mehrzeilig: true },
      { key: "pills", label: "Stichworte (durch \\n trennen)", mehrzeilig: true },
      { key: "card_heading", label: "Bildkarte – Überschrift" },
      { key: "card_text", label: "Bildkarte – Text" },
      { key: "tags", label: "Sprechblasen (durch \\n trennen)", mehrzeilig: true },
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
    beschreibung: "Übersicht der drei Leistungen mit Beschreibung.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "heading", label: "Überschrift" },
      { key: "lead", label: "Einleitung", mehrzeilig: true },
      { key: "cards", label: "Drei Karten (Titel\\nText\\nButton-Label, durch Leerzeile getrennt)", mehrzeilig: true },
    ],
  },
  {
    key: "sommerkurse",
    titel: "Sommerkurse – Vorstellung",
    beschreibung: "Einleitungstext neben der Buchungsbox auf der Startseite.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "heading", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "points", label: "Vier Vorteile (durch Leerzeile getrennt)", mehrzeilig: true },
      { key: "box_badge", label: "Buchungsbox – Badge" },
      { key: "box_title", label: "Buchungsbox – Titel" },
    ],
  },
  {
    key: "wann_hilft",
    titel: "Wann Einfach Lernen hilft",
    beschreibung: "Bereich mit den typischen Anliegen, bei denen die Förderung hilft.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "heading", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "chips", label: "Sechs Anliegen (durch Leerzeile getrennt)", mehrzeilig: true },
      { key: "vision_heading", label: "Baum-Karte – Überschrift" },
      { key: "vision_text", label: "Baum-Karte – Text (Zeilenumbruch mit \\n)", mehrzeilig: true },
    ],
  },
  {
    key: "prozess",
    titel: "In vier Schritten zum Erfolg",
    beschreibung: "Ablauf-Übersicht mit den vier Prozessschritten.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "heading", label: "Überschrift" },
      { key: "steps", label: "Vier Schritte (Titel\\nText, durch Leerzeile getrennt)", mehrzeilig: true },
    ],
  },
  {
    key: "cta",
    titel: "Kontakt-Aufruf (Startseite)",
    beschreibung: "Abschließender Aufruf zur Kontaktaufnahme am Ende der Startseite.",
    felder: [
      { key: "heading", label: "Überschrift" },
      { key: "tagline", label: "Tagline" },
      { key: "text", label: "Text", mehrzeilig: true },
      { key: "buttons", label: "Buttons (durch \\n trennen)", mehrzeilig: true },
    ],
  },
  {
    key: "beratung",
    titel: "Beratung (Unterseite)",
    beschreibung: "Eigene Seite Beratung mit Ablauf, Preis und Kontakt-Aufruf.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift (Kicker)" },
      { key: "heading", label: "Überschrift" },
      { key: "subheading", label: "Unterüberschrift" },
      { key: "content", label: "Alle Absätze (durch Leerzeile getrennt)", mehrzeilig: true },
      { key: "price", label: "Preis-Hinweis" },
      { key: "cta_heading", label: "Kontakt-Aufruf – Überschrift" },
      { key: "cta_text", label: "Kontakt-Aufruf – Text", mehrzeilig: true },
      { key: "cta_button", label: "Kontakt-Aufruf – Button-Beschriftung" },
    ],
  },
];
