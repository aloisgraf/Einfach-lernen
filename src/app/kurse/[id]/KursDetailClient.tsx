"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Euro, CheckCircle } from "lucide-react";
import { Kurs, KursEinheit, kategorieLabels } from "@/types";
import AnmeldungFormular from "@/components/AnmeldungFormular";
import { cn } from "@/lib/utils";

interface Props {
  kurs: Kurs;
}

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString("de-AT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function KursDetailClient({ kurs }: Props) {
  const [ausgewaehlteEinheit, setAusgewaehlteEinheit] =
    useState<KursEinheit | null>(kurs.einheiten?.[0] ?? null);
  const [anmeldungOffen, setAnmeldungOffen] = useState(false);

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/kurse"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2d6a4f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Kursübersicht
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="h-2 bg-gradient-to-r from-[#2d6a4f] to-[#52b788]" />
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-[#d8f3e3] text-[#1b4332] text-xs font-semibold rounded-full mb-4">
                  {kategorieLabels[kurs.kategorie]}
                </span>
                <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-4">
                  {kurs.titel}
                </h1>
                <p className="text-gray-600 leading-relaxed">{kurs.beschreibung}</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-[#2d6a4f]" />
                    <span>Altersgruppe: {kurs.altersgruppe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-[#2d6a4f]" />
                    <span>Max. {kurs.max_teilnehmer} Teilnehmer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Euro className="w-4 h-4 text-[#2d6a4f]" />
                    <span>{kurs.preis_pro_einheit} € pro Einheit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Termine */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 className="font-bold text-xl text-[#1a1a2e] mb-6">
                Verfügbare Termine
              </h2>
              <div className="space-y-3">
                {kurs.einheiten?.map((einheit) => (
                  <button
                    key={einheit.id}
                    onClick={() => setAusgewaehlteEinheit(einheit)}
                    disabled={einheit.freie_plaetze === 0}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all",
                      einheit.freie_plaetze === 0
                        ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                        : ausgewaehlteEinheit?.id === einheit.id
                        ? "border-[#2d6a4f] bg-[#f0faf4]"
                        : "border-gray-200 hover:border-[#52b788] hover:bg-[#f9fafb]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e]">
                          <Calendar className="w-4 h-4 text-[#2d6a4f]" />
                          {formatDatum(einheit.datum)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {einheit.uhrzeit_von} – {einheit.uhrzeit_bis} Uhr
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {einheit.ort}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {einheit.freie_plaetze === 0 ? (
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Ausgebucht
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full",
                              einheit.freie_plaetze <= 2
                                ? "text-amber-700 bg-amber-50"
                                : "text-[#1b4332] bg-[#d8f3e3]"
                            )}
                          >
                            {einheit.freie_plaetze} Plätze frei
                          </span>
                        )}
                        {ausgewaehlteEinheit?.id === einheit.id && einheit.freie_plaetze > 0 && (
                          <div className="mt-1 flex justify-end">
                            <CheckCircle className="w-4 h-4 text-[#2d6a4f]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar – Anmeldung */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#2d6a4f] to-[#52b788]" />
              <div className="p-6">
                <h2 className="font-bold text-lg text-[#1a1a2e] mb-2">
                  Platz sichern
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Wählt einen Termin und meldet euch direkt online an.
                </p>

                {ausgewaehlteEinheit && (
                  <div className="bg-[#f0faf4] rounded-xl p-4 mb-5 space-y-2">
                    <p className="text-xs font-semibold text-[#1b4332] uppercase tracking-wide">
                      Gewählter Termin
                    </p>
                    <p className="text-sm font-bold text-[#1a1a2e]">
                      {formatDatum(ausgewaehlteEinheit.datum)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ausgewaehlteEinheit.uhrzeit_von} – {ausgewaehlteEinheit.uhrzeit_bis} Uhr
                    </p>
                    <p className="text-sm text-gray-600">{ausgewaehlteEinheit.ort}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#2d6a4f]">
                        {kurs.preis_pro_einheit} €
                      </span>
                      <span className="text-xs text-gray-400">
                        {ausgewaehlteEinheit.freie_plaetze} Plätze frei
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setAnmeldungOffen(true)}
                  disabled={!ausgewaehlteEinheit || ausgewaehlteEinheit.freie_plaetze === 0}
                  className="w-full py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Jetzt anmelden
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Kostenlos stornierbar bis 48h vor dem Termin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anmeldungs-Modal */}
      {anmeldungOffen && ausgewaehlteEinheit && (
        <AnmeldungFormular
          kurs={kurs}
          einheit={ausgewaehlteEinheit}
          onClose={() => setAnmeldungOffen(false)}
        />
      )}
    </div>
  );
}
