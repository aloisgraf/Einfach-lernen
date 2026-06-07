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
  title: "FAQ | Einfach Lernen",
  description: "Häufig gestellte Fragen zu Testung, Schriftproben und Diagnostik bei Einfach Lernen.",
};

const faqs = [
  {
    frage: "Womit werden die Lese- Rechtschreib- und Rechenfertigkeiten meines Kindes getestet?",
    antwort: [
      "Meine Ausbildung zur Betreuerin für Lese-Rechtschreibschwäche befähigt mich, den  SLRT-II einzusetzen. Dieser standardisierte Test besteht aus einem Leseteil und einem Rechtschreibteil. Er wird teilweise auch von PsychologInnen zur Feststellung einer Legasthenie eingesetzt.",
      "In Mathematik verwende ich Kalkulie, einem Diagnose- und Trainingsprogramm für rechenschwache Kinder und erstelle zudem individualisierte Lernstandserhebungen basierend auf den Informationen, die ich von dir beim Kennenlerngespräch bekomme.",
      "Zusätzlich dazu wird der AFS-Computertest durchgeführt um zu erkennen ob eine Legasthenie oder Dyskalkulie vorliegt.",
    ],
  },
  {
    frage: "Welche Schriftproben soll ich mitbringen?",
    antwort: [
      "Bring bitte Schriftstücke mit wie ein Schulheft, Hausübungsheft oder Diktate. Am besten ist ein Heft mit frei geschriebenen Texten.",
      "Im Bereich Mathematik bring bitte Rechenproben mit, wie ein Schulheft, Hausübungsheft, Kopien von Tests oder Lernzielkontrollen.",
    ],
  },
  {
    frage: "Wie lange dauert die Testung?",
    antwort: [
      "In der Regel schaffen die Kinder die Austestung in einer Einheit. Es kann vorkommen, dass der AFS Test, die Testung mittels SLRTII oder Kalkulie auf zwei Einheiten aufgeteilt wird.",
    ],
  },
  {
    frage: "Wer kann Legasthenie und Dyskalkulie diagnostizieren?",
    antwort: [
      "Ich kann aufgrund meines pädagogischen Hintergrunds keine klinisch-psychologischen Diagnosen gemäß ICD-11/DSM-5 stellen, da die Abklärung der kognitiven Leistungsfähigkeit (Intelligenzdiagnostik) nicht angeboten werden darf.",
      "In meinem pädagogischen Gutachten findest du keine spezifischen Diagnoseschlüssel (z.B. ICD-10: F81.0 Lese- und Rechtschreibstörung, F81.1 Isolierte Rechtschreibstörung, F81.2 Rechenstörung, F81.3 Kombinierte Störung schulischer Fertigkeiten). Stattdessen werden in der pädagogischen Diagnostik Lese- und/oder Rechtschreibschwierigkeiten oder Rechenschwierigkeiten anhand normierter Tests beschrieben. Die von mir durchgeführten Testungen basieren jedoch hauptsächlich auf denselben standardisierten Verfahren, die auch in der klinisch-psychologischen Diagnostik zum Einsatz kommen.",
    ],
  },
];

export default function FaqPage() {
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">Häufig gestellt</span>
          <h1 className="sec-title">FAQ&apos;s</h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>Antworten auf Fragen, die mir am häufigsten gestellt werden.</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="sec" style={{ background: "var(--white)" }}>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item" key={i} {...(i === 0 ? { open: true } : {})}>
              <summary>{f.frage}</summary>
              <div className="faq-a">
                {f.antwort.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2>Noch Fragen offen? <strong>Melde dich gerne!</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Ich beantworte deine Fragen gern persönlich – unverbindlich und in Ruhe.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Frage stellen</a>
          <a href="/kontakt" className="btn btn-white">📍 Kontakt</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
