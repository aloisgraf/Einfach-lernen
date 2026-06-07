import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { getWebsiteTexte } from "@/lib/einstellungen-store";
import { RichText, ContentSection, parseHeader, parseCta, splitItems } from "@/components/RichText";
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
  title: "Legasthenie & Dyskalkulie | Einfach Lernen",
  description: "Förderung bei Lese-Rechtschreibschwäche und Rechenschwäche – individuell, einfühlsam und fundiert.",
};

export const dynamic = "force-dynamic";

export default async function LegasthenieDyskalkuliePage() {
  const texte = await getWebsiteTexte();
  const l = texte.legasthenie;
  const h = parseHeader(l.header);
  const c = parseCta(l.cta);
  const lrsH = splitItems(l.lrs_header);
  const rsH = splitItems(l.rechenschwaeche_header);
  const afsH = splitItems(l.afs_header);

  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">{h.kicker}</span>
          <h1 className="sec-title"><RichText text={h.titel} /></h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>{h.subtitel}</p>
        </div>
      </section>

      <hr className="divider" />

      {/* LRS */}
      <section className="sec" style={{ background: "var(--white)" }} id="lrs">
        <div className="content-wrap">
          <span className="sec-kicker kk-pine">{lrsH[0]}</span>
          <h2 className="sec-title">{lrsH[1]}</h2>
          <ContentSection text={l.lrs_content} />
        </div>
      </section>

      <hr className="divider" />

      {/* Rechenschwäche */}
      <section className="sec" style={{ background: "var(--pine-pale)" }} id="rechenschwaeche">
        <div className="content-wrap">
          <span className="sec-kicker kk-earth">{rsH[0]}</span>
          <h2 className="sec-title">{rsH[1]}</h2>
          <ContentSection text={l.rechenschwaeche_content} />
        </div>
      </section>

      <hr className="divider" />

      {/* AFS-Computertest */}
      <section className="sec" style={{ background: "var(--white)" }} id="afs-test">
        <div className="content-wrap">
          <span className="sec-kicker kk-soft">{afsH[0]}</span>
          <h2 className="sec-title">{afsH[1]}</h2>
          <ContentSection text={l.afs_content} />
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2><RichText text={c.heading} /></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p><RichText text={c.text} /></p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">{c.button}</a>
          <a href="/faq" className="btn btn-white">❓ Häufige Fragen</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
