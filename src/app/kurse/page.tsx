import { Suspense } from "react";
import KursListe from "./KursListe";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurse & Termine | Einfach Lernen Pongau",
  description:
    "Alle aktuellen Kurse und Termine auf einen Blick. Jetzt Platz sichern!",
};

export default function KursePage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#f0faf4] to-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-4">
            Kursübersicht
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a1a2e] mb-4">
            Alle Kurse & Termine
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Wählt den passenden Kurs und sichert euren Platz direkt online.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <KursListe />
      </Suspense>
    </div>
  );
}
