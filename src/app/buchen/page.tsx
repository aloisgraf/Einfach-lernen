import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import { getBuchungsformularTexte, getWebsiteTexte } from "@/lib/einstellungen-store";
import SommerBuchung from "../SommerBuchung";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { RichText, parseHeader } from "@/components/RichText";
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
  const [slots, buchungen, formularTexte, texte] = await Promise.all([
    getFreigegebeneSlots(),
    getAlleBuchungen(),
    getBuchungsformularTexte(),
    getWebsiteTexte(),
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

  const b = texte.buchen;
  const h = parseHeader(b.header);

  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "2.5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">{h.kicker}</span>
          <h1 className="sec-title"><RichText text={h.titel} /></h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>{h.subtitel}</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="content-wrap" style={{ maxWidth: 640 }}>
          <div className="booking-box" id="booking">
            <div className="bk-head">
              <div className="bk-badge">{b.box_badge}</div>
              <span className="bk-title">{b.box_title}</span>
            </div>
            <SommerBuchung slots={buchbareSlots} texte={formularTexte} />
          </div>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
