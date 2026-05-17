import Link from "next/link";
import { ArrowRight } from "lucide-react";
import KursKarte from "./KursKarte";
import AnimateOnView from "./AnimateOnView";
import { mockKurse } from "@/lib/supabase";

export default function KursVorschau() {
  const vorschau = mockKurse.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-4">
              Aktuelle Kurse
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e]">
              Nächste Termine & Kurse
            </h2>
          </div>
          <Link
            href="/kurse"
            className="inline-flex items-center gap-2 text-[#2d6a4f] font-semibold hover:underline text-sm"
          >
            Alle Kurse ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimateOnView>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vorschau.map((kurs, i) => (
            <AnimateOnView key={kurs.id} delay={i * 0.1}>
              <KursKarte kurs={kurs} />
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView className="mt-10 text-center" delay={0.3}>
          <Link
            href="/kurse"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#f0faf4] text-[#2d6a4f] font-semibold rounded-xl hover:bg-[#d8f3e3] transition-colors border border-[#d8f3e3]"
          >
            Alle {mockKurse.length} Kurse ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
