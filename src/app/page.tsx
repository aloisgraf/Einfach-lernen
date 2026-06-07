import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import { getBuchungsformularTexte, getWebsiteTexte } from "@/lib/einstellungen-store";
import SommerBuchung from "./SommerBuchung";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { RichText, RichParagraphs } from "@/components/RichText";
import { Metadata } from "next";
import { Raleway, Nunito } from "next/font/google";
import "./lernversum.css";

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
  title: "Einfach Lernen – Wo Lernen einfach wird",
  description: "Förderung in Deutsch, Mathe und bei Lese-Rechtschreibschwäche – für Kinder in der Volksschule und Mittelschule. Individuell, einfühlsam und mit klarem Plan.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
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

  // Mehrtägige Kurse (gruppe_id) werden nur angezeigt, solange JEDER Termin der
  // Gruppe noch frei ist – sonst könnte die automatische Buchung aller Tage nicht klappen.
  const ausgebuchteGruppen = new Set(
    Array.from(new Set(slotsWithPlaetze.filter((s) => s.gruppe_id).map((s) => s.gruppe_id!)))
      .filter((gruppeId) => slotsWithPlaetze.some((s) => s.gruppe_id === gruppeId && s.freie_plaetze <= 0))
  );

  // Ausgebuchte Termine werden nicht mehr angezeigt, sobald sie voll sind.
  const buchbareSlots = slotsWithPlaetze.filter(
    (s) => s.freie_plaetze > 0 && !(s.gruppe_id && ausgebuchteGruppen.has(s.gruppe_id))
  );

  const buchungComponent = <SommerBuchung slots={buchbareSlots} texte={formularTexte} />;
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>

      <LvHeader />

      {/* BANNER */}
      <div className="summer-banner">
        <div className="banner-text">
          <strong><RichText text={texte.banner.text} /></strong>
          <span>{texte.banner.subtext}</span>
        </div>
        <div className="banner-cta">
          <a href="#sommerkurse">{texte.banner.cta_label}</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-location">{texte.hero.location}</div>
          <h1><RichText text={texte.hero.titel_zeile1} /><br /><RichText text={texte.hero.titel_zeile2} /></h1>
          <div className="hero-slogan">{texte.hero.slogan}</div>
          <p className="hero-lead">
            <RichText text={texte.hero.lead} />
          </p>
          <div className="hero-ctas">
            <a href="#kontakt" className="btn btn-pine">{texte.hero.cta1_label}</a>
            <a href="#angebot" className="btn btn-outline">{texte.hero.cta2_label}</a>
          </div>
          <div className="hero-pills">
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--pine)" }} />{texte.hero.pill1}</div>
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--pine-light)" }} />{texte.hero.pill2}</div>
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--gold-dark)" }} />{texte.hero.pill3}</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-wrap">
            <div className="main-card">
              <div className="card-top">
                <div className="card-chip cc-pale">📖</div>
                <div className="card-chip cc-gold">✏️</div>
                <div className="card-chip cc-sand">🧮</div>
              </div>
              <h3>{texte.hero.karte_titel}</h3>
              <p>{texte.hero.karte_text}</p>
              <div className="prog-stack">
                <div className="prog-row">
                  <span className="prog-lbl">Lesekompetenz</span>
                  <div className="prog-track"><div className="prog-bar pb-1" /></div>
                  <span className="prog-val pv-1">+84%</span>
                </div>
                <div className="prog-row">
                  <span className="prog-lbl">Rechtschreiben</span>
                  <div className="prog-track"><div className="prog-bar pb-2" /></div>
                  <span className="prog-val pv-2">+70%</span>
                </div>
                <div className="prog-row">
                  <span className="prog-lbl">Rechnen</span>
                  <div className="prog-track"><div className="prog-bar pb-3" /></div>
                  <span className="prog-val pv-3">+76%</span>
                </div>
              </div>
            </div>
            <div className="float-tag ft-1">{texte.hero.tag1}</div>
            <div className="float-tag ft-2">{texte.hero.tag2}</div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* WILLKOMMEN */}
      <section className="sec" style={{ background: "var(--white)" }} id="willkommen">
        <div className="content-wrap" style={{ maxWidth: 680 }}>
          <span className="sec-kicker kk-pine">{texte.willkommen.kicker}</span>
          <RichParagraphs text={texte.willkommen.text} />
          <p style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 600, color: "var(--pine)", fontSize: "1.05rem" }}>{texte.willkommen.signatur}</p>
        </div>
      </section>

      <hr className="divider" />

      {/* SERVICES */}
      <section className="sec services" id="angebot">
        <div className="services-intro">
          <span className="sec-kicker kk-earth">{texte.angebot.kicker}</span>
          <h2 className="sec-title"><RichText text={texte.angebot.titel} /></h2>
          <p className="sec-sub">{texte.angebot.subtitel}</p>
        </div>
        <div className="svc-grid">
          <div className="svc-card sc-a" id="beratung">
            <div className="svc-icon si-a">🧑‍👧</div>
            <h3>{texte.angebot.karte1_titel}</h3>
            <p>{texte.angebot.karte1_text}</p>
            <a href="#kontakt" className="svc-btn sb-a">{texte.angebot.karte1_button}</a>
          </div>
          <div className="svc-card sc-b" id="lernanalyse">
            <div className="svc-icon si-b">🔍</div>
            <h3>{texte.angebot.karte2_titel}</h3>
            <p>{texte.angebot.karte2_text}</p>
            <a href="#kontakt" className="svc-btn sb-b">{texte.angebot.karte2_button}</a>
          </div>
          <div className="svc-card sc-c" id="legasthenie">
            <div className="svc-icon si-c">📚</div>
            <h3>{texte.angebot.karte3_titel}</h3>
            <p>{texte.angebot.karte3_text}</p>
            <a href="#kontakt" className="svc-btn sb-c">{texte.angebot.karte3_button}</a>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* SOMMERKURSE */}
      <section className="sec summer" id="sommerkurse">
        <div className="summer-layout">
          <div>
            <span className="sec-kicker kk-gold">{texte.sommerkurse.kicker}</span>
            <h2 className="sec-title"><RichText text={texte.sommerkurse.titel} /></h2>
            <p className="sec-sub">{texte.sommerkurse.subtitel}</p>
            <div className="why-list">
              <div className="why-item"><div className="why-icon wi-gold">☀️</div>{texte.sommerkurse.punkt1}</div>
              <div className="why-item"><div className="why-icon wi-pine">👥</div>{texte.sommerkurse.punkt2}</div>
              <div className="why-item"><div className="why-icon wi-earth">🎯</div>{texte.sommerkurse.punkt3}</div>
              <div className="why-item"><div className="why-icon wi-light">✅</div>{texte.sommerkurse.punkt4}</div>
            </div>
          </div>

          <div className="booking-box" id="booking">
            <div className="bk-head">
              <div className="bk-badge">{texte.sommerkurse.box_badge}</div>
              <span className="bk-title">{texte.sommerkurse.box_titel}</span>
            </div>
            {buchungComponent}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* WHEN */}
      <section className="sec when">
        <div className="when-wrap">
          <div>
            <span className="sec-kicker kk-soft">{texte.wann_hilft.kicker}</span>
            <h2 className="sec-title"><RichText text={texte.wann_hilft.titel} /></h2>
            <p className="sec-sub">{texte.wann_hilft.subtitel}</p>
            <div className="when-chips">
              <div className="chip"><div className="chip-ico">📝</div><p>{texte.wann_hilft.chip1}</p></div>
              <div className="chip"><div className="chip-ico">🔢</div><p>{texte.wann_hilft.chip2}</p></div>
              <div className="chip"><div className="chip-ico">😓</div><p>{texte.wann_hilft.chip3}</p></div>
              <div className="chip"><div className="chip-ico">🎯</div><p>{texte.wann_hilft.chip4}</p></div>
              <div className="chip"><div className="chip-ico">🏠</div><p>{texte.wann_hilft.chip5}</p></div>
              <div className="chip"><div className="chip-ico">🗺️</div><p>{texte.wann_hilft.chip6}</p></div>
            </div>
          </div>
          <div className="when-vis">
            <div className="wv">
              <svg className="wv-tree" width="100" height="116" viewBox="0 0 100 116" fill="none">
                <rect x="41" y="82" width="18" height="28" rx="7" fill="#7C5230" />
                <ellipse cx="50" cy="48" rx="28" ry="34" fill="#2D6A4F" />
                <ellipse cx="28" cy="62" rx="20" ry="25" fill="#52B788" />
                <ellipse cx="72" cy="62" rx="20" ry="25" fill="#52B788" />
                <ellipse cx="50" cy="74" rx="24" ry="18" fill="#2D6A4F" />
                <ellipse cx="50" cy="26" rx="16" ry="20" fill="#3d8a62" />
                <circle cx="76" cy="36" r="6" fill="#F4C842" opacity=".8" />
                <circle cx="24" cy="50" r="5" fill="#F4C842" opacity=".7" />
              </svg>
              <h4>{texte.wann_hilft.vision_titel}</h4>
              <p><RichText text={texte.wann_hilft.vision_text} /></p>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* PROCESS */}
      <section className="sec process">
        <div className="process-center">
          <span className="sec-kicker kk-pine">{texte.prozess.kicker}</span>
          <h2 className="sec-title"><RichText text={texte.prozess.titel} /></h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-n sn1">1</div>
            <div className="step-ico">📞</div>
            <h4>{texte.prozess.schritt1_titel}</h4>
            <p>{texte.prozess.schritt1_text}</p>
          </div>
          <div className="step">
            <div className="step-n sn2">2</div>
            <div className="step-ico">🔍</div>
            <h4>{texte.prozess.schritt2_titel}</h4>
            <p>{texte.prozess.schritt2_text}</p>
          </div>
          <div className="step">
            <div className="step-n sn3">3</div>
            <div className="step-ico">✏️</div>
            <h4>{texte.prozess.schritt3_titel}</h4>
            <p>{texte.prozess.schritt3_text}</p>
          </div>
          <div className="step">
            <div className="step-n sn4">4</div>
            <div className="step-ico">📊</div>
            <h4>{texte.prozess.schritt4_titel}</h4>
            <p>{texte.prozess.schritt4_text}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" id="kontakt">
        <h2><RichText text={texte.cta.titel} /></h2>
        <div className="tagline">{texte.cta.tagline}</div>
        <p><RichText text={texte.cta.text} /></p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">{texte.cta.button1_label}</a>
          <a href="#sommerkurse" className="btn btn-white">{texte.cta.button2_label}</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
