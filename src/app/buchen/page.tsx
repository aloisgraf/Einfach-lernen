import { Metadata } from "next";
import { getFreigegebeneSlots, getFreiePlaetze } from "@/lib/slots-store";
import BuchungsSeite from "./BuchungsSeite";

export const metadata: Metadata = {
  title: "Termin buchen | Einfach Lernen Pongau",
  description:
    "Freien Termin im Kalender wählen und direkt online buchen – schnell und unkompliziert.",
};

// Jede Anfrage frisch rendern (kein Caching)
export const dynamic = "force-dynamic";

export default function BuchenPage() {
  const slots = getFreigegebeneSlots().map((s) => ({
    ...s,
    freie_plaetze: getFreiePlaetze(s.id),
  }));

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#f0faf4] to-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-xs font-semibold rounded-full mb-3">
            Online-Buchung
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-2">
            Termin buchen
          </h1>
          <p className="text-gray-500 max-w-lg">
            Wähle im Kalender einen freien Termin aus, trage deine Daten ein
            und klicke auf <strong>„Jetzt eintragen"</strong>.
          </p>
        </div>
      </div>

      <BuchungsSeite slots={slots} />
    </div>
  );
}
