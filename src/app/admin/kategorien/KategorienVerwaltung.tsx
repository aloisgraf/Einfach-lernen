"use client";

import { useState } from "react";
import { Save, Check, Loader2, Plus, Trash2, Tags } from "lucide-react";
import { Kurskategorie } from "@/types/kategorie";

interface Props { initialKategorien: Kurskategorie[]; }

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function KategorienVerwaltung({ initialKategorien }: Props) {
  const [kategorien, setKategorien] = useState(initialKategorien);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function aendern(index: number, patch: Partial<Kurskategorie>) {
    setKategorien((prev) => prev.map((k, i) => {
      if (i !== index) return k;
      const naechste = { ...k, ...patch };
      if (patch.label !== undefined && k.id === slugify(k.label)) {
        naechste.id = slugify(patch.label);
      }
      return naechste;
    }));
    setSaved(false);
  }

  function hinzufuegen() {
    setKategorien((prev) => [...prev, { id: "", label: "", emoji: "⭐" }]);
    setSaved(false);
  }

  function entfernen(index: number) {
    setKategorien((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  async function speichern() {
    setSaving(true);
    setError("");
    try {
      const bereinigt = kategorien.map((k) => ({ ...k, id: k.id.trim() || slugify(k.label) }));
      if (bereinigt.some((k) => !k.id || !k.label.trim() || !k.emoji.trim())) {
        throw new Error("Bitte bei jeder Kategorie Symbol, Name und ID ausfüllen.");
      }
      const res = await fetch("/api/admin/kategorien", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bereinigt),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler beim Speichern");
      setKategorien(json);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 36, maxWidth: 760 }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Kurskategorien</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            Diese Kategorien erscheinen als Filter-Buttons über der Kursauswahl. Weise sie bei den Zeitslots zu.
          </p>
        </div>
        <button
          onClick={speichern}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#1a5c4a", color: "#fff",
            border: "none", borderRadius: 10, padding: "11px 22px",
            fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1, fontFamily: "inherit",
          }}
        >
          {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
            : saved ? <Check style={{ width: 16, height: 16 }} />
            : <Save style={{ width: 16, height: 16 }} />}
          {saving ? "Speichert…" : saved ? "Gespeichert" : "Änderungen speichern"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "#dc2626", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ ...card, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <Tags style={{ width: 16, height: 16, color: "#1a5c4a" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Kategorien</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {kategorien.map((kat, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <div>
                <label style={labelStyle}>Symbol</label>
                <input
                  value={kat.emoji}
                  onChange={(e) => aendern(i, { emoji: e.target.value })}
                  style={{ ...inputStyle, textAlign: "center", fontSize: 18 }}
                  placeholder="📖"
                />
              </div>
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  value={kat.label}
                  onChange={(e) => aendern(i, { label: e.target.value })}
                  style={inputStyle}
                  placeholder="z.B. Lesen"
                />
              </div>
              <div>
                <label style={labelStyle}>ID (für Zuweisung)</label>
                <input
                  value={kat.id}
                  onChange={(e) => aendern(i, { id: slugify(e.target.value) })}
                  style={inputStyle}
                  placeholder="lesen"
                />
              </div>
              <button
                onClick={() => entfernen(i)}
                title="Kategorie entfernen"
                style={{ padding: 10, borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", color: "#9ca3af" }}
              >
                <Trash2 style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={hinzufuegen}
          style={{
            display: "flex", alignItems: "center", gap: 8, marginTop: 18,
            padding: "10px 16px", background: "#fff", color: "#1a5c4a",
            border: "1.5px dashed #1a5c4a", borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
          Kategorie hinzufügen
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
