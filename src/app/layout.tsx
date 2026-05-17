import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Einfach Lernen Pongau | Nachhilfe & Kurse im Pongau",
  description:
    "Professionelle Nachhilfe und Kurse für Kinder und Erwachsene im Pongau. Individuell, kompetent und nachhaltig.",
  keywords: "Nachhilfe, Pongau, Kurse, Lernen, Salzburg, Schülerhilfe",
  openGraph: {
    title: "Einfach Lernen Pongau",
    description: "Professionelle Nachhilfe und Kurse im Pongau",
    locale: "de_AT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
