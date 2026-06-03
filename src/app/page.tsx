import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import BuchungsSeite from "./buchen/BuchungsSeite";
import { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Termin buchen | Einfach Lernen Pongau",
  description: "Jetzt online einen Termin für Nachhilfe im Pongau buchen.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
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
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#1a1a2e] leading-tight">Einfach Lernen Pongau</p>
            <p className="text-xs text-[#2d6a4f]">Nachhilfe & Lernförderung</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Termin buchen
          </h1>
          <p className="text-white/70 text-sm max-w-md">
            Wähle einen freien Termin im Kalender und fülle das Formular aus.
            Wir melden uns danach bei dir.
          </p>
        </div>
      </div>

      {/* Booking */}
      <BuchungsSeite slots={slotsWithPlaetze} />

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-6 px-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Einfach Lernen Pongau
      </footer>
    </div>
  );
}
