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
                2. Erhobene Daten bei der Kursanmeldung
              </h2>
              <p>
                Bei der Kursanmeldung verarbeiten wir folgende personenbezogene Daten:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Vor- und Nachname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Geburtsdatum des Kindes (optional)</li>
                <li>Kurs- und Terminauswahl</li>
                <li>Freiwillige Mitteilungen im Nachrichtenfeld</li>
              </ul>
              <p className="mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung /
                vorvertragliche Maßnahmen).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">3. Speicherung</h2>
              <p>
                Eure Daten werden ausschließlich zur Abwicklung der Kursanmeldung
                verwendet und nicht an Dritte weitergegeben. Die Daten werden nach
                Abschluss des Kurses und Ablauf gesetzlicher Aufbewahrungsfristen
                gelöscht.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">4. Eure Rechte</h2>
              <p>Ihr habt das Recht auf:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Auskunft über eure gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-2">
                Bei Fragen: office@einfachlernen-pongau.at
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">5. Hosting</h2>
              <p>
                Diese Website wird über Vercel gehostet. Vercel erhebt
                technisch notwendige Daten (Server-Logs). Weitere Informationen
                unter{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2d6a4f] underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
