"use client";

import { useState } from "react";
import KursKarte from "@/components/KursKarte";
import { mockKurse } from "@/lib/supabase";
import { KursKategorie, kategorieLabels } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const alleKategorien: (KursKategorie | "alle")[] = [
  "alle",
  "nachhilfe",
  "sprachen",
  "kreativ",
  "bewegung",
  "sonstiges",
];

const kategorieFilterLabels: Record<KursKategorie | "alle", string> = {
  alle: "Alle Kurse",
  ...kategorieLabels,
};

export default function KursListe() {
  const [suche, setSuche] = useState("");
  const [kategorie, setKategorie] = useState<KursKategorie | "alle">("alle");

  const gefiltert = mockKurse.filter((k) => {
    const matchKat = kategorie === "alle" || k.kategorie === kategorie;
    const matchSuche =
      suche.trim() === "" ||
      k.titel.toLowerCase().includes(suche.toLowerCase()) ||
      k.beschreibung.toLowerCase().includes(suche.toLowerCase());
    return matchKat && matchSuche;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Kurs suchen…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {alleKategorien.map((k) => (
            <button
              key={k}
              onClick={() => setKategorie(k)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                kategorie === k
                  ? "bg-[#2d6a4f] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-[#f0faf4] hover:text-[#2d6a4f]"
              )}
            >
              {kategorieFilterLabels[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {gefiltert.length} Kurs{gefiltert.length !== 1 ? "e" : ""} gefunden
      </p>

      {/* Grid */}
      {gefiltert.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gefiltert.map((kurs) => (
            <KursKarte key={kurs.id} kurs={kurs} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-medium">Keine Kurse gefunden</p>
          <p className="text-gray-400 text-sm mt-1">
            Versucht einen anderen Suchbegriff oder eine andere Kategorie.
          </p>
        </div>
      )}
    </div>
  );
}
