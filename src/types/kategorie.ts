export interface Kurskategorie {
  id: string;
  label: string;
  emoji: string;
}

export const STANDARD_KURSKATEGORIEN: Kurskategorie[] = [
  { id: "lesen", label: "Lesen", emoji: "📖" },
  { id: "schreiben", label: "Schreiben", emoji: "✏️" },
  { id: "rechnen", label: "Rechnen", emoji: "🔢" },
  { id: "konzentration", label: "Konzentration", emoji: "🎯" },
];
