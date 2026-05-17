"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Users, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "200+", label: "Schülerinnen & Schüler" },
  { icon: Star, value: "98%", label: "Zufriedenheit" },
  { icon: Award, value: "10+", label: "Jahre Erfahrung" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#f0faf4] via-white to-[#fff8f0]">
      {/* Decorative background circles */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#52b788]/10 blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#f4a261]/10 blur-3xl -z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
              Lernzentrum im Pongau
            </motion.span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a1a2e] leading-tight mb-6">
              Lernen leicht{" "}
              <span className="relative">
                <span className="text-[#2d6a4f]">gemacht</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6 Q100 0 200 6"
                    stroke="#52b788"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Individuell, kompetent und nachhaltig – wir fördern Kinder und
              Jugendliche im Pongau mit Leidenschaft und Expertise. Von der
              Volksschule bis zur Matura.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/kurse"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-all shadow-lg shadow-[#2d6a4f]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Kurse entdecken
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#kontakt"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-[#2d6a4f] font-semibold rounded-xl border-2 border-[#d8f3e3] hover:border-[#52b788] hover:bg-[#f0faf4] transition-all"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </motion.div>

          {/* Illustration / Stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#f0faf4] rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a2e]">Nächster Kurs</p>
                    <p className="text-sm text-gray-500">Heute verfügbar</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { emoji: "📐", title: "Mathematik Nachhilfe", time: "Di 15:00 – 16:30", spots: "4 Plätze frei" },
                    { emoji: "📚", title: "Deutsch & Lesen", time: "Mi 14:00 – 15:30", spots: "3 Plätze frei" },
                    { emoji: "🌍", title: "Englisch für Anfänger", time: "Do 16:00 – 17:00", spots: "6 Plätze frei" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#f0faf4] transition-colors cursor-pointer group"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1a1a2e] truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                      <span className="text-xs text-[#2d6a4f] font-medium whitespace-nowrap">
                        {item.spots}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/kurse"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-[#2d6a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#1b4332] transition-colors"
                >
                  Alle Kurse ansehen <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 bg-[#f4a261] text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg"
              >
                ✨ Jetzt anmelden!
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#d8f3e3] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2d6a4f]" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#1a1a2e]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 font-medium">Mehr entdecken</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
