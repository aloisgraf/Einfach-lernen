import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Termin buchen | Einfach Lernen Pongau",
  description: "Nachhilfe & Lernförderung im Pongau – jetzt Termin buchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={raleway.variable}>
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "var(--font-raleway), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
