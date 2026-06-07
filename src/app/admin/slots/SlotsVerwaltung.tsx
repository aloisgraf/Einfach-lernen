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

interface TerminEntry {
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
}

const leerFormular = {
  titel: "",
  kurs: "",
  notizen: "",
  // Bearbeiten eines bestehenden Slots (ein Termin):
  datum: "",
  uhrzeit_von: "",
  uhrzeit_bis: "",
  // Neuanlage (ein oder mehrere Termine):
  termine: [{ datum: "", uhrzeit_von: "", uhrzeit_bis: "" }] as TerminEntry[],
  alsGruppe: false,
  max_teilnehmer: "1",
  freigegeben: false,
  preis: "",
  preis_2er: "",
  preis_5er: "",
  preis_10er: "",
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
    setFormData({ ...leerFormular, termine: [{ datum: "", uhrzeit_von: "", uhrzeit_bis: "" }] });
    setFormOpen(true);
  }

  function openEdit(slot: SlotMitPlaetzen) {
    // Wenn dieser Slot Teil einer Gruppe ist, bearbeite die ganze Gruppe
    if (slot.gruppe_id) {
      const gruppenSlots = slots.filter((s) => s.gruppe_id === slot.gruppe_id).sort((a, b) => a.datum.localeCompare(b.datum));
      setEditId(gruppenSlots[0]?.id ?? null);
      setFormData({
        ...leerFormular,
        titel: slot.titel,
        kurs: (slot as any).kurs ?? "",
        notizen: (slot as any).notizen ?? "",
        max_teilnehmer: String(slot.max_teilnehmer),
        freigegeben: slot.freigegeben,
        preis: slot.preis != null ? String(slot.preis) : "",
        preis_2er: (slot as any).preis_2er != null ? String((slot as any).preis_2er) : "",
        preis_5er: slot.preis_5er != null ? String(slot.preis_5er) : "",
        preis_10er: slot.preis_10er != null ? String(slot.preis_10er) : "",
        termine: gruppenSlots.map((s) => ({ datum: s.datum, uhrzeit_von: s.uhrzeit_von, uhrzeit_bis: s.uhrzeit_bis })),
        alsGruppe: true,
      });
    } else {
      // Einzelner Slot - bearbeite nur diesen
      setEditId(slot.id);
      setFormData({
        ...leerFormular,
        titel: slot.titel,
        kurs: (slot as any).kurs ?? "",
        notizen: (slot as any).notizen ?? "",
        datum: slot.datum,
        uhrzeit_von: slot.uhrzeit_von,
        uhrzeit_bis: slot.uhrzeit_bis,
        max_teilnehmer: String(slot.max_teilnehmer),
        freigegeben: slot.freigegeben,
        preis: slot.preis != null ? String(slot.preis) : "",
        preis_2er: (slot as any).preis_2er != null ? String((slot as any).preis_2er) : "",
        preis_5er: slot.preis_5er != null ? String(slot.preis_5er) : "",
        preis_10er: slot.preis_10er != null ? String(slot.preis_10er) : "",
      });
    }
    setFormOpen(true);
  }

  function terminHinzufuegen() {
    setFormData((d) => ({ ...d, termine: [...d.termine, { datum: "", uhrzeit_von: "", uhrzeit_bis: "" }] }));
  }

  function terminEntfernen(index: number) {
    setFormData((d) => ({ ...d, termine: d.termine.filter((_, i) => i !== index) }));
  }

  function terminAendern(index: number, feld: keyof TerminEntry, wert: string) {
    setFormData((d) => ({
      ...d,
      termine: d.termine.map((t, i) => (i === index ? { ...t, [feld]: wert } : t)),
    }));
  }

  async function handleSpeichern() {
    setLoading(true);
    try {
      if (editId) {
        const body = {
          id: editId,
          titel: formData.kurs,
          kurs: formData.kurs,
          notizen: formData.notizen,
          datum: formData.datum,
          uhrzeit_von: formData.uhrzeit_von,
          uhrzeit_bis: formData.uhrzeit_bis,
          max_teilnehmer: Number(formData.max_teilnehmer),
          freigegeben: formData.freigegeben,
          preis: formData.preis,
          preis_2er: formData.preis_2er,
          preis_5er: formData.preis_5er,
          preis_10er: formData.preis_10er,
        };
        const res = await fetch("/api/admin/slots", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const saved = await res.json();
        if (!res.ok) {
          const msg = saved.details ? `${saved.error} (${saved.details})` : saved.error ?? "Fehler beim Speichern.";
          throw new Error(msg);
        }
        router.refresh();
        setSlots((prev) => prev.map((s) => (s.id === editId ? { ...saved, freie_plaetze: s.freie_plaetze } : s)));
      } else {
        const body = {
          titel: formData.kurs.trim() || "Lerntermin",
          kurs: formData.kurs.trim() || "Einzelstunde",
          notizen: formData.notizen,
          max_teilnehmer: Number(formData.max_teilnehmer),
          freigegeben: formData.freigegeben,
          preis: formData.preis,
          preis_2er: formData.preis_2er,
          preis_5er: formData.preis_5er,
          preis_10er: formData.preis_10er,
          termine: formData.termine,
          alsGruppe: formData.alsGruppe,
        };
        const res = await fetch("/api/admin/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const saved = await res.json();
        if (!res.ok) {
          const msg = saved.details ? `${saved.error} (${saved.details})` : saved.error ?? "Fehler beim Speichern.";
          throw new Error(msg);
        }
        router.refresh();
        const neue: SlotMitPlaetzen[] = (saved as Zeitslot[]).map((s) => ({ ...s, freie_plaetze: Number(formData.max_teilnehmer) }));
        setSlots((prev) => [...prev, ...neue]);
      }
      setFormOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Fehler beim Speichern.");
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

  const canSave = editId
    ? Boolean(formData.datum && formData.uhrzeit_von && formData.uhrzeit_bis)
    : Boolean(
        formData.termine.length > 0 &&
        formData.termine.every((t) => t.datum && t.uhrzeit_von && t.uhrzeit_bis)
      );

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
                {(() => {
                  const grouped = new Map<string, SlotMitPlaetzen[]>();
                  for (const slot of slots) {
                    const key = slot.gruppe_id || slot.id;
                    if (!grouped.has(key)) grouped.set(key, []);
                    grouped.get(key)!.push(slot);
                  }
                  const sortedGroups = Array.from(grouped.values())
                    .sort((a, b) => a[0].datum.localeCompare(b[0].datum));

                  return sortedGroups.map((group) => {
                    const firstSlot = group[0];
                    const isGroup = group.length > 1;
                    const allFreie = Math.min(...group.map((s) => s.freie_plaetze));

                    return (
                      <tr key={firstSlot.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                            {firstSlot.titel}
                            {isGroup && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#fff4e0", color: "#a16207" }}>
                                {group.length} Tage
                              </span>
                            )}
                          </p>
                          {((firstSlot as any).notizen || firstSlot.beschreibung) && (
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>{(firstSlot as any).notizen || firstSlot.beschreibung}</p>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                          {isGroup ? (
                            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                              {group.map((s) => (
                                <div key={s.id}>{formatDatum(s.datum)}</div>
                              ))}
                            </div>
                          ) : (
                            formatDatum(firstSlot.datum)
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                          {isGroup ? (
                            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                              {group.map((s) => (
                                <div key={s.id}>{s.uhrzeit_von}–{s.uhrzeit_bis}</div>
                              ))}
                            </div>
                          ) : (
                            `${firstSlot.uhrzeit_von}–${firstSlot.uhrzeit_bis}`
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                            background: allFreie === 0 ? "#fee2e2" : "#eaf4ef",
                            color: allFreie === 0 ? "#dc2626" : "#1a5c4a",
                          }}>
                            {allFreie}/{firstSlot.max_teilnehmer}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <button
                            onClick={() => handleToggle(firstSlot)}
                            disabled={togglingId === firstSlot.id}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                              border: "none", cursor: "pointer", fontFamily: "inherit",
                              background: firstSlot.freigegeben ? "#eaf4ef" : "#f3f4f6",
                              color: firstSlot.freigegeben ? "#1a5c4a" : "#9ca3af",
                            }}
                            title={firstSlot.freigegeben ? "Klicken zum Sperren" : "Klicken zum Freigeben"}
                          >
                            {togglingId === firstSlot.id ? (
                              <Loader2 style={{ width: 12, height: 12 }} />
                            ) : firstSlot.freigegeben ? (
                              <Eye style={{ width: 12, height: 12 }} />
                            ) : (
                              <EyeOff style={{ width: 12, height: 12 }} />
                            )}
                            {firstSlot.freigegeben ? "Freigegeben" : "Gesperrt"}
                          </button>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                            <button
                              onClick={() => openEdit(firstSlot)}
                              style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}
                              title="Bearbeiten"
                            >
                              <Pencil style={{ width: 15, height: 15 }} />
                            </button>
                            <button
                              onClick={() => handleLoeschen(firstSlot.id)}
                              disabled={deletingId === firstSlot.id}
                              style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}
                              title="Löschen"
                            >
                              {deletingId === firstSlot.id ? (
                                <Loader2 style={{ width: 15, height: 15 }} />
                              ) : (
                                <Trash2 style={{ width: 15, height: 15 }} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
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
                <label style={labelStyle}>Kurs *</label>
                <input type="text" value={formData.kurs} onChange={(e) => setFormData((d) => ({ ...d, kurs: e.target.value }))} style={inputStyle} placeholder="z.B. Einzelstunde, Legasthenie, Dyskalkulie" />
              </div>
              <div>
                <label style={labelStyle}>Notizen (optional)</label>
                <input type="text" value={formData.notizen} onChange={(e) => setFormData((d) => ({ ...d, notizen: e.target.value }))} style={inputStyle} placeholder="Interne Notizen" />
              </div>
              {editId ? (
                <>
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
                </>
              ) : (
                <div>
                  <label style={labelStyle}>Termine *</label>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 10px", lineHeight: 1.5 }}>
                    Trage Datum und Uhrzeit für jeden Termin ein. Für mehrere Uhrzeiten am selben Tag oder
                    für einen Kurs über mehrere Tage füge weitere Termine hinzu.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {formData.termine.map((termin, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ flex: 1.3 }}>
                          {i === 0 && <span style={labelStyle}>Datum</span>}
                          <input type="date" value={termin.datum} onChange={(e) => terminAendern(i, "datum", e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                          {i === 0 && <span style={labelStyle}>Von</span>}
                          <input type="time" value={termin.uhrzeit_von} onChange={(e) => terminAendern(i, "uhrzeit_von", e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                          {i === 0 && <span style={labelStyle}>Bis</span>}
                          <input type="time" value={termin.uhrzeit_bis} onChange={(e) => terminAendern(i, "uhrzeit_bis", e.target.value)} style={inputStyle} />
                        </div>
                        <button
                          type="button"
                          onClick={() => terminEntfernen(i)}
                          disabled={formData.termine.length === 1}
                          style={{
                            padding: 10, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff",
                            cursor: formData.termine.length === 1 ? "not-allowed" : "pointer",
                            color: formData.termine.length === 1 ? "#e5e7eb" : "#9ca3af", display: "flex",
                          }}
                          title="Termin entfernen"
                        >
                          <X style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={terminHinzufuegen}
                    style={{
                      marginTop: 10, display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 10, border: "1.5px dashed #d1d5db",
                      background: "#fff", color: "#6b7280", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <Plus style={{ width: 13, height: 13 }} />
                    Weiteren Termin hinzufügen
                  </button>

                  {formData.termine.length > 1 && (
                    <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", cursor: "pointer", marginTop: 14 }}>
                      <input
                        type="checkbox"
                        checked={formData.alsGruppe}
                        onChange={(e) => setFormData((d) => ({ ...d, alsGruppe: e.target.checked }))}
                        style={{ width: 15, height: 15, accentColor: "#1a5c4a" }}
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>Mehrtägiger Kurs</p>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
                          Alle Termine gehören zu einem Kurs – bucht ein Kunde einen Termin, werden automatisch alle Termine für ihn gebucht.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Max. Teilnehmer *</label>
                  <input type="number" min={1} max={30} value={formData.max_teilnehmer} onChange={(e) => setFormData((d) => ({ ...d, max_teilnehmer: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Preis Einzelstunde in € (optional)</label>
                  <input type="number" min={0} step="1" value={formData.preis} onChange={(e) => setFormData((d) => ({ ...d, preis: e.target.value }))} style={inputStyle} placeholder="z.B. 180" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Preis für 2 Kinder in € (optional)</label>
                  <input type="number" min={0} step="1" value={formData.preis_2er} onChange={(e) => setFormData((d) => ({ ...d, preis_2er: e.target.value }))} style={inputStyle} placeholder="z.B. 160" />
                </div>
                <div>
                  <label style={labelStyle}>Preis ab 5 Terminen in € (optional)</label>
                  <input type="number" min={0} step="1" value={formData.preis_5er} onChange={(e) => setFormData((d) => ({ ...d, preis_5er: e.target.value }))} style={inputStyle} placeholder="z.B. 160" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Preis ab 10 Terminen in € (optional)</label>
                  <input type="number" min={0} step="1" value={formData.preis_10er} onChange={(e) => setFormData((d) => ({ ...d, preis_10er: e.target.value }))} style={inputStyle} placeholder="z.B. 140" />
                </div>
                <div></div>
              </div>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "-6px 0 0" }}>
                Diese Preise werden dem Kunden als Mengenrabatt-Hinweis angezeigt (z.B. „ab 5 Terminen nur € 160″).
              </p>
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
