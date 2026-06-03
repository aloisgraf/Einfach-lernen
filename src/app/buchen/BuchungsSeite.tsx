"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Kalender from "@/components/Kalender";
import { Zeitslot, schulstufen } from "@/types/buchung";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot { freie_plaetze: number; }
interface Props { slots: SlotMitPlaetzen[]; }

const schema = z.object({
  vorname: z.string().min(2, "Pflichtfeld"),
  nachname: z.string().min(2, "Pflichtfeld"),
  email: z.string().email("Ungültige E-Mail"),
  telefon: z.string().min(7, "Pflichtfeld"),
  name_kind: z.string().min(2, "Pflichtfeld"),
  schulstufe: z.string().min(1, "Bitte wählen"),
  kind_staerken: z.string().min(3, "Pflichtfeld"),
  kind_lernen: z.string().min(3, "Pflichtfeld"),
  datenschutz: z.boolean().refine((v) => v, { message: "Bitte bestätigen" }),
});
type FormData = z.infer<typeof schema>;

function formatDatum(datum: string) {
  return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: 14,
  color: "#111827",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 6,
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 16px" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#1a5c4a", letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e8eceb" }} />
    </div>
  );
}

export default function BuchungsSeite({ slots }: Props) {
  const [ausgewaehlterSlot, setAusgewaehlterSlot] = useState<SlotMitPlaetzen | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function getInputStyle(name: string): React.CSSProperties {
    return { ...inputStyle, borderColor: focusedInput === name ? "#1a5c4a" : "#e5e7eb" };
  }

  async function onSubmit(data: FormData) {
    if (!ausgewaehlterSlot) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/buchung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zeitslot_id: ausgewaehlterSlot.id, ...data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStatus("error");
    }
  }

  function neueAnmeldung() {
    reset();
    setAusgewaehlterSlot(null);
    setStatus("idle");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ width: 64, height: 64, background: "#eaf4ef", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle style={{ width: 32, height: 32, color: "#1a5c4a" }} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Anmeldung erfolgreich!</h2>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>
          Wir melden uns in Kürze persönlich bei dir.
        </p>
        {ausgewaehlterSlot && (
          <div style={{ ...card, display: "inline-block", padding: "20px 28px", textAlign: "left", marginBottom: 28, minWidth: 260 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Dein Termin</p>
            <p style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>{ausgewaehlterSlot.titel}</p>
            <p style={{ color: "#6b7280", fontSize: 14 }}>{formatDatum(ausgewaehlterSlot.datum)}</p>
            <p style={{ color: "#6b7280", fontSize: 14 }}>{ausgewaehlterSlot.uhrzeit_von} – {ausgewaehlterSlot.uhrzeit_bis} Uhr</p>
          </div>
        )}
        <br />
        <button
          onClick={neueAnmeldung}
          style={{ background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          Weitere Anmeldung
        </button>
      </div>
    );
  }

  const fInputProps = (name: string) => ({
    onFocus: () => setFocusedInput(name),
    onBlur: () => setFocusedInput(null),
    style: getInputStyle(name),
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "32px 0 60px" }} className="booking-grid">
      {/* Kalender */}
      <div style={card}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a5c4a" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>Schritt 1</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>Termin wählen</h3>
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          <Kalender slots={slots} ausgewaehlt={ausgewaehlterSlot?.id ?? null} onSlotWaehlen={setAusgewaehlterSlot} />
        </div>
      </div>

      {/* Formular */}
      <div style={{ ...card, opacity: ausgewaehlterSlot ? 1 : 0.45, pointerEvents: ausgewaehlterSlot ? "auto" : "none", transition: "opacity 0.2s" }}>
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ausgewaehlterSlot ? "#1a5c4a" : "#d1d5db" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>Schritt 2</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Formular ausfüllen</h3>
          {ausgewaehlterSlot ? (
            <div style={{ background: "#eaf4ef", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ fontWeight: 700, color: "#1a5c4a", fontSize: 14, margin: 0 }}>{ausgewaehlterSlot.titel}</p>
              <p style={{ color: "#4a7c6a", fontSize: 12, margin: "3px 0 0" }}>
                {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
              </p>
            </div>
          ) : (
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Bitte zuerst Schritt 1 ausfüllen</p>
          )}
        </div>

        <div style={{ padding: "4px 28px 28px", overflowY: "auto", maxHeight: 620 }}>
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "16px 0", color: "#dc2626", fontSize: 13 }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <SectionLabel>Ihre Kontaktdaten</SectionLabel>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Vorname *" error={errors.vorname?.message}>
                <input {...register("vorname")} {...fInputProps("vorname")} placeholder="Max" />
              </Field>
              <Field label="Nachname *" error={errors.nachname?.message}>
                <input {...register("nachname")} {...fInputProps("nachname")} placeholder="Mustermann" />
              </Field>
            </div>

            <Field label="E-Mail *" error={errors.email?.message}>
              <input {...register("email")} type="email" {...fInputProps("email")} placeholder="max@beispiel.at" />
            </Field>

            <Field label="Telefon *" error={errors.telefon?.message}>
              <input {...register("telefon")} type="tel" {...fInputProps("telefon")} placeholder="+43 660 123 456" />
            </Field>

            <SectionLabel>Angaben zum Kind</SectionLabel>

            <Field label="Name des Kindes *" error={errors.name_kind?.message}>
              <input {...register("name_kind")} {...fInputProps("name_kind")} placeholder="z.B. Anna" />
            </Field>

            <Field label="Schulstufe *" error={errors.schulstufe?.message}>
              <select {...register("schulstufe")} {...fInputProps("schulstufe")} style={{ ...getInputStyle("schulstufe"), appearance: "auto" }}>
                <option value="">Bitte wählen…</option>
                {schulstufen.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Was kann mein Kind gut? *" error={errors.kind_staerken?.message}>
              <textarea
                {...register("kind_staerken")}
                {...fInputProps("kind_staerken")}
                rows={3}
                placeholder="z.B. Lesen, Englisch, kreatives Denken…"
                style={{ ...getInputStyle("kind_staerken"), resize: "none" }}
              />
            </Field>

            <Field label="Was muss mein Kind noch lernen? *" error={errors.kind_lernen?.message}>
              <textarea
                {...register("kind_lernen")}
                {...fInputProps("kind_lernen")}
                rows={3}
                placeholder="z.B. Mathematik, Rechtschreibung…"
                style={{ ...getInputStyle("kind_lernen"), resize: "none" }}
              />
            </Field>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
              <input {...register("datenschutz")} type="checkbox" style={{ marginTop: 2, accentColor: "#1a5c4a", width: 15, height: 15 }} />
              <span style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
                Ich stimme der Verarbeitung meiner Daten zu. *
              </span>
            </label>
            {errors.datenschutz && <p style={{ color: "#ef4444", fontSize: 11, marginTop: -14, marginBottom: 16 }}>{errors.datenschutz.message}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                width: "100%",
                background: "#1a5c4a",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 14,
                fontWeight: 700,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              {status === "loading"
                ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Wird gespeichert…</>
                : "Jetzt anmelden"
              }
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
