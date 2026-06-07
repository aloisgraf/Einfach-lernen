import Link from "next/link";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { User } from "lucide-react";
import { getWebsiteTexte } from "@/lib/einstellungen-store";
import { RichText, RichParagraphs, parseHeader, parseCta } from "@/components/RichText";
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

export const dynamic = "force-dynamic";

export default async function UeberMichPage() {
  const texte = await getWebsiteTexte();
  const u = texte.ueber_mich;
  const h = parseHeader(u.header);
  const c = parseCta(u.cta);

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
            <User style={{ width: 84, height: 84, color: "var(--pine-pale)" }} strokeWidth={1.2} />
          </div>
          <div>
            <span className="sec-kicker kk-pine">{h.kicker}</span>
            <h1 className="sec-title" style={{ marginBottom: ".5rem" }}><RichText text={h.titel} /></h1>
            <p className="sec-sub">{h.subtitel}</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <RichParagraphs text={u.content} />

          <div className="chip" style={{ marginTop: "1rem", alignItems: "center" }}>
            <div className="chip-ico">✉️</div>
            <p style={{ fontWeight: 600 }}>{u.hinweis}</p>
          </div>
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2><RichText text={c.heading} /></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p><RichText text={c.text} /></p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">{c.button}</a>
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
