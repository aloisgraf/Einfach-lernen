"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, CalendarClock } from "lucide-react";
import { Zeitslot } from "@/types/buchung";

interface SlotMitPlaetzen extends Zeitslot {
  freie_plaetze: number;
}

interface Props {
  initialSlots: SlotMitPlaetzen[];
}

const leerFormular = {
  titel: "",
  beschreibung: "",
  datum: "",
  uhrzeit_von: "",
  uhrzeit_bis: "",
  max_teilnehmer: "1",
  freigegeben: false,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: 13,
  color: "#111827",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function SlotsVerwaltung({ initialSlots }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(leerFormular);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openNeu() {
    setEditId(null);
    setFormData(leerFormular);
    setFormOpen(true);
  }

  function openEdit(slot: SlotMitPlaetzen) {
    setEditId(slot.id);
    setFormData({
      titel: slot.titel,
      beschreibung: slot.beschreibung ?? "",
      datum: slot.datum,
      uhrzeit_von: slot.uhrzeit_von,
      uhrzeit_bis: slot.uhrzeit_bis,
      max_teilnehmer: String(slot.max_teilnehmer),
      freigegeben: slot.freigegeben,
    });
    setFormOpen(true);
  }

  async function handleSpeichern() {
    setLoading(true);
    try {
      const body = {
        ...formData,
        max_teilnehmer: Number(formData.max_teilnehmer),
        ...(editId ? { id: editId } : {}),
      };
      const res = await fetch("/api/admin/slots", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      const saved = await res.json();
      if (editId) {
        setSlots((prev) => prev.map((s) => s.id === editId ? { ...saved, freie_plaetze: s.freie_plaetze } : s));
      } else {
        setSlots((prev) => [...prev, { ...saved, freie_plaetze: Number(formData.max_teilnehmer) }]);
      }
      setFormOpen(false);
    } catch {
      alert("Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoeschen(id: string) {
    if (!confirm("Zeitslot wirklich löschen?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Fehler beim Löschen.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(slot: SlotMitPlaetzen) {
    setTogglingId(slot.id);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slot.id, freigegeben: !slot.freigegeben }),
      });
      const updated = await res.json();
      setSlots((prev) => prev.map((s) => s.id === slot.id ? { ...updated, freie_plaetze: s.freie_plaetze } : s));
    } catch {
      alert("Fehler.");
    } finally {
      setTogglingId(null);
    }
  }

  function formatDatum(datum: string) {
    return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  }

  const canSave = formData.titel && formData.datum && formData.uhrzeit_von && formData.uhrzeit_bis;

  return (
    <div style={{ padding: 36 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Zeitslots</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{slots.length} Slots gesamt</p>
        </div>
        <button
          onClick={openNeu}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", background: "#1a5c4a", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
          Neuer Slot
        </button>
      </div>

      {/* Empty state */}
      {slots.length === 0 ? (
        <div style={{ ...card, padding: 48, textAlign: "center" }}>
          <CalendarClock style={{ width: 40, height: 40, color: "#e5e7eb", margin: "0 auto 16px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>Noch keine Zeitslots angelegt.</p>
          <button
            onClick={openNeu}
            style={{ padding: "10px 20px", background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Ersten Slot erstellen
          </button>
        </div>
      ) : (
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                  {["Titel", "Datum", "Zeit", "Plätze", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: h === "Plätze" || h === "Status" ? "center" : h === "" ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{slot.titel}</p>
                      {slot.beschreibung && (
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>{slot.beschreibung}</p>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDatum(slot.datum)}</td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{slot.uhrzeit_von}–{slot.uhrzeit_bis}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: slot.freie_plaetze === 0 ? "#fee2e2" : "#eaf4ef",
                        color: slot.freie_plaetze === 0 ? "#dc2626" : "#1a5c4a",
                      }}>
                        {slot.freie_plaetze}/{slot.max_teilnehmer}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggle(slot)}
                        disabled={togglingId === slot.id}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                          background: slot.freigegeben ? "#eaf4ef" : "#f3f4f6",
                          color: slot.freigegeben ? "#1a5c4a" : "#9ca3af",
                        }}
                        title={slot.freigegeben ? "Klicken zum Sperren" : "Klicken zum Freigeben"}
                      >
                        {togglingId === slot.id ? (
                          <Loader2 style={{ width: 12, height: 12 }} />
                        ) : slot.freigegeben ? (
                          <Eye style={{ width: 12, height: 12 }} />
                        ) : (
                          <EyeOff style={{ width: 12, height: 12 }} />
                        )}
                        {slot.freigegeben ? "Freigegeben" : "Gesperrt"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                        <button
                          onClick={() => openEdit(slot)}
                          style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}
                          title="Bearbeiten"
                        >
                          <Pencil style={{ width: 15, height: 15 }} />
                        </button>
                        <button
                          onClick={() => handleLoeschen(slot.id)}
                          disabled={deletingId === slot.id}
                          style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}
                          title="Löschen"
                        >
                          {deletingId === slot.id ? (
                            <Loader2 style={{ width: 15, height: 15 }} />
                          ) : (
                            <Trash2 style={{ width: 15, height: 15 }} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} onClick={() => setFormOpen(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 440 }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                {editId ? "Slot bearbeiten" : "Neuer Zeitslot"}
              </h2>
              <button onClick={() => setFormOpen(false)} style={{ padding: 6, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Titel *</label>
                <input type="text" value={formData.titel} onChange={(e) => setFormData((d) => ({ ...d, titel: e.target.value }))} style={inputStyle} placeholder="z.B. Nachhilfe Mathematik" />
              </div>
              <div>
                <label style={labelStyle}>Beschreibung (optional)</label>
                <input type="text" value={formData.beschreibung} onChange={(e) => setFormData((d) => ({ ...d, beschreibung: e.target.value }))} style={inputStyle} placeholder="Kurze Zusatzinfo" />
              </div>
              <div>
                <label style={labelStyle}>Datum *</label>
                <input type="date" value={formData.datum} onChange={(e) => setFormData((d) => ({ ...d, datum: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Von *</label>
                  <input type="time" value={formData.uhrzeit_von} onChange={(e) => setFormData((d) => ({ ...d, uhrzeit_von: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Bis *</label>
                  <input type="time" value={formData.uhrzeit_bis} onChange={(e) => setFormData((d) => ({ ...d, uhrzeit_bis: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Max. Teilnehmer *</label>
                <input type="number" min={1} max={30} value={formData.max_teilnehmer} onChange={(e) => setFormData((d) => ({ ...d, max_teilnehmer: e.target.value }))} style={inputStyle} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.freigegeben}
                  onChange={(e) => setFormData((d) => ({ ...d, freigegeben: e.target.checked }))}
                  style={{ width: 15, height: 15, accentColor: "#1a5c4a" }}
                />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>Sofort freigeben</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>Der Slot ist sofort im Kalender buchbar</p>
                </div>
              </label>
            </div>

            {/* Modal footer */}
            <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
              <button
                onClick={() => setFormOpen(false)}
                style={{ flex: 1, padding: "11px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleSpeichern}
                disabled={loading || !canSave}
                style={{
                  flex: 1, padding: "11px", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: loading || !canSave ? "not-allowed" : "pointer",
                  background: loading || !canSave ? "#9ca3af" : "#1a5c4a",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit",
                }}
              >
                {loading ? <Loader2 style={{ width: 15, height: 15 }} /> : <Check style={{ width: 15, height: 15 }} />}
                {editId ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
