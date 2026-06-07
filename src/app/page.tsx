import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import { getBuchungsformularTexte } from "@/lib/einstellungen-store";
import SommerBuchung from "./SommerBuchung";
import LvHeader from "@/components/LvHeader";
import LvFooter from "@/components/LvFooter";
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
  const [slots, buchungen, formularTexte] = await Promise.all([
    getFreigegebeneSlots(),
    getAlleBuchungen(),
    getBuchungsformularTexte(),
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
          <strong>☀️ Sommerkurse 2026 – Jetzt buchbar!</strong>
          <span>Kleine Gruppen · Juli &amp; August · Eben im Pongau · Wenige Plätze frei!</span>
        </div>
        <div className="banner-cta">
          <a href="#sommerkurse">Platz sichern →</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-location">🌿 Eben im Pongau · Salzburg</div>
          <h1>Weniger Stress.<br /><strong>Mehr Erfolg.</strong></h1>
          <div className="hero-slogan">Wo Lernen einfach wird.</div>
          <p className="hero-lead">
            Förderung in Deutsch, Mathe und bei Lese-Rechtschreibschwäche –
            für Kinder in der Volksschule und Mittelschule.{" "}
            <strong>Individuell, einfühlsam und mit einem klaren Plan.</strong>
          </p>
          <div className="hero-ctas">
            <a href="#kontakt" className="btn btn-pine">🗓 Erstgespräch anfragen</a>
            <a href="#angebot" className="btn btn-outline">Angebot ansehen</a>
          </div>
          <div className="hero-pills">
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--pine)" }} />Volksschule &amp; Mittelschule</div>
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--pine-light)" }} />Legasthenie &amp; Dyskalkulie</div>
            <div className="hero-pill"><div className="hero-pill-dot" style={{ background: "var(--gold-dark)" }} />Sommerkurse</div>
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
              <h3>Fortschritte dieser Woche</h3>
              <p>Schritt für Schritt zu mehr Sicherheit und Freude am Lernen.</p>
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
            <div className="float-tag ft-1">🌟 Individuell gefördert</div>
            <div className="float-tag ft-2">👨‍👩‍👧 Eltern einbezogen</div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* WILLKOMMEN */}
      <section className="sec" style={{ background: "var(--white)" }} id="willkommen">
        <div className="content-wrap" style={{ maxWidth: 680 }}>
          <span className="sec-kicker kk-pine">Herzlich willkommen</span>
          <p>Hausübungen sind für dein Kind schwierig, die Hausübungssituation ist immer angespannt?</p>
          <p>Du weißt nicht, wie du deinem Kind am besten helfen kannst?</p>
          <p>Lesen, Schreiben oder Rechnen ist für dein Kind anstrengend und mühsam?</p>
          <p>Egal wie oft Lernwörter geübt werden, dein Kind kann sie sich nicht merken oder einfache Rechnungen werden immer wieder falsch gerechnet?</p>
          <p>Dein Kind hört sich sehr gern Geschichten an, selber lesen mag es aber nicht?</p>
          <p>Dann bist du bei mir genau richtig. Mit meiner Förderung und Elternberatung legen wir gemeinsam eine solide Basis für eine entspannte und erfolgreiche Schulzeit.</p>
          <p>Lasst uns gemeinsam &quot;Einfach Lernen&quot;.</p>
          <p>Als Primarstufenpädagogin, Betreuerin für Lese-Rechtschreib-Schwäche und diplomierte Legasthenie- und Dyskalkulietrainerin biete ich ab sofort Unterstützung.</p>
          <p>Ich begleite dich und dein Kind individuell und transparent auf dem Weg durch den Zahlen- und Buchstabendschungel um euren Weg durch die Schulzeit zu erleichtern.</p>
          <p>Ich freue mich darauf, Dich kennenzulernen.</p>
          <p style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 600, color: "var(--pine)", fontSize: "1.05rem" }}>Anna Reichsöllner</p>
        </div>
      </section>

      <hr className="divider" />

      {/* SERVICES */}
      <section className="sec services" id="angebot">
        <div className="services-intro">
          <span className="sec-kicker kk-earth">Mein Angebot</span>
          <h2 className="sec-title">Was ich für <strong>euer Kind</strong> tue</h2>
          <p className="sec-sub">Von der ersten Beratung bis zum gezielten Training – mit klaren Schritten, offener Kommunikation und echtem Interesse am Kind.</p>
        </div>
        <div className="svc-grid">
          <div className="svc-card sc-a" id="beratung">
            <div className="svc-icon si-a">🧑‍👧</div>
            <h3>Elternberatung</h3>
            <p>Wenn Lernen zuhause zur Belastung wird. Ich gebe Eltern Klarheit und Strategien – verständlich, ohne Fachchinesisch, mit Blick aufs große Ganze.</p>
            <a href="#kontakt" className="svc-btn sb-a">Mehr erfahren →</a>
          </div>
          <div className="svc-card sc-b" id="lernanalyse">
            <div className="svc-icon si-b">🔍</div>
            <h3>Lernstandsanalyse</h3>
            <p>Bevor wir fördern, schauen wir genau hin. Eine fundierte Analyse zeigt, wo das Kind wirklich steht – und wo wir konkret ansetzen.</p>
            <a href="#kontakt" className="svc-btn sb-b">Zur Analyse →</a>
          </div>
          <div className="svc-card sc-c" id="legasthenie">
            <div className="svc-icon si-c">📚</div>
            <h3>Legasthenie &amp; Dyskalkulie</h3>
            <p>Gezielte Hilfe bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und auf jedes Kind individuell abgestimmt.</p>
            <a href="#kontakt" className="svc-btn sb-c">Mehr zum Training →</a>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* SOMMERKURSE */}
      <section className="sec summer" id="sommerkurse">
        <div className="summer-layout">
          <div>
            <span className="sec-kicker kk-gold">Sommerkurse 2026</span>
            <h2 className="sec-title">Die Ferien <strong>sinnvoll nutzen</strong> ☀️</h2>
            <p className="sec-sub">Kein Druck, keine Noten – dafür echte Fortschritte. Kleine Gruppen, spielerisches Lernen, gezielte Förderung.</p>
            <div className="why-list">
              <div className="why-item"><div className="why-icon wi-gold">☀️</div>Entspannte Atmosphäre – Kinder lernen ohne Schulstress leichter</div>
              <div className="why-item"><div className="why-icon wi-pine">👥</div>Kleine Gruppen – intensive, persönliche Begleitung</div>
              <div className="why-item"><div className="why-icon wi-earth">🎯</div>Gezielt dort fördern, wo wirklich Lücken bestehen</div>
              <div className="why-item"><div className="why-icon wi-light">✅</div>Entspannt ins neue Schuljahr starten</div>
            </div>
          </div>

          <div className="booking-box" id="booking">
            <div className="bk-head">
              <div className="bk-badge">☀️ Sommer 2026</div>
              <span className="bk-title">Kursplatz buchen</span>
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
            <span className="sec-kicker kk-soft">Für wen?</span>
            <h2 className="sec-title">Wann <strong>Einfach Lernen</strong> hilft</h2>
            <p className="sec-sub">Egal ob Deutsch, Mathe oder Lernen allgemein – ich finde heraus, wo dein Kind steht und was es wirklich braucht.</p>
            <div className="when-chips">
              <div className="chip"><div className="chip-ico">📝</div><p>Lesen &amp; Rechtschreiben fällt schwer</p></div>
              <div className="chip"><div className="chip-ico">🔢</div><p>Unsicherheit beim Rechnen</p></div>
              <div className="chip"><div className="chip-ico">😓</div><p>Hausaufgaben werden zum Streit</p></div>
              <div className="chip"><div className="chip-ico">🎯</div><p>Konzentrationsschwierigkeiten</p></div>
              <div className="chip"><div className="chip-ico">🏠</div><p>Überforderung im Familienalltag</p></div>
              <div className="chip"><div className="chip-ico">🗺️</div><p>Wunsch nach klarem Förderweg</p></div>
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
              <h4>Jedes Kind kann lernen.</h4>
              <p>Manchmal braucht es nur<br />den richtigen Weg dorthin.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* PROCESS */}
      <section className="sec process">
        <div className="process-center">
          <span className="sec-kicker kk-pine">So geht&apos;s los</span>
          <h2 className="sec-title">In <strong>vier Schritten</strong> zum Erfolg</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-n sn1">1</div>
            <div className="step-ico">📞</div>
            <h4>Elternberatung</h4>
            <p>Erstes Gespräch – offen, kostenlos, ohne Druck.</p>
          </div>
          <div className="step">
            <div className="step-n sn2">2</div>
            <div className="step-ico">🔍</div>
            <h4>Lernstandsanalyse</h4>
            <p>Wo steht dein Kind wirklich? Wir schauen genau hin.</p>
          </div>
          <div className="step">
            <div className="step-n sn3">3</div>
            <div className="step-ico">✏️</div>
            <h4>Individuelle Förderung</h4>
            <p>Maßgeschneidertes Training – spielerisch und effektiv.</p>
          </div>
          <div className="step">
            <div className="step-n sn4">4</div>
            <div className="step-ico">📊</div>
            <h4>Regelmäßige Rückmeldung</h4>
            <p>Eltern bleiben immer informiert – ehrlich und klar.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" id="kontakt">
        <h2>Bereit für den ersten Schritt? <strong>Melden Sie sich!</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Starte mit einer unverbindlichen <strong>Elternberatung</strong> –<br />egal ob Deutsch, Mathe oder Lernen allgemein.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Erstgespräch anfragen</a>
          <a href="#sommerkurse" className="btn btn-white">☀️ Sommerkurs buchen</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
