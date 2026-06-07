"use client";

import { useState } from "react";
import { Save, Check, Loader2, FileText } from "lucide-react";
import { WebsiteTexte, TEXTE_MODULE, ModulFeld } from "@/types/website-texte";

interface Props { initialTexte: WebsiteTexte; }

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

export default function WebsiteTexteVerwaltung({ initialTexte }: Props) {
  const [texte, setTexte] = useState(initialTexte);
  const [aktivesModul, setAktivesModul] = useState(TEXTE_MODULE[0].key);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const modul = TEXTE_MODULE.find((m) => m.key === aktivesModul)!;
  const werte = texte[modul.key] as unknown as Record<string, string>;

  function setFeld(feld: ModulFeld, value: string) {
    setTexte((prev) => ({
      ...prev,
      [modul.key]: { ...(prev[modul.key] as unknown as Record<string, string>), [feld.key]: value },
    }));
    setSaved(false);
  }

  async function speichern() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/website-texte", {
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
    <div style={{ padding: 36 }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Website-Texte</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            Alle Texte &amp; Überschriften der Website – nach Seiten geordnet.
            <strong>**fett**</strong> · Aufzählung mit <code>- </code> · Überschrift mit <code>## </code> · Preisbox mit <code>[PREIS] </code> · Fußnote mit <code>[*] </code> · FAQ-Paare mit <code>---</code> trennen.
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

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Modul-Navigation */}
        <div style={{ ...card, padding: 10, minWidth: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {TEXTE_MODULE.map((m) => (
            <button
              key={m.key}
              onClick={() => setAktivesModul(m.key)}
              style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 10, border: "none",
                background: aktivesModul === m.key ? "#eaf4ef" : "transparent",
                color: aktivesModul === m.key ? "#1a5c4a" : "#374151",
                fontWeight: aktivesModul === m.key ? 700 : 600,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {m.titel}
            </button>
          ))}
        </div>

        {/* Modul-Felder */}
        <div style={{ ...card, padding: 28, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <FileText style={{ width: 16, height: 16, color: "#1a5c4a" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{modul.titel}</span>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 22px" }}>{modul.beschreibung}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {modul.felder.map((feld) => (
              <div key={feld.key}>
                <label style={labelStyle}>{feld.label}</label>
                {feld.mehrzeilig ? (
                  <textarea
                    value={werte[feld.key] ?? ""}
                    onChange={(e) => setFeld(feld, e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                ) : (
                  <input
                    value={werte[feld.key] ?? ""}
                    onChange={(e) => setFeld(feld, e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
