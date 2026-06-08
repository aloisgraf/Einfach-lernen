import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import { getBuchungsformularTexte, getWebsiteTexte } from "@/lib/einstellungen-store";
import SommerBuchung from "./SommerBuchung";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
import { RichText, RichParagraphs, splitItems, splitBlocks } from "@/components/RichText";
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
          <h1><RichText text={texte.hero.heading} /></h1>
          <div className="hero-slogan">{texte.hero.slogan}</div>
          <p className="hero-lead">
            <RichText text={texte.hero.lead} />
          </p>
          <div className="hero-ctas">
            {splitItems(texte.hero.buttons).map((label, i) => (
              <a key={i} href={i === 0 ? "#kontakt" : "#angebot"} className={`btn ${i === 0 ? "btn-pine" : "btn-outline"}`}>{label}</a>
            ))}
          </div>
          <div className="hero-pills">
            {splitItems(texte.hero.pills).map((pill, i) => (
              <div key={i} className="hero-pill">
                <div className="hero-pill-dot" style={{ background: i === 0 ? "var(--pine)" : i === 1 ? "var(--pine-light)" : "var(--gold-dark)" }} />
                {pill}
              </div>
            ))}
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
          <h2 className="sec-title"><RichText text={texte.angebot.heading} /></h2>
          <p className="sec-sub">{texte.angebot.lead}</p>
        </div>
        <div className="svc-grid">
          {splitBlocks(texte.angebot.cards).map((cardText, i) => {
            const [titel, text, button] = splitItems(cardText);
            const icons = ['🧑‍👧', '🔍', '📚'];
            const cardClass = ['sc-a', 'sc-b', 'sc-c'][i];
            const btnClass = ['sb-a', 'sb-b', 'sb-c'][i];
            const iconClass = ['si-a', 'si-b', 'si-c'][i];
            const ids = ['beratung', 'lernanalyse', 'legasthenie'];
            return (
              <div key={i} className={`svc-card ${cardClass}`} id={ids[i]}>
                <div className={`svc-icon ${iconClass}`}>{icons[i]}</div>
                <h3>{titel}</h3>
                <p>{text}</p>
                <a href="#kontakt" className={`svc-btn ${btnClass}`}>{button}</a>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      {/* SOMMERKURSE */}
      <section className="sec summer" id="sommerkurse">
        <div className="summer-layout">
          <div>
            <span className="sec-kicker kk-gold">{texte.sommerkurse.kicker}</span>
            <h2 className="sec-title"><RichText text={texte.sommerkurse.heading} /></h2>
            <p className="sec-sub">{texte.sommerkurse.subtitel}</p>
            <div className="why-list">
              {splitBlocks(texte.sommerkurse.points).map((punkt, i) => {
                const icons = ['☀️', '👥', '🎯', '✅'];
                const iconClasses = ['wi-gold', 'wi-pine', 'wi-earth', 'wi-light'];
                return (
                  <div key={i} className="why-item">
                    <div className={`why-icon ${iconClasses[i]}`}>{icons[i]}</div>
                    {punkt}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="booking-box" id="booking">
            <div className="bk-head">
              <div className="bk-badge">{texte.sommerkurse.box_badge}</div>
              <span className="bk-title">{texte.sommerkurse.box_title}</span>
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
            <h2 className="sec-title"><RichText text={texte.wann_hilft.heading} /></h2>
            <p className="sec-sub">{texte.wann_hilft.subtitel}</p>
            <div className="when-chips">
              {splitBlocks(texte.wann_hilft.chips).map((chip, i) => {
                const icons = ['📝', '🔢', '😓', '🎯', '🏠', '🗺️'];
                return (
                  <div key={i} className="chip">
                    <div className="chip-ico">{icons[i]}</div>
                    <p>{chip}</p>
                  </div>
                );
              })}
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
              <h4>{texte.wann_hilft.vision_heading}</h4>
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
          <h2 className="sec-title"><RichText text={texte.prozess.heading} /></h2>
        </div>
        <div className="steps">
          {splitBlocks(texte.prozess.steps).map((stepBlock, i) => {
            const [titel, text] = splitItems(stepBlock);
            const icons = ['📞', '🔍', '✏️', '📊'];
            const stepClasses = ['sn1', 'sn2', 'sn3', 'sn4'];
            return (
              <div key={i} className="step">
                <div className={`step-n ${stepClasses[i]}`}>{i + 1}</div>
                <div className="step-ico">{icons[i]}</div>
                <h4>{titel}</h4>
                <p>{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" id="kontakt">
        <h2><RichText text={texte.cta.heading} /></h2>
        <div className="tagline">{texte.cta.tagline}</div>
        <p><RichText text={texte.cta.text} /></p>
        <div className="cta-btns">
          {splitItems(texte.cta.buttons).map((label, i) => (
            <a key={i} href={i === 0 ? "mailto:info@einfachlernen-pongau.at" : "#sommerkurse"} className={`btn ${i === 0 ? "btn-gold" : "btn-white"}`}>{label}</a>
          ))}
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
