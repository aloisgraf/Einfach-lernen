"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zeitslot, schwerpunkte } from "@/types/buchung";
import { BuchungsformularTexte } from "@/types/formular";
import { Kurskategorie } from "@/types/kategorie";
import { Loader2 } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot { freie_plaetze: number; }
interface Props {
  slots: SlotMitPlaetzen[];
  texte: BuchungsformularTexte;
  kategorien: Kurskategorie[];
}

const STANDARD_EMOJI = "⭐";

function kursEmoji(slot: SlotMitPlaetzen, kategorien: Kurskategorie[]) {
  const erste = slot.kategorien?.[0];
  return kategorien.find((k) => k.id === erste)?.emoji ?? STANDARD_EMOJI;
}

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

export default function SommerBuchung({ slots, texte, kategorien }: Props) {
  const [slotsState, setSlotsState] = useState(slots);
  const [aktiveKategorie, setAktiveKategorie] = useState<string | null>(null);
  const [gewaehlterKurs, setGewaehlterKurs] = useState<string | null>(null);
  const [gewaehltesDatum, setGewaehltesDatum] = useState<string | null>(null);
  const [ausgewaehlterSlot, setAusgewaehlterSlot] = useState<SlotMitPlaetzen | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sichtbareSlots = aktiveKategorie
    ? slotsState.filter((s) => s.kategorien?.includes(aktiveKategorie))
    : slotsState;

  const kurse: { titel: string; emoji: string; slots: SlotMitPlaetzen[] }[] = [];
  for (const slot of sichtbareSlots) {
    let gruppe = kurse.find((k) => k.titel === slot.titel);
    if (!gruppe) {
      gruppe = { titel: slot.titel, emoji: kursEmoji(slot, kategorien), slots: [] };
      kurse.push(gruppe);
    }
    gruppe.slots.push(slot);
  }

  const aktuellerKurs = kurse.find((k) => k.titel === gewaehlterKurs) ?? null;
  const termine = aktuellerKurs
    ? Array.from(new Set(aktuellerKurs.slots.map((s) => s.datum))).sort()
    : [];
  const zeitenAmTag = aktuellerKurs && gewaehltesDatum
    ? aktuellerKurs.slots.filter((s) => s.datum === gewaehltesDatum)
    : [];

  function kursWaehlen(titel: string) {
    setGewaehlterKurs(titel);
    setGewaehltesDatum(null);
    setAusgewaehlterSlot(null);
  }

  function datumWaehlen(datum: string, slotsAmTag: SlotMitPlaetzen[]) {
    setGewaehltesDatum(datum);
    if (slotsAmTag.length === 1) {
      setAusgewaehlterSlot(slotsAmTag[0].freie_plaetze > 0 ? slotsAmTag[0] : null);
    } else {
      setAusgewaehlterSlot(null);
    }
  }

  function buchungZuruecksetzen() {
    setGewaehlterKurs(null);
    setGewaehltesDatum(null);
    setAusgewaehlterSlot(null);
  }

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
      {/* Kategorie-Filter */}
      {kategorien.length > 0 && (
        <div className="kurs-filter">
          <button
            type="button"
            className={`kurs-filter-btn${aktiveKategorie === null ? " on" : ""}`}
            onClick={() => { setAktiveKategorie(null); buchungZuruecksetzen(); }}
          >
            Alle
          </button>
          {kategorien.map((kat) => (
            <button
              key={kat.id}
              type="button"
              className={`kurs-filter-btn${aktiveKategorie === kat.id ? " on" : ""}`}
              onClick={() => { setAktiveKategorie(kat.id); buchungZuruecksetzen(); }}
            >
              <span>{kat.emoji}</span> {kat.label}
            </button>
          ))}
        </div>
      )}

      {/* Schritt 1: Kurs wählen */}
      {kurse.length === 0 ? (
        <p style={{ fontSize: ".88rem", color: "var(--soft)", marginBottom: "1.2rem" }}>
          {slotsState.length === 0
            ? "Aktuell sind keine Termine zur Buchung freigegeben – schau bald wieder vorbei!"
            : "Für diese Kategorie sind aktuell keine Termine freigegeben."}
        </p>
      ) : !aktuellerKurs ? (
        <div className="course-grid">
          {kurse.map((kurs) => {
            const gesamtPlaetze = kurs.slots.reduce((sum, s) => sum + s.freie_plaetze, 0);
            const preise = Array.from(new Set(kurs.slots.map((s) => s.preis).filter((p): p is number => p != null)));
            return (
              <button
                type="button"
                key={kurs.titel}
                className="course-card"
                onClick={() => kursWaehlen(kurs.titel)}
              >
                <div className="cc-emoji">{kurs.emoji}</div>
                <h4>{kurs.titel}</h4>
                <p className="cc-info">
                  {kurs.slots.length === 1 ? "1 Termin verfügbar" : `${kurs.slots.length} Termine verfügbar`}
                  {kurs.slots[0].beschreibung ? ` · ${kurs.slots[0].beschreibung}` : ""}
                </p>
                <div className="cc-footer">
                  <span className={`cc-spots${gesamtPlaetze <= 0 ? " full" : ""}`}>
                    {gesamtPlaetze <= 0 ? "Ausgebucht" : "Termine ansehen →"}
                  </span>
                  {preise.length > 0 && (
                    <span className="cc-price">
                      {preise.length === 1 ? `€ ${preise[0]}` : `ab € ${Math.min(...preise)}`}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <button type="button" className="kurs-back" onClick={buchungZuruecksetzen}>← Anderen Kurs wählen</button>

          {/* Schritt 2: Tag wählen */}
          <p className="kurs-step-label">{aktuellerKurs.emoji} {aktuellerKurs.titel} – wähle einen Tag</p>
          <div className="termin-grid">
            {termine.map((datum) => {
              const slotsAmTag = aktuellerKurs.slots.filter((s) => s.datum === datum);
              const gesamtPlaetze = slotsAmTag.reduce((sum, s) => sum + s.freie_plaetze, 0);
              const aktiv = gewaehltesDatum === datum;
              return (
                <button
                  type="button"
                  key={datum}
                  className={`termin-btn${aktiv ? " on" : ""}`}
                  disabled={gesamtPlaetze <= 0}
                  onClick={() => datumWaehlen(datum, slotsAmTag)}
                >
                  <strong>{formatDatum(datum)}</strong>
                  <span>
                    {gesamtPlaetze <= 0
                      ? "Ausgebucht"
                      : slotsAmTag.length > 1
                        ? `${slotsAmTag.length} Uhrzeiten`
                        : `${slotsAmTag[0].uhrzeit_von}–${slotsAmTag[0].uhrzeit_bis} Uhr`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Schritt 3: Uhrzeit wählen (nur bei mehreren Terminen am selben Tag) */}
          {gewaehltesDatum && zeitenAmTag.length > 1 && (
            <>
              <p className="kurs-step-label">Wähle eine Uhrzeit am {formatDatum(gewaehltesDatum)}</p>
              <div className="termin-grid">
                {zeitenAmTag.map((slot) => {
                  const aktiv = ausgewaehlterSlot?.id === slot.id;
                  const voll = slot.freie_plaetze <= 0;
                  const knapp = slot.freie_plaetze === 1;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      className={`termin-btn${aktiv ? " on" : ""}`}
                      disabled={voll}
                      onClick={() => setAusgewaehlterSlot(slot)}
                    >
                      <strong>{slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr</strong>
                      <span className={knapp ? "knapp" : ""}>
                        {voll ? "Ausgebucht" : knapp ? "Nur 1 Platz frei!" : `${slot.freie_plaetze} Plätze frei`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {ausgewaehlterSlot ? (
        <div style={{ background: "var(--pine-pale)", borderRadius: 11, padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".85rem", color: "var(--pine-dark)", fontWeight: 700 }}>
          Ausgewählt: {ausgewaehlterSlot.titel} · {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
          {ausgewaehlterSlot.preis != null && ` · € ${ausgewaehlterSlot.preis}`}
        </div>
      ) : (
        <p style={{ fontSize: ".82rem", color: "var(--soft)", marginBottom: "1rem" }}>
          {!aktuellerKurs ? "Bitte zuerst oben einen Kurs auswählen." : "Bitte wähle Tag und Uhrzeit für deinen Termin."}
        </p>
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
