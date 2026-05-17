"use client";

import { motion } from "framer-motion";
import AnimateOnView from "./AnimateOnView";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Familie Huber",
    ort: "St. Johann im Pongau",
    text: "Unser Sohn hat in nur drei Monaten unglaubliche Fortschritte in Mathematik gemacht. Die Nachhilfe ist individuell und macht sogar Spaß!",
    sterne: 5,
    initial: "FH",
    farbe: "bg-[#2d6a4f]",
  },
  {
    name: "Familie Müller",
    ort: "Bischofshofen",
    text: "Die Atmosphäre im Lernstudio ist wunderschön. Unsere Tochter geht sehr gerne hin und hat seit der Nachhilfe viel mehr Selbstvertrauen.",
    sterne: 5,
    initial: "FM",
    farbe: "bg-[#f4a261]",
  },
  {
    name: "Familie Gruber",
    ort: "Schwarzach",
    text: "Perfekte Vorbereitung auf die Matura! Die Fortschrittsberichte an die Eltern sind sehr hilfreich. Absolut empfehlenswert!",
    sterne: 5,
    initial: "FG",
    farbe: "bg-blue-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#f4a261] blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
            Stimmen unserer Familien
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Was Eltern über uns sagen
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Wir sind stolz auf das Vertrauen der Familien im Pongau.
          </p>
        </AnimateOnView>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateOnView key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.sterne }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-[#f4a261] fill-[#f4a261]"
                    />
                  ))}
                </div>

                <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
                  „{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.farbe} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/60 text-xs">{t.ort}</p>
                  </div>
                </div>
              </motion.div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
