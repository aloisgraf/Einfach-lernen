import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { getWebsiteTexte } from "@/lib/einstellungen-store";
import { RichText, RichParagraphs } from "@/components/RichText";
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

export const dynamic = "force-dynamic";

export default async function BeratungPage() {
  const texte = await getWebsiteTexte();
  const b = texte.beratung;

  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">{b.kicker}</span>
          <h1 className="sec-title"><RichText text={b.heading} /></h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>{b.subheading}</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="content-wrap">
          <RichParagraphs text={b.content} />

          <div className="price-box">{b.price}</div>
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2><RichText text={b.cta_heading} /></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>{b.cta_text}</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">{b.cta_button}</a>
          <a href="/kontakt" className="btn btn-white">📍 Kontakt</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
