"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Kalender from "@/components/Kalender";
import { Zeitslot, schulstufen } from "@/types/buchung";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot {
  freie_plaetze: number;
}

interface Props {
  slots: SlotMitPlaetzen[];
}

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-[#d0e6dc] bg-white text-sm text-[#1a2e26] " +
  "placeholder:text-[#1a5c4a]/30 focus:outline-none focus:ring-2 focus:ring-[#1a5c4a]/30 " +
  "focus:border-[#1a5c4a] transition-colors disabled:bg-[#f7faf8] disabled:cursor-not-allowed";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold tracking-widest uppercase text-[#1a5c4a]/60">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1a5c4a]/50">
        {children}
      </span>
      <div className="flex-1 h-px bg-[#d0e6dc]" />
    </div>
  );
}

export default function BuchungsSeite({ slots }: Props) {
  const [ausgewaehlterSlot, setAusgewaehlterSlot] = useState<SlotMitPlaetzen | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      <div className="max-w-lg mx-auto text-center py-24 px-6">
        <CheckCircle className="w-16 h-16 text-[#1a5c4a] mx-auto mb-6" />
        <h2 className="text-2xl font-bold tracking-[0.1em] uppercase text-[#1a5c4a] mb-3">
          Anmeldung erfolgreich
        </h2>
        <p className="text-[#1a5c4a]/60 text-sm leading-relaxed mb-8">
          Deine Anmeldung wurde gespeichert.<br />
          Wir melden uns in Kürze persönlich bei dir.
        </p>
        {ausgewaehlterSlot && (
          <div className="bg-white border border-[#d0e6dc] rounded-2xl p-6 text-sm text-left mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1a5c4a]/50 mb-3">
              Gebuchter Termin
            </p>
            <p className="font-bold text-[#1a5c4a]">{ausgewaehlterSlot.titel}</p>
            <p className="text-[#1a5c4a]/60 mt-1">{formatDatum(ausgewaehlterSlot.datum)}</p>
            <p className="text-[#1a5c4a]/60">
              {ausgewaehlterSlot.uhrzeit_von} – {ausgewaehlterSlot.uhrzeit_bis} Uhr
            </p>
          </div>
        )}
        <button
          onClick={neueAnmeldung}
          className="px-8 py-3 bg-[#1a5c4a] text-white text-sm font-semibold tracking-widest uppercase rounded-xl hover:bg-[#154d3e] transition-colors"
        >
          Weitere Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-10">

        {/* Kalender */}
        <div className="bg-white rounded-2xl border border-[#d0e6dc] shadow-sm p-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#1a5c4a]/50 mb-1">
            Schritt 1
          </p>
          <h3 className="text-lg font-bold tracking-wide text-[#1a5c4a] mb-6">
            Termin wählen
          </h3>
          <Kalender
            slots={slots}
            ausgewaehlt={ausgewaehlterSlot?.id ?? null}
            onSlotWaehlen={setAusgewaehlterSlot}
          />
        </div>

        {/* Formular */}
        <div
          className={`bg-white rounded-2xl border shadow-sm transition-all duration-300 ${
            ausgewaehlterSlot
              ? "border-[#1a5c4a]/30 opacity-100"
              : "border-[#d0e6dc] opacity-40 pointer-events-none"
          }`}
        >
          <div className="p-8 border-b border-[#e0ede7]">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1a5c4a]/50 mb-1">
              Schritt 2
            </p>
            <h3 className="text-lg font-bold tracking-wide text-[#1a5c4a] mb-3">
              Formular ausfüllen
            </h3>
            {ausgewaehlterSlot ? (
              <div className="bg-[#f0f7f3] rounded-xl px-4 py-3 text-sm">
                <p className="font-bold text-[#1a5c4a]">{ausgewaehlterSlot.titel}</p>
                <p className="text-[#1a5c4a]/60 text-xs mt-0.5">
                  {formatDatum(ausgewaehlterSlot.datum)} &middot;{" "}
                  {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#1a5c4a]/40 tracking-wide">
                Bitte zuerst einen Termin wählen
              </p>
            )}
          </div>

          <div className="p-8 space-y-5">
            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <SectionLabel>Ihre Kontaktdaten</SectionLabel>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Vorname" error={errors.vorname?.message}>
                  <input {...register("vorname")} className={inputClass} placeholder="Max" />
                </Field>
                <Field label="Nachname" error={errors.nachname?.message}>
                  <input {...register("nachname")} className={inputClass} placeholder="Mustermann" />
                </Field>
              </div>

              <Field label="E-Mail" error={errors.email?.message}>
                <input {...register("email")} type="email" className={inputClass} placeholder="max@beispiel.at" />
              </Field>

              <Field label="Telefon" error={errors.telefon?.message}>
                <input {...register("telefon")} type="tel" className={inputClass} placeholder="+43 660 123 456" />
              </Field>

              <SectionLabel>Angaben zum Kind</SectionLabel>

              <Field label="Name des Kindes" error={errors.name_kind?.message}>
                <input {...register("name_kind")} className={inputClass} placeholder="z.B. Anna" />
              </Field>

              <Field label="Schulstufe" error={errors.schulstufe?.message}>
                <select {...register("schulstufe")} className={inputClass + " bg-white"}>
                  <option value="">Bitte wählen…</option>
                  {schulstufen.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Was kann mein Kind gut?" error={errors.kind_staerken?.message}>
                <textarea
                  {...register("kind_staerken")}
                  rows={3}
                  className={inputClass + " resize-none"}
                  placeholder="z.B. Lesen, kreatives Denken, Englisch…"
                />
              </Field>

              <Field label="Was muss mein Kind noch lernen?" error={errors.kind_lernen?.message}>
                <textarea
                  {...register("kind_lernen")}
                  rows={3}
                  className={inputClass + " resize-none"}
                  placeholder="z.B. Mathematik, Rechtschreibung…"
                />
              </Field>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    {...register("datenschutz")}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-[#1a5c4a]"
                  />
                  <span className="text-xs text-[#1a5c4a]/50 leading-relaxed group-hover:text-[#1a5c4a]/70 transition-colors">
                    Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.*
                  </span>
                </label>
                {errors.datenschutz && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.datenschutz.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-[#1a5c4a] text-white text-sm font-bold tracking-[0.15em] uppercase rounded-xl hover:bg-[#154d3e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert…</>
                ) : (
                  "Jetzt anmelden"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
