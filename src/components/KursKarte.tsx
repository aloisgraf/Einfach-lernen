import Link from "next/link";
import { Clock, Users, MapPin, Euro } from "lucide-react";
import { Kurs, kategorieLabels } from "@/types";
import { cn } from "@/lib/utils";

const kategorieColors: Record<string, string> = {
  nachhilfe: "bg-blue-50 text-blue-700 border-blue-100",
  sprachen: "bg-violet-50 text-violet-700 border-violet-100",
  kreativ: "bg-amber-50 text-amber-700 border-amber-100",
  bewegung: "bg-rose-50 text-rose-700 border-rose-100",
  sonstiges: "bg-gray-50 text-gray-700 border-gray-200",
};

const kategorieEmoji: Record<string, string> = {
  nachhilfe: "📐",
  sprachen: "🌍",
  kreativ: "🎨",
  bewegung: "⚡",
  sonstiges: "💡",
};

interface KursKarteProps {
  kurs: Kurs;
  compact?: boolean;
}

export default function KursKarte({ kurs, compact = false }: KursKarteProps) {
  const naechsteEinheit = kurs.einheiten?.[0];
  const gesamtFreiePlaetze = kurs.einheiten?.reduce(
    (sum, e) => sum + e.freie_plaetze,
    0
  ) ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-[#d8f3e3] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden">
      {/* Color bar top */}
      <div className="h-1.5 bg-gradient-to-r from-[#2d6a4f] to-[#52b788]" />

      <div className="p-6 flex flex-col flex-1">
        {/* Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border",
              kategorieColors[kurs.kategorie]
            )}
          >
            <span>{kategorieEmoji[kurs.kategorie]}</span>
            {kategorieLabels[kurs.kategorie]}
          </span>
          {gesamtFreiePlaetze === 0 && (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
              Ausgebucht
            </span>
          )}
          {gesamtFreiePlaetze > 0 && gesamtFreiePlaetze <= 2 && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
              Nur {gesamtFreiePlaetze} Plätze frei
            </span>
          )}
        </div>

        <h3 className="font-bold text-[#1a1a2e] text-lg mb-2 group-hover:text-[#2d6a4f] transition-colors">
          {kurs.titel}
        </h3>

        {!compact && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
            {kurs.beschreibung}
          </p>
        )}

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-2 mb-5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{kurs.altersgruppe}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Euro className="w-3.5 h-3.5 flex-shrink-0" />
            <span>ab {kurs.preis_pro_einheit} €/Einheit</span>
          </div>
          {naechsteEinheit && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {naechsteEinheit.uhrzeit_von}–{naechsteEinheit.uhrzeit_bis} Uhr
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{naechsteEinheit.ort}</span>
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/kurse/${kurs.id}`}
          className={cn(
            "block text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all",
            gesamtFreiePlaetze > 0
              ? "bg-[#2d6a4f] text-white hover:bg-[#1b4332]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
          )}
        >
          {gesamtFreiePlaetze > 0 ? "Details & Anmeldung" : "Ausgebucht"}
        </Link>
      </div>
    </div>
  );
}
