"use client";

import { Buchung, Zeitslot } from "@/types/buchung";
import { Trash2, Loader2, Check, X } from "lucide-react";
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
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(von: string, bis: string) {
  return `${von}–${bis} Uhr`;
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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
        prev.map((item) =>
          item.buchung.id === buchungId
            ? { ...item, buchung: { ...item.buchung, status: newStatus } }
            : item
        ).filter((item) => newStatus !== "rejected" || item.buchung.id !== buchungId)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(buchungId);
        return next;
      });
    }
  }

  // Gruppiere Buchungen nach Person
  const groupedByPerson = new Map<string, BuchungMitSlot[]>();
  for (const item of buchungen) {
    const key = `${item.buchung.vorname}|${item.buchung.nachname}`;
    if (!groupedByPerson.has(key)) {
      groupedByPerson.set(key, []);
    }
    groupedByPerson.get(key)!.push(item);
  }

  const groups = Array.from(groupedByPerson.entries()).map(([key, items]) => ({
    key,
    person: items[0].buchung,
    buchungen: items,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {groups.map(({ key, person, buchungen: personBuchungen }) => (
        <div key={key} style={{ ...card, overflow: "hidden" }}>
          {/* Header mit Personen-Info */}
          <div style={{ background: "#f9fafb", padding: 20, borderBottom: "1px solid #e8eceb" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>
              {person.vorname} {person.nachname}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</p>
                <p style={{ color: "#111827", margin: 0 }}>{person.email}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Telefon</p>
                <p style={{ color: "#111827", margin: 0 }}>{person.telefon}</p>
              </div>
            </div>
          </div>

          {/* Gruppiere Buchungen dieser Person nach gemeinsamen Merkmalen */}
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {personBuchungen.length} Buchung{personBuchungen.length > 1 ? "en" : ""}
            </p>

            {personBuchungen.map(({ buchung: b, slot }, idx) => (
              <div
                key={b.id}
                style={{
                  borderTop: idx > 0 ? "1px solid #f3f4f6" : "none",
                  paddingTop: idx > 0 ? 20 : 0,
                }}
              >
                {/* Status Badge + Kurs Badge */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: b.status === "confirmed" ? "#dcfce7" : b.status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: b.status === "confirmed" ? "#166534" : b.status === "rejected" ? "#991b1b" : "#92400e",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {b.status === "confirmed" && <Check style={{ width: 14, height: 14 }} />}
                    {b.status === "rejected" && <X style={{ width: 14, height: 14 }} />}
                    {b.status === "pending" && "⏳"}
                    {b.status === "confirmed"
                      ? "Bestätigt"
                      : b.status === "rejected"
                      ? "Abgelehnt"
                      : "Ausstehend"}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "#1a5c4a",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {b.kurs_name}
                  </span>
                </div>

                {/* Slot-Info */}
                {slot && (
                  <div style={{ marginBottom: 14 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: "#eaf4ef",
                        color: "#1a5c4a",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {formatDatum(slot.datum)} · {formatTime(slot.uhrzeit_von, slot.uhrzeit_bis)}
                    </span>
                  </div>
                )}

                {/* Kind Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Kind / Klasse
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "pre-line" }}>
                      {b.name_kind}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Bereich
                    </p>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 11, fontWeight: 700 }}>
                      {b.schulstufe}
                    </span>
                  </div>
                </div>

                {/* Förderziel */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Förderziel
                  </p>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>
                    {b.kind_lernen}
                  </p>
                </div>

                {/* Details */}
                {b.kind_staerken && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Details
                    </p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>
                      {b.kind_staerken}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {b.status === "pending" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button
                      onClick={() => handleStatusUpdate(b.id, "confirmed")}
                      disabled={loadingIds.has(b.id)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: "#dcfce7",
                        color: "#166534",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: loadingIds.has(b.id) ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        opacity: loadingIds.has(b.id) ? 0.6 : 1,
                      }}
                    >
                      {loadingIds.has(b.id) ? (
                        <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                      ) : (
                        <Check style={{ width: 16, height: 16 }} />
                      )}
                      Termin bestätigen
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(b.id, "rejected")}
                      disabled={loadingIds.has(b.id)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: "#fee2e2",
                        color: "#991b1b",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: loadingIds.has(b.id) ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        opacity: loadingIds.has(b.id) ? 0.6 : 1,
                      }}
                    >
                      {loadingIds.has(b.id) ? (
                        <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                      ) : (
                        <X style={{ width: 16, height: 16 }} />
                      )}
                      Termin ablehnen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
