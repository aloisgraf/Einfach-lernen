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

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 " +
  "placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a5c4a]/25 " +
  "focus:border-[#1a5c4a] transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-3 pb-1">
      <span className="text-xs font-semibold text-[#1a5c4a]">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export default function BuchungsSeite({ slots }: Props) {
  const [ausgewaehlterSlot, setAusgewaehlterSlot] = useState<SlotMitPlaetzen | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
      <div className="text-center py-20 px-6">
        <CheckCircle className="w-14 h-14 text-[#1a5c4a] mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-[#1a5c4a] mb-2">Anmeldung erfolgreich!</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          Wir melden uns in Kürze persönlich bei dir zur Bestätigung.
        </p>
        {ausgewaehlterSlot && (
          <div className="inline-block bg-white border border-gray-200 rounded-2xl p-5 text-sm text-left mb-8 min-w-64">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Dein Termin</p>
            <p className="font-bold text-[#1a5c4a]">{ausgewaehlterSlot.titel}</p>
            <p className="text-gray-500 mt-1">{formatDatum(ausgewaehlterSlot.datum)}</p>
            <p className="text-gray-500">{ausgewaehlterSlot.uhrzeit_von} – {ausgewaehlterSlot.uhrzeit_bis} Uhr</p>
          </div>
        )}
        <br />
        <button
          onClick={neueAnmeldung}
          className="px-7 py-2.5 bg-[#1a5c4a] text-white text-sm font-semibold rounded-xl hover:bg-[#154d3e] transition-colors"
        >
          Weitere Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Kalender */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Schritt 1</p>
          <h3 className="text-lg font-bold text-[#1a5c4a] mb-6">Termin wählen</h3>
          <Kalender
            slots={slots}
            ausgewaehlt={ausgewaehlterSlot?.id ?? null}
            onSlotWaehlen={setAusgewaehlterSlot}
          />
        </div>

        {/* Formular */}
        <div className={`bg-white rounded-2xl border shadow-sm transition-all ${
          ausgewaehlterSlot ? "border-[#1a5c4a]/30" : "border-gray-200 opacity-50 pointer-events-none"
        }`}>
          <div className="p-7 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Schritt 2</p>
            <h3 className="text-lg font-bold text-[#1a5c4a] mb-3">Formular ausfüllen</h3>
            {ausgewaehlterSlot ? (
              <div className="bg-[#f0f7f3] rounded-xl px-4 py-3 text-sm">
                <p className="font-semibold text-[#1a5c4a]">{ausgewaehlterSlot.titel}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {formatDatum(ausgewaehlterSlot.datum)} · {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Bitte zuerst einen Termin wählen</p>
            )}
          </div>

          <div className="p-7">
            {status === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm mb-5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Divider label="Ihre Kontaktdaten" />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Vorname *" error={errors.vorname?.message}>
                  <input {...register("vorname")} className={inputCls} placeholder="Max" />
                </Field>
                <Field label="Nachname *" error={errors.nachname?.message}>
                  <input {...register("nachname")} className={inputCls} placeholder="Mustermann" />
                </Field>
              </div>

              <Field label="E-Mail *" error={errors.email?.message}>
                <input {...register("email")} type="email" className={inputCls} placeholder="max@beispiel.at" />
              </Field>

              <Field label="Telefon *" error={errors.telefon?.message}>
                <input {...register("telefon")} type="tel" className={inputCls} placeholder="+43 660 123 456" />
              </Field>

              <Divider label="Angaben zum Kind" />

              <Field label="Name des Kindes *" error={errors.name_kind?.message}>
                <input {...register("name_kind")} className={inputCls} placeholder="z.B. Anna" />
              </Field>

              <Field label="Schulstufe *" error={errors.schulstufe?.message}>
                <select {...register("schulstufe")} className={inputCls + " bg-white"}>
                  <option value="">Bitte wählen…</option>
                  {schulstufen.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Was kann mein Kind gut? *" error={errors.kind_staerken?.message}>
                <textarea
                  {...register("kind_staerken")}
                  rows={3}
                  className={inputCls + " resize-none"}
                  placeholder="z.B. Lesen, Englisch, kreatives Denken…"
                />
              </Field>

              <Field label="Was muss mein Kind noch lernen? *" error={errors.kind_lernen?.message}>
                <textarea
                  {...register("kind_lernen")}
                  rows={3}
                  className={inputCls + " resize-none"}
                  placeholder="z.B. Mathematik, Rechtschreibung…"
                />
              </Field>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  {...register("datenschutz")}
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-[#1a5c4a]"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  Ich stimme der Verarbeitung meiner Daten zu. *
                </span>
              </label>
              {errors.datenschutz && (
                <p className="text-red-500 text-xs ml-6 -mt-2">{errors.datenschutz.message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-[#1a5c4a] text-white text-sm font-bold rounded-xl hover:bg-[#154d3e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {status === "loading"
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert…</>
                  : "Jetzt anmelden"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
