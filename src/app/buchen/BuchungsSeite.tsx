"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Kalender from "@/components/Kalender";
import { Zeitslot, schwerpunkte } from "@/types/buchung";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot { freie_plaetze: number; }
interface Props { slots: SlotMitPlaetzen[]; }

const schema = z.object({
  vorname: z.string().min(2, "Pflichtfeld"),
  nachname: z.string().min(2, "Pflichtfeld"),
  email: z.string().email("Ungültige E-Mail"),
  name_kind: z.string().min(2, "Pflichtfeld"),
  schulstufe: z.string().min(1, "Bitte wählen"),
  kind_lernen: z.string().min(3, "Pflichtfeld"),
  telefon: z.string().min(7, "Pflichtfeld"),
  kind_beschreibung: z.string().optional(),
  kind_diagnosen: z.string().optional(),
  nachricht: z.string().optional(),
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
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  lineHeight: 1.4,
};

const hintStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#9ca3af",
  marginBottom: 8,
  lineHeight: 1.5,
  fontStyle: "italic",
};

function Field({
  label, hint, error, children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {hint && <span style={hintStyle}>{hint}</span>}
      {children}
      {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function SectionLabel({ children, color = "#1a5c4a" }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 18px" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e8eceb" }} />
    </div>
  );
}

export default function BuchungsSeite({ slots }: Props) {
  const [slotsState, setSlotsState] = useState(slots);
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

  const fInputProps = (name: string) => ({
    onFocus: () => setFocusedInput(name),
    onBlur: () => setFocusedInput(null),
    style: getInputStyle(name),
  });

  async function onSubmit(data: FormData) {
    if (!ausgewaehlterSlot) return;
    setStatus("loading");

    const optionalParts = [
      data.kind_beschreibung?.trim() && `Beschreibung des Kindes:\n${data.kind_beschreibung.trim()}`,
      data.kind_diagnosen?.trim() && `Diagnosen / frühere Förderung:\n${data.kind_diagnosen.trim()}`,
      data.nachricht?.trim() && `Nachricht:\n${data.nachricht.trim()}`,
    ].filter(Boolean);

    try {
      const res = await fetch("/api/buchung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zeitslot_id: ausgewaehlterSlot.id,
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          name_kind: data.name_kind,
          schulstufe: data.schulstufe,
          kind_lernen: data.kind_lernen,
          kind_staerken: optionalParts.join("\n\n"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler");
      setSlotsState(prev => prev.map(s =>
        s.id === ausgewaehlterSlot.id ? { ...s, freie_plaetze: s.freie_plaetze - 1 } : s
      ));
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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "32px 0 60px", alignItems: "start" }} className="booking-grid">
      {/* Kalender */}
      <div style={{ ...card, position: "sticky", top: 24 }}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a5c4a" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>Schritt 1</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>Termin wählen</h3>
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          <Kalender slots={slotsState} ausgewaehlt={ausgewaehlterSlot?.id ?? null} onSlotWaehlen={setAusgewaehlterSlot} />
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

        <div style={{ padding: "4px 28px 28px" }}>
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "16px 0", color: "#dc2626", fontSize: 13 }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ── Kontaktdaten ── */}
            <SectionLabel>Ihre Kontaktdaten</SectionLabel>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Vorname *" error={errors.vorname?.message}>
                <input {...register("vorname")} {...fInputProps("vorname")} placeholder="Anna" />
              </Field>
              <Field label="Nachname *" error={errors.nachname?.message}>
                <input {...register("nachname")} {...fInputProps("nachname")} placeholder="Muster" />
              </Field>
            </div>

            <Field label="E-Mail *" error={errors.email?.message}>
              <input {...register("email")} type="email" {...fInputProps("email")} placeholder="anna@beispiel.at" />
            </Field>

            {/* ── Pflichtfelder ── */}
            <SectionLabel>Das Wichtigste für mich (Pflichtfelder)</SectionLabel>

            <Field
              label="Wie heißt dein Kind und in welche Klasse/Schulstufe kommt es ab September? *"
              hint="Bitte beide Namen und Schulstufen angeben, falls du die Stunde für zwei Kinder gemeinsam buchen möchtest."
              error={errors.name_kind?.message}
            >
              <textarea
                {...register("name_kind")}
                {...fInputProps("name_kind")}
                rows={2}
                placeholder="z.B. Emma, 3. Klasse VS / Luca, 5. Klasse NMS"
                style={{ ...getInputStyle("name_kind"), resize: "none" }}
              />
            </Field>

            <Field
              label="Welcher Schwerpunkt soll bei unserer gemeinsamen Zeit im Fokus stehen? *"
              hint="Bitte auswählen: Deutsch / Mathematik / Legasthenietraining / Dyskalkulietraining / Konzentrationstraining"
              error={errors.schulstufe?.message}
            >
              <select
                {...register("schulstufe")}
                {...fInputProps("schulstufe")}
                style={{ ...getInputStyle("schulstufe"), appearance: "auto" }}
              >
                <option value="">Bitte wählen…</option>
                {schwerpunkte.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field
              label="Was soll durch die Förderung erreicht werden? *"
              hint="Geht es dir vor allem um das Wiederholen von Stoff, Festigen, Lücken schließen oder darum, dass dein Kind wieder mehr Leichtigkeit und Motivation findet?"
              error={errors.kind_lernen?.message}
            >
              <textarea
                {...register("kind_lernen")}
                {...fInputProps("kind_lernen")}
                rows={3}
                placeholder="z.B. Lücken in der Rechtschreibung schließen und wieder mehr Freude am Lesen finden."
                style={{ ...getInputStyle("kind_lernen"), resize: "none" }}
              />
            </Field>

            <Field
              label="Unter welcher Telefonnummer kann ich dich bei Fragen oder im Notfall am besten erreichen? *"
              error={errors.telefon?.message}
            >
              <input {...register("telefon")} type="tel" {...fInputProps("telefon")} placeholder="+43 660 123 456" />
            </Field>

            {/* ── Optionale Angaben ── */}
            <SectionLabel color="#d97706">🟡 Raum für Details (Optionale Angaben)</SectionLabel>

            <Field
              label="Wie würdest du dein Kind beschreiben?"
              hint="Was macht ihm besonders viel Spaß, was zeichnet es aus und worüber lacht es gerne? Das hilft mir, mich ganz individuell auf dein Kind einzustellen."
            >
              <textarea
                {...register("kind_beschreibung")}
                {...fInputProps("kind_beschreibung")}
                rows={3}
                placeholder="z.B. Emma liebt Pferde, lacht viel und ist sehr kreativ. In der Schule ist sie eher ruhig, aber zu Hause richtig lebendig."
                style={{ ...getInputStyle("kind_beschreibung"), resize: "none" }}
              />
            </Field>

            <Field
              label="Gab es bereits außerschulische Förderung oder Diagnosen?"
              hint="Liegen bereits Befunde oder Vermutungen vor, wie z. B. eine Legasthenie, Dyskalkulie oder Konzentrationsschwierigkeiten?"
            >
              <textarea
                {...register("kind_diagnosen")}
                {...fInputProps("kind_diagnosen")}
                rows={2}
                placeholder="z.B. Legasthenie-Diagnose vom Schulpsychologischen Dienst, 2023."
                style={{ ...getInputStyle("kind_diagnosen"), resize: "none" }}
              />
            </Field>

            <Field
              label="Hast du noch eine Frage oder eine Nachricht an mich?"
              hint="Hier ist Platz für alles, was dir sonst noch auf dem Herzen liegt."
            >
              <textarea
                {...register("nachricht")}
                {...fInputProps("nachricht")}
                rows={2}
                placeholder="z.B. Können wir den ersten Termin auch online abhalten?"
                style={{ ...getInputStyle("nachricht"), resize: "none" }}
              />
            </Field>

            {/* ── Datenschutz ── */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 8 }}>
              <input {...register("datenschutz")} type="checkbox" style={{ marginTop: 3, accentColor: "#1a5c4a", width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
                Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                <a href="/datenschutz" target="_blank" style={{ color: "#1a5c4a", textDecoration: "underline" }}>Datenschutzerklärung</a>{" "}
                zu. *
              </span>
            </label>
            {errors.datenschutz && <p style={{ color: "#ef4444", fontSize: 11, marginBottom: 16 }}>{errors.datenschutz.message}</p>}

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
                marginTop: 16,
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
