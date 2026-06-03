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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed";

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
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <CheckCircle className="w-16 h-16 text-[#52b788] mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-2">Anmeldung erfolgreich!</h2>
        <p className="text-gray-500 text-sm mb-4">
          Wir melden uns in Kürze bei dir zur Bestätigung.
        </p>
        {ausgewaehlterSlot && (
          <div className="bg-[#f0faf4] rounded-xl p-4 text-sm text-left mb-6">
            <p className="font-bold text-[#1a1a2e]">{ausgewaehlterSlot.titel}</p>
            <p className="text-gray-600">{formatDatum(ausgewaehlterSlot.datum)}</p>
            <p className="text-gray-600">
              {ausgewaehlterSlot.uhrzeit_von} – {ausgewaehlterSlot.uhrzeit_bis} Uhr
            </p>
          </div>
        )}
        <button
          onClick={neueAnmeldung}
          className="px-6 py-2.5 bg-[#2d6a4f] text-white font-semibold rounded-lg hover:bg-[#1b4332] transition-colors text-sm"
        >
          Weitere Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Kalender */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-1">Schritt 1: Termin wählen</h2>
          <p className="text-xs text-gray-400 mb-5">
            Grüne Tage haben freie Plätze – klicken zum Auswählen
          </p>
          <Kalender
            slots={slots}
            ausgewaehlt={ausgewaehlterSlot?.id ?? null}
            onSlotWaehlen={setAusgewaehlterSlot}
          />
        </div>

        {/* Formular */}
        <div
          className={`bg-white rounded-2xl border shadow-sm transition-opacity ${
            ausgewaehlterSlot ? "border-[#d8f3e3]" : "border-gray-100 opacity-50"
          }`}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-[#1a1a2e] mb-1">Schritt 2: Formular ausfüllen</h2>
            {ausgewaehlterSlot ? (
              <div className="mt-2 bg-[#f0faf4] rounded-lg px-3 py-2 text-xs text-[#1b4332]">
                <p className="font-bold">{ausgewaehlterSlot.titel}</p>
                <p>
                  {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–
                  {ausgewaehlterSlot.uhrzeit_bis} Uhr
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Bitte zuerst einen Termin wählen</p>
            )}
          </div>

          <div className="p-6 space-y-4">
            {status === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Kontakt */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ihre Kontaktdaten</p>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Vorname *" error={errors.vorname?.message}>
                  <input {...register("vorname")} disabled={!ausgewaehlterSlot} className={inputClass} placeholder="Max" />
                </Field>
                <Field label="Nachname *" error={errors.nachname?.message}>
                  <input {...register("nachname")} disabled={!ausgewaehlterSlot} className={inputClass} placeholder="Mustermann" />
                </Field>
              </div>

              <Field label="E-Mail *" error={errors.email?.message}>
                <input {...register("email")} type="email" disabled={!ausgewaehlterSlot} className={inputClass} placeholder="max@beispiel.at" />
              </Field>

              <Field label="Telefon *" error={errors.telefon?.message}>
                <input {...register("telefon")} type="tel" disabled={!ausgewaehlterSlot} className={inputClass} placeholder="+43 660 123 456" />
              </Field>

              {/* Kind */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-2">Angaben zum Kind</p>

              <Field label="Name des Kindes *" error={errors.name_kind?.message}>
                <input {...register("name_kind")} disabled={!ausgewaehlterSlot} className={inputClass} placeholder="z.B. Anna" />
              </Field>

              <Field label="Schulstufe *" error={errors.schulstufe?.message}>
                <select {...register("schulstufe")} disabled={!ausgewaehlterSlot} className={inputClass + " bg-white"}>
                  <option value="">Bitte wählen…</option>
                  {schulstufen.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Was kann mein Kind gut? *" error={errors.kind_staerken?.message}>
                <textarea
                  {...register("kind_staerken")}
                  disabled={!ausgewaehlterSlot}
                  rows={2}
                  className={inputClass + " resize-none"}
                  placeholder="z.B. Lesen, kreatives Denken…"
                />
              </Field>

              <Field label="Was muss mein Kind noch lernen? *" error={errors.kind_lernen?.message}>
                <textarea
                  {...register("kind_lernen")}
                  disabled={!ausgewaehlterSlot}
                  rows={2}
                  className={inputClass + " resize-none"}
                  placeholder="z.B. Mathematik, Rechtschreibung…"
                />
              </Field>

              {/* Datenschutz */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  {...register("datenschutz")}
                  type="checkbox"
                  disabled={!ausgewaehlterSlot}
                  className="mt-0.5 accent-[#2d6a4f]"
                />
                <span className="text-xs text-gray-500">
                  Ich stimme der Verarbeitung meiner Daten zu. *
                </span>
              </label>
              {errors.datenschutz && (
                <p className="text-red-500 text-xs -mt-2">{errors.datenschutz.message}</p>
              )}

              <button
                type="submit"
                disabled={!ausgewaehlterSlot || status === "loading"}
                className="w-full py-3 bg-[#2d6a4f] text-white font-bold rounded-lg hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
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
