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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {buchungen.map(({ buchung: b, slot }) => (
        <div key={b.id} style={{ ...card, padding: 24, position: "relative" }}>
          <button
            onClick={() => handleDelete(b.id)}
            disabled={deletingId === b.id}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
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

          {/* Slot-Badge + Datum */}
          <div style={{ marginBottom: 20 }}>
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
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0" }}>
              Angemeldet am {new Date(b.erstellt_am).toLocaleDateString("de-AT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {/* Info-Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Elternteil</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{b.vorname} {b.nachname}</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>{b.email}</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{b.telefon}</p>
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Kind & Schwerpunkt</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "pre-line" }}>{b.name_kind}</p>
              <span style={{ display: "inline-block", marginTop: 8, padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 11, fontWeight: 700 }}>{b.schulstufe}</span>
            </div>

            <div style={{ background: "#eaf4ef", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#1a5c4a", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Förderziel & Details</p>
              <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 3px", fontWeight: 600 }}>Förderziel:</p>
              <p style={{ fontSize: 12, color: "#374151", margin: "0 0 10px", whiteSpace: "pre-line" }}>{b.kind_lernen}</p>
              {b.kind_staerken && (
                <>
                  <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 3px", fontWeight: 600 }}>Weitere Details:</p>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, whiteSpace: "pre-line" }}>{b.kind_staerken}</p>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
