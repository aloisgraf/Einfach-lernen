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
  title: "Einfach Lernen Pongau | Termin buchen",
  description: "Nachhilfe & Lernförderung im Pongau – jetzt Termin buchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={raleway.variable}>
      <body className="min-h-screen antialiased font-[family-name:var(--font-raleway)]">
        {children}
      </body>
    </html>
  );
}
