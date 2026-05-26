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

  // Kalender-Grid aufbauen
  const ersterTag = new Date(jahr, monat, 1);
  // In Österreich: Montag = 0
  const startOffset = (ersterTag.getDay() + 6) % 7;
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  const tage: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: tageImMonat }, (_, i) => i + 1),
  ];

  // Slots pro Tag indexieren
  const slotsByDate = new Map<string, (Zeitslot & { freie_plaetze: number })[]>();
  for (const slot of slots) {
    const list = slotsByDate.get(slot.datum) ?? [];
    list.push(slot);
    slotsByDate.set(slot.datum, list);
  }

  function mkDateStr(tag: number) {
    const m = String(monat + 1).padStart(2, "0");
    const d = String(tag).padStart(2, "0");
    return `${jahr}-${m}-${d}`;
  }

  function istVergangenheit(tag: number) {
    const d = new Date(jahr, monat, tag);
    const heuteStart = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
    return d < heuteStart;
  }

  const tagSlots = gewaehlterTag ? (slotsByDate.get(gewaehlterTag) ?? []) : [];

  return (
    <div className="space-y-6">
      {/* Monats-Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonat}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Vorheriger Monat"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-bold text-[#1a1a2e] text-lg">
          {MONATE[monat]} {jahr}
        </h3>
        <button
          onClick={nextMonat}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Nächster Monat"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-1">
        {WOCHENTAGE.map((wt) => (
          <div key={wt} className="text-center text-xs font-semibold text-gray-400 py-1">
            {wt}
          </div>
        ))}

        {/* Tage */}
        {tage.map((tag, i) => {
          if (!tag) return <div key={`empty-${i}`} />;

          const dateStr = mkDateStr(tag);
          const tagesSlots = slotsByDate.get(dateStr) ?? [];
          const hatFreieSlots = tagesSlots.some((s) => s.freie_plaetze > 0);
          const hatSlots = tagesSlots.length > 0;
          const istHeute = dateStr === heute.toISOString().split("T")[0];
          const istGewählt = gewaehlterTag === dateStr;
          const vergangen = istVergangenheit(tag);

          return (
            <button
              key={dateStr}
              onClick={() => {
                if (!vergangen && hatSlots) {
                  setGewaehlterTag(istGewählt ? null : dateStr);
                }
              }}
              disabled={vergangen || !hatSlots}
              className={cn(
                "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all",
                istGewählt
                  ? "bg-[#2d6a4f] text-white shadow-md"
                  : hatFreieSlots && !vergangen
                  ? "bg-[#f0faf4] text-[#1b4332] hover:bg-[#d8f3e3] cursor-pointer"
                  : hatSlots && !vergangen
                  ? "bg-red-50 text-red-400 cursor-not-allowed"
                  : vergangen
                  ? "text-gray-300 cursor-default"
                  : "text-gray-500 cursor-default"
              )}
            >
              {istHeute && !istGewählt && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f4a261] rounded-full" />
              )}
              {tag}
              {hatSlots && !vergangen && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-0.5",
                    istGewählt
                      ? "bg-white"
                      : hatFreieSlots
                      ? "bg-[#52b788]"
                      : "bg-red-300"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legende */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#f0faf4] border border-[#52b788]" />
          Freie Plätze
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200" />
          Ausgebucht
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f4a261]" />
          Heute
        </span>
      </div>

      {/* Zeitslots des gewählten Tags */}
      {gewaehlterTag && tagSlots.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Verfügbare Zeitslots am{" "}
            {new Date(gewaehlterTag + "T12:00:00").toLocaleDateString("de-AT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            :
          </p>
          <div className="space-y-2">
            {tagSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.freie_plaetze > 0 && onSlotWaehlen(slot)}
                disabled={slot.freie_plaetze === 0}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  slot.freie_plaetze === 0
                    ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                    : ausgewaehlt === slot.id
                    ? "border-[#2d6a4f] bg-[#f0faf4] shadow-sm"
                    : "border-gray-200 hover:border-[#52b788] hover:bg-[#f9fafb]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{slot.titel}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {slot.uhrzeit_von} – {slot.uhrzeit_bis} Uhr
                    </p>
                    {slot.beschreibung && (
                      <p className="text-gray-400 text-xs mt-0.5">{slot.beschreibung}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        slot.freie_plaetze === 0
                          ? "bg-red-50 text-red-600"
                          : slot.freie_plaetze === 1
                          ? "bg-amber-50 text-amber-700"
                          : "bg-[#d8f3e3] text-[#1b4332]"
                      )}
                    >
                      {slot.freie_plaetze === 0
                        ? "Ausgebucht"
                        : `${slot.freie_plaetze} Platz${slot.freie_plaetze !== 1 ? "e" : ""} frei`}
                    </span>
                    {ausgewaehlt === slot.id && (
                      <p className="text-xs text-[#2d6a4f] font-semibold mt-1">✓ Ausgewählt</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
