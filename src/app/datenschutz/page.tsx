import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Datenschutz | Einfach Lernen Pongau",
};

export default function Datenschutz() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2d6a4f] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-8">Datenschutzerklärung</h1>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">1. Verantwortlicher</h2>
              <p>
                Einfach Lernen Pongau<br />
                Musterstraße 1, 5600 St. Johann im Pongau<br />
                E-Mail: office@einfachlernen-pongau.at
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                2. Erhobene Daten bei der Terminbuchung
              </h2>
              <p>
                Bei der Terminbuchung verarbeiten wir folgende personenbezogene Daten:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Vor- und Nachname (Elternteil)</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Name des Kindes und Schulstufe</li>
                <li>Angaben zu Stärken und Lernbedarf des Kindes</li>
                <li>Gewählter Termin (Zeitslot)</li>
              </ul>
              <p className="mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung /
                vorvertragliche Maßnahmen).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">3. Speicherdauer</h2>
              <p>
                Eure Daten werden ausschließlich zur Abwicklung der Terminbuchung
                verwendet. Die Daten werden nach Abschluss des Kurses und Ablauf
                der gesetzlichen Aufbewahrungsfristen (in der Regel 7 Jahre für
                buchhalterisch relevante Unterlagen) gelöscht. Auf Wunsch erfolgt
                eine frühere Löschung, soweit keine gesetzliche Aufbewahrungspflicht
                besteht.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">4. Weitergabe an Dritte</h2>
              <p>
                Eure Daten werden nicht an unbefugte Dritte weitergegeben. Folgende
                Auftragsverarbeiter (Art. 28 DSGVO) werden eingesetzt:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Supabase Inc.</strong> (USA) – Datenbankdienst für die
                  Speicherung von Buchungsdaten. Der Datentransfer in die USA erfolgt
                  auf Basis der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c
                  DSGVO). Datenschutzinformationen:{" "}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2d6a4f] underline">
                    supabase.com/privacy
                  </a>
                </li>
                <li>
                  <strong>Resend Inc.</strong> (USA) – E-Mail-Dienst zur Weiterleitung
                  von Buchungsbenachrichtigungen an uns. Dabei werden Name, E-Mail
                  und Buchungsdetails übermittelt. Datenschutzinformationen:{" "}
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#2d6a4f] underline">
                    resend.com/legal/privacy-policy
                  </a>
                </li>
                <li>
                  <strong>Render Inc.</strong> (USA) – Hosting-Dienst für diese
                  Website. Server-Logs (IP-Adresse, Zeitstempel) werden technisch
                  notwendig verarbeitet. Datenschutzinformationen:{" "}
                  <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2d6a4f] underline">
                    render.com/privacy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">5. Cookies und lokaler Speicher</h2>
              <p>
                Diese Website verwendet technisch notwendige Session-Cookies für den
                Admin-Bereich (nur für Betreiber, nicht für Besucher). Es werden keine
                Tracking- oder Werbe-Cookies eingesetzt.
              </p>
              <p className="mt-2">
                Das Silbenspiel speichert den Spielfortschritt (abgeschlossene Wörter)
                lokal in Ihrem Browser (<em>localStorage</em>). Diese Daten verlassen
                nicht Ihren Browser und werden nicht an uns übertragen. Sie können
                den Speicher jederzeit im Browser löschen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">6. Eure Rechte</h2>
              <p>Ihr habt das Recht auf:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Auskunft über eure gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-2">
                Zur Ausübung eurer Rechte oder bei Fragen zum Datenschutz wendet
                euch bitte an:{" "}
                <a href="mailto:office@einfachlernen-pongau.at" className="text-[#2d6a4f] underline">
                  office@einfachlernen-pongau.at
                </a>
              </p>
              <p className="mt-2">
                Ihr habt außerdem das Recht, bei der österreichischen
                Datenschutzbehörde (
                <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-[#2d6a4f] underline">
                  dsb.gv.at
                </a>
                ) eine Beschwerde einzureichen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">7. Datensicherheit</h2>
              <p>
                Wir setzen technische und organisatorische Maßnahmen ein, um eure
                Daten vor unbefugtem Zugriff zu schützen. Die Übertragung erfolgt
                ausschließlich über verschlüsselte HTTPS-Verbindungen.
              </p>
            </section>

            <p className="text-xs text-gray-400 mt-8">Stand: Juni 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
