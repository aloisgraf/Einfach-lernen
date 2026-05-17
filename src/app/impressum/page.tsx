import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Impressum | Einfach Lernen Pongau",
};

export default function Impressum() {
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
          <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-8">Impressum</h1>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                Angaben gemäß § 5 ECG
              </h2>
              <p>
                <strong>Einfach Lernen Pongau</strong><br />
                Musterstraße 1<br />
                5600 St. Johann im Pongau<br />
                Österreich
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">Kontakt</h2>
              <p>
                Telefon: +43 123 456 789<br />
                E-Mail: office@einfachlernen-pongau.at
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                Unternehmensgegenstand
              </h2>
              <p>
                Nachhilfe, Lernbegleitung und Bildungsdienstleistungen für
                Kinder, Jugendliche und Erwachsene.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                Haftungsausschluss
              </h2>
              <p>
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
                Haftung für die Inhalte externer Links. Für den Inhalt der
                verlinkten Seiten sind ausschließlich deren Betreiber
                verantwortlich.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
