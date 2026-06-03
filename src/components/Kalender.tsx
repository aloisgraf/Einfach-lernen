"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Zeitslot } from "@/types/buchung";

interface Props {
  slots: (Zeitslot & { freie_plaetze: number })[];
  ausgewaehlt: string | null;
  onSlotWaehlen: (slot: Zeitslot & { freie_plaetze: number }) => void;
}

const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export default function Kalender({ slots, ausgewaehlt, onSlotWaehlen }: Props) {
  const heute = new Date();
  const [monat, setMonat] = useState(heute.getMonth());
  const [jahr, setJahr] = useState(heute.getFullYear());
  const [gewaehlterTag, setGewaehlterTag] = useState<string | null>(null);

  function prevMonat() { monat === 0 ? (setMonat(11), setJahr(j => j - 1)) : setMonat(m => m - 1); }
  function nextMonat() { monat === 11 ? (setMonat(0), setJahr(j => j + 1)) : setMonat(m => m + 1); }

  const startOffset = (new Date(jahr, monat, 1).getDay() + 6) % 7;
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();
  const tage: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: tageImMonat }, (_, i) => i + 1)];

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
    return new Date(jahr, monat, tag) < new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  }

  const tagSlots = gewaehlterTag ? (slotsByDate.get(gewaehlterTag) ?? []) : [];
  const heuteStr = heute.toISOString().split("T")[0];

  return (
    <div>
      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={prevMonat} style={{ border: "none", background: "#f3f4f6", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "inherit" }}>
          {MONATE[monat]} {jahr}
        </span>
        <button onClick={nextMonat} style={{ border: "none", background: "#f3f4f6", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Wochentage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {WOCHENTAGE.map(wt => (
          <div key={wt} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", padding: "4px 0" }}>{wt}</div>
        ))}
      </div>

      {/* Tage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {tage.map((tag, i) => {
          if (!tag) return <div key={`e-${i}`} />;
          const dateStr = mkDateStr(tag);
          const tagesSlots = slotsByDate.get(dateStr) ?? [];
          const hatFrei = tagesSlots.some(s => s.freie_plaetze > 0);
          const hatSlots = tagesSlots.length > 0;
          const istHeute = dateStr === heuteStr;
          const istGewählt = gewaehlterTag === dateStr;
          const vergangen = istVergangenheit(tag);

          let bg = "transparent";
          let color = "#374151";
          let cursor = "default";
          let fontWeight = 400;

          if (vergangen) { color = "#d1d5db"; }
          else if (istGewählt) { bg = "#1a5c4a"; color = "#fff"; fontWeight = 700; cursor = "pointer"; }
          else if (hatFrei) { bg = "#eaf4ef"; color = "#1a5c4a"; cursor = "pointer"; fontWeight = 600; }
          else if (hatSlots) { bg = "#fef2f2"; color = "#fca5a5"; cursor = "not-allowed"; }

          return (
            <button
              key={dateStr}
              onClick={() => { if (!vergangen && hatSlots) setGewaehlterTag(istGewählt ? null : dateStr); }}
              disabled={vergangen || !hatSlots}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                border: istHeute && !istGewählt ? "1.5px solid #1a5c4a" : "1.5px solid transparent",
                background: bg,
                color,
                fontSize: 13,
                fontWeight,
                cursor,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.1s",
                fontFamily: "inherit",
                gap: 2,
              }}
            >
              {tag}
              {hatSlots && !vergangen && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: istGewählt ? "rgba(255,255,255,0.6)" : hatFrei ? "#1a5c4a" : "#fca5a5" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legende */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 11, color: "#9ca3af" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "#eaf4ef", border: "1px solid #bbdeca", display: "inline-block" }} />
          Verfügbar
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "#fef2f2", border: "1px solid #fecaca", display: "inline-block" }} />
          Ausgebucht
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: "1.5px solid #1a5c4a", display: "inline-block" }} />
          Heute
        </span>
      </div>

      {/* Zeitslots */}
      {gewaehlterTag && tagSlots.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 10 }}>
            {new Date(gewaehlterTag + "T12:00:00").toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tagSlots.map(slot => {
              const selected = ausgewaehlt === slot.id;
              const voll = slot.freie_plaetze === 0;
              return (
                <button
                  key={slot.id}
                  onClick={() => !voll && onSlotWaehlen(slot)}
                  disabled={voll}
                  style={{
                    border: selected ? "2px solid #1a5c4a" : "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: selected ? "#eaf4ef" : voll ? "#fafafa" : "#fff",
                    cursor: voll ? "not-allowed" : "pointer",
                    opacity: voll ? 0.55 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    transition: "all 0.1s",
                    fontFamily: "inherit",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{slot.titel}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "3px 0 0" }}>{slot.uhrzeit_von} – {slot.uhrzeit_bis} Uhr</p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: voll ? "#fee2e2" : slot.freie_plaetze === 1 ? "#fef3c7" : "#eaf4ef",
                    color: voll ? "#dc2626" : slot.freie_plaetze === 1 ? "#d97706" : "#1a5c4a",
                    whiteSpace: "nowrap",
                  }}>
                    {voll ? "Ausgebucht" : `${slot.freie_plaetze} frei`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
