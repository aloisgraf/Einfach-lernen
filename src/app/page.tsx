import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import BuchungsSeite from "./buchen/BuchungsSeite";
import { Metadata } from "next";

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
    <div className="min-h-screen bg-[#f5f8f6]">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto w-full px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1a5c4a]">Einfach Lernen</h1>
            <p className="text-xs text-gray-400 mt-0.5">Nachhilfe &amp; Lernförderung · Pongau</p>
          </div>
          <a
            href="/admin/login"
            className="text-xs font-semibold text-[#1a5c4a] border border-[#1a5c4a]/30 px-4 py-2 rounded-lg hover:bg-[#1a5c4a] hover:text-white transition-colors"
          >
            Admin-Login
          </a>
        </div>
        <div className="h-0.5 bg-[#1a5c4a]" />
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-14 px-6">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a5c4a] mb-3">
            Termin buchen
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Wähle einen freien Termin und fülle das Formular aus.
            Wir melden uns danach persönlich bei dir.
          </p>
        </div>
      </section>

      {/* Booking */}
      <div className="max-w-4xl mx-auto w-full">
        <BuchungsSeite slots={slotsWithPlaetze} />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-6 px-6 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Einfach Lernen Pongau
        </p>
      </footer>
    </div>
  );
}
