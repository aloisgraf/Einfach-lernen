import { getFreigegebeneSlots, getAlleBuchungen } from "@/lib/slots-store";
import BuchungsSeite from "./buchen/BuchungsSeite";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termin buchen | Einfach Lernen Pongau",
  description: "Jetzt online einen Termin für Nachhilfe im Pongau buchen.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [slots, buchungen] = await Promise.all([
    getFreigegebeneSlots(),
    getAlleBuchungen(),
  ]);

  const slotsWithPlaetze = slots.map((s) => ({
    ...s,
    freie_plaetze:
      s.max_teilnehmer - buchungen.filter((b) => b.zeitslot_id === s.id).length,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#f4f6f5" }}>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8eceb" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/logo.png" alt="Einfach Lernen" style={{ height: 44 }} />
            </div>
            <a href="/admin/login" className="admin-btn">
              Admin
            </a>
            <style>{`
              .admin-btn {
                font-size: 13px;
                font-weight: 600;
                color: #1a5c4a;
                border: 1.5px solid #1a5c4a;
                border-radius: 8px;
                padding: 7px 16px;
                text-decoration: none;
                transition: all 0.15s;
              }
              .admin-btn:hover {
                background: #1a5c4a;
                color: #fff;
              }
            `}</style>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eceb", padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "#eaf4ef",
            color: "#1a5c4a",
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 20,
            padding: "5px 14px",
            marginBottom: 20,
            letterSpacing: 0.5,
          }}>
            Online-Anmeldung
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.15 }}>
            Termin buchen
          </h1>
          <p style={{ fontSize: 15, color: "#6b7280", marginTop: 14, lineHeight: 1.7, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            Wähle einen freien Termin im Kalender, fülle das Formular aus – und wir melden uns persönlich bei dir.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <BuchungsSeite slots={slotsWithPlaetze} />
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "48px 24px 32px", color: "#9ca3af", fontSize: 12 }}>
        © {new Date().getFullYear()} Einfach Lernen Pongau
      </div>
    </div>
  );
}
