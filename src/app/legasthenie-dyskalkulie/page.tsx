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
  title: "Legasthenie & Dyskalkulie | Einfach Lernen",
  description: "Förderung bei Lese-Rechtschreibschwäche und Rechenschwäche – individuell, einfühlsam und fundiert.",
};

export default function LegasthenieDyskalkuliePage() {
  return (
    <div className={`lv-page ${raleway.variable} ${nunito.variable}`}>
      <LvHeader />

      <section className="sec" style={{ background: "linear-gradient(150deg, var(--sand) 0%, #fdf6e8 55%, var(--pine-pale) 100%)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="sec-kicker kk-pine">Mein Training</span>
          <h1 className="sec-title">Legasthenie &amp; <strong>Dyskalkulie</strong></h1>
          <p className="sec-sub" style={{ margin: "0 auto" }}>Gezielte Förderung bei Lese-Rechtschreib- und Rechenschwäche – einfühlsam, strukturiert und individuell.</p>
        </div>
      </section>

      <hr className="divider" />

      {/* LRS */}
      <section className="sec" style={{ background: "var(--white)" }} id="lrs">
        <div className="content-wrap">
          <span className="sec-kicker kk-pine">Lese-Rechtschreibschwäche</span>
          <h2 className="sec-title">Förderung bei Lese-Rechtschreibschwäche</h2>

          <p>Nach einem kostenlosen Kennenlerngespräch (ca. 30 min), in dem du mir euer Anliegen schilderst, folgt die Testung der Lese- und Rechtschreibfertigkeiten deines Kindes mittels eines standardisierten Tests und Schriftproben deines Kindes. Basierend auf den Testergebnissen erstelle ich einen individuellen Förderplan, bzw. Förderkonzept.</p>

          <p>Wenn erwünscht folgt ein Beratungsgespräch bezüglich der Testergebnisse und ich stelle Übungen für zu Hause zusammen.*</p>

          <h3>Mein Angebot beinhaltet:</h3>
          <ul>
            <li>Anamnesegespräch mit dir (ca. 1 Stunde)</li>
            <li>individuelle Fehleranalyse aus den Schriftproben deines Kindes</li>
            <li>Testung der Lese- und Rechtschreibfertigkeiten deines Kindes mittels eines standardisierten Tests</li>
            <li>Pädagogisches Gutachten (wird auf expliziten Wunsch schriftlich erstellt)</li>
            <li>Besprechung der Ergebnisse</li>
          </ul>

          <p>Ich stelle ein individuelles Trainingskonzept für dein Kind zusammen, basierend auf den Ergebnissen der pädagogischen Diagnostik und des Anamnesegesprächs.*</p>

          <p>Die Förderung findet meist einmal pro Woche für 50 Minuten statt. Wichtig ist der regelmäßige Besuch bei mir. Damit eine Verbesserung der Situation optimal gelingt, ist es notwendig, dass die Eltern (oder Lernpartner) ausreichend Zeit haben, konsequent über einen längeren Zeitraum mit dem Kind zu üben.</p>

          <p>Es ist mir wichtig, dass auch du deinem Kind zu Hause gut weiterhelfen kannst. Ich unterstütze dich gerne, damit das Üben auch zu Hause gut klappt.</p>

          <p>Im Preis ist eine Einheit pro Woche, Übungsmaterial für die wöchentliche Hausübung, Telefonate mit Lehrerinnen und Lehrern und die Beratung der Eltern inkludiert.</p>

          <div className="price-box">Deine Investition: € 95,- / 50 Minuten**</div>

          <h3>Ablauf</h3>

          <p className="fussnote">*Investition für ein pädagogisches Gutachten: € 250,- (Anamnesegespräch, standardisierter Lese- Rechtschreibtest, qualitative Fehleranalyse, Erstellung des pädagogischen Gutachtens)</p>

          <p className="fussnote">**Bei einer verbindlichen Anmeldung zur Förderung sind ein Anamnesegespräch, ein standardisierter Lese- Rechtschreibtest und eine qualitative Fehleranalyse bereits enthalten. Das pädagogische Gutachten erfolgt dabei mündlich im Zuge eines Informationsgespräches.</p>

          <p>Manche Kinder sind eher unmusikalisch oder eher unsportlich, manche Kinder sind im Bereich der Schriftsprache einfach nicht so begabt wie in anderen Bereichen. Das Lesen lernen und/oder die Rechtschreibung fallen ihnen besonders schwer.</p>

          <p>Melde dich gern bei mir für ein kostenloses Beratungsgespräch, wenn du vermutest, dass dein Kind eine Lese-Rechtschreibschwäche hat. Anzeichen könnten Schwierigkeiten in diesen Bereichen sein:</p>

          <ul>
            <li>Bilden von Reimen</li>
            <li>Silbenklatschen</li>
            <li>schnellen Benennen von Buchstaben</li>
            <li>&quot;Zusammenlauten&quot;</li>
            <li>Lesen (liest langsam und stockend, lässt Buchstaben aus, verdreht Silben und Buchstaben ...)</li>
            <li>Verstehen von Sätzen und Texten</li>
            <li>der Lesemotivation</li>
            <li>Lernen und Anwenden von Rechtschreibregeln</li>
            <li>Schreiben von Wörtern</li>
          </ul>
        </div>
      </section>

      <hr className="divider" />

      {/* Rechenschwäche */}
      <section className="sec" style={{ background: "var(--pine-pale)" }} id="rechenschwaeche">
        <div className="content-wrap">
          <span className="sec-kicker kk-earth">Rechenschwäche</span>
          <h2 className="sec-title">Förderung bei Rechenschwäche</h2>

          <p>Dein Kind zählt in der 2. Klasse, statt zu rechnen? Es fällt deinem Kind schwer, das 1x1 zu lernen?</p>

          <p>Besonders im Bereich Mathematik ist es wichtig, frühzeitig mit einer Förderung anzusetzen und die Basis zu festigen. Die Lücke wird immer größer, den Kindern macht Mathe keinen Spaß mehr, sie sind frustriert.</p>

          <p>Oft haben sich Kinder eigene Strategien oder &ldquo;Tricks&rdquo; zurechtgelegt, die leider nicht immer funktionieren- dann stimmt das Ergebnis nicht. Wichtig ist, deinem Kind keine Rechenwege oder Methoden aufzuzwängen. Ich werde mit deinem Kind gemeinsam einen Weg finden, wie es sich zurechtfindet und Mathe meistert!</p>

          <p>Ich möchte dein Kind und dich unterstützen. Die Förderung funktioniert am besten, wenn auch du zu Hause weißt, worauf es ankommt!</p>

          <p>Wenn du bei deinem Kind folgende Schwierigkeiten beobachtest, könnte eine Rechenschwäche vorliegen.</p>

          <ul>
            <li>Rechnen ohne Unterstützung (Plättchen, Finger...)</li>
            <li>Rechentempo (sehr langsam)</li>
            <li>Rechnen über oder unter den Zehner</li>
            <li>Verstehen des Stellenwerts</li>
            <li>Schreiben von Zahlen</li>
            <li>Zerlegen von Zahlen</li>
            <li>Lösen von Sachaufgaben</li>
            <li>Lernen des 1x1</li>
          </ul>

          <p>Nach einem kostenlosen Kennenlerngespräch (ca. 30 min), in dem du mir euer Anliegen schilderst, erstelle ich für dein Kind zusätzlich zur standardisierten Testung eine individuelle Lernstandserhebung. Damit ich weiß, wo ich mit meiner Förderung ansetzen muss ist es wichtig, dass ich weiß, wie dein Kind rechnet.</p>

          <p>Basierend auf den Testergebnissen arbeite ich einen individuellen Förderplan, bzw. ein Förderkonzept aus.</p>

          <p>Wenn erwünscht folgt ein Beratungsgespräch bezüglich der Testergebnisse und ich stelle Übungen für zu Hause zusammen.*</p>

          <h3>Mein Angebot beinhaltet:</h3>
          <ul>
            <li>Anamnesegespräch mit dir (ca. 1 Stunde)</li>
            <li>Lernstandserhebung anhand einer standardisierten Testung</li>
            <li>Pädagogisches Gutachten (wird auf expliziten Wunsch schriftlich erstellt)</li>
            <li>Besprechung der Ergebnisse</li>
          </ul>

          <p>Ich stelle ein individuelles Trainingskonzept für dein Kind zusammen, basierend auf den Ergebnissen der pädagogischen Diagnostik und des Anamnesegesprächs.*</p>

          <p>Die Förderung findet meist einmal pro Woche für 50 Minuten statt. Wichtig ist der regelmäßige Besuch bei mir. Damit eine Verbesserung der Situation optimal gelingt, ist es notwendig, dass die Eltern (oder Lernpartner) ausreichend Zeit haben, konsequent über einen längeren Zeitraum mit dem Kind zu üben.</p>

          <p>Im Preis ist eine Einheit pro Woche, Übungsmaterial für die wöchentliche Hausübung, Telefonate mit Lehrerinnen und Lehrern und die Beratung der Eltern inkludiert.</p>

          <div className="price-box">Deine Investition: € 95,- / 50 Minuten**</div>

          <h3>Ablauf</h3>

          <p className="fussnote">*Investition für ein pädagogisches Gutachten: € 250,- (Anamnesegespräch, standardisierte Testung, qualitative Fehleranalyse, Erstellung des pädagogischen Gutachtens)</p>

          <p className="fussnote">**Bei einer verbindlichen Anmeldung zur Förderung sind ein Anamnesegespräch, ein standardisierter Test der Rechenfertigkeiten, bzw. des Verständnisses und eine qualitative Fehleranalyse im Beitrag bereits enthalten. Das pädagogische Gutachten erfolgt dabei mündlich im Zuge eines Informationsgespräches.</p>
        </div>
      </section>

      <hr className="divider" />

      {/* AFS-Computertest */}
      <section className="sec" style={{ background: "var(--white)" }} id="afs-test">
        <div className="content-wrap">
          <span className="sec-kicker kk-soft">Diagnostik</span>
          <h2 className="sec-title">AFS-Computertest</h2>

          <p>Als diplomierte Legasthenie- und Dyskalkulietrainerin in Ausbildung setze ich das AFS- Computertestverfahren im Rahmen einer pädagogischen Förderdiagnostik zur Feststellung und Kategorisierung einer eventuell vorliegenden Legasthenie/LRS oder Dyskalkulie/Rechenschwäche ein.</p>

          <p>Zuerst wird spielerisch überprüft, ob und wie gut das Kind seine Aufmerksamkeit halten kann. Dann werden die Sinneswahrnehmungen getestet. Bei verschiedenen Aufgaben wird die Verarbeitung von visuellen und auditiven Eindrücken sowie die Raumwahrnehmung überprüf. So erkennt man, ob das Kind z.B. Schwierigkeiten hat, Unterschiede zu sehen bzw. zu hören, ob es Gesehenes oder Gehörtes merken kann oder oder ob mehrere Bereiche betroffen sind.</p>

          <p>Danach folgen Fragen zu den Symptomen. Dazu werden die Schriftproben deines Kindes analysiert. Auf Basis der Testergebnisse, der Analyse der Schriftproben und des Anamnesegesprächs erstelle ich ein pädagogisches Gutachten und einen individuellen Trainingsplan. So erfährst du, in welchen Bereichen dein Kind eine Förderung benötigt und wie wir gemeinsam mit deinem Kind erfolgreich trainieren können.</p>
        </div>
      </section>

      <section className="cta-sec" id="kontakt">
        <h2>Du vermutest eine <strong>Lernschwäche?</strong></h2>
        <div className="tagline">Wo Lernen einfach wird.</div>
        <p>Vereinbare ein kostenloses, unverbindliches Kennenlerngespräch – ich nehme mir gerne Zeit für dein Anliegen.</p>
        <div className="cta-btns">
          <a href="mailto:info@einfachlernen-pongau.at" className="btn btn-gold">✉️ Gespräch vereinbaren</a>
          <a href="/faq" className="btn btn-white">❓ Häufige Fragen</a>
        </div>
      </section>

      <LvFooter />
    </div>
  );
}
