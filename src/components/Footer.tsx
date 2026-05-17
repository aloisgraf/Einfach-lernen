import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Einfach Lernen Pongau
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Professionelle Nachhilfe und Kurse für Kinder und Jugendliche im
              Pongau. Individuell, kompetent und nachhaltig.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+43123456789"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                +43 123 456 789
              </a>
              <a
                href="mailto:office@einfachlernen-pongau.at"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                office@einfachlernen-pongau.at
              </a>
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                5600 St. Johann im Pongau
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-white text-sm mb-4">Navigation</p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Startseite" },
                { href: "/#angebot", label: "Angebot" },
                { href: "/#ueber-uns", label: "Über uns" },
                { href: "/kurse", label: "Kurse & Termine" },
                { href: "/#kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Öffnungszeiten */}
          <div>
            <p className="font-semibold text-white text-sm mb-4">Öffnungszeiten</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between gap-4">
                <span>Mo – Fr</span>
                <span>13:00–19:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Samstag</span>
                <span>09:00–13:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sonntag</span>
                <span>Geschlossen</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/kurse"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2d6a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#52b788] transition-colors"
              >
                Kurs buchen
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {year} Einfach Lernen Pongau. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-gray-300 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-gray-300 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
