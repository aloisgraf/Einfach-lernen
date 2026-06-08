"use client";

import { useState, useEffect } from "react";
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

const STANDARD_EMOJI = "⭐";

// Mapping für Kursnamen und deren Untertitel/Beschreibungen
const KURS_INFO: Record<string, { displayName: string; subtitle: string }> = {
  "Einzelstunde": {
    displayName: "Nachhilfe & Lernbegleitung",
    subtitle: "Individuell zum Üben aller Fächer, Mathematik bis zur Sekundarstufe (Nachprüfungsvorbereitung möglich), Buchung auch zu zweit",
  },
  "Legasthenietraining": {
    displayName: "Lese- Rechtschreibtraining",
    subtitle: "Legasthenietraining, mindestens 1 Einheit pro Woche inkl. Übungsmaterial für zu Hause.",
  },
  "Dyskalkulietraining": {
    displayName: "Professionelles Dyskalkulietraining",
    subtitle: "Professionelles Dyskalkulietraining und Aufbau mathematischer Grundlagen. mindestens 1 Einheit pro Woche inkl. Übungsmaterial für zu Hause.",
  },
};

function getKursInfoByDisplayName(displayName: string): { displayName: string; subtitle: string } | null {
  return Object.values(KURS_INFO).find((info) => info.displayName === displayName) || null;
}

/** Zeigt einen Hinweis auf Mengenrabatt, falls für den Kurs Paketpreise hinterlegt sind. */
function RabattHinweis({ slots }: { slots: SlotMitPlaetzen[] }) {
  const preis5er = slots.map((s) => s.preis_5er).find((p): p is number => p != null);
  const preis10er = slots.map((s) => s.preis_10er).find((p): p is number => p != null);
  if (preis5er == null && preis10er == null) return null;
  return (
    <p className="rabatt-hinweis">
      {preis5er != null && <>ab 5 Terminen <strong>€ {preis5er}</strong></>}
      {preis5er != null && preis10er != null && " · "}
      {preis10er != null && <>ab 10 Terminen <strong>€ {preis10er}</strong></>}
    </p>
  );
}

function berechneGesamtpreis(slots: SlotMitPlaetzen[], schwerpunkt?: string, istGruppenKurs?: boolean): { total: number; label: string } | null {
  const count = slots.length;
  if (count === 0) return null;

  // Preise können je nach Datenquelle als String ankommen (z.B. NUMERIC-Spalten) –
  // ohne Konvertierung würde "330" + 0 zu String-Konkatenation ("3300") führen.
  const num = (v: number | null | undefined): number | null =>
    v == null ? null : Number(v);

  if (istGruppenKurs) {
    // Bei mehrtägigen Kursen ist der hinterlegte Preis bereits der Gesamtpreis
    // für den ganzen Kurs (auf jedem Termin der Gruppe identisch gespeichert) –
    // er darf nicht mit der Anzahl der Termine multipliziert werden.
    const gesamtpreis = num(slots.find((s) => s.preis != null)?.preis);
    if (gesamtpreis == null) return null;
    return { total: gesamtpreis, label: "Kurs gesamt" };
  }

  if (schwerpunkt === "Legasthenietraining") {
    const p = num(slots.find((s) => s.preis_legasthenie != null)?.preis_legasthenie);
    if (p == null) return null;
    return { total: count * p, label: count === 1 ? "Legasthenietraining" : `${count} × Legasthenietraining` };
  }
  if (schwerpunkt === "Dyskalkulietraining") {
    const p = num(slots.find((s) => s.preis_dyskalkulie != null)?.preis_dyskalkulie);
    if (p == null) return null;
    return { total: count * p, label: count === 1 ? "Dyskalkulietraining" : `${count} × Dyskalkulietraining` };
  }

  const einzelPreis = num(slots.find((s) => s.preis != null)?.preis);
  const preis5er = num(slots.find((s) => s.preis_5er != null)?.preis_5er);
  const preis10er = num(slots.find((s) => s.preis_10er != null)?.preis_10er);
  if (einzelPreis == null) return null;

  if (count >= 10 && preis10er != null) {
    const extra = count - 10;
    return {
      total: preis10er + extra * einzelPreis,
      label: extra > 0 ? `10er-Paket + ${extra} Einzelstunde${extra > 1 ? "n" : ""}` : "10er-Rundum-Sicher-Paket",
    };
  }
  if (count >= 5 && preis5er != null) {
    const extra = count - 5;
    return {
      total: preis5er + extra * einzelPreis,
      label: extra > 0 ? `5er-Paket + ${extra} Einzelstunde${extra > 1 ? "n" : ""}` : "5er-Sommerpaket",
    };
  }
  return {
    total: count * einzelPreis,
    label: count === 1 ? "Einzelstunde" : `${count} Einzelstunden`,
  };
}

const schema = z.object({
  vorname: z.string().min(2, "Pflichtfeld"),
  nachname: z.string().min(2, "Pflichtfeld"),
  email: z.string().email("Ungültige E-Mail"),
  telefon: z.string().min(7, "Pflichtfeld"),
  q0_kinder_anzahl: z.string().min(1, "Bitte wählen"),
  q1_name_klasse: z.string().min(2, "Pflichtfeld"),
  q2_bereiche: z.string().min(3, "Pflichtfeld"),
  q3_ziele: z.string().min(3, "Pflichtfeld"),
  q4_beschreibung: z.string().optional(),
  q5_diagnosen: z.string().optional(),
  q6_frage: z.string().optional(),
  datenschutz: z.boolean().refine((v) => v, { message: "Bitte bestätigen" }),
});
type FormData = z.infer<typeof schema>;

function formatDatum(datum: string) {
  return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
    day: "numeric", month: "long",
  });
}

function formatDatumKurz(datum: string) {
  return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function formatDatumsListe(daten: string[]) {
  if (daten.length === 1) return formatDatum(daten[0]);
  if (daten.length === 2) return `${formatDatum(daten[0])} & ${formatDatum(daten[1])}`;
  return `${daten.slice(0, -1).map(formatDatum).join(", ")} & ${formatDatum(daten[daten.length - 1])}`;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="fg full">
      <label style={{ marginTop: 12, display: "block" }}>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {children}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

interface KursVariante {
  gruppeId: string;
  slots: SlotMitPlaetzen[]; // sortiert nach Datum
}

interface KursFamilie {
  titel: string;
  emoji: string;
  istGruppenKurs: boolean;
  varianten: KursVariante[];   // bei mehrtägigen Kursen: jede Variante = ein Satz zusammengehöriger Termine
  einzelSlots: SlotMitPlaetzen[]; // bei Einzelblöcken: alle buchbaren Einzeltermine
  /**
   * Gesetzt bei "virtuellen" Familien, die denselben Pool an Einzelstunden-Slots
   * unter anderem Namen anbieten (Legasthenie-/Dyskalkulietraining). Bucht jemand
   * einen dieser Termine, sinkt die Verfügbarkeit für alle drei Varianten gleichermaßen,
   * da sie auf denselben Zeitslot zeigen. Es sind dabei nur einzelne Termine für 1 Kind buchbar.
   */
  erzwingeSchwerpunkt?: string;
}

const PAKETE = [
  { anzahl: 1, label: "Einzelstunde" },
  { anzahl: 5, label: "5 Einheiten" },
  { anzahl: 10, label: "10 Einheiten" },
] as const;

export default function SommerBuchung({ slots, texte }: Props) {
  const [slotsState, setSlotsState] = useState(slots);

  // Navigation
  const [gewaehlteFamilie, setGewaehlteFamilie] = useState<string | null>(null);
  const [gewaehltesTag1Datum, setGewaehltesTag1Datum] = useState<string | null>(null);
  const [gewaehltesPaket, setGewaehltesPaket] = useState<number | null>(null);

  const [ausgewaehlteSlots, setAusgewaehlteSlots] = useState<SlotMitPlaetzen[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [useCalendarView, setUseCalendarView] = useState(true);
  const [kalenderdatum, setKalenderdatum] = useState<string | null>(null);

  // ── Kurse zu Familien gruppieren (Kurs ist die Hauptüberschrift) ────────────
  const familien: KursFamilie[] = [];
  for (const slot of slotsState) {
    const name = slot.kurs || slot.titel;
    let familie = familien.find((f) => f.titel === name);
    if (!familie) {
      familie = { titel: name, emoji: STANDARD_EMOJI, istGruppenKurs: false, varianten: [], einzelSlots: [] };
      familien.push(familie);
    }
    if (slot.gruppe_id) {
      familie.istGruppenKurs = true;
      let variante = familie.varianten.find((v) => v.gruppeId === slot.gruppe_id);
      if (!variante) {
        variante = { gruppeId: slot.gruppe_id, slots: [] };
        familie.varianten.push(variante);
      }
      if (!variante.slots.find((s) => s.id === slot.id)) variante.slots.push(slot);
    } else {
      familie.einzelSlots.push(slot);
    }
  }
  for (const familie of familien) {
    for (const variante of familie.varianten) variante.slots.sort((a, b) => a.datum.localeCompare(b.datum));
    familie.varianten.sort((a, b) => (a.slots[0]?.datum ?? "").localeCompare(b.slots[0]?.datum ?? ""));
  }

  // ── Einzelstunden zusätzlich als Legasthenie-/Dyskalkulietraining anbieten ──
  // Jeder normale Einzelstunden-Termin teilt sich den Platz mit diesen beiden
  // "virtuellen" Buchungsvarianten – wird einer davon gebucht, sinkt die freie
  // Kapazität für alle drei gleichermaßen (gleicher Zeitslot, gleiche freie_plaetze).
  const einzelstundenFamilie = familien.find((f) => f.titel === "Einzelstunde" && !f.istGruppenKurs && f.einzelSlots.length > 0);
  if (einzelstundenFamilie) {
    // Aktualisiere auch den Anzeigenamen der Einzelstunde
    einzelstundenFamilie.titel = KURS_INFO["Einzelstunde"]?.displayName || "Einzelstunde";

    for (const [dbKey, schwerpunkt] of [
      ["Legasthenietraining", "Legasthenietraining"],
      ["Dyskalkulietraining", "Dyskalkulietraining"],
    ] as const) {
      const displayTitel = KURS_INFO[dbKey]?.displayName || dbKey;
      familien.push({
        titel: displayTitel,
        emoji: STANDARD_EMOJI,
        istGruppenKurs: false,
        varianten: [],
        einzelSlots: einzelstundenFamilie.einzelSlots,
        erzwingeSchwerpunkt: schwerpunkt,
      });
    }
  }

  const aktuelleFamilie = familien.find((f) => f.titel === gewaehlteFamilie) ?? null;

  // ── Mehrtägiger Kurs: Tag-1-Daten & Varianten je Tag-1-Datum ────────────────
  const tag1Daten = aktuelleFamilie
    ? Array.from(new Set(aktuelleFamilie.varianten.map((v) => v.slots[0]?.datum).filter((d): d is string => Boolean(d))))
    : [];
  const variantenAmTag1 = aktuelleFamilie && gewaehltesTag1Datum
    ? aktuelleFamilie.varianten.filter((v) => v.slots[0]?.datum === gewaehltesTag1Datum)
    : [];

  function familieWaehlen(familie: KursFamilie) {
    setGewaehlteFamilie(familie.titel);
    setGewaehltesTag1Datum(null);
    // Legasthenie-/Dyskalkulietraining: nur einzelne Termine für 1 Kind, keine Pakete – Paketwahl überspringen
    setGewaehltesPaket(familie.erzwingeSchwerpunkt ? 1 : null);
    setAusgewaehlteSlots([]);
    // Bei nur einer Tag-1-Option direkt vorauswählen
    if (familie.istGruppenKurs) {
      const eindeutigeTage = Array.from(new Set(familie.varianten.map((v) => v.slots[0]?.datum)));
      if (eindeutigeTage.length === 1) setGewaehltesTag1Datum(eindeutigeTage[0] ?? null);
    }
  }

  function variantenWaehlen(variante: KursVariante) {
    setAusgewaehlteSlots(variante.slots);
  }

  function paketSlotToggle(slot: SlotMitPlaetzen) {
    if (gewaehltesPaket == null) return;
    setAusgewaehlteSlots((prev) => {
      const existiert = prev.find((s) => s.id === slot.id);
      if (existiert) return prev.filter((s) => s.id !== slot.id);
      return [...prev, slot];
    });
  }

  /** Setzt die aktuelle Auswahl zurück, damit Datum/Uhrzeit neu gewählt werden können. */
  function datumAendern() {
    setAusgewaehlteSlots([]);
  }


  function buchungZuruecksetzen() {
    setGewaehlteFamilie(null);
    setGewaehltesTag1Datum(null);
    setGewaehltesPaket(null);
    setAusgewaehlteSlots([]);
  }

  function zurueckZuKursen() {
    setGewaehlteFamilie(null);
    setGewaehltesTag1Datum(null);
    setGewaehltesPaket(null);
    setAusgewaehlteSlots([]);
  }

  const auswahlAbgeschlossen = aktuelleFamilie
    ? aktuelleFamilie.istGruppenKurs
      ? ausgewaehlteSlots.length > 0
      : gewaehltesPaket != null && ausgewaehlteSlots.length >= 1
    : false;


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });



  async function onSubmit(data: FormData) {
    if (!auswahlAbgeschlossen || ausgewaehlteSlots.length === 0) return;
    setStatus("loading");

    try {
      // Mehrtägiger Kurs: Backend bucht beim ersten Termin automatisch alle der Gruppe.
      // Einzelblöcke (auch Pakete mit mehreren Terminen): jeden gewählten Termin einzeln buchen.
      const zuBuchen = ausgewaehlteSlots[0]?.gruppe_id
        ? [ausgewaehlteSlots[0]]
        : ausgewaehlteSlots;

      const optionalParts = [
        `Anzahl Kinder: ${data.q0_kinder_anzahl}`,
        data.q4_beschreibung?.trim() && `Wie würde ich dein Kind beschreiben:\n${data.q4_beschreibung.trim()}`,
        data.q5_diagnosen?.trim() && `Außerschulische Förderung / Diagnosen:\n${data.q5_diagnosen.trim()}`,
        data.q6_frage?.trim() && `Frage:\n${data.q6_frage.trim()}`,
      ].filter(Boolean);

      const bookings = zuBuchen.map((slot) => ({
        zeitslot_id: slot.id,
        name_kind: data.q1_name_klasse,
        schulstufe: data.q2_bereiche,
        kind_lernen: data.q3_ziele,
        kind_staerken: optionalParts.join("\n\n"),
      }));

      const res = await fetch("/api/buchung-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          bookings,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fehler");

      setSlotsState((prev) => prev.map((s) => {
        const betroffen = ausgewaehlteSlots.find((a) => (a.gruppe_id ? s.gruppe_id === a.gruppe_id : s.id === a.id));
        return betroffen ? { ...s, freie_plaetze: Math.max(0, s.freie_plaetze - 1) } : s;
      }));
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStatus("error");
    }
  }

  function neueAnfrage() {
    reset();
    buchungZuruecksetzen();
    setStatus("idle");
    setErrorMsg("");
  }

  if (status === "success") {
    return (
      <div className="book-ok" style={{ display: "block" }}>
        <strong>🎉 Anfrage gesendet!</strong>
        <p>Ich melde mich innerhalb von 24 Stunden bei euch.</p>
        {ausgewaehlteSlots.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontWeight: 700, margin: "0 0 .6rem" }}>
              {aktuelleFamilie?.titel ?? ausgewaehlteSlots[0].kurs ?? ausgewaehlteSlots[0].titel}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem" }}>
              {ausgewaehlteSlots.map((slot) => (
                <li key={slot.id} style={{ fontWeight: 700 }}>
                  {formatDatum(slot.datum)} · {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" onClick={neueAnfrage} className="btn btn-pine" style={{ marginTop: 14 }}>
          Weitere Anfrage stellen
        </button>
      </div>
    );
  }

  return (
    <div>
      {familien.length === 0 ? (
        <p style={{ fontSize: ".88rem", color: "var(--soft)", marginBottom: "1.2rem" }}>
          Aktuell sind keine Termine zur Buchung freigegeben – schau bald wieder vorbei!
        </p>
      ) : !aktuelleFamilie ? (
        // ── Schritt 1: Kurs wählen ────────────────────────────────────────────
        <>
          <p style={{ fontSize: ".9rem", color: "#6b7280", marginBottom: "1.2rem", fontStyle: "italic" }}>
            Vor Ort in Eben – oder online
          </p>
          <div className="course-grid">
          {familien.map((familie) => {
            const alleSlots = familie.istGruppenKurs ? familie.varianten.flatMap((v) => v.slots) : familie.einzelSlots;
            const gesamtPlaetze = alleSlots.reduce((sum, s) => sum + s.freie_plaetze, 0);
            const preise = Array.from(new Set(alleSlots.map((s) =>
              familie.erzwingeSchwerpunkt === "Legasthenietraining" ? s.preis_legasthenie :
              familie.erzwingeSchwerpunkt === "Dyskalkulietraining" ? s.preis_dyskalkulie :
              s.preis
            ).filter((p): p is number => p != null)));
            const terminAnzahl = familie.istGruppenKurs
              ? (familie.varianten[0]?.slots.length ?? 0)
              : familie.einzelSlots.length;
            return (
              <button
                type="button"
                key={familie.titel}
                className="course-card"
                onClick={() => familieWaehlen(familie)}
              >
                <div className="cc-emoji">{familie.emoji}</div>
                <h4>{familie.titel}</h4>
                {(() => {
                  const info = getKursInfoByDisplayName(familie.titel);
                  return info?.subtitle ? (
                    <p style={{ fontSize: ".85rem", color: "#6b7280", margin: "0.3rem 0 0.6rem", lineHeight: 1.4 }}>
                      {info.subtitle}
                    </p>
                  ) : null;
                })()}
                <p className="cc-info">
                  {familie.istGruppenKurs
                    ? `${terminAnzahl} zusammengehörige Termine`
                    : terminAnzahl === 1 ? "1 Termin verfügbar" : `${terminAnzahl} Termine verfügbar`}
                  {alleSlots[0]?.notizen ? ` · ${alleSlots[0].notizen}` : alleSlots[0]?.beschreibung ? ` · ${alleSlots[0].beschreibung}` : ""}
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
                {!familie.erzwingeSchwerpunkt && <RabattHinweis slots={alleSlots} />}
              </button>
            );
          })}
          </div>
        </>
      ) : (
        <>
          <button type="button" className="kurs-back" onClick={zurueckZuKursen}>← Anderen Kurs wählen</button>

          {aktuelleFamilie.istGruppenKurs ? (
            <>
              {/* Mehrtägiger Kurs: Tag 1 → Uhrzeit (= Variante) → restliche Tage automatisch */}
              {!gewaehltesTag1Datum ? (
                <>
                  <p className="kurs-step-label">{aktuelleFamilie.emoji} {aktuelleFamilie.titel} – wähle einen Termin</p>
                  <div className="termin-grid">
                    {tag1Daten.map((datum) => {
                      const varianten = aktuelleFamilie.varianten.filter((v) => v.slots[0]?.datum === datum);
                      const gesamtPlaetze = Math.min(...varianten.flatMap((v) => v.slots.map((s) => s.freie_plaetze)));
                      const anzahlTage = varianten[0]?.slots.length ?? 0;
                      return (
                        <button
                          type="button"
                          key={datum}
                          className="termin-btn"
                          disabled={gesamtPlaetze <= 0}
                          onClick={() => setGewaehltesTag1Datum(datum)}
                        >
                          <strong>{formatDatum(datum)}</strong>
                          <span>
                            {gesamtPlaetze <= 0 ? "Ausgebucht" : `Kurs über ${anzahlTage} Tage · ${varianten.length === 1 ? "1 Uhrzeit" : `${varianten.length} Uhrzeiten`} verfügbar`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : ausgewaehlteSlots.length === 0 ? (
                <>
                  <p className="kurs-step-label">
                    {formatDatum(gewaehltesTag1Datum)} – wähle eine Uhrzeit
                  </p>
                  {tag1Daten.length > 1 && (
                    <button type="button" className="kurs-back" onClick={() => setGewaehltesTag1Datum(null)} style={{ marginBottom: ".6rem" }}>
                      ← Anderen Termin wählen
                    </button>
                  )}
                  <div className="termin-grid">
                    {variantenAmTag1.map((variante) => {
                      const tag1Slot = variante.slots[0];
                      const weitereTage = variante.slots.slice(1);
                      const gesamtPlaetze = Math.min(...variante.slots.map((s) => s.freie_plaetze));
                      const voll = gesamtPlaetze <= 0;
                      const knapp = gesamtPlaetze === 1;
                      return (
                        <button
                          type="button"
                          key={variante.gruppeId}
                          className="termin-btn"
                          disabled={voll}
                          onClick={() => variantenWaehlen(variante)}
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          <strong>{tag1Slot.uhrzeit_von}–{tag1Slot.uhrzeit_bis} Uhr</strong>
                          <span className={knapp ? "knapp" : ""}>
                            {voll
                              ? "Ausgebucht"
                              : <>
                                  Weitere Termine: {weitereTage.map((s, i) => (
                                    <span key={s.id}>{i > 0 ? ", " : ""}{formatDatumKurz(s.datum)} {s.uhrzeit_von}–{s.uhrzeit_bis}</span>
                                  ))}
                                  {knapp && " · Nur 1 Platz frei!"}
                                </>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="kurs-step-label">✅ Alle Termine ausgewählt</p>
                  <p style={{ fontSize: ".82rem", color: "var(--soft)", marginBottom: ".6rem" }}>
                    Diese {ausgewaehlteSlots.length} Termine werden gemeinsam für dich gebucht:
                  </p>
                  <ul style={{ margin: "0 0 1rem", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {ausgewaehlteSlots.map((s, i) => (
                      <li key={s.id} className="termin-btn on" style={{ cursor: "default" }}>
                        <strong>{formatDatum(s.datum)}</strong>
                        <span>{s.uhrzeit_von}–{s.uhrzeit_bis} Uhr</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="kurs-back" onClick={() => { setAusgewaehlteSlots([]); }}>
                    ← Andere Uhrzeit wählen
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Einzelblock: Paket wählen → so viele Termine (Datum + Uhrzeit) auswählen */}
              {gewaehltesPaket == null ? (
                <>
                  <p className="kurs-step-label">{aktuelleFamilie.emoji} {aktuelleFamilie.titel} – wähle ein Paket</p>
                  <div className="termin-grid">
                    {PAKETE.map(({ anzahl, label }) => {
                      const verfuegbar = aktuelleFamilie.einzelSlots.filter((s) => s.freie_plaetze > 0).length;
                      const zuWenig = verfuegbar < anzahl;
                      const preis = anzahl === 1
                        ? aktuelleFamilie.einzelSlots.find((s) => s.preis != null)?.preis
                        : anzahl === 5
                          ? aktuelleFamilie.einzelSlots.find((s) => s.preis_5er != null)?.preis_5er
                          : aktuelleFamilie.einzelSlots.find((s) => s.preis_10er != null)?.preis_10er;
                      return (
                        <button
                          type="button"
                          key={anzahl}
                          className="termin-btn"
                          disabled={zuWenig}
                          onClick={() => setGewaehltesPaket(anzahl)}
                        >
                          <strong>{label}</strong>
                          <span>
                            {zuWenig
                              ? `Aktuell nicht genug freie Termine (${verfuegbar} verfügbar)`
                              : `${anzahl === 1 ? "1 Termin" : `${anzahl} Termine`} nach Wahl${preis != null ? ` · € ${preis}` : ""}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="kurs-step-label">
                    {aktuelleFamilie.emoji} {aktuelleFamilie.titel} – wähle {gewaehltesPaket === 1 ? "deinen Termin" : `${gewaehltesPaket} Termine`}
                    {gewaehltesPaket > 1 && ` (${ausgewaehlteSlots.length}/${gewaehltesPaket} ausgewählt)`}
                  </p>
                  {!aktuelleFamilie.erzwingeSchwerpunkt && (
                    <button type="button" className="kurs-back" onClick={() => { setGewaehltesPaket(null); setAusgewaehlteSlots([]); }} style={{ marginBottom: ".6rem" }}>
                      ← Anderes Paket wählen
                    </button>
                  )}
                  <div style={{ marginBottom: ".6rem", display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setUseCalendarView(false)}
                      style={{
                        flex: 1,
                        padding: ".5rem .7rem",
                        background: !useCalendarView ? "var(--pine)" : "#e5e7eb",
                        color: !useCalendarView ? "#fff" : "#6b7280",
                        border: "none",
                        borderRadius: 8,
                        fontSize: ".85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Listenansicht
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseCalendarView(true)}
                      style={{
                        flex: 1,
                        padding: ".5rem .7rem",
                        background: useCalendarView ? "var(--pine)" : "#e5e7eb",
                        color: useCalendarView ? "#fff" : "#6b7280",
                        border: "none",
                        borderRadius: 8,
                        fontSize: ".85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Kalendaransicht
                    </button>
                  </div>
                  {useCalendarView ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {Array.from(new Set(aktuelleFamilie.einzelSlots.map((s) => s.datum)))
                        .sort()
                        .map((datum) => {
                          const slotsAmDatum = aktuelleFamilie.einzelSlots.filter((s) => s.datum === datum);
                          return (
                            <div key={datum} style={{ borderLeft: "3px solid var(--pine)", paddingLeft: ".8rem" }}>
                              <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--ink)", margin: "0 0 .5rem" }}>
                                {formatDatum(datum)}
                              </p>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {slotsAmDatum.map((slot) => {
                                  const ausgewaehlt = Boolean(ausgewaehlteSlots.find((s) => s.id === slot.id));
                                  const voll = slot.freie_plaetze <= 0;
                                  const knapp = slot.freie_plaetze === 1;
                                  return (
                                    <button
                                      type="button"
                                      key={slot.id}
                                      className={`termin-btn${ausgewaehlt ? " on" : ""}`}
                                      disabled={voll}
                                      onClick={() => paketSlotToggle(slot)}
                                      style={{ textAlign: "left" }}
                                    >
                                      <strong>{slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr</strong>
                                      <span className={knapp ? "knapp" : ""}>
                                        {voll ? "Ausgebucht" : knapp ? "Nur 1 Platz frei!" : ausgewaehlt ? "✓ Ausgewählt" : `${slot.freie_plaetze} Plätze frei`}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="termin-grid">
                    {aktuelleFamilie.einzelSlots.map((slot) => {
                      const ausgewaehlt = Boolean(ausgewaehlteSlots.find((s) => s.id === slot.id));
                      const voll = slot.freie_plaetze <= 0;
                      const knapp = slot.freie_plaetze === 1;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          className={`termin-btn${ausgewaehlt ? " on" : ""}`}
                          disabled={voll}
                          onClick={() => paketSlotToggle(slot)}
                        >
                          <strong>{formatDatum(slot.datum)} · {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr</strong>
                          <span className={knapp ? "knapp" : ""}>
                            {voll ? "Ausgebucht" : knapp ? "Nur 1 Platz frei!" : ausgewaehlt ? "✓ Ausgewählt" : `${slot.freie_plaetze} Plätze frei`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Nach Auswahl: "Auswahl zurücksetzen" Button */}
      {auswahlAbgeschlossen && !aktuelleFamilie?.istGruppenKurs && !aktuelleFamilie?.erzwingeSchwerpunkt && (
        <div style={{ display: "flex", gap: 12, marginBottom: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={datumAendern}
            className="kurs-back"
            style={{ marginBottom: 0, flex: "1 1 auto", minWidth: 150 }}
          >
            🔄 Auswahl zurücksetzen
          </button>
        </div>
      )}

      {auswahlAbgeschlossen && ausgewaehlteSlots.length > 0 && (() => {
        const preisInfo = berechneGesamtpreis(ausgewaehlteSlots, aktuelleFamilie?.erzwingeSchwerpunkt, aktuelleFamilie?.istGruppenKurs);
        return (
          <div style={{ background: "var(--pine-pale)", borderRadius: 11, padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".85rem", color: "var(--pine-dark)" }}>
            <div style={{ fontWeight: 700 }}>
              Ausgewählt: {ausgewaehlteSlots[0].kurs || ausgewaehlteSlots[0].titel} ·{" "}
              {formatDatumsListe(ausgewaehlteSlots.map((s) => s.datum))}
              {ausgewaehlteSlots.length === 1 && ` · ${ausgewaehlteSlots[0].uhrzeit_von}–${ausgewaehlteSlots[0].uhrzeit_bis} Uhr`}
            </div>
            {ausgewaehlteSlots.length > 1 && (
              <p style={{ fontSize: ".75rem", margin: ".3rem 0 0" }}>
                {ausgewaehlteSlots.map((s) => `${formatDatumKurz(s.datum)} ${s.uhrzeit_von}–${s.uhrzeit_bis}`).join(" · ")}
              </p>
            )}
            {preisInfo && (
              <div style={{ marginTop: ".5rem", padding: ".5rem .7rem", background: "var(--white)", borderRadius: 8, fontWeight: 600, fontSize: ".9rem" }}>
                {preisInfo.label}: <strong>€ {preisInfo.total}</strong>
              </div>
            )}
            {!aktuelleFamilie?.istGruppenKurs && !aktuelleFamilie?.erzwingeSchwerpunkt && <RabattHinweis slots={ausgewaehlteSlots} />}
          </div>
        );
      })()}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: auswahlAbgeschlossen ? "block" : "none" }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "1.5rem 0 1rem", color: "var(--ink)" }}>Deine Angaben</h3>

        <div className="form-grid">
          <div className="fg">
            <label style={{ marginTop: 12, display: "block" }}>Vorname *</label>
            <input {...register("vorname")} />
            {errors.vorname && <span className="err">{errors.vorname.message}</span>}
          </div>
          <div className="fg">
            <label style={{ marginTop: 12, display: "block" }}>Nachname *</label>
            <input {...register("nachname")} />
            {errors.nachname && <span className="err">{errors.nachname.message}</span>}
          </div>
          <div className="fg" style={{ gridColumn: "1 / -1" }}>
            <label style={{ marginTop: 12, display: "block" }}>E-Mail *</label>
            <input {...register("email")} type="email" />
            {errors.email && <span className="err">{errors.email.message}</span>}
          </div>
          <div className="fg" style={{ gridColumn: "1 / -1" }}>
            <label style={{ marginTop: 12, display: "block" }}>Unter welcher Telefonnummer kann ich dich bei Fragen oder im Notfall erreichen? *</label>
            <input {...register("telefon")} type="tel" />
            {errors.telefon && <span className="err">{errors.telefon.message}</span>}
          </div>
        </div>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "1.5rem 0 1rem", color: "var(--ink)" }}>Fragen zum Kind</h3>

        <Field label="Wird die Stunde für 1 oder 2 Kinder gebucht? *" error={errors.q0_kinder_anzahl?.message}>
          <select {...register("q0_kinder_anzahl")} defaultValue="">
            <option value="">Bitte wählen…</option>
            <option value="1 Kind">1 Kind</option>
            <option value="2 Kinder">2 Kinder</option>
          </select>
        </Field>

        <Field label="Wie heißt dein Kind? In welche Klasse kommt dein Kind? (Bitte beide Namen angeben, falls du die Stunde für 2 Kinder buchen möchtest) *" error={errors.q1_name_klasse?.message}>
          <textarea {...register("q1_name_klasse")} rows={2} />
        </Field>

        <Field label="In welchem Bereich/welchen Themen darf ich dein Kind unterstützen? *" error={errors.q2_bereiche?.message}>
          <textarea {...register("q2_bereiche")} rows={2} />
        </Field>

        <Field label="Was soll durch die Förderung erreicht werden? (Wiederholen, Festigen, Lücken schließen...) *" error={errors.q3_ziele?.message}>
          <textarea {...register("q3_ziele")} rows={3} />
        </Field>

        <Field label="Wie würdest du dein Kind beschreiben?" error={errors.q4_beschreibung?.message}>
          <textarea {...register("q4_beschreibung")} rows={2} />
        </Field>

        <Field label="Gab es bereits außerschulische Förderung oder Diagnosen?" error={errors.q5_diagnosen?.message}>
          <textarea {...register("q5_diagnosen")} rows={2} />
        </Field>

        <Field label="Hast du eine Frage an mich?" error={errors.q6_frage?.message}>
          <textarea {...register("q6_frage")} rows={2} />
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

        <button type="submit" className="book-btn" disabled={status === "loading" || !auswahlAbgeschlossen}>
          {status === "loading"
            ? <><Loader2 style={{ width: 16, height: 16, animation: "lvSpin 1s linear infinite" }} /> Wird gesendet…</>
            : <>☀️ Kursplatz verbindlich anfragen</>
          }
        </button>
      </form>
    </div>
  );
}
