"use client";

import { Buchung, Zeitslot } from "@/types/buchung";
import { Trash2, Loader2 } from "lucide-react";
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

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

export default function BuchungenList({ initialBuchungen }: Props) {
  const [buchungen, setBuchungen] = useState(initialBuchungen);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Buchung wirklich löschen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/buchungen", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setBuchungen((prev) => prev.filter((b) => b.buchung.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Fehler beim Löschen");
    } finally {
      setDeletingId(null);
    }
  }

  // Gruppiere Buchungen nach Person (Vorname + Nachname)
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

          {/* Buchungen dieser Person */}
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {personBuchungen.length} Buchung{personBuchungen.length > 1 ? "en" : ""}
            </p>

            {personBuchungen.map(({ buchung: b, slot }) => (
              <div key={b.id} style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, position: "relative" }}>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deletingId === b.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 8,
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#e5e7eb",
                    transition: "color 0.2s",
                  }}
                  title="Löschen"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#e5e7eb";
                  }}
                >
                  {deletingId === b.id ? (
                    <Loader2 style={{ width: 16, height: 16, animation: "lvSpin 1s linear infinite" }} />
                  ) : (
                    <Trash2 style={{ width: 16, height: 16 }} />
                  )}
                </button>

                {/* Slot-Badge */}
                <div style={{ marginBottom: 12 }}>
                  {slot ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "4px 12px", borderRadius: 20,
                      background: "#eaf4ef", color: "#1a5c4a",
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {slot.titel} · {formatDatum(slot.datum)} · {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr
                    </span>
                  ) : (
                    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "#f3f4f6", color: "#9ca3af", fontSize: 12 }}>
                      Slot gelöscht
                    </span>
                  )}
                </div>

                {/* Kind Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Kind / Klasse</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "pre-line" }}>{b.name_kind}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bereich</p>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 11, fontWeight: 700 }}>{b.schulstufe}</span>
                  </div>
                </div>

                {/* Förderziel */}
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Förderziel</p>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>{b.kind_lernen}</p>
                </div>

                {/* Details */}
                {b.kind_staerken && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Details</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>{b.kind_staerken}</p>
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
