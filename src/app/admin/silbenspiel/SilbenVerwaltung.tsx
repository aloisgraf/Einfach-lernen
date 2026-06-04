"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2, BookOpen } from "lucide-react";
import { SilbenWort } from "@/types/silbenspiel";

interface Props { initialWoerter: SilbenWort[] }

const card: React.CSSProperties = {
  background: "#fff", borderRadius: 14, border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #e5e7eb", fontSize: 13, color: "#111827",
  background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
};

const leer = { wort: "", silbenInput: "", aktiv: true };

export default function SilbenVerwaltung({ initialWoerter }: Props) {
  const router = useRouter();
  const [woerter, setWoerter] = useState(initialWoerter);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(leer);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openNeu() { setEditId(null); setForm(leer); setFormOpen(true); }

  function openEdit(w: SilbenWort) {
    setEditId(w.id);
    setForm({ wort: w.wort, silbenInput: w.silben.join("-"), aktiv: w.aktiv });
    setFormOpen(true);
  }

  function parseSilben(input: string): string[] {
    return input.split("-").map(s => s.trim()).filter(Boolean);
  }

  async function handleSpeichern() {
    const silben = parseSilben(form.silbenInput);
    if (!form.wort.trim() || silben.length < 2) {
      alert("Bitte Wort und mindestens 2 Silben eingeben.");
      return;
    }
    setLoading(true);
    try {
      const body = { wort: form.wort.trim(), silben, aktiv: form.aktiv, ...(editId ? { id: editId } : {}) };
      const res = await fetch("/api/admin/silbenspiel", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error ?? "Fehler");
      if (editId) {
        setWoerter(prev => prev.map(w => w.id === editId ? saved : w));
      } else {
        setWoerter(prev => [saved, ...prev]);
      }
      setFormOpen(false);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoeschen(id: string) {
    if (!confirm("Wort wirklich löschen?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/silbenspiel", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setWoerter(prev => prev.filter(w => w.id !== id));
    } catch { alert("Fehler beim Löschen."); }
    finally { setDeletingId(null); }
  }

  async function handleToggle(w: SilbenWort) {
    setTogglingId(w.id);
    try {
      const res = await fetch("/api/admin/silbenspiel", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: w.id, aktiv: !w.aktiv }),
      });
      const updated = await res.json();
      setWoerter(prev => prev.map(x => x.id === w.id ? updated : x));
    } catch { alert("Fehler."); }
    finally { setTogglingId(null); }
  }

  const canSave = form.wort.trim() && parseSilben(form.silbenInput).length >= 2;

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Silbenspiel</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{woerter.length} Wörter gesamt</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/silbenspiel"
            target="_blank"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: "1.5px solid #1a5c4a", color: "#1a5c4a", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            Spiel öffnen ↗
          </a>
          <button
            onClick={openNeu}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            Neues Wort
          </button>
        </div>
      </div>

      {woerter.length === 0 ? (
        <div style={{ ...card, padding: 48, textAlign: "center" }}>
          <BookOpen style={{ width: 40, height: 40, color: "#e5e7eb", margin: "0 auto 16px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>Noch keine Wörter angelegt.</p>
          <button onClick={openNeu} style={{ padding: "10px 20px", background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Erstes Wort erstellen
          </button>
        </div>
      ) : (
        <div style={{ ...card, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                {["Wort", "Silben", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "" ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {woerter.map(w => (
                <tr key={w.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{w.wort}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {w.silben.map((s, i) => (
                        <span key={i} style={{ padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 12, fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => handleToggle(w)}
                      disabled={togglingId === w.id}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", background: w.aktiv ? "#eaf4ef" : "#f3f4f6", color: w.aktiv ? "#1a5c4a" : "#9ca3af" }}
                    >
                      {togglingId === w.id ? <Loader2 style={{ width: 11, height: 11 }} /> : null}
                      {w.aktiv ? "Aktiv" : "Inaktiv"}
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <button onClick={() => openEdit(w)} style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}>
                        <Pencil style={{ width: 15, height: 15 }} />
                      </button>
                      <button onClick={() => handleLoeschen(w.id)} disabled={deletingId === w.id} style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}>
                        {deletingId === w.id ? <Loader2 style={{ width: 15, height: 15 }} /> : <Trash2 style={{ width: 15, height: 15 }} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} onClick={() => setFormOpen(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{editId ? "Wort bearbeiten" : "Neues Wort"}</h2>
              <button onClick={() => setFormOpen(false)} style={{ padding: 6, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Wort *</label>
                <input type="text" value={form.wort} onChange={e => setForm(f => ({ ...f, wort: e.target.value }))} style={inputStyle} placeholder="z.B. Schmetterling" />
              </div>
              <div>
                <label style={labelStyle}>Silben *</label>
                <input type="text" value={form.silbenInput} onChange={e => setForm(f => ({ ...f, silbenInput: e.target.value }))} style={inputStyle} placeholder="Schmet-ter-ling" />
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>Silben mit <strong>-</strong> trennen. Mindestens 2 Silben.</p>
                {form.silbenInput && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    {parseSilben(form.silbenInput).map((s, i) => (
                      <span key={i} style={{ padding: "2px 10px", borderRadius: 20, background: "#eaf4ef", color: "#1a5c4a", fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.aktiv} onChange={e => setForm(f => ({ ...f, aktiv: e.target.checked }))} style={{ width: 15, height: 15, accentColor: "#1a5c4a" }} />
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Im Spiel aktiv</span>
              </label>
            </div>
            <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
              <button onClick={() => setFormOpen(false)} style={{ flex: 1, padding: "11px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Abbrechen
              </button>
              <button
                onClick={handleSpeichern}
                disabled={loading || !canSave}
                style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading || !canSave ? "not-allowed" : "pointer", background: loading || !canSave ? "#9ca3af" : "#1a5c4a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
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
