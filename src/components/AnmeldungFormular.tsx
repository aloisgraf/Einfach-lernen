"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Kurs, KursEinheit } from "@/types";

const schema = z.object({
  vorname: z.string().min(2, "Bitte Vornamen eingeben"),
  nachname: z.string().min(2, "Bitte Nachnamen eingeben"),
  email: z.string().email("Bitte gültige E-Mail eingeben"),
  telefon: z.string().min(7, "Bitte Telefonnummer eingeben"),
  geburtsdatum: z.string().optional(),
  nachricht: z.string().optional(),
  datenschutz: z.boolean().refine((v) => v === true, {
    message: "Bitte Datenschutzerklärung akzeptieren",
  }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  kurs: Kurs;
  einheit: KursEinheit;
  onClose: () => void;
}

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString("de-AT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AnmeldungFormular({ kurs, einheit, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/anmeldung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kurs_id: kurs.id,
          einheit_id: einheit.id,
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          geburtsdatum: data.geburtsdatum,
          nachricht: data.nachricht,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-[#1a1a2e] text-lg">Kursanmeldung</h2>
            <p className="text-sm text-gray-500">{kurs.titel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-[#52b788] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                Anmeldung erfolgreich!
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Wir haben eure Anmeldung erhalten und werden uns in Kürze bei
                euch melden, um alles zu bestätigen.
              </p>
              <div className="mt-4 bg-[#f0faf4] rounded-xl p-4 text-left text-sm text-gray-600 space-y-1">
                <p><strong>Kurs:</strong> {kurs.titel}</p>
                <p><strong>Termin:</strong> {formatDatum(einheit.datum)}</p>
                <p>
                  <strong>Zeit:</strong> {einheit.uhrzeit_von} – {einheit.uhrzeit_bis} Uhr
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-colors"
              >
                Schließen
              </button>
            </div>
          ) : (
            <>
              {/* Termin summary */}
              <div className="bg-[#f0faf4] rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-[#1b4332]">Anmeldung für:</p>
                <p className="font-bold">{kurs.titel}</p>
                <p>{formatDatum(einheit.datum)}</p>
                <p>
                  {einheit.uhrzeit_von} – {einheit.uhrzeit_bis} Uhr · {einheit.ort}
                </p>
                <p className="text-[#2d6a4f] font-semibold">
                  {kurs.preis_pro_einheit} € pro Einheit
                </p>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg || "Anmeldung fehlgeschlagen. Bitte versucht es erneut."}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Vorname *
                    </label>
                    <input
                      {...register("vorname")}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
                      placeholder="Max"
                    />
                    {errors.vorname && (
                      <p className="text-red-500 text-xs mt-1">{errors.vorname.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nachname *
                    </label>
                    <input
                      {...register("nachname")}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
                      placeholder="Mustermann"
                    />
                    {errors.nachname && (
                      <p className="text-red-500 text-xs mt-1">{errors.nachname.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    E-Mail *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
                    placeholder="max@beispiel.at"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Telefon *
                  </label>
                  <input
                    {...register("telefon")}
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
                    placeholder="+43 123 456 789"
                  />
                  {errors.telefon && (
                    <p className="text-red-500 text-xs mt-1">{errors.telefon.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Geburtsdatum des Kindes (optional)
                  </label>
                  <input
                    {...register("geburtsdatum")}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nachricht / Anmerkungen (optional)
                  </label>
                  <textarea
                    {...register("nachricht")}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent resize-none"
                    placeholder="Besondere Wünsche oder Infos…"
                  />
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register("datenschutz")}
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 accent-[#2d6a4f]"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Ich habe die{" "}
                      <a
                        href="/datenschutz"
                        target="_blank"
                        className="text-[#2d6a4f] underline"
                      >
                        Datenschutzerklärung
                      </a>{" "}
                      gelesen und bin damit einverstanden. *
                    </span>
                  </label>
                  {errors.datenschutz && (
                    <p className="text-red-500 text-xs mt-1">{errors.datenschutz.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Wird versendet…
                    </>
                  ) : (
                    "Verbindlich anmelden"
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Nach der Anmeldung erhaltet ihr eine Bestätigungs-E-Mail.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
