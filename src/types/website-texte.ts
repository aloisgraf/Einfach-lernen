/**
 * Admin-editierbare Texte aller öffentlichen Seiten, organisiert in Module.
 *
 * Konventionen in Textfeldern:
 *  - Absätze durch Leerzeile trennen
 *  - **fett** für Hervorhebungen
 *  - Aufzählungen: jede Zeile mit "- " beginnen
 *  - Überschriften: Zeile mit "## " beginnen
 *  - Preisbox: Zeile mit "[PREIS] " beginnen
 *  - Fußnote: Zeile mit "[*] " beginnen
 *  - FAQ: Einträge durch "---" trennen (erste Zeile = Frage, Rest = Antwort)
 */

// ── Startseite ──────────────────────────────────────────────

export interface BannerTexte {
  text: string;
  subtext: string;
  cta_label: string;
}

export interface HeroTexte {
  location: string;
  heading: string;
  slogan: string;
  lead: string;
  buttons: string;
  pills: string;
  card_heading: string;
  card_text: string;
  tags: string;
}

export interface WillkommenTexte {
  kicker: string;
  text: string;
  signatur: string;
}

export interface AngebotTexte {
  kicker: string;
  heading: string;
  lead: string;
  cards: string;
}

export interface SommerkurseTexte {
  kicker: string;
  heading: string;
  subtitel: string;
  points: string;
  box_badge: string;
  box_title: string;
}

export interface WannHilftTexte {
  kicker: string;
  heading: string;
  subtitel: string;
  chips: string;
  vision_heading: string;
  vision_text: string;
}

export interface ProzessTexte {
  kicker: string;
  heading: string;
  steps: string;
}

export interface CtaTexte {
  heading: string;
  tagline: string;
  text: string;
  buttons: string;
}

// ── Unterseiten ─────────────────────────────────────────────

export interface BeratungTexte {
  header: string;
  content: string;
  cta: string;
}

export interface LegasthenieTexte {
  header: string;
  lrs_header: string;
  lrs_content: string;
  rechenschwaeche_header: string;
  rechenschwaeche_content: string;
  afs_header: string;
  afs_content: string;
  cta: string;
}

export interface FaqTexte {
  header: string;
  fragen: string;
  cta: string;
}

export interface UeberMichTexte {
  header: string;
  content: string;
  hinweis: string;
  cta: string;
}

export interface KontaktTexte {
  header: string;
  name: string;
  telefon: string;
  email: string;
  instagram: string;
  website: string;
  adresse: string;
  cta: string;
}

export interface BuchenTexte {
  header: string;
  box_badge: string;
  box_title: string;
}

// ── Gesamt ──────────────────────────────────────────────────

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
  legasthenie: LegasthenieTexte;
  faq: FaqTexte;
  ueber_mich: UeberMichTexte;
  kontakt: KontaktTexte;
  buchen: BuchenTexte;
}

// ── Standardwerte ───────────────────────────────────────────

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
      'Dann bist du bei mir genau richtig. Mit meiner Förderung und Elternberatung legen wir gemeinsam eine solide Basis für eine entspannte und erfolgreiche Schulzeit.',
      'Lasst uns gemeinsam "Einfach Lernen".',
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
    cards: [
      "Elternberatung\nWenn Lernen zuhause zur Belastung wird. Ich gebe Eltern Klarheit und Strategien – verständlich, ohne Fachchinesisch, mit Blick aufs große Ganze.\nMehr erfahren →",
      "Lernstandsanalyse\nBevor wir fördern, schauen wir genau hin. Eine fundierte Analyse zeigt, wo das Kind wirklich steht – und wo wir konkret ansetzen.\nZur Analyse →",
      "Legasthenie & Dyskalkulie\nGezielte Hilfe bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und auf jedes Kind individuell abgestimmt.\nMehr zum Training →",
    ].join("\n\n"),
  },
  sommerkurse: {
    kicker: "Sommerkurse 2026",
    heading: "Die Ferien **sinnvoll nutzen** ☀️",
    subtitel: "Kein Druck, keine Noten – dafür echte Fortschritte. Kleine Gruppen, spielerisches Lernen, gezielte Förderung.",
    points: [
      "Entspannte Atmosphäre – Kinder lernen ohne Schulstress leichter",
      "Kleine Gruppen – intensive, persönliche Begleitung",
      "Gezielt dort fördern, wo wirklich Lücken bestehen",
      "Entspannt ins neue Schuljahr starten",
    ].join("\n\n"),
    box_badge: "☀️ Sommer 2026",
    box_title: "Kursplatz buchen",
  },
  wann_hilft: {
    kicker: "Für wen?",
    heading: "Wann **Einfach Lernen** hilft",
    subtitel: "Egal ob Deutsch, Mathe oder Lernen allgemein – ich finde heraus, wo dein Kind steht und was es wirklich braucht.",
    chips: [
      "Lesen & Rechtschreiben fällt schwer",
      "Unsicherheit beim Rechnen",
      "Hausaufgaben werden zum Streit",
      "Konzentrationsschwierigkeiten",
      "Überforderung im Familienalltag",
      "Wunsch nach klarem Förderweg",
    ].join("\n\n"),
    vision_heading: "Jedes Kind kann lernen.",
    vision_text: "Manchmal braucht es nur\nden richtigen Weg dorthin.",
  },
  prozess: {
    kicker: "So geht's los",
    heading: "In **vier Schritten** zum Erfolg",
    steps: [
      "Elternberatung\nErstes Gespräch – offen, kostenlos, ohne Druck.",
      "Lernstandsanalyse\nWo steht dein Kind wirklich? Wir schauen genau hin.",
      "Individuelle Förderung\nMaßgeschneidertes Training – spielerisch und effektiv.",
      "Regelmäßige Rückmeldung\nEltern bleiben immer informiert – ehrlich und klar.",
    ].join("\n\n"),
  },
  cta: {
    heading: "Bereit für den ersten Schritt? **Melden Sie sich!**",
    tagline: "Wo Lernen einfach wird.",
    text: "Starte mit einer unverbindlichen **Elternberatung** –\negal ob Deutsch, Mathe oder Lernen allgemein.",
    buttons: "✉️ Erstgespräch anfragen\n☀️ Sommerkurs buchen",
  },

  // ── Beratung ──

  beratung: {
    header: "Für Eltern\nBeratung\nKlarheit und Strategien für den Familienalltag – verständlich, einfühlsam, auf Augenhöhe.",
    content: [
      "Ich biete individuelle Beratung für Eltern und Erziehungsberechtigte zur optimalen Unterstützung deines Kindes.",
      "Hausübungen bedeuten Stress für dich und deine Familie? Deinem Kind fällt eine spezielle Sache in der Schule sehr schwer und du möchtest wissen, wie du am besten unterstützen kannst? Von allgemeinen Themen, wie Schulstufenübertritt und Lernschwierigkeiten bis hin zu inhaltlichen Fragen zu schulischen Themen wie z.B. Lese- Rechtschreibschwäche oder Schwierigkeiten in Mathematik, gemeinsam suchen wir nach Lösungen für dein Anliegen.",
      "Diese Beratung dauert 50 Minuten, damit wir genug Zeit für dein Anliegen haben. Ich sende dir vorab einen Fragebogen zu, damit ich optimal vorbereitet bin.",
      "[PREIS] Deine Investition: € 150/ 50 Minuten",
      "Die Beratung kann entweder persönlich oder online stattfinden.",
      "Bei einem kostenlosen Kennenlerngespräch (ca. 20 Minuten) gibt es die Möglichkeit mich kennenzulernen und zu erfahren, wie eine Elternberatung oder eine Lernförderung, Legasthenie- bzw. Dyskalkulietraining aussehen könnte. Ich freue mich auf dich!",
    ].join("\n\n"),
    cta: "Lass uns **ins Gespräch kommen**\nVereinbare dein kostenloses Kennenlerngespräch – persönlich oder online, ganz ohne Druck.\n✉️ Termin anfragen",
  },

  // ── Legasthenie & Dyskalkulie ──

  legasthenie: {
    header: "Mein Training\nLegasthenie & **Dyskalkulie**\nGezielte Förderung bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und individuell.",
    lrs_header: "Lese-Rechtschreibschwäche\nFörderung bei Lese-Rechtschreibschwäche",
    lrs_content: `Nach einem kostenlosen Kennenlerngespräch (ca. 30 min), in dem du mir euer Anliegen schilderst, folgt die Testung der Lese- und Rechtschreibfertigkeiten deines Kindes mittels eines standardisierten Tests und Schriftproben deines Kindes. Basierend auf den Testergebnissen erstelle ich einen individuellen Förderplan, bzw. Förderkonzept.

Wenn erwünscht folgt ein Beratungsgespräch bezüglich der Testergebnisse und ich stelle Übungen für zu Hause zusammen.*

## Mein Angebot beinhaltet:

- Anamnesegespräch mit dir (ca. 1 Stunde)
- individuelle Fehleranalyse aus den Schriftproben deines Kindes
- Testung der Lese- und Rechtschreibfertigkeiten deines Kindes mittels eines standardisierten Tests
- Pädagogisches Gutachten (wird auf expliziten Wunsch schriftlich erstellt)
- Besprechung der Ergebnisse

Ich stelle ein individuelles Trainingskonzept für dein Kind zusammen, basierend auf den Ergebnissen der pädagogischen Diagnostik und des Anamnesegesprächs.*

Die Förderung findet meist einmal pro Woche für 50 Minuten statt. Wichtig ist der regelmäßige Besuch bei mir. Damit eine Verbesserung der Situation optimal gelingt, ist es notwendig, dass die Eltern (oder Lernpartner) ausreichend Zeit haben, konsequent über einen längeren Zeitraum mit dem Kind zu üben.

Es ist mir wichtig, dass auch du deinem Kind zu Hause gut weiterhelfen kannst. Ich unterstütze dich gerne, damit das Üben auch zu Hause gut klappt.

Im Preis ist eine Einheit pro Woche, Übungsmaterial für die wöchentliche Hausübung, Telefonate mit Lehrerinnen und Lehrern und die Beratung der Eltern inkludiert.

[PREIS] Deine Investition: € 95,- / 50 Minuten**

## Ablauf

[*] *Investition für ein pädagogisches Gutachten: € 250,- (Anamnesegespräch, standardisierter Lese- Rechtschreibtest, qualitative Fehleranalyse, Erstellung des pädagogischen Gutachtens)

[*] **Bei einer verbindlichen Anmeldung zur Förderung sind ein Anamnesegespräch, ein standardisierter Lese- Rechtschreibtest und eine qualitative Fehleranalyse bereits enthalten. Das pädagogische Gutachten erfolgt dabei mündlich im Zuge eines Informationsgespräches.

Manche Kinder sind eher unmusikalisch oder eher unsportlich, manche Kinder sind im Bereich der Schriftsprache einfach nicht so begabt wie in anderen Bereichen. Das Lesen lernen und/oder die Rechtschreibung fallen ihnen besonders schwer.

Melde dich gern bei mir für ein kostenloses Beratungsgespräch, wenn du vermutest, dass dein Kind eine Lese-Rechtschreibschwäche hat. Anzeichen könnten Schwierigkeiten in diesen Bereichen sein:

- Bilden von Reimen
- Silbenklatschen
- schnellen Benennen von Buchstaben
- "Zusammenlauten"
- Lesen (liest langsam und stockend, lässt Buchstaben aus, verdreht Silben und Buchstaben ...)
- Verstehen von Sätzen und Texten
- der Lesemotivation
- Lernen und Anwenden von Rechtschreibregeln
- Schreiben von Wörtern`,
    rechenschwaeche_header: "Rechenschwäche\nFörderung bei Rechenschwäche",
    rechenschwaeche_content: `Dein Kind zählt in der 2. Klasse, statt zu rechnen? Es fällt deinem Kind schwer, das 1x1 zu lernen?

Besonders im Bereich Mathematik ist es wichtig, frühzeitig mit einer Förderung anzusetzen und die Basis zu festigen. Die Lücke wird immer größer, den Kindern macht Mathe keinen Spaß mehr, sie sind frustriert.

Oft haben sich Kinder eigene Strategien oder "Tricks" zurechtgelegt, die leider nicht immer funktionieren- dann stimmt das Ergebnis nicht. Wichtig ist, deinem Kind keine Rechenwege oder Methoden aufzuzwängen. Ich werde mit deinem Kind gemeinsam einen Weg finden, wie es sich zurechtfindet und Mathe meistert!

Ich möchte dein Kind und dich unterstützen. Die Förderung funktioniert am besten, wenn auch du zu Hause weißt, worauf es ankommt!

Wenn du bei deinem Kind folgende Schwierigkeiten beobachtest, könnte eine Rechenschwäche vorliegen.

- Rechnen ohne Unterstützung (Plättchen, Finger...)
- Rechentempo (sehr langsam)
- Rechnen über oder unter den Zehner
- Verstehen des Stellenwerts
- Schreiben von Zahlen
- Zerlegen von Zahlen
- Lösen von Sachaufgaben
- Lernen des 1x1

Nach einem kostenlosen Kennenlerngespräch (ca. 30 min), in dem du mir euer Anliegen schilderst, erstelle ich für dein Kind zusätzlich zur standardisierten Testung eine individuelle Lernstandserhebung. Damit ich weiß, wo ich mit meiner Förderung ansetzen muss ist es wichtig, dass ich weiß, wie dein Kind rechnet.

Basierend auf den Testergebnissen arbeite ich einen individuellen Förderplan, bzw. ein Förderkonzept aus.

Wenn erwünscht folgt ein Beratungsgespräch bezüglich der Testergebnisse und ich stelle Übungen für zu Hause zusammen.*

## Mein Angebot beinhaltet:

- Anamnesegespräch mit dir (ca. 1 Stunde)
- Lernstandserhebung anhand einer standardisierten Testung
- Pädagogisches Gutachten (wird auf expliziten Wunsch schriftlich erstellt)
- Besprechung der Ergebnisse

Ich stelle ein individuelles Trainingskonzept für dein Kind zusammen, basierend auf den Ergebnissen der pädagogischen Diagnostik und des Anamnesegesprächs.*

Die Förderung findet meist einmal pro Woche für 50 Minuten statt. Wichtig ist der regelmäßige Besuch bei mir. Damit eine Verbesserung der Situation optimal gelingt, ist es notwendig, dass die Eltern (oder Lernpartner) ausreichend Zeit haben, konsequent über einen längeren Zeitraum mit dem Kind zu üben.

Im Preis ist eine Einheit pro Woche, Übungsmaterial für die wöchentliche Hausübung, Telefonate mit Lehrerinnen und Lehrern und die Beratung der Eltern inkludiert.

[PREIS] Deine Investition: € 95,- / 50 Minuten**

## Ablauf

[*] *Investition für ein pädagogisches Gutachten: € 250,- (Anamnesegespräch, standardisierte Testung, qualitative Fehleranalyse, Erstellung des pädagogischen Gutachtens)

[*] **Bei einer verbindlichen Anmeldung zur Förderung sind ein Anamnesegespräch, ein standardisierter Test der Rechenfertigkeiten, bzw. des Verständnisses und eine qualitative Fehleranalyse im Beitrag bereits enthalten. Das pädagogische Gutachten erfolgt dabei mündlich im Zuge eines Informationsgespräches.`,
    afs_header: "Diagnostik\nAFS-Computertest",
    afs_content: `Als diplomierte Legasthenie- und Dyskalkulietrainerin in Ausbildung setze ich das AFS- Computertestverfahren im Rahmen einer pädagogischen Förderdiagnostik zur Feststellung und Kategorisierung einer eventuell vorliegenden Legasthenie/LRS oder Dyskalkulie/Rechenschwäche ein.

Zuerst wird spielerisch überprüft, ob und wie gut das Kind seine Aufmerksamkeit halten kann. Dann werden die Sinneswahrnehmungen getestet. Bei verschiedenen Aufgaben wird die Verarbeitung von visuellen und auditiven Eindrücken sowie die Raumwahrnehmung überprüf. So erkennt man, ob das Kind z.B. Schwierigkeiten hat, Unterschiede zu sehen bzw. zu hören, ob es Gesehenes oder Gehörtes merken kann oder oder ob mehrere Bereiche betroffen sind.

Danach folgen Fragen zu den Symptomen. Dazu werden die Schriftproben deines Kindes analysiert. Auf Basis der Testergebnisse, der Analyse der Schriftproben und des Anamnesegesprächs erstelle ich ein pädagogisches Gutachten und einen individuellen Trainingsplan. So erfährst du, in welchen Bereichen dein Kind eine Förderung benötigt und wie wir gemeinsam mit deinem Kind erfolgreich trainieren können.`,
    cta: "Du vermutest eine **Lernschwäche?**\nVereinbare ein kostenloses, unverbindliches Kennenlerngespräch – ich nehme mir gerne Zeit für dein Anliegen.\n✉️ Gespräch vereinbaren",
  },

  // ── FAQ ──

  faq: {
    header: "Häufig gestellt\nFAQ's\nAntworten auf Fragen, die mir am häufigsten gestellt werden.",
    fragen: `Womit werden die Lese- Rechtschreib- und Rechenfertigkeiten meines Kindes getestet?

Meine Ausbildung zur Betreuerin für Lese-Rechtschreibschwäche befähigt mich, den SLRT-II einzusetzen. Dieser standardisierte Test besteht aus einem Leseteil und einem Rechtschreibteil. Er wird teilweise auch von PsychologInnen zur Feststellung einer Legasthenie eingesetzt.

In Mathematik verwende ich Kalkulie, einem Diagnose- und Trainingsprogramm für rechenschwache Kinder und erstelle zudem individualisierte Lernstandserhebungen basierend auf den Informationen, die ich von dir beim Kennenlerngespräch bekomme.

Zusätzlich dazu wird der AFS-Computertest durchgeführt um zu erkennen ob eine Legasthenie oder Dyskalkulie vorliegt.

---

Welche Schriftproben soll ich mitbringen?

Bring bitte Schriftstücke mit wie ein Schulheft, Hausübungsheft oder Diktate. Am besten ist ein Heft mit frei geschriebenen Texten.

Im Bereich Mathematik bring bitte Rechenproben mit, wie ein Schulheft, Hausübungsheft, Kopien von Tests oder Lernzielkontrollen.

---

Wie lange dauert die Testung?

In der Regel schaffen die Kinder die Austestung in einer Einheit. Es kann vorkommen, dass der AFS Test, die Testung mittels SLRTII oder Kalkulie auf zwei Einheiten aufgeteilt wird.

---

Wer kann Legasthenie und Dyskalkulie diagnostizieren?

Ich kann aufgrund meines pädagogischen Hintergrunds keine klinisch-psychologischen Diagnosen gemäß ICD-11/DSM-5 stellen, da die Abklärung der kognitiven Leistungsfähigkeit (Intelligenzdiagnostik) nicht angeboten werden darf.

In meinem pädagogischen Gutachten findest du keine spezifischen Diagnoseschlüssel (z.B. ICD-10: F81.0 Lese- und Rechtschreibstörung, F81.1 Isolierte Rechtschreibstörung, F81.2 Rechenstörung, F81.3 Kombinierte Störung schulischer Fertigkeiten). Stattdessen werden in der pädagogischen Diagnostik Lese- und/oder Rechtschreibschwierigkeiten oder Rechenschwierigkeiten anhand normierter Tests beschrieben. Die von mir durchgeführten Testungen basieren jedoch hauptsächlich auf denselben standardisierten Verfahren, die auch in der klinisch-psychologischen Diagnostik zum Einsatz kommen.`,
    cta: "Noch Fragen offen? **Melde dich gerne!**\nIch beantworte deine Fragen gern persönlich – unverbindlich und in Ruhe.\n✉️ Frage stellen",
  },

  // ── Über Mich ──

  ueber_mich: {
    header: "Über mich\nHallo, ich bin **Anna Reichsöllner**\nGründerin von Einfach Lernen – Volksschullehrerin, Lernbegleiterin und Mama aus Eben im Pongau.",
    content: [
      "Ich freue mich, dich auf meiner Homepage begrüßen zu dürfen. Mein Name ist Anna Reichsöllner, ich wohne gemeinsam mit meinem Mann und unseren zwei Kindern in Eben im Pongau.",
      'Ich bin im Pinzgau aufgewachsen. Nach meiner Matura am Privatgymnasium St. Ursula in Salzburg 2008 studierte ich zunächst an der Fachhochschule Salzburg "Innovation und Management im Tourismus". Schon damals gab ich VolksschülerInnen und MaturantInnen Nachhilfe in Mathematik. Das "Lehren" ließ mich nicht los und ich entschied, Lehrerin zu werden, nachdem ich als Rezeptionistin in einem Hotel, Nachhilfelehrerin bei der Schülerhilfe Saalfelden, als Kellnerin und als Reitlehrerin gearbeitet hatte.',
      "Nachdem ich das Bachelorstudium im Bereich Primarstufenpädagogik mit Schwerpunkt gesellschaftlichem Lernen an der Pädagogischen Hochschule abgeschlossen hatte, folgte 2023 der Masterabschluss.",
      'Im Schuljahr 2021/22 hatte ich die Möglichkeit als Lernassistentin tätig zu sein und absolvierte den Hochschullehrgang "Betreuer/in für Lese-Rechtschreibschwäche" an der Pädagogischen Hochschule Salzburg. Durch meine Tätigkeit als Lernassistentin wurde ich noch mehr für das Thema "Förderung" sensibilisiert.',
      "Neben dem Besuch von zahlreichen Fortbildungen vor allem in den Bereichen Deutsch und Mathematik habe ich mir im Lauf der Jahre vieles an Materialien und Fachliteratur angeschafft und konnte so mein Wissen vertiefen.",
      "Die Gründung von Einfach Lernen war für mich eine Herzensangelegenheit. Was mich antreibt, ist die Überzeugung, dass jedes Kind die Chance verdient, sein volles Potenzial zu entfalten – ohne Druck, ohne Frustration. Es bereitet mir unendlich viel Freude, Kinder auf ihrem Lernweg zu begleiten und zu sehen, wie sie durch individuelle Unterstützung Selbstvertrauen und Stolz entwickeln.",
      "Mein Beruf als Volksschullehrerin sehe ich als großen Vorteil, denn ich verstehe sowohl die Perspektive der Lehrpersonen als auch die Herausforderungen, die Eltern täglich erleben.",
      "Als Mutter weiß ich, wie wichtig es ist, auf die Bedürfnisse jedes einzelnen Kindes einzugehen.",
      "Ich lege großen Wert darauf, den Kindern zu zeigen, dass Lernen Spaß machen kann, wenn man die richtigen Werkzeuge und die nötige Geduld mitbringt. Mir ist es wichtig, ein Umfeld zu schaffen, in dem Kinder ohne Angst vor Fehlern lernen können. Denn ich bin überzeugt: Lernen funktioniert am besten, wenn Kinder sich sicher und wertgeschätzt fühlen.",
      "Einfach Lernen steht für eine ganzheitliche und wertschätzende Förderung, bei der jedes Kind in seinem Tempo und nach seinen eigenen Bedürfnissen unterstützt wird. Mein Ziel ist es, Kinder zu stärken, damit sie mit Selbstvertrauen und Freude ihre schulischen Herausforderungen meistern können.",
    ].join("\n\n"),
    hinweis: "Schreib mir gern, wenn du weitere Fragen hast! Ich freue mich darauf, dich kennenzulernen.",
    cta: "Lust auf ein erstes **Kennenlernen?**\nMelde dich jederzeit unverbindlich – ich freue mich, von dir und deinem Kind zu hören.\n✉️ Nachricht schreiben",
  },

  // ── Kontakt ──

  kontakt: {
    header: "So erreichst du mich\nKontakt\nMelde dich gerne – ich freue mich, von dir zu hören.",
    name: "Anna Reichsöllner, BEd MEd",
    telefon: "0670 190 26 04",
    email: "info@einfachlernen-pongau.at",
    instagram: "einfachlernen_pongau",
    website: "www.einfachlernen-pongau.at",
    adresse: "Bauernschmiedgasse 380\n5531 Eben im Pongau",
    cta: "Lust, mich **kennenzulernen?**\nSchreib mir eine Nachricht oder ruf einfach an – ich melde mich gerne bei dir zurück.\n✉️ Nachricht schreiben",
  },

  // ── Buchungsseite ──

  buchen: {
    header: "Online-Anmeldung\nKursplatz buchen\nWähle einen freien Termin aus, trage deine Daten ein und sichere dir deinen Platz – ganz unkompliziert online.",
    box_badge: "☀️ Sommer 2026",
    box_title: "Kursplatz buchen",
  },
};

// ── Admin-UI Modul-Felder ───────────────────────────────────

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
  // Startseite
  {
    key: "banner",
    titel: "Startseite – Banner",
    beschreibung: "Laufband ganz oben auf der Startseite.",
    felder: [
      { key: "text", label: "Hervorgehobener Text" },
      { key: "subtext", label: "Untertext" },
      { key: "cta_label", label: "Button-Beschriftung" },
    ],
  },
  {
    key: "hero",
    titel: "Startseite – Hero",
    beschreibung: "Der große Aufmacher-Bereich direkt unter dem Header.",
    felder: [
      { key: "location", label: "Standort-Hinweis" },
      { key: "heading", label: "Überschrift (Zeilen mit Enter trennen)", mehrzeilig: true },
      { key: "slogan", label: "Slogan" },
      { key: "lead", label: "Einleitungstext", mehrzeilig: true },
      { key: "buttons", label: "Buttons (je Zeile ein Button)", mehrzeilig: true },
      { key: "pills", label: "Stichworte (je Zeile eins)", mehrzeilig: true },
      { key: "card_heading", label: "Bildkarte – Überschrift" },
      { key: "card_text", label: "Bildkarte – Text" },
      { key: "tags", label: "Sprechblasen (je Zeile eine)", mehrzeilig: true },
    ],
  },
  {
    key: "willkommen",
    titel: "Startseite – Willkommen",
    beschreibung: "Persönliche Begrüßung & Vorstellung.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift" },
      { key: "text", label: "Begrüßungstext (Absätze durch Leerzeile trennen)", mehrzeilig: true },
      { key: "signatur", label: "Unterschrift" },
    ],
  },
  {
    key: "angebot",
    titel: "Startseite – Mein Angebot",
    beschreibung: "Drei Leistungskarten: je Karte Titel, Text, Button – durch Leerzeile getrennt.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift" },
      { key: "heading", label: "Überschrift" },
      { key: "lead", label: "Einleitung", mehrzeilig: true },
      { key: "cards", label: "Drei Karten (Titel / Text / Button, durch Leerzeile getrennt)", mehrzeilig: true },
    ],
  },
  {
    key: "sommerkurse",
    titel: "Startseite – Sommerkurse",
    beschreibung: "Einleitungstext neben der Buchungsbox.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift" },
      { key: "heading", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "points", label: "Vier Vorteile (durch Leerzeile getrennt)", mehrzeilig: true },
      { key: "box_badge", label: "Buchungsbox – Badge" },
      { key: "box_title", label: "Buchungsbox – Titel" },
    ],
  },
  {
    key: "wann_hilft",
    titel: "Startseite – Wann hilft's",
    beschreibung: "Typische Anliegen.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift" },
      { key: "heading", label: "Überschrift" },
      { key: "subtitel", label: "Untertitel", mehrzeilig: true },
      { key: "chips", label: "Anliegen-Chips (durch Leerzeile getrennt)", mehrzeilig: true },
      { key: "vision_heading", label: "Baum-Karte – Überschrift" },
      { key: "vision_text", label: "Baum-Karte – Text", mehrzeilig: true },
    ],
  },
  {
    key: "prozess",
    titel: "Startseite – Vier Schritte",
    beschreibung: "Ablauf-Übersicht. Je Schritt: Titel / Text, durch Leerzeile getrennt.",
    felder: [
      { key: "kicker", label: "Kleine Überschrift" },
      { key: "heading", label: "Überschrift" },
      { key: "steps", label: "Vier Schritte (Titel / Text, durch Leerzeile getrennt)", mehrzeilig: true },
    ],
  },
  {
    key: "cta",
    titel: "Startseite – Kontakt-Aufruf",
    beschreibung: "Abschließender Kontakt-Aufruf.",
    felder: [
      { key: "heading", label: "Überschrift" },
      { key: "tagline", label: "Tagline" },
      { key: "text", label: "Text", mehrzeilig: true },
      { key: "buttons", label: "Buttons (je Zeile ein Button)", mehrzeilig: true },
    ],
  },

  // Unterseiten
  {
    key: "beratung",
    titel: "Beratung",
    beschreibung: "Unterseite /beratung. Seitenkopf: 3 Zeilen (Kicker, Titel, Untertitel). CTA: 3 Zeilen (Überschrift, Text, Button).",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "content", label: "Inhalt (mit [PREIS] für Preisbox)", mehrzeilig: true },
      { key: "cta", label: "Kontakt-Aufruf (Überschrift / Text / Button)", mehrzeilig: true },
    ],
  },
  {
    key: "legasthenie",
    titel: "Legasthenie & Dyskalkulie",
    beschreibung: "Unterseite /legasthenie-dyskalkulie. Header/CTA: je 2-3 Zeilen. Inhalt: ## Überschrift, - Aufzählung, [PREIS], [*] Fußnote.",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "lrs_header", label: "LRS – Abschnittskopf (Kicker / Überschrift)", mehrzeilig: true },
      { key: "lrs_content", label: "LRS – Gesamter Inhalt", mehrzeilig: true },
      { key: "rechenschwaeche_header", label: "Rechenschwäche – Abschnittskopf", mehrzeilig: true },
      { key: "rechenschwaeche_content", label: "Rechenschwäche – Gesamter Inhalt", mehrzeilig: true },
      { key: "afs_header", label: "AFS-Test – Abschnittskopf", mehrzeilig: true },
      { key: "afs_content", label: "AFS-Test – Gesamter Inhalt", mehrzeilig: true },
      { key: "cta", label: "Kontakt-Aufruf (Überschrift / Text / Button)", mehrzeilig: true },
    ],
  },
  {
    key: "faq",
    titel: "FAQ",
    beschreibung: "Unterseite /faq. Fragen: Frage als erste Zeile, dann Antwort-Absätze – Paare durch --- trennen.",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "fragen", label: "Fragen & Antworten (Paare mit --- trennen)", mehrzeilig: true },
      { key: "cta", label: "Kontakt-Aufruf (Überschrift / Text / Button)", mehrzeilig: true },
    ],
  },
  {
    key: "ueber_mich",
    titel: "Über mich",
    beschreibung: "Unterseite /ueber-mich.",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "content", label: "Biografie (Absätze durch Leerzeile trennen)", mehrzeilig: true },
      { key: "hinweis", label: "Hinweis-Box unten" },
      { key: "cta", label: "Kontakt-Aufruf (Überschrift / Text / Button)", mehrzeilig: true },
    ],
  },
  {
    key: "kontakt",
    titel: "Kontakt",
    beschreibung: "Unterseite /kontakt.",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "name", label: "Name & Titel" },
      { key: "telefon", label: "Telefonnummer" },
      { key: "email", label: "E-Mail-Adresse" },
      { key: "instagram", label: "Instagram-Handle" },
      { key: "website", label: "Webseite" },
      { key: "adresse", label: "Adresse", mehrzeilig: true },
      { key: "cta", label: "Kontakt-Aufruf (Überschrift / Text / Button)", mehrzeilig: true },
    ],
  },
  {
    key: "buchen",
    titel: "Buchungsseite",
    beschreibung: "Eigenständige Seite /buchen zum externen Verlinken.",
    felder: [
      { key: "header", label: "Seitenkopf (Kicker / Titel / Untertitel)", mehrzeilig: true },
      { key: "box_badge", label: "Buchungsbox – Badge" },
      { key: "box_title", label: "Buchungsbox – Titel" },
    ],
  },
];
