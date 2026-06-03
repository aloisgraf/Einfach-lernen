"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zeitslot } from "@/types/buchung";

interface Props {
  slots: (Zeitslot & { freie_plaetze: number })[];
  ausgewaehlt: string | null;
  onSlotWaehlen: (slot: Zeitslot & { freie_plaetze: number }) => void;
}

const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONATE = [
  "Jänner", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export default function Kalender({ slots, ausgewaehlt, onSlotWaehlen }: Props) {
  const heute = new Date();
  const [monat, setMonat] = useState(heute.getMonth());
  const [jahr, setJahr] = useState(heute.getFullYear());
  const [gewaehlterTag, setGewaehlterTag] = useState<string | null>(null);

  function prevMonat() {
    if (monat === 0) { setMonat(11); setJahr(j => j - 1); }
    else setMonat(m => m - 1);
  }
  function nextMonat() {
    if (monat === 11) { setMonat(0); setJahr(j => j + 1); }
    else setMonat(m => m + 1);
  }

  const ersterTag = new Date(jahr, monat, 1);
  const startOffset = (ersterTag.getDay() + 6) % 7;
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();
  const tage: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: tageImMonat }, (_, i) => i + 1),
  ];

  const slotsByDate = new Map<string, (Zeitslot & { freie_plaetze: number })[]>();
  for (const slot of slots) {
    const list = slotsByDate.get(slot.datum) ?? [];
    list.push(slot);
    slotsByDate.set(slot.datum, list);
  }

  function mkDateStr(tag: number) {
    return `${jahr}-${String(monat + 1).padStart(2, "0")}-${String(tag).padStart(2, "0")}`;
  }

  function istVergangenheit(tag: number) {
    const d = new Date(jahr, monat, tag);
    return d < new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  }

  const tagSlots = gewaehlterTag ? (slotsByDate.get(gewaehlterTag) ?? []) : [];

  return (
    <div className="space-y-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonat} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a5c4a] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-[#1a5c4a]">
          {MONATE[monat]} {jahr}
        </span>
        <button onClick={nextMonat} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a5c4a] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {WOCHENTAGE.map((wt) => (
          <div key={wt} className="text-center text-[11px] font-semibold text-gray-400 py-1">
            {wt}
          </div>
        ))}
        {tage.map((tag, i) => {
          if (!tag) return <div key={`e-${i}`} />;
          const dateStr = mkDateStr(tag);
          const tagesSlots = slotsByDate.get(dateStr) ?? [];
          const hatFrei = tagesSlots.some((s) => s.freie_plaetze > 0);
          const hatSlots = tagesSlots.length > 0;
          const istHeute = dateStr === heute.toISOString().split("T")[0];
          const istGewählt = gewaehlterTag === dateStr;
          const vergangen = istVergangenheit(tag);

          return (
            <button
              key={dateStr}
              onClick={() => {
                if (!vergangen && hatSlots) setGewaehlterTag(istGewählt ? null : dateStr);
              }}
              disabled={vergangen || !hatSlots}
              className={cn(
                "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all",
                istGewählt ? "bg-[#1a5c4a] text-white"
                  : hatFrei && !vergangen ? "bg-[#eaf4ef] text-[#1a5c4a] hover:bg-[#d4ebdf] cursor-pointer"
                  : hatSlots && !vergangen ? "bg-red-50 text-red-400 cursor-not-allowed"
                  : vergangen ? "text-gray-200"
                  : "text-gray-300"
              )}
            >
              {istHeute && !istGewählt && (
                <span className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full" />
              )}
              {tag}
              {hatSlots && !vergangen && (
                <span className={cn("w-1 h-1 rounded-full mt-0.5",
                  istGewählt ? "bg-white/60" : hatFrei ? "bg-[#1a5c4a]" : "bg-red-300"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legende */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#eaf4ef] border border-[#1a5c4a]/20" />
          Verfügbar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200" />
          Ausgebucht
        </span>
      </div>

      {/* Zeitslots */}
      {gewaehlterTag && tagSlots.length > 0 && (
        <div className="border-t border-gray-100 pt-5 space-y-2">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            {new Date(gewaehlterTag + "T12:00:00").toLocaleDateString("de-AT", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>
          {tagSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => slot.freie_plaetze > 0 && onSlotWaehlen(slot)}
              disabled={slot.freie_plaetze === 0}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                slot.freie_plaetze === 0
                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  : ausgewaehlt === slot.id
                  ? "border-[#1a5c4a] bg-[#eaf4ef]"
                  : "border-gray-200 hover:border-[#1a5c4a]/40 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{slot.titel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {slot.uhrzeit_von} – {slot.uhrzeit_bis} Uhr
                  </p>
                </div>
                <span className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                  slot.freie_plaetze === 0 ? "bg-red-50 text-red-500"
                    : slot.freie_plaetze === 1 ? "bg-amber-50 text-amber-600"
                    : "bg-[#eaf4ef] text-[#1a5c4a]"
                )}>
                  {slot.freie_plaetze === 0 ? "Ausgebucht" : `${slot.freie_plaetze} frei`}
                </span>
              </div>
              {ausgewaehlt === slot.id && (
                <p className="text-[11px] text-[#1a5c4a] font-semibold mt-2">✓ Ausgewählt</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
