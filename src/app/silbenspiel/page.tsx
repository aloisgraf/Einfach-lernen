import { getAktiveSilbenWoerter } from "@/lib/silbenspiel-store";
import Spiel from "./Spiel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silbenspiel | Einfach Lernen Pongau",
};

export const dynamic = "force-dynamic";

export default async function SilbenspielPage() {
  const woerter = await getAktiveSilbenWoerter();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f5", fontFamily: "var(--font-raleway), sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e8eceb" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <a href="/" style={{ fontSize: 16, fontWeight: 800, color: "#1a5c4a", textDecoration: "none" }}>Einfach Lernen</a>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Silbenspiel</span>
        </div>
      </header>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
        <Spiel woerter={woerter} />
      </div>
    </div>
  );
}
