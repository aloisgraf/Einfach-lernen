"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#angebot", label: "Angebot" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/kurse", label: "Kurse & Termine" },
  { href: "/buchen", label: "Termin buchen" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Einfach Lernen Pongau – Startseite"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center group-hover:bg-[#1b4332] transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#1a1a2e] text-lg leading-tight">
              Einfach<br />
              <span className="text-[#2d6a4f] text-sm font-semibold -mt-1 block">
                Lernen Pongau
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[#2d6a4f] bg-[#f0faf4]"
                    : "text-gray-600 hover:text-[#2d6a4f] hover:bg-[#f0faf4]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kurse"
              className="ml-3 px-5 py-2.5 bg-[#2d6a4f] text-white text-sm font-semibold rounded-lg hover:bg-[#1b4332] transition-colors shadow-sm"
            >
              Jetzt anmelden
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#2d6a4f] hover:bg-[#f0faf4] transition-colors"
            aria-label="Menü öffnen"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-[#2d6a4f] hover:bg-[#f0faf4] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kurse"
            className="mt-2 px-4 py-3 bg-[#2d6a4f] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#1b4332] transition-colors"
          >
            Jetzt anmelden
          </Link>
        </nav>
      </div>
    </header>
  );
}
