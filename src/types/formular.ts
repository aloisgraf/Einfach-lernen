export interface BuchungsformularTexte {
  name_kind_label: string;
  name_kind_hint: string;
  schwerpunkt_label: string;
  schwerpunkt_hint: string;
  kind_lernen_label: string;
  kind_lernen_hint: string;
  telefon_label: string;
  kind_beschreibung_label: string;
  kind_beschreibung_hint: string;
  kind_diagnosen_label: string;
  kind_diagnosen_hint: string;
  nachricht_label: string;
  nachricht_hint: string;
}

export const STANDARD_FORMULAR_TEXTE: BuchungsformularTexte = {
  name_kind_label: "Wie heißt dein Kind und in welche Klasse/Schulstufe kommt es ab September?",
  name_kind_hint: "Bitte beide Namen und Schulstufen angeben, falls du die Stunde für zwei Kinder gemeinsam buchen möchtest.",
  schwerpunkt_label: "Welcher Schwerpunkt soll bei unserer gemeinsamen Zeit im Fokus stehen?",
  schwerpunkt_hint: "Bitte auswählen: Deutsch / Mathematik / Legasthenietraining / Dyskalkulietraining / Konzentrationstraining",
  kind_lernen_label: "Was soll durch die Förderung erreicht werden?",
  kind_lernen_hint: "Geht es dir vor allem um das Wiederholen von Stoff, Festigen, Lücken schließen oder darum, dass dein Kind wieder mehr Leichtigkeit und Motivation findet?",
  telefon_label: "Unter welcher Telefonnummer kann ich dich bei Fragen oder im Notfall am besten erreichen?",
  kind_beschreibung_label: "Wie würdest du dein Kind beschreiben?",
  kind_beschreibung_hint: "Was macht ihm besonders viel Spaß, was zeichnet es aus und worüber lacht es gerne? Das hilft mir, mich ganz individuell auf dein Kind einzustellen.",
  kind_diagnosen_label: "Gab es bereits außerschulische Förderung oder Diagnosen?",
  kind_diagnosen_hint: "Liegen bereits Befunde oder Vermutungen vor, wie z. B. eine Legasthenie, Dyskalkulie oder Konzentrationsschwierigkeiten?",
  nachricht_label: "Hast du noch eine Frage oder eine Nachricht an mich?",
  nachricht_hint: "Hier ist Platz für alles, was dir sonst noch auf dem Herzen liegt.",
};

export const FORMULAR_FELDER: { key: keyof BuchungsformularTexte; label: string; mehrzeilig?: boolean }[] = [
  { key: "name_kind_label", label: "Frage: Name & Klasse des Kindes" },
  { key: "name_kind_hint", label: "Hinweistext dazu", mehrzeilig: true },
  { key: "schwerpunkt_label", label: "Frage: Schwerpunkt" },
  { key: "schwerpunkt_hint", label: "Hinweistext dazu", mehrzeilig: true },
  { key: "kind_lernen_label", label: "Frage: Förderziel" },
  { key: "kind_lernen_hint", label: "Hinweistext dazu", mehrzeilig: true },
  { key: "telefon_label", label: "Frage: Telefonnummer" },
  { key: "kind_beschreibung_label", label: "Frage: Beschreibung des Kindes (optional)" },
  { key: "kind_beschreibung_hint", label: "Hinweistext dazu", mehrzeilig: true },
  { key: "kind_diagnosen_label", label: "Frage: Diagnosen / frühere Förderung (optional)" },
  { key: "kind_diagnosen_hint", label: "Hinweistext dazu", mehrzeilig: true },
  { key: "nachricht_label", label: "Frage: Nachricht (optional)" },
  { key: "nachricht_hint", label: "Hinweistext dazu", mehrzeilig: true },
];
