"use client";

import { useState } from "react";
import { Save, Check, Loader2, FileText } from "lucide-react";
import { BuchungsformularTexte, FORMULAR_FELDER } from "@/types/formular";

interface Props { initialTexte: BuchungsformularTexte; }

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

export default function FormularVerwaltung({ initialTexte }: Props) {
  const [texte, setTexte] = useState(initialTexte);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function setFeld(key: keyof BuchungsformularTexte, value: string) {
    setTexte((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function speichern() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/formular", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(texte),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler beim Speichern");
      setTexte(json);
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Buchungsformular</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            Hier kannst du die Fragen &amp; Hinweistexte im Anmeldeformular auf der Startseite anpassen.
          </p>
        </div>
        <button
          onClick={speichern}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: saved ? "#1a5c4a" : "#1a5c4a", color: "#fff",
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
          <FileText style={{ width: 16, height: 16, color: "#1a5c4a" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Fragen &amp; Hinweistexte</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {FORMULAR_FELDER.map(({ key, label, mehrzeilig }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              {mehrzeilig ? (
                <textarea
                  value={texte[key]}
                  onChange={(e) => setFeld(key, e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              ) : (
                <input
                  value={texte[key]}
                  onChange={(e) => setFeld(key, e.target.value)}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
