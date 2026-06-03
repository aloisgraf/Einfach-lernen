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
    <div className="min-h-screen bg-[#f7faf8]">

      {/* Header */}
      <header className="bg-white border-b border-[#e0ede7]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1a5c4a]/50 mb-0.5">
              Nachhilfe &amp; Lernförderung
            </p>
            <h1 className="text-2xl font-bold tracking-[0.12em] uppercase text-[#1a5c4a]">
              Einfach Lernen
            </h1>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-[#1a5c4a]/50 tracking-wide">Pongau</p>
          </div>
        </div>
        {/* Logo-style underline */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1a5c4a] to-transparent" />
      </header>

      {/* Hero */}
      <section className="bg-white pt-16 pb-14 px-6 text-center border-b border-[#e0ede7]">
        <p className="text-xs tracking-[0.3em] uppercase text-[#1a5c4a]/60 mb-4">
          Online-Anmeldung
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-[0.08em] uppercase text-[#1a5c4a] mb-5">
          Termin buchen
        </h2>
        <p className="text-[#1a5c4a]/60 text-sm tracking-wide max-w-md mx-auto leading-relaxed">
          Wähle einen freien Termin im Kalender und fülle das Formular aus.
          <br className="hidden sm:block" />
          Wir melden uns danach persönlich bei dir.
        </p>
      </section>

      {/* Booking */}
      <BuchungsSeite slots={slotsWithPlaetze} />

      {/* Footer */}
      <footer className="border-t border-[#e0ede7] mt-24 py-8 px-6 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#1a5c4a]/40 mb-3">
          © {new Date().getFullYear()} Einfach Lernen Pongau
        </p>
        <a
          href="/admin/login"
          className="text-[10px] tracking-widest uppercase text-[#1a5c4a]/25 hover:text-[#1a5c4a]/50 transition-colors"
        >
          Admin
        </a>
      </footer>
    </div>
  );
}
