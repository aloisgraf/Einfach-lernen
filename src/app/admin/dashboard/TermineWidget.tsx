"use client";

import { useState } from "react";
import { Buchung, Zeitslot } from "@/types/buchung";

interface Props {
  slots: Zeitslot[];
  buchungen: Buchung[];
  heuteStr: string;
}

export default function TermineWidget({ slots, buchungen, heuteStr }: Props) {
  const [ansicht, setAnsicht] = useState<"3tage" | "alle">("3tage");

  const freigegebeneZukunft = slots
    .filter((s) => s.freigegeben && s.datum >= heuteStr)
    .sort((a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit_von.localeCompare(b.uhrzeit_von));

  const alleDaten = Array.from(new Set(freigegebeneZukunft.map((s) => s.datum)));
  const angezeigeDaten = ansicht === "3tage" ? alleDaten.slice(0, 3) : alleDaten;

  function slotInfo(slot: Zeitslot) {
    const sb = buchungen.filter((b) => b.zeitslot_id === slot.id);
    return {
      kurse: Array.from(new Set(sb.map((b) => b.kurs_name))),
      namen: sb.map((b) => `${b.vorname} ${b.nachname}`),
      belegt: sb.length,
    };
  }

  const leer = angezeigeDaten.length === 0;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eceb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: 24 }}>
      {/* Header mit Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
          {ansicht === "3tage" ? "Nächste 3 Tage" : "Alle Termine"}
        </h2>
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 8, padding: 2, gap: 2 }}>
          {(["3tage", "alle"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAnsicht(v)}
              style={{
                padding: "4px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700,
                cursor: "pointer",
                background: ansicht === v ? "#fff" : "transparent",
                color: ansicht === v ? "#111827" : "#9ca3af",
                boxShadow: ansicht === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all .15s",
              }}
            >
              {v === "3tage" ? "3 Tage" : "Alle"}
            </button>
          ))}
        </div>
      </div>

      {leer ? (
        <p style={{ color: "#9ca3af", fontSize: 13 }}>Keine bevorstehenden Termine.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxHeight: ansicht === "alle" ? 520 : undefined, overflowY: ansicht === "alle" ? "auto" : undefined }}>
          {angezeigeDaten.map((datum) => {
            const tagesSlots = freigegebeneZukunft.filter((s) => s.datum === datum);
            const gebucht = tagesSlots.filter((s) => slotInfo(s).belegt > 0);
            const frei = tagesSlots.filter((s) => slotInfo(s).belegt === 0);

            const datumFormatted = new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
              weekday: "short", day: "numeric", month: "short",
            });

            return (
              <div key={datum}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 10px", textTransform: "capitalize" }}>
                  {datumFormatted}
                </p>

                {gebucht.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      🔴 Gebucht
                    </p>
                    {gebucht.map((slot) => {
                      const info = slotInfo(slot);
                      const kursText = info.kurse.length ? info.kurse.join(", ") : slot.titel;
                      const namenText = info.namen.join(", ");
                      return (
                        <div key={slot.id} style={{ fontSize: 12, color: "#374151", padding: "6px 10px", background: "#fef2f2", borderLeft: "3px solid #dc2626", marginBottom: 4, borderRadius: 4 }}>
                          <span style={{ fontWeight: 600 }}>{slot.uhrzeit_von}–{slot.uhrzeit_bis}</span>
                          <span style={{ color: "#374151", marginLeft: 8 }}>{kursText}</span>
                          {namenText && <span style={{ color: "#9ca3af", marginLeft: 8 }}>· {namenText}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {frei.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      🟢 Frei
                    </p>
                    {frei.map((slot) => (
                      <div key={slot.id} style={{ fontSize: 12, color: "#374151", padding: "6px 10px", background: "#f0fdf4", borderLeft: "3px solid #16a34a", marginBottom: 4, borderRadius: 4 }}>
                        <span style={{ fontWeight: 600 }}>{slot.uhrzeit_von}–{slot.uhrzeit_bis}</span>
                        <span style={{ color: "#9ca3af", marginLeft: 8 }}>{slot.titel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
