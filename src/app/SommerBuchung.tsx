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

const STANDARD_EMOJI = "";

const KURS_INFO: Record<string, { displayName: string; subtitle: string }> = {
  "Einzelstunde": {
    displayName: "Nachhilfe & Lernbegleitung",
    subtitle: "Individuell zum Üben aller Fächer, Mathematik bis zur Sekundarstufe (Nachprüfungsvorbereitung). Diese Einheiten können auch für 2 Kinder gebucht werden.",
  },
  "Legasthenietraining": {
    displayName: "Lese- Rechtschreibtraining",
    subtitle: "Legasthenietraining, mindestens 1 Einheit pro Woche inkl. Übungsmaterial für zu Hause.",
  },
  "Dyskalkulietraining": {
    displayName: "Dyskalkulietraining",
    subtitle: "Dyskalkulietraining und Aufbau mathematischer Grundlagen. Mindestens 1 Einheit pro Woche inkl. Übungsmaterial für zu Hause.",
  },
};

function getKursInfoByDisplayName(displayName: string): { displayName: string; subtitle: string } | null {
  return Object.values(KURS_INFO).find((info) => info.displayName === displayName) || null;
}

function RabattHinweis({ slots }: { slots: SlotMitPlaetzen[] }) {
  const preis5er = slots.map((s) => s.preis_5er).find((p): p is number => p != null);
  const preis10er = slots.map((s) => s.preis_10er).find((p): p is number => p != null);
  if (preis5er == null && preis10er == null) return null;
  return (
    <p className="rabatt-hinweis">
      {preis5er != null && <>5 Termine <strong>€{preis5er},-</strong></>}
      {preis5er != null && preis10er != null && " · "}
      {preis10er != null && <>10 Termine <strong>€{preis10er},-</strong></>}
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

function KursIkon({ titel, istGruppenKurs }: { titel: string; istGruppenKurs?: boolean }) {
  if (istGruppenKurs) {
    return (
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: ".2rem" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <circle cx="5.5" cy="7.5" r="2.3" fill="#0d9488"/>
          <circle cx="12" cy="6" r="2.6" fill="#0d9488"/>
          <circle cx="18.5" cy="7.5" r="2.3" fill="#0d9488"/>
          <path d="M1.5 19c0-2.8 1.8-4.3 4-4.3s4 1.5 4 4.3" fill="#0d9488"/>
          <path d="M8 19c0-3.2 2-5 4-5s4 1.8 4 5" fill="#0d9488"/>
          <path d="M14.5 19c0-2.8 1.8-4.3 4-4.3s4 1.5 4 4.3" fill="#0d9488"/>
        </svg>
      </div>
    );
  }
  if (titel === "Lese- Rechtschreibtraining") {
    return (
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#ffd6e7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: ".2rem" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M4 4h7c.6 0 1 .4 1 1v13c0 .6-.4 1-1 1H4V4z" fill="#e8547a"/>
          <path d="M20 4h-7c-.6 0-1 .4-1 1v13c0 .6.4 1 1 1h7V4z" fill="#e8547a" opacity=".6"/>
          <line x1="12" y1="6" x2="12" y2="18" stroke="white" strokeWidth="1.2"/>
          <line x1="6" y1="8.5" x2="10.5" y2="8.5" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="6" y1="11" x2="10.5" y2="11" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          <line x1="6" y1="13.5" x2="9.5" y2="13.5" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          <path d="M15 15.5l3.5-3.5 1.8 1.8-3.5 3.5-1.8-1.8z" fill="#e8547a"/>
          <path d="M14.5 17.5l.5-2 1.8 1.8-2.3.2z" fill="#c43066"/>
        </svg>
      </div>
    );
  }
  if (titel === "Dyskalkulietraining") {
    return (
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#ecfccb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: ".2rem" }}>
        <svg viewBox="0 0 24 24" width="28" height="28">
          <text x="2.5" y="11.5" fontSize="10" fontWeight="900" fill="#4d7c0f">+</text>
          <text x="13" y="11.5" fontSize="10" fontWeight="900" fill="#4d7c0f">×</text>
          <text x="2.5" y="22" fontSize="10" fontWeight="900" fill="#4d7c0f">−</text>
          <text x="13" y="22" fontSize="9" fontWeight="900" fill="#4d7c0f">%</text>
        </svg>
      </div>
    );
  }
  if (titel === "Nachhilfe & Lernbegleitung") {
    return (
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: ".2rem" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <circle cx="8" cy="7.5" r="3" fill="#d97706"/>
          <path d="M2.5 19.5c0-3.5 2.5-5.5 5.5-5.5s5.5 2 5.5 5.5" fill="#d97706"/>
          <circle cx="18" cy="7" r="2.5" fill="#d97706" opacity=".7"/>
          <path d="M13 19.5c0-3.2 2.2-5 5-5s5 1.8 5 5" fill="#d97706" opacity=".7"/>
        </svg>
      </div>
    );
  }
  return null;
}

function getGruppenkursDatumInfo(datum: string): { titel: string; untertitel: string | null; beschreibung: string } {
  const d = new Date(datum + "T12:00:00");
  const day = d.getDate();
  const month = d.getMonth();
  if (month === 7 && day <= 9) {
    return {
      titel: "Gruppenkurs für Kinder der 1. und 2. Klassen",
      untertitel: "Für Kinder, die ab September in die 2. oder 3. Klasse Volksschule kommen.",
      beschreibung: "An 3 Tagen lernen wir gemeinsam mit viel Bewegung und Abwechslung in der Kleingruppe gezielt an wichtigen Lerninhalten. So ist dein Kind fit für die nächste Schulstufe!",
    };
  }
  if (month === 7 && day >= 10) {
    return {
      titel: "Gruppenkurs für Kinder der 3. und 4. Klassen",
      untertitel: null,
      beschreibung: "An 3 Tagen lernen wir gemeinsam mit viel Bewegung und Abwechslung in der Kleingruppe gezielt an wichtigen Lerninhalten. So ist dein Kind fit für die nächste Schulstufe und fit für den Übertritt!",
    };
  }
  return { titel: formatDatum(datum), untertitel: null, beschreibung: "" };
}

function CalendarGrid({ slots, ausgewaehlteSlots, ausgewaehltesDatum, onDatumClick, onSlotClick, onBack }: {
  slots: SlotMitPlaetzen[];
  ausgewaehlteSlots: SlotMitPlaetzen[];
  ausgewaehltesDatum: string | null;
  onDatumClick: (datum: string) => void;
  onSlotClick: (slot: SlotMitPlaetzen) => void;
  onBack: () => void;
}) {
  const verfuegbareDaten = Array.from(new Set(slots.filter((s) => s.freie_plaetze > 0).map((s) => s.datum))).sort();
  if (verfuegbareDaten.length === 0) return <p style={{ color: "var(--soft)" }}>Keine Termine verfügbar.</p>;

  const ersterDatumDate = new Date(verfuegbareDaten[0] + "T00:00:00");
  const [angezeigterMonat, setAngezeigterMonat] = useState({ year: ersterDatumDate.getFullYear(), month: ersterDatumDate.getMonth() });

  const { year, month } = angezeigterMonat;

  const slotsPerDatum = new Map<string, SlotMitPlaetzen[]>();
  for (const datum of verfuegbareDaten) {
    slotsPerDatum.set(datum, slots.filter((s) => s.datum === datum && s.freie_plaetze > 0).sort((a, b) => a.uhrzeit_von.localeCompare(b.uhrzeit_von)));
  }

  // Kalender-Tage aufbauen: Vormonat-Füllfelder + aktueller Monat + Folge-Monat-Füllfelder
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const calendarDays: Array<{ dateStr: string; currentMonth: boolean }> = [];
  // Füllfelder vom Vormonat
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({ dateStr: `${prevMonthYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, currentMonth: false });
  }
  // Aktuelle Monatstage
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, currentMonth: true });
  }
  // Folge-Monat-Füllfelder (bis 7er-Grid voll)
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const remaining = calendarDays.length % 7 === 0 ? 0 : 7 - (calendarDays.length % 7);
  for (let day = 1; day <= remaining; day++) {
    calendarDays.push({ dateStr: `${nextMonthYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, currentMonth: false });
  }

  // Gibt es Slots im Vormonat / Folgemonat?
  const hasPrev = verfuegbareDaten.some((d) => { const dd = new Date(d + "T00:00:00"); return dd.getFullYear() < year || (dd.getFullYear() === year && dd.getMonth() < month); });
  const hasNext = verfuegbareDaten.some((d) => { const dd = new Date(d + "T00:00:00"); return dd.getFullYear() > year || (dd.getFullYear() === year && dd.getMonth() > month); });

  const monthYear = new Date(year, month, 1).toLocaleDateString("de-AT", { month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div>
        {/* Monat-Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".8rem" }}>
          <button
            type="button"
            onClick={() => setAngezeigterMonat({ year: month === 0 ? year - 1 : year, month: month === 0 ? 11 : month - 1 })}
            disabled={!hasPrev}
            style={{ border: "none", background: "none", cursor: hasPrev ? "pointer" : "default", color: hasPrev ? "var(--pine)" : "var(--soft)", fontSize: "1.1rem", padding: ".2rem .5rem", borderRadius: 6 }}
          >
            ‹
          </button>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--ink)", margin: 0, textTransform: "capitalize" }}>
            {monthYear}
          </p>
          <button
            type="button"
            onClick={() => setAngezeigterMonat({ year: month === 11 ? year + 1 : year, month: month === 11 ? 0 : month + 1 })}
            disabled={!hasNext}
            style={{ border: "none", background: "none", cursor: hasNext ? "pointer" : "default", color: hasNext ? "var(--pine)" : "var(--soft)", fontSize: "1.1rem", padding: ".2rem .5rem", borderRadius: 6 }}
          >
            ›
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: ".4rem" }}>
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
            <div key={day} style={{ textAlign: "center", fontSize: ".75rem", fontWeight: 700, color: "var(--soft)", padding: ".4rem 0" }}>
              {day}
            </div>
          ))}
          {calendarDays.map(({ dateStr, currentMonth }, idx) => {
            const slotCount = slotsPerDatum.get(dateStr)?.length ?? 0;
            const hasSlots = slotCount > 0;
            const isSelected = dateStr === ausgewaehltesDatum;
            return (
              <button
                key={idx}
                type="button"
                disabled={!hasSlots}
                onClick={() => hasSlots && onDatumClick(dateStr)}
                style={{
                  aspectRatio: "1",
                  border: isSelected ? "2px solid var(--pine)" : "1px solid #e5e7eb",
                  borderRadius: 8,
                  background: isSelected ? "var(--pine-pale)" : hasSlots ? "var(--white)" : "#f9fafb",
                  color: hasSlots ? "var(--ink)" : "var(--soft)",
                  cursor: hasSlots ? "pointer" : "default",
                  fontSize: ".85rem",
                  fontWeight: 600,
                  transition: "all .2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: ".2rem",
                  opacity: !currentMonth && !hasSlots ? 0.35 : !hasSlots ? 0.5 : 1,
                }}
                title={hasSlots ? `${slotCount} Uhrzeit${slotCount > 1 ? "en" : ""}` : ""}
              >
                {new Date(dateStr + "T00:00:00").getDate()}
                {hasSlots && <div style={{ fontSize: ".6rem", color: "var(--pine)", marginTop: ".1rem" }}>●</div>}
              </button>
            );
          })}
        </div>
      </div>

      {ausgewaehltesDatum && slotsPerDatum.get(ausgewaehltesDatum) && (
        <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" }}>
            <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--ink)", margin: 0 }}>
              {new Date(ausgewaehltesDatum + "T12:00:00").toLocaleDateString("de-AT", { day: "numeric", month: "long" })}
            </p>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: ".3rem .6rem",
                fontSize: ".75rem",
                border: "none",
                background: "#f3f4f6",
                borderRadius: 6,
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              ✕ Zurück
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {slotsPerDatum.get(ausgewaehltesDatum)!.map((slot) => {
              const ausgewaehlt = Boolean(ausgewaehlteSlots.find((s) => s.id === slot.id));
              return (
                <button
                  type="button"
                  key={slot.id}
                  className={`termin-btn${ausgewaehlt ? " on" : ""}`}
                  onClick={() => onSlotClick(slot)}
                  style={{ textAlign: "left" }}
                >
                  <strong>{slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr</strong>
                  <span className={ausgewaehlt ? "verfuegbar" : ""}>
                    {ausgewaehlt ? "✓ Ausgewählt" : "Auswählen"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [ausgewaehltesDatum, setAusgewaehltesDatum] = useState<string | null>(null);

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
        kurs_name: aktuelleFamilie?.titel || "Unbekannter Kurs",
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
                <KursIkon titel={familie.titel} istGruppenKurs={familie.istGruppenKurs} />
                <h4>{familie.titel}</h4>
                {(() => {
                  const info = getKursInfoByDisplayName(familie.titel);
                  const subtitle = info?.subtitle ?? (familie.istGruppenKurs ? "Gemeinsam machen wir uns fit fürs nächste Schuljahr!" : null);
                  return subtitle ? (
                    <p style={{ fontSize: ".85rem", color: "#6b7280", margin: "0.3rem 0 0.6rem", lineHeight: 1.4 }}>
                      {subtitle}
                    </p>
                  ) : null;
                })()}
                {(() => {
                  const zusatz = alleSlots[0]?.notizen || alleSlots[0]?.beschreibung || "";
                  const text = familie.istGruppenKurs
                    ? `${terminAnzahl} zusammengehörige Termine${zusatz ? ` · ${zusatz}` : ""}`
                    : zusatz;
                  return text ? <p className="cc-info">{text}</p> : null;
                })()}
                <div className="cc-footer">
                  <span className={`cc-spots${gesamtPlaetze <= 0 ? " full" : ""}`}>
                    {gesamtPlaetze <= 0 ? "Ausgebucht" : "Termine ansehen →"}
                  </span>
                  {preise.length > 0 && (
                    <span className="cc-price">
                      {preise.length === 1 ? `€${preise[0]},-` : `ab €${Math.min(...preise)},-`}
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
                  <p className="kurs-step-label">{aktuelleFamilie.titel}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {tag1Daten
                      .filter((datum) => {
                        const varianten = aktuelleFamilie.varianten.filter((v) => v.slots[0]?.datum === datum);
                        return Math.min(...varianten.flatMap((v) => v.slots.map((s) => s.freie_plaetze))) > 0;
                      })
                      .map((datum) => {
                        const varianten = aktuelleFamilie.varianten.filter((v) => v.slots[0]?.datum === datum);
                        const gesamtPlaetze = Math.min(...varianten.flatMap((v) => v.slots.map((s) => s.freie_plaetze)));
                        const kursInfo = getGruppenkursDatumInfo(datum);
                        return (
                          <button
                            type="button"
                            key={datum}
                            className="termin-btn"
                            onClick={() => setGewaehltesTag1Datum(datum)}
                            style={{ textAlign: "left" }}
                          >
                            <strong style={{ fontSize: "1rem" }}>{kursInfo.titel}</strong>
                            {kursInfo.untertitel && (
                              <span style={{ fontWeight: 600, fontSize: ".82rem", color: "var(--pine-dark)", display: "block" }}>
                                {kursInfo.untertitel}
                              </span>
                            )}
                            <span style={{ fontSize: ".82rem", lineHeight: 1.5 }}>{kursInfo.beschreibung}</span>
                            <span style={{ fontSize: ".8rem", marginTop: ".3rem", display: "block" }}>
                              Start: {formatDatum(datum)} · {varianten.length === 1 ? "1 Uhrzeit" : `${varianten.length} Uhrzeiten`} verfügbar
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
                    {variantenAmTag1.filter((variante) => Math.min(...variante.slots.map((s) => s.freie_plaetze)) > 0).map((variante) => {
                      const tag1Slot = variante.slots[0];
                      const weitereTage = variante.slots.slice(1);
                      const gesamtPlaetze = Math.min(...variante.slots.map((s) => s.freie_plaetze));
                      return (
                        <button
                          type="button"
                          key={variante.gruppeId}
                          className="termin-btn"
                          onClick={() => variantenWaehlen(variante)}
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          <strong>{tag1Slot.uhrzeit_von}–{tag1Slot.uhrzeit_bis} Uhr</strong>
                          <span>
                            Weitere Termine: {weitereTage.map((s, i) => (
                              <span key={s.id}>{i > 0 ? ", " : ""}{formatDatumKurz(s.datum)} {s.uhrzeit_von}–{s.uhrzeit_bis}</span>
                            ))}
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
                  <p className="kurs-step-label">{aktuelleFamilie.titel}</p>
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
                              : `${anzahl === 1 ? "1 Termin" : `${anzahl} Termine`}${preis != null ? ` · €${preis},-` : ""}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="kurs-step-label">
                    {aktuelleFamilie.titel}
                    {gewaehltesPaket > 1 && ` – ${ausgewaehlteSlots.length}/${gewaehltesPaket} ausgewählt`}
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
                    <CalendarGrid
                      slots={aktuelleFamilie.einzelSlots}
                      ausgewaehlteSlots={ausgewaehlteSlots}
                      ausgewaehltesDatum={ausgewaehltesDatum}
                      onDatumClick={setAusgewaehltesDatum}
                      onSlotClick={paketSlotToggle}
                      onBack={() => setAusgewaehltesDatum(null)}
                    />
                  ) : (
                    <div className="termin-grid">
                    {aktuelleFamilie.einzelSlots.filter((slot) => slot.freie_plaetze > 0).map((slot) => {
                      const ausgewaehlt = Boolean(ausgewaehlteSlots.find((s) => s.id === slot.id));
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          className={`termin-btn${ausgewaehlt ? " on" : ""}`}
                          onClick={() => paketSlotToggle(slot)}
                        >
                          <strong>{formatDatum(slot.datum)} · {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr</strong>
                          <span className={ausgewaehlt ? "verfuegbar" : ""}>
                            {ausgewaehlt ? "✓ Ausgewählt" : "Auswählen"}
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
                {preisInfo.label}: <strong>€{preisInfo.total},-</strong>
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
