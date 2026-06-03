import { Metadata } from "next";
import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import BuchungsSeite from "./BuchungsSeite";

export const metadata: Metadata = {
  title: "Termin buchen | Einfach Lernen Pongau",
  description:
    "Freien Termin im Kalender wählen und direkt online anmelden – schnell und unkompliziert.",
};

export const dynamic = "force-dynamic";

export default async function BuchenPage() {
  const [slots, buchungen] = await Promise.all([
    getFreigegebeneSlots(),
    getAlleBuchungen(),
  ]);

  const slotsWithPlaetze = slots.map((s) => ({
    ...s,
    freie_plaetze:
      s.max_teilnehmer - buchungen.filter((b) => b.zeitslot_id === s.id).length,
  }));

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="bg-gradient-to-br from-[#f0faf4] to-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-xs font-semibold rounded-full mb-3">
            Online-Anmeldung
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-2">
            Termin buchen
          </h1>
          <p className="text-gray-500 max-w-lg">
            Wähle im Kalender einen freien Termin aus, trage deine Daten ein
            und klicke auf <strong>„Jetzt anmelden"</strong>.
          </p>
        </div>
      </div>

      <BuchungsSeite slots={slotsWithPlaetze} />
    </div>
  );
}
