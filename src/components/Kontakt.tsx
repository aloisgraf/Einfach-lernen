"use client";

import { useState } from "react";
import AnimateOnView from "./AnimateOnView";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Kontakt() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Placeholder – hier könnte eine API-Route oder ein E-Mail-Service angebunden werden
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <section id="kontakt" className="py-24 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#d8f3e3] text-[#1b4332] text-sm font-semibold rounded-full mb-4">
            Kontakt
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Wir freuen uns auf eure Nachricht
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bei Fragen zu unseren Kursen oder für eine persönliche Beratung –
            einfach melden!
          </p>
        </AnimateOnView>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <AnimateOnView direction="left" className="space-y-6">
            {[
              {
                icon: Phone,
                title: "Telefon",
                value: "+43 123 456 789",
                sub: "Mo–Fr 9:00–18:00 Uhr",
                href: "tel:+43123456789",
              },
              {
                icon: Mail,
                title: "E-Mail",
                value: "office@einfachlernen-pongau.at",
                sub: "Antwort innerhalb 24 Stunden",
                href: "mailto:office@einfachlernen-pongau.at",
              },
              {
                icon: MapPin,
                title: "Adresse",
                value: "Musterstraße 1, 5600 St. Johann im Pongau",
                sub: "Parkplätze vorhanden",
                href: "https://maps.google.com",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#d8f3e3] hover:shadow-md transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f0faf4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d8f3e3] transition-colors">
                    <Icon className="w-5 h-5 text-[#2d6a4f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{item.title}</p>
                    <p className="text-gray-700 text-sm mt-0.5">{item.value}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </a>
              );
            })}
          </AnimateOnView>

          {/* Form */}
          <AnimateOnView direction="right" delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-16 h-16 text-[#52b788] mb-4" />
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                    Nachricht gesendet!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Wir melden uns so schnell wie möglich bei euch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Vorname *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Nachname *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition"
                        placeholder="Mustermann"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition"
                      placeholder="max@beispiel.at"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nachricht *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition resize-none"
                      placeholder="Eure Anfrage oder Frage..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? "Wird gesendet…" : "Nachricht senden"}
                  </button>
                </form>
              )}
            </div>
          </AnimateOnView>
        </div>
      </div>
    </section>
  );
}
