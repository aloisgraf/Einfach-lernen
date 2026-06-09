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
          {/* Hero Header */}
          <div style={{ textAlign: "center", marginBottom: "2.2rem", paddingBottom: "2rem", borderBottom: "2px solid #eaf4ef" }}>
            <img
              src="/logo.png"
              alt="Einfach Lernen Pongau"
              style={{ height: 70, display: "block", margin: "0 auto 1.1rem", objectFit: "contain" }}
            />
            <h1 style={{
              fontFamily: `var(--font-raleway), sans-serif`,
              fontSize: "clamp(1.45rem, 5vw, 2rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#1a5c4a",
              margin: "0 0 .4rem",
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}>
              Fit &amp; Sicher<br />ins neue Schuljahr
            </h1>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 .2rem" }}>
              Individuelle Lernförderung in den Sommerferien
            </p>
            <p style={{ fontSize: ".88rem", color: "#6b7280", margin: "0 0 1rem" }}>
              vor Ort in Eben oder online
            </p>
            <p style={{
              fontSize: ".87rem",
              color: "#4b5563",
              lineHeight: 1.65,
              margin: "0 auto",
              maxWidth: 480,
            }}>
              Gezielte Förderung, abgestimmt auf dein Kind, ideal um Lernlücken zu schließen,
              wichtige Inhalte zu wiederholen oder Gelerntes zu festigen.
            </p>
          </div>

          <div className="booking-box" id="booking">
            <SommerBuchung slots={buchbareSlots} texte={formularTexte} />
          </div>
        </div>
      </section>
    </div>
  );
}
