"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Kalender from "@/components/Kalender";
import { Zeitslot, schulstufen } from "@/types/buchung";
import { CheckCircle, AlertCircle, Loader2, Calendar, User } from "lucide-react";

interface SlotMitPlaetzen extends Zeitslot {
  freie_plaetze: number;
}

interface Props {
  slots: SlotMitPlaetzen[];
}

const schema = z.object({
  vorname: z.string().min(2, "Bitte Vornamen eingeben"),
  nachname: z.string().min(2, "Bitte Nachnamen eingeben"),
  email: z.string().email("Bitte gültige E-Mail eingeben"),
  telefon: z.string().min(7, "Bitte Handynummer eingeben"),
  name_kind: z.string().min(2, "Bitte Name des Kindes eingeben"),
  schulstufe: z.string().min(1, "Bitte Schulstufe wählen"),
  kind_staerken: z.string().min(5, "Bitte mindestens 5 Zeichen eingeben"),
  kind_lernen: z.string().min(5, "Bitte mindestens 5 Zeichen eingeben"),
  datenschutz: z.boolean().refine((v) => v, { message: "Datenschutz bestätigen" }),
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
        body: JSON.stringify({
          zeitslot_id: ausgewaehlterSlot.id,
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          name_kind: data.name_kind,
          schulstufe: data.schulstufe,
          kind_staerken: data.kind_staerken,
          kind_lernen: data.kind_lernen,
        }),
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
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <CheckCircle className="w-20 h-20 text-[#52b788] mx-auto mb-6" />
          <h2 className="text-2xl font-extrabold text-[#1a1a2e] mb-3">
            Anmeldung erfolgreich!
          </h2>
          <p className="text-gray-500 mb-6">
            Deine Anmeldung wurde gespeichert. Wir melden uns in Kürze per E-Mail
            zur Bestätigung.
          </p>
          {ausgewaehlterSlot && (
            <div className="bg-[#f0faf4] rounded-2xl p-5 text-left text-sm space-y-2 mb-8">
              <p className="font-semibold text-[#1b4332] text-xs uppercase tracking-wide mb-3">
                Dein Termin
              </p>
              <p className="font-bold text-[#1a1a2e]">{ausgewaehlterSlot.titel}</p>
              <p className="text-gray-600">{formatDatum(ausgewaehlterSlot.datum)}</p>
              <p className="text-gray-600">
                {ausgewaehlterSlot.uhrzeit_von} – {ausgewaehlterSlot.uhrzeit_bis} Uhr
              </p>
            </div>
          )}
          <button
            onClick={neueAnmeldung}
            className="px-7 py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-colors"
          >
            Weitere Anmeldung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Kalender */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#f0faf4] rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#2d6a4f]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a1a2e]">Schritt 1: Termin wählen</h2>
                <p className="text-xs text-gray-400">
                  Klicke auf einen grünen Tag und wähle einen Zeitslot
                </p>
              </div>
            </div>
            <Kalender
              slots={slots}
              ausgewaehlt={ausgewaehlterSlot?.id ?? null}
              onSlotWaehlen={setAusgewaehlterSlot}
            />
          </div>
        </div>

        {/* Formular */}
        <div className="lg:col-span-2">
          <div
            className={`bg-white rounded-2xl border shadow-sm transition-all ${
              ausgewaehlterSlot ? "border-[#d8f3e3]" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[#f0faf4] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#2d6a4f]" />
                </div>
                <h2 className="font-bold text-[#1a1a2e]">Schritt 2: Daten eingeben</h2>
              </div>
              {!ausgewaehlterSlot ? (
                <p className="text-xs text-gray-400 ml-10">
                  Wähle zuerst einen Zeitslot im Kalender
                </p>
              ) : (
                <div className="ml-10 mt-2 bg-[#f0faf4] rounded-xl px-3 py-2 text-xs text-[#1b4332]">
                  <p className="font-bold">{ausgewaehlterSlot.titel}</p>
                  <p>
                    {formatDatum(ausgewaehlterSlot.datum)} ·{" "}
                    {ausgewaehlterSlot.uhrzeit_von}–{ausgewaehlterSlot.uhrzeit_bis} Uhr
                  </p>
                </div>
              )}
            </div>

            <div className="p-6">
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Elternteil Name */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Ihre Kontaktdaten
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Vorname *
                      </label>
                      <input
                        {...register("vorname")}
                        disabled={!ausgewaehlterSlot}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Max"
                      />
                      {errors.vorname && (
                        <p className="text-red-500 text-xs mt-1">{errors.vorname.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nachname *
                      </label>
                      <input
                        {...register("nachname")}
                        disabled={!ausgewaehlterSlot}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Mustermann"
                      />
                      {errors.nachname && (
                        <p className="text-red-500 text-xs mt-1">{errors.nachname.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    E-Mail-Adresse *
                  </label>
                  <input
                    {...register("email")}
                    disabled={!ausgewaehlterSlot}
                    type="email"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="max@beispiel.at"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Handynummer *
                  </label>
                  <input
                    {...register("telefon")}
                    disabled={!ausgewaehlterSlot}
                    type="tel"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="+43 660 123 456"
                  />
                  {errors.telefon && (
                    <p className="text-red-500 text-xs mt-1">{errors.telefon.message}</p>
                  )}
                </div>

                {/* Kind */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Angaben zum Kind
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Name des Kindes *
                      </label>
                      <input
                        {...register("name_kind")}
                        disabled={!ausgewaehlterSlot}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="z.B. Anna"
                      />
                      {errors.name_kind && (
                        <p className="text-red-500 text-xs mt-1">{errors.name_kind.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Schulstufe *
                      </label>
                      <select
                        {...register("schulstufe")}
                        disabled={!ausgewaehlterSlot}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                      >
                        <option value="">Bitte wählen…</option>
                        {schulstufen.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.schulstufe && (
                        <p className="text-red-500 text-xs mt-1">{errors.schulstufe.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Was kann mein Kind gut? *
                      </label>
                      <textarea
                        {...register("kind_staerken")}
                        disabled={!ausgewaehlterSlot}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="z.B. Lesen, Schreiben, kreatives Denken…"
                      />
                      {errors.kind_staerken && (
                        <p className="text-red-500 text-xs mt-1">{errors.kind_staerken.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Was muss mein Kind noch lernen? *
                      </label>
                      <textarea
                        {...register("kind_lernen")}
                        disabled={!ausgewaehlterSlot}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="z.B. Mathematik Grundrechenarten, Rechtschreibung…"
                      />
                      {errors.kind_lernen && (
                        <p className="text-red-500 text-xs mt-1">{errors.kind_lernen.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Datenschutz */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    {...register("datenschutz")}
                    type="checkbox"
                    disabled={!ausgewaehlterSlot}
                    className="mt-0.5 accent-[#2d6a4f]"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    Ich stimme der{" "}
                    <a href="/datenschutz" target="_blank" className="text-[#2d6a4f] underline">
                      Datenschutzerklärung
                    </a>{" "}
                    zu. *
                  </span>
                </label>
                {errors.datenschutz && (
                  <p className="text-red-500 text-xs -mt-2">{errors.datenschutz.message}</p>
                )}

                <button
                  type="submit"
                  disabled={!ausgewaehlterSlot || status === "loading"}
                  className="w-full py-3.5 bg-[#2d6a4f] text-white font-bold rounded-xl hover:bg-[#1b4332] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Wird gespeichert…
                    </>
                  ) : (
                    "Jetzt anmelden"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
