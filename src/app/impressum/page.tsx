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
                Informationspflicht laut §5 E-Commerce Gesetz, §14 Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz
              </h2>
              <p>
                <strong>Einfach Lernen</strong><br />
                Anna Reichsöllner<br />
                Bauernschmiedgasse 380<br />
                5531 Eben im Pongau
              </p>
              <p>
                Tel.: 0670 1902604<br />
                E-Mail: info@einfachlernen-pongau.at
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                Streitbeilegung
              </h2>
              <p>
                Nach geltendem Recht sind wir verpflichtet auf die Existenz der europäischen Online-Streitbeilegungs-
                Plattform hinzuweisen. Darüber hinaus weisen wir darauf hin, dass wir an einem freiwilligen
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht teilnehmen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">
                Bildquellen
              </h2>
              <p>
                Anna Reichsöllner<br />
                Canva
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
