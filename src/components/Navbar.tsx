"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Einfach Lernen Pongau – Startseite"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center group-hover:bg-[#1b4332] transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#1a1a2e] text-lg leading-tight">
              Einfach Lernen
              <span className="text-[#2d6a4f] text-sm font-semibold block -mt-1">
                Pongau
              </span>
            </span>
          </Link>

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
          open ? "max-h-32" : "max-h-0"
        )}
      >
        <nav className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
          <Link
            href="/"
            className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-[#2d6a4f] hover:bg-[#f0faf4] transition-colors"
          >
            Termin buchen
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:text-[#2d6a4f] hover:bg-[#f0faf4] transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
