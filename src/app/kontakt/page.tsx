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
  title: "Kontakt | Einfach Lernen",
  description: "Kontaktiere Anna Reichsöllner von Einfach Lernen in Eben im Pongau.",
};

const OSM_BBOX = "13.4332,47.4296,13.4452,47.4356";
const OSM_MARKER = "47.4326,13.4392";

export default function KontaktPage() {
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">So erreichst du mich</span>
          <h1 className="sec-title">Kontakt</h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>Melde dich gerne – ich freue mich, von dir zu hören.</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="contact-grid">
          <div className="contact-card">
            <h3 style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 500, fontSize: "1.2rem", color: "var(--ink)", margin: 0 }}>
              Anna Reichsöllner, BEd MEd
            </h3>
            <div className="contact-row">
              <div className="contact-ico">📞</div>
              <a href="tel:+436701902604">0670 190 26 04</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">✉️</div>
              <a href="mailto:info@einfachlernen-pongau.at">info@einfachlernen-pongau.at</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">📷</div>
              <span>einfachlernen_pongau</span>
            </div>
            <div className="contact-row">
              <div className="contact-ico">🌐</div>
              <a href="https://www.einfachlernen-pongau.at" target="_blank" rel="noopener noreferrer">www.einfachlernen-pongau.at</a>
            </div>
            <div className="contact-row">
              <div className="contact-ico">📍</div>
              <span>Bauernschmiedgasse 380<br />5531 Eben im Pongau</span>
            </div>
          </div>

          <div className="map-embed">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${OSM_BBOX}&layer=mapnik&marker=${OSM_MARKER}`}
              title="Standort von Einfach Lernen – Bauernschmiedgasse 380, 5531 Eben im Pongau"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="cta-sec" id="kennenlernen">
        <h2>Lust, mich <strong>kennenzulernen?</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Schreib mir eine Nachricht oder ruf einfach an – ich melde mich gerne bei dir zurück.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Nachricht schreiben</a>
          <a href="tel:+436701902604" className="btn btn-white">📞 Anrufen</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
