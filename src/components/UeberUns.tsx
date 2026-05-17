"use client";

import AnimateOnView from "./AnimateOnView";
import { CheckCircle2 } from "lucide-react";

const punkte = [
  "Ausgebildete Pädagoginnen und Pädagogen",
  "Individuelle Lernpläne für jeden Schüler",
  "Regelmäßige Fortschrittsberichte für Eltern",
  "Vertrauensvolle Atmosphäre ohne Leistungsdruck",
  "Enge Zusammenarbeit mit Schulen und Eltern",
  "Langjährige Erfahrung in der Region Pongau",
];

export default function UeberUns() {
  return (
    <section id="ueber-uns" className="py-24 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image / Illustration side */}
          <AnimateOnView direction="left">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center shadow-2xl">
                <div className="text-center text-white p-8">
                  <div className="text-8xl mb-4">🌱</div>
                  <p className="text-2xl font-bold mb-2">Wachsen & Lernen</p>
                  <p className="text-white/80 text-sm">
                    Jeder Schüler bringt eigene Stärken mit – wir helfen,
                    sie zu entfalten.
                  </p>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="text-3xl">⭐</div>
                <div>
                  <p className="font-bold text-[#1a1a2e] text-sm">4,9 / 5 Sterne</p>
                  <p className="text-xs text-gray-500">200+ Bewertungen</p>
                </div>
              </div>
            </div>
          </AnimateOnView>

          {/* Text side */}
          <AnimateOnView direction="right" delay={0.1}>
            <span className="inline-block px-4 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-4">
              Über uns
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-5 leading-tight">
              Lernen mit Herz und Methode
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Einfach Lernen Pongau wurde mit einer klaren Vision gegründet:
              Jedes Kind soll die Chance bekommen, sein volles Potenzial zu
              entfalten – unabhängig von Schulstufe oder Vorkenntnissen.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Unser Team aus erfahrenen Pädagoginnen und Pädagogen setzt auf
              individuelle Begleitung, moderne Lernmethoden und eine
              wertschätzende Atmosphäre, in der Kinder gerne kommen und mit
              Freude lernen.
            </p>

            <ul className="space-y-3">
              {punkte.map((punkt) => (
                <li key={punkt} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#52b788] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{punkt}</span>
                </li>
              ))}
            </ul>
          </AnimateOnView>
        </div>
      </div>
    </section>
  );
}
