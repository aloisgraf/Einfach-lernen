import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import { getAlleSlots, getAlleBuchungen, countBuchungenFuerSlot } from "@/lib/slots-store";
import { CalendarClock, Users, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

export default async function DashboardPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const [slots, buchungen] = await Promise.all([getAlleSlots(), getAlleBuchungen()]);

  const freigegeben = slots.filter((s) => s.freigegeben).length;
  const heuteStr = new Date().toISOString().split("T")[0];
  const heuteSlots = slots.filter((s) => s.datum === heuteStr && s.freigegeben).length;

  const naechsteSlots = slots.filter((s) => s.freigegeben && s.datum >= heuteStr).slice(0, 5);
  const freibePlaetzeMap = new Map<string, number>();
  await Promise.all(
    naechsteSlots.map(async (s) => {
      const belegt = await countBuchungenFuerSlot(s.id);
      freibePlaetzeMap.set(s.id, s.max_teilnehmer - belegt);
    })
  );

  const stats = [
    { icon: CalendarClock, label: "Gesamt-Slots", value: slots.length, sub: `${freigegeben} freigegeben`, color: "#3b82f6", bg: "#eff6ff" },
    { icon: CheckCircle2, label: "Freigegeben", value: freigegeben, sub: `${slots.length - freigegeben} gesperrt`, color: "#1a5c4a", bg: "#eaf4ef" },
    { icon: Users, label: "Buchungen", value: buchungen.length, sub: "gesamt", color: "#d97706", bg: "#fffbeb" },
    { icon: Clock, label: "Heute", value: heuteSlots, sub: "freie Slots", color: "#7c3aed", bg: "#f5f3ff" },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 32px" }}>Willkommen zurück!</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} style={{ ...card, padding: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon style={{ width: 18, height: 18, color }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "6px 0 2px" }}>{label}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Nächste Termine */}
          <div style={{ ...card, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Nächste Termine</h2>
            {naechsteSlots.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Keine bevorstehenden Termine.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {naechsteSlots.map((slot) => {
                  const frei = freibePlaetzeMap.get(slot.id) ?? 0;
                  return (
                    <div key={slot.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{slot.titel}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
                          {new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", { day: "numeric", month: "short", year: "numeric" })} · {slot.uhrzeit_von}–{slot.uhrzeit_bis}
                        </p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: frei === 0 ? "#fee2e2" : "#eaf4ef", color: frei === 0 ? "#dc2626" : "#1a5c4a", whiteSpace: "nowrap" }}>
                        {frei === 0 ? "Ausgebucht" : `${frei} frei`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Letzte Buchungen */}
          <div style={{ ...card, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Letzte Buchungen</h2>
            {buchungen.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Noch keine Buchungen vorhanden.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {buchungen.slice(0, 5).map((b) => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{b.name_kind}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>{b.schulstufe}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(b.erstellt_am).toLocaleDateString("de-AT", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
