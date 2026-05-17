"use client";

import AnimateOnView from "./AnimateOnView";
import { BookOpen, Users, Trophy, Heart, Clock, MapPin } from "lucide-react";

const leistungen = [
  {
    icon: BookOpen,
    title: "Fachliche Nachhilfe",
    description:
      "Gezielte Förderung in Mathematik, Deutsch, Englisch und weiteren Fächern – von der Volksschule bis zur Matura.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Kleine Gruppen",
    description:
      "Maximal 6 Kinder pro Gruppe für optimale individuelle Betreuung und persönlichen Lernerfolg.",
    color: "bg-[#f0faf4] text-[#2d6a4f]",
  },
  {
    icon: Trophy,
    title: "Prüfungsvorbereitung",
    description:
      "Intensive Vorbereitung auf Schularbeiten, Matura und Aufnahmeprüfungen mit bewährten Methoden.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Heart,
    title: "Lerncoaching",
    description:
      "Lerntechniken, Selbstorganisation und Motivation – wir stärken nicht nur Wissen, sondern auch Selbstvertrauen.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Clock,
    title: "Flexible Zeiten",
    description:
      "Nachmittags- und Abendtermine für Schülerinnen und Schüler aller Schulstufen. Auch Wochenendkurse möglich.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: MapPin,
    title: "Im Herzen des Pongau",
    description:
      "Unser Lernstudio befindet sich zentral im Pongau – gut erreichbar für Familien aus der gesamten Region.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function Angebot() {
  return (
    <section id="angebot" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnView className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-4">
            Was wir bieten
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Unser Angebot für euren Lernerfolg
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Wir begleiten Kinder und Jugendliche mit Freude und Fachkompetenz –
            damit Lernen nicht zur Last, sondern zur Stärke wird.
          </p>
        </AnimateOnView>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leistungen.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateOnView key={item.title} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-[#d8f3e3] transition-all duration-300 hover:-translate-y-1 h-full">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimateOnView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
