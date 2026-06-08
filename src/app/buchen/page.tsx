import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import { getBuchungsformularTexte, getWebsiteTexte } from "@/lib/einstellungen-store";
import SommerBuchung from "../SommerBuchung";
import "../lernversum.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kursplatz buchen | Einfach Lernen Pongau",
  description: "Freien Termin auswählen und direkt online anmelden – schnell und unkompliziert.",
};

export const dynamic = "force-dynamic";

export default async function BuchenPage() {
  const [slots, buchungen, formularTexte] = await Promise.all([
    getFreigegebeneSlots(),
    getAlleBuchungen(),
    getBuchungsformularTexte(),
  ]);

  const slotsWithPlaetze = slots.map((s) => ({
    ...s,
    freie_plaetze: s.max_teilnehmer - buchungen.filter((b) => b.zeitslot_id === s.id).length,
  }));

  const ausgebuchteGruppen = new Set(
    Array.from(new Set(slotsWithPlaetze.filter((s) => s.gruppe_id).map((s) => s.gruppe_id!)))
      .filter((gruppeId) => slotsWithPlaetze.some((s) => s.gruppe_id === gruppeId && s.freie_plaetze <= 0))
  );

  const buchbareSlots = slotsWithPlaetze.filter(
    (s) => s.freie_plaetze > 0 && !(s.gruppe_id && ausgebuchteGruppen.has(s.gruppe_id))
  );

  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`} style={{ padding: 0 }}>
      <section className="sec" style={{ background: "var(--white)", padding: "2rem max(1.5rem,6vw)" }}>
        <div className="content-wrap" style={{ maxWidth: 640 }}>
          <div className="booking-box" id="booking">
            <SommerBuchung slots={buchbareSlots} texte={formularTexte} />
          </div>
        </div>
      </section>
    </div>
  );
}
