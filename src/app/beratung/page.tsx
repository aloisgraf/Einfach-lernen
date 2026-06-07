import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
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
  title: "Beratung | Einfach Lernen",
  description: "Individuelle Elternberatung – persönlich oder online, mit klaren Lösungen für euer Anliegen.",
};

export default function BeratungPage() {
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">Für Eltern</span>
          <h1 className="sec-title">Beratung</h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>Klarheit und Strategien für den Familienalltag – verständlich, einfühlsam, auf Augenhöhe.</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="content-wrap">
          <p>Ich biete individuelle Beratung für Eltern und Erziehungsberechtigte zur optimalen Unterstützung deines Kindes.</p>

          <p>Hausübungen bedeuten Stress für dich und deine Familie? Deinem Kind fällt eine spezielle Sache in der Schule sehr schwer und du möchtest wissen, wie du am besten unterstützen kannst? Von allgemeinen Themen, wie Schulstufenübertritt und Lernschwierigkeiten bis hin zu inhaltlichen Fragen zu schulischen Themen wie z.B.  Lese- Rechtschreibschwäche oder Schwierigkeiten in Mathematik, gemeinsam suchen wir nach Lösungen für dein Anliegen.</p>

          <p>Diese Beratung dauert 50 Minuten, damit wir genug Zeit für dein Anliegen haben. Ich sende dir vorab einen Fragebogen zu, damit ich optimal vorbereitet bin.</p>

          <div className="price-box">Deine Investition: € 150/ 50 Minuten</div>

          <p>Die Beratung kann entweder persönlich oder online stattfinden.</p>

          <p>Bei einem kostenlosen Kennenlerngespräch (ca. 20 Minuten) gibt es die Möglichkeit mich kennenzulernen und zu erfahren, wie eine Elternberatung oder eine Lernförderung, Legasthenie- bzw. Dyskalkulietraining aussehen könnte. Ich freue mich auf dich!</p>
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2>Lass uns <strong>ins Gespräch kommen</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Vereinbare dein kostenloses Kennenlerngespräch – persönlich oder online, ganz ohne Druck.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Termin anfragen</a>
          <a href="/kontakt" className="btn btn-white">📍 Kontakt</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
