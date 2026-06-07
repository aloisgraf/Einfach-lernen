import Link from "next/link";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { User } from "lucide-react";
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
  title: "Über mich | Einfach Lernen",
  description: "Lerne Anna Reichsöllner kennen – Gründerin von Einfach Lernen im Pongau.",
};

const absaetze = [
  `Ich freue mich, dich auf meiner Homepage begrüßen zu dürfen. Mein Name ist Anna Reichsöllner, ich wohne gemeinsam mit meinem Mann und unseren zwei Kindern in Eben im Pongau.`,
  `Ich bin im Pinzgau aufgewachsen. Nach meiner Matura am Privatgymnasium St. Ursula in Salzburg 2008 studierte ich zunächst an der Fachhochschule Salzburg "Innovation und Management im Tourismus". Schon damals gab ich VolksschülerInnen und MaturantInnen Nachhilfe in Mathematik. Das "Lehren" ließ mich nicht los und ich entschied, Lehrerin zu werden, nachdem ich als Rezeptionistin in einem Hotel, Nachhilfelehrerin bei der Schülerhilfe Saalfelden, als Kellnerin und als Reitlehrerin gearbeitet hatte.`,
  `Nachdem ich das Bachelorstudium im Bereich Primarstufenpädagogik mit Schwerpunkt gesellschaftlichem Lernen an der Pädagogischen Hochschule abgeschlossen hatte, folgte 2023 der Masterabschluss.`,
  `Im Schuljahr 2021/22 hatte ich die Möglichkeit als Lernassistentin tätig zu sein und absolvierte den Hochschullehrgang "Betreuer/in für Lese-Rechtschreibschwäche" an der Pädagogischen Hochschule Salzburg. Durch meine Tätigkeit als Lernassistentin wurde ich noch mehr für das Thema "Förderung" sensibilisiert.`,
  `Neben dem Besuch von zahlreichen Fortbildungen vor allem in den Bereichen Deutsch und Mathematik habe ich mir im Lauf der Jahre vieles an Materialien und Fachliteratur angeschafft und konnte so mein Wissen vertiefen.`,
  `Die Gründung von Einfach Lernen war für mich eine Herzensangelegenheit. Was mich antreibt, ist die Überzeugung, dass jedes Kind die Chance verdient, sein volles Potenzial zu entfalten – ohne Druck, ohne Frustration. Es bereitet mir unendlich viel Freude, Kinder auf ihrem Lernweg zu begleiten und zu sehen, wie sie durch individuelle Unterstützung Selbstvertrauen und Stolz entwickeln.`,
  `Mein Beruf als Volksschullehrerin sehe ich als großen Vorteil, denn ich verstehe sowohl die Perspektive der Lehrpersonen als auch die Herausforderungen, die Eltern täglich erleben.`,
  `Als Mutter weiß ich, wie wichtig es ist, auf die Bedürfnisse jedes einzelnen Kindes einzugehen.`,
  `Ich lege großen Wert darauf, den Kindern zu zeigen, dass Lernen Spaß machen kann, wenn man die richtigen Werkzeuge und die nötige Geduld mitbringt. Mir ist es wichtig, ein Umfeld zu schaffen, in dem Kinder ohne Angst vor Fehlern lernen können. Denn ich bin überzeugt: Lernen funktioniert am besten, wenn Kinder sich sicher und wertgeschätzt fühlen.`,
  `Einfach Lernen steht für eine ganzheitliche und wertschätzende Förderung, bei der jedes Kind in seinem Tempo und nach seinen eigenen Bedürfnissen unterstützt wird. Mein Ziel ist es, Kinder zu stärken, damit sie mit Selbstvertrauen und Freude ihre schulischen Herausforderungen meistern können.`,
];

export default function UeberMichPage() {
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: "3rem", alignItems: "center" }} className="ueber-mich-head">
          <div style={{
            width: 240, height: 240, borderRadius: "50%",
            background: "var(--white)", border: "1.5px solid var(--pine-pale)",
            boxShadow: "var(--sh-lg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto",
          }}>
            {/* Platzhalter für Foto von Anna Reichsöllner */}
            <User style={{ width: 84, height: 84, color: "var(--pine-pale)" }} strokeWidth={1.2} />
          </div>
          <div>
            <span className="sec-kicker kk-pine">Über mich</span>
            <h1 className="sec-title" style={{ marginBottom: ".5rem" }}>Hallo, ich bin <strong>Anna Reichsöllner</strong></h1>
            <p className="sec-sub">Gründerin von Einfach Lernen – Volksschullehrerin, Lernbegleiterin und Mama aus Eben im Pongau.</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {absaetze.map((text, i) => (
            <p key={i} style={{ fontSize: ".97rem", lineHeight: 1.85, color: "var(--mid)" }}>{text}</p>
          ))}

          <div className="chip" style={{ marginTop: "1rem", alignItems: "center" }}>
            <div className="chip-ico">✉️</div>
            <p style={{ fontWeight: 600 }}>
              Schreib mir gern, wenn du weitere Fragen hast! Ich freue mich darauf, dich kennenzulernen.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2>Lust auf ein erstes <strong>Kennenlernen?</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Melde dich jederzeit unverbindlich – ich freue mich, von dir und deinem Kind zu hören.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Nachricht schreiben</a>
          <Link href="/#sommerkurse" className="btn btn-white">☀️ Sommerkurs buchen</Link>
        </div>
      </section>

      <LvFooter />

      <style>{`
        @media (max-width: 700px) {
          .ueber-mich-head { grid-template-columns: 1fr !important; text-align: center; }
        }
      `}</style>
    </div>
  );
}
