"use client";

import { Buchung, Zeitslot } from "@/types/buchung";
import { Loader2, Check, X } from "lucide-react";
import { useState } from "react";

interface BuchungMitSlot {
  buchung: Buchung;
  slot: Zeitslot | null;
}

interface Props {
  initialBuchungen: BuchungMitSlot[];
}

function formatDatum(datum: string) {
  return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

const label: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "#9ca3af",
  margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em",
};

export default function BuchungenList({ initialBuchungen }: Props) {
  const [buchungen, setBuchungen] = useState(initialBuchungen);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  async function handleStatusUpdate(buchungId: string, newStatus: "confirmed" | "rejected") {
    setLoadingIds((prev) => new Set(prev).add(buchungId));
    try {
      const res = await fetch("/api/admin/buchungen/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buchungId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      setBuchungen((prev) =>
        prev
          .map((item) =>
            item.buchung.id === buchungId
              ? { ...item, buchung: { ...item.buchung, status: newStatus } }
              : item
          )
          .filter((item) => newStatus !== "rejected" || item.buchung.id !== buchungId)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setLoadingIds((prev) => { const n = new Set(prev); n.delete(buchungId); return n; });
    }
  }

  // Gruppe nach Person
  const groupedByPerson = new Map<string, BuchungMitSlot[]>();
  for (const item of buchungen) {
    const key = `${item.buchung.vorname}|${item.buchung.nachname}|${item.buchung.email}`;
    if (!groupedByPerson.has(key)) groupedByPerson.set(key, []);
    groupedByPerson.get(key)!.push(item);
  }

  if (buchungen.length === 0) {
    return <p style={{ color: "#9ca3af", fontSize: 14 }}>Noch keine Buchungen vorhanden.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {Array.from(groupedByPerson.values()).map((items) => {
        const person = items[0].buchung;
        // Formularfelder sind für alle Buchungen dieser Person gleich → einmal aus erster Buchung nehmen
        const { name_kind, schulstufe, kind_lernen, kind_staerken } = person;

        return (
          <div key={`${person.vorname}|${person.nachname}|${person.email}`}
            style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eceb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}
          >
            {/* ── Kopfzeile: Elternteil ── */}
            <div style={{ background: "#f9fafb", padding: "16px 20px", borderBottom: "1px solid #e8eceb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
                  {person.vorname} {person.nachname}
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  {person.email} · {person.telefon}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 20 }}>
                {items.length} Termin{items.length > 1 ? "e" : ""}
              </span>
            </div>

            <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* ── Formulardaten (einmal) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", padding: "14px 16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e8eceb" }}>
                <div>
                  <p style={label}>Kind / Klasse</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, whiteSpace: "pre-line" }}>{name_kind}</p>
                </div>
                <div>
                  <p style={label}>Bereich</p>
                  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 11, fontWeight: 700 }}>
                    {schulstufe}
                  </span>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={label}>Förderziel</p>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>{kind_lernen}</p>
                </div>
                {kind_staerken && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p style={label}>Details</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>{kind_staerken}</p>
                  </div>
                )}
              </div>

              {/* ── Termine (je Buchung einzeln mit Bestätigung) ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ ...label, margin: 0 }}>Gebuchte Termine</p>
                {items
                  .slice()
                  .sort((a, b) => (a.slot?.datum ?? "").localeCompare(b.slot?.datum ?? ""))
                  .map(({ buchung: b, slot }) => (
                    <div key={b.id}
                      style={{
                        border: `1px solid ${b.status === "confirmed" ? "#bbf7d0" : b.status === "rejected" ? "#fecaca" : "#e5e7eb"}`,
                        borderRadius: 10,
                        padding: "12px 14px",
                        background: b.status === "confirmed" ? "#f0fdf4" : b.status === "rejected" ? "#fef2f2" : "#fff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                        {/* Datum + Kurs */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                            {slot ? `${formatDatum(slot.datum)} · ${slot.uhrzeit_von}–${slot.uhrzeit_bis} Uhr` : "Slot gelöscht"}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#1a5c4a", color: "#fff" }}>
                            {b.kurs_name}
                          </span>
                        </div>
                        {/* Status Badge */}
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                          background: b.status === "confirmed" ? "#dcfce7" : b.status === "rejected" ? "#fee2e2" : "#fef3c7",
                          color: b.status === "confirmed" ? "#166534" : b.status === "rejected" ? "#991b1b" : "#92400e",
                        }}>
                          {b.status === "confirmed" && <Check style={{ width: 12, height: 12 }} />}
                          {b.status === "rejected" && <X style={{ width: 12, height: 12 }} />}
                          {b.status === "pending" ? "⏳ Ausstehend" : b.status === "confirmed" ? "Bestätigt" : "Abgelehnt"}
                        </span>
                      </div>

                      {/* Buttons nur bei pending */}
                      {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button
                            onClick={() => handleStatusUpdate(b.id, "confirmed")}
                            disabled={loadingIds.has(b.id)}
                            style={{
                              flex: 1, padding: "7px 10px", borderRadius: 8, border: "none",
                              background: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: 12,
                              cursor: loadingIds.has(b.id) ? "not-allowed" : "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                              opacity: loadingIds.has(b.id) ? 0.6 : 1,
                            }}
                          >
                            {loadingIds.has(b.id)
                              ? <Loader2 style={{ width: 13, height: 13, animation: "lvSpin 1s linear infinite" }} />
                              : <Check style={{ width: 13, height: 13 }} />}
                            Bestätigen
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b.id, "rejected")}
                            disabled={loadingIds.has(b.id)}
                            style={{
                              flex: 1, padding: "7px 10px", borderRadius: 8, border: "none",
                              background: "#fee2e2", color: "#991b1b", fontWeight: 600, fontSize: 12,
                              cursor: loadingIds.has(b.id) ? "not-allowed" : "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                              opacity: loadingIds.has(b.id) ? 0.6 : 1,
                            }}
                          >
                            {loadingIds.has(b.id)
                              ? <Loader2 style={{ width: 13, height: 13, animation: "lvSpin 1s linear infinite" }} />
                              : <X style={{ width: 13, height: 13 }} />}
                            Ablehnen
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
