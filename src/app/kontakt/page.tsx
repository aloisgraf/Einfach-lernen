import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import { getWebsiteTexte } from "@/lib/einstellungen-store";
import { RichText, parseHeader, parseCta } from "@/components/RichText";
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
  title: "Kontakt | Einfach Lernen",
  description: "Kontaktiere Anna Reichsöllner von Einfach Lernen in Eben im Pongau.",
};

export const dynamic = "force-dynamic";

const OSM_BBOX = "13.4332,47.4296,13.4452,47.4356";
const OSM_MARKER = "47.4326,13.4392";

export default async function KontaktPage() {
  const texte = await getWebsiteTexte();
  const k = texte.kontakt;
  const h = parseHeader(k.header);
  const c = parseCta(k.cta);

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

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="contact-grid">
          <div className="contact-card">
            <h3 style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 500, fontSize: "1.2rem", color: "var(--ink)", margin: 0 }}>
              {k.name}
            </h3>
            <div className="contact-row">
              <div className="contact-ico">📞</div>
              <a href={`tel:+43${k.telefon.replace(/\s/g, "").replace(/^0/, "")}`}>{k.telefon}</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">✉️</div>
              <a href={`mailto:${k.email}`}>{k.email}</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">📷</div>
              <span>{k.instagram}</span>
            </div>
            <div className="contact-row">
              <div className="contact-ico">🌐</div>
              <a href={`https://${k.website}`} target="_blank" rel="noopener noreferrer">{k.website}</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">📍</div>
              <span><RichText text={k.adresse} /></span>
            </div>
          </div>

          <div className="map-embed">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${OSM_BBOX}&layer=mapnik&marker=${OSM_MARKER}`}
              title="Standort von Einfach Lernen"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="cta-sec" id="kennenlernen">
        <h2><RichText text={c.heading} /></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p><RichText text={c.text} /></p>
        <div className="cta-btns">
          <a href={`mailto:${k.email}`} className="btn btn-gold">{c.button}</a>
          <a href={`tel:+43${k.telefon.replace(/\s/g, "").replace(/^0/, "")}`} className="btn btn-white">📞 Anrufen</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
