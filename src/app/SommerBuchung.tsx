"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zeitslot, schwerpunkte } from "@/types/buchung";
import { BuchungsformularTexte } from "@/types/formular";
import { Loader2 } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot { freie_plaetze: number; }
interface Props {
  slots: SlotMitPlaetzen[];
  texte: BuchungsformularTexte;
}

const KURS_ICONS = ["ci-a", "ci-b", "ci-c", "ci-d"];
const KURS_EMOJIS = ["📖", "🔢", "⭐", "📚"];

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
    day: "numeric", month: "long",
  });
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="fg full">
      <label>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {children}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

export default function SommerBuchung({ slots, texte }: Props) {
  const [slotsState, setSlotsState] = useState(slots);
  const [ausgewaehlterSlot, setAusgewaehlterSlot] = useState<SlotMitPlaetzen | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      setSlotsState((prev) => prev.map((s) =>
        s.id === ausgewaehlterSlot.id ? { ...s, freie_plaetze: s.freie_plaetze - 1 } : s
      ));
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStatus("error");
    }
  }

  function neueAnfrage() {
    reset();
    setAusgewaehlterSlot(null);
    setStatus("idle");
    setErrorMsg("");
  }

  if (status === "success") {
    return (
      <div className="book-ok" style={{ display: "block" }}>
        <strong>🎉 Anfrage gesendet!</strong>
        <p>Ich melde mich innerhalb von 24 Stunden bei euch.</p>
        {ausgewaehlterSlot && (
          <p style={{ marginTop: 8, fontWeight: 700 }}>
            {ausgewaehlterSlot.titel} · {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
          </p>
        )}
        <button type="button" onClick={neueAnfrage} className="btn btn-pine" style={{ marginTop: 14 }}>
          Weitere Anfrage stellen
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Kursauswahl im Original-Listen-Design */}
      {slotsState.length === 0 ? (
        <p style={{ fontSize: ".88rem", color: "var(--soft)", marginBottom: "1.2rem" }}>
          Aktuell sind keine Termine zur Buchung freigegeben – schau bald wieder vorbei!
        </p>
      ) : (
        <div className="course-list">
          {slotsState.map((slot, i) => {
            const selected = ausgewaehlterSlot?.id === slot.id;
            const voll = slot.freie_plaetze <= 0;
            const knapp = slot.freie_plaetze === 1;
            return (
              <label
                key={slot.id}
                className={`course-row${selected ? " on" : ""}`}
                style={{ opacity: voll ? 0.55 : 1, cursor: voll ? "not-allowed" : "pointer" }}
              >
                <input
                  type="radio"
                  name="kurs"
                  checked={selected}
                  disabled={voll}
                  onChange={() => !voll && setAusgewaehlterSlot(slot)}
                />
                <div className={`ci ${KURS_ICONS[i % KURS_ICONS.length]}`}>{KURS_EMOJIS[i % KURS_EMOJIS.length]}</div>
                <div className="cr-info">
                  <strong>{slot.titel}</strong>
                  <small>
                    {formatDatum(slot.datum)} · {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr
                    {slot.beschreibung ? ` · ${slot.beschreibung}` : ""}
                  </small>
                </div>
                <div className="cr-right">
                  <span className={`cr-spots${knapp ? " last" : ""}`}>
                    {voll ? "Ausgebucht" : knapp ? "Nur 1 Platz frei!" : `${slot.freie_plaetze} Plätze frei`}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {ausgewaehlterSlot ? (
        <div style={{ background: "var(--pine-pale)", borderRadius: 11, padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".85rem", color: "var(--pine-dark)", fontWeight: 700 }}>
          Ausgewählt: {ausgewaehlterSlot.titel} · {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
        </div>
      ) : (
        <p style={{ fontSize: ".82rem", color: "var(--soft)", marginBottom: "1rem" }}>Bitte zuerst oben einen Kurs auswählen.</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ opacity: ausgewaehlterSlot ? 1 : 0.45, pointerEvents: ausgewaehlterSlot ? "auto" : "none", transition: "opacity .2s" }}
      >
        <div className="form-grid">
          <div className="fg">
            <label>Vorname *</label>
            <input {...register("vorname")} placeholder="Anna" />
            {errors.vorname && <span className="err">{errors.vorname.message}</span>}
          </div>
          <div className="fg">
            <label>Nachname *</label>
            <input {...register("nachname")} placeholder="Muster" />
            {errors.nachname && <span className="err">{errors.nachname.message}</span>}
          </div>
          <div className="fg">
            <label>E-Mail *</label>
            <input {...register("email")} type="email" placeholder="anna@beispiel.at" />
            {errors.email && <span className="err">{errors.email.message}</span>}
          </div>
          <div className="fg">
            <label>{texte.telefon_label} *</label>
            <input {...register("telefon")} type="tel" placeholder="+43 660 123 456" />
            {errors.telefon && <span className="err">{errors.telefon.message}</span>}
          </div>
        </div>

        <Field label={`${texte.name_kind_label} *`} hint={texte.name_kind_hint} error={errors.name_kind?.message}>
          <textarea {...register("name_kind")} rows={2} placeholder="z.B. Emma, 3. Klasse VS" />
        </Field>

        <Field label={`${texte.schwerpunkt_label} *`} hint={texte.schwerpunkt_hint} error={errors.schulstufe?.message}>
          <select {...register("schulstufe")} defaultValue="">
            <option value="">Bitte wählen…</option>
            {schwerpunkte.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label={`${texte.kind_lernen_label} *`} hint={texte.kind_lernen_hint} error={errors.kind_lernen?.message}>
          <textarea {...register("kind_lernen")} rows={3} placeholder="z.B. Lücken in der Rechtschreibung schließen und wieder mehr Freude am Lesen finden." />
        </Field>

        <Field label={`${texte.kind_beschreibung_label} (optional)`} hint={texte.kind_beschreibung_hint}>
          <textarea {...register("kind_beschreibung")} rows={2} placeholder="Was zeichnet dein Kind aus, was macht ihm Freude?" />
        </Field>

        <Field label={`${texte.kind_diagnosen_label} (optional)`} hint={texte.kind_diagnosen_hint}>
          <textarea {...register("kind_diagnosen")} rows={2} placeholder="z.B. Legasthenie-Diagnose vom Schulpsychologischen Dienst, 2023." />
        </Field>

        <Field label={`${texte.nachricht_label} (optional)`} hint={texte.nachricht_hint}>
          <textarea {...register("nachricht")} rows={2} placeholder="Fragen, Besonderheiten…" />
        </Field>

        <label className="consent">
          <input {...register("datenschutz")} type="checkbox" />
          <span>
            Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
            <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> zu. *
          </span>
        </label>
        {errors.datenschutz && <span className="err">{errors.datenschutz.message}</span>}

        {status === "error" && (
          <div className="book-error">{errorMsg}</div>
        )}

        <button type="submit" className="book-btn" disabled={status === "loading" || !ausgewaehlterSlot}>
          {status === "loading"
            ? <><Loader2 style={{ width: 16, height: 16, animation: "lvSpin 1s linear infinite" }} /> Wird gesendet…</>
            : <>☀️ Kursplatz verbindlich anfragen</>
          }
        </button>
        <p className="book-note">Keine Vorauszahlung · Rückmeldung innerhalb von 24h · Unverbindlich</p>
      </form>
    </div>
  );
}
