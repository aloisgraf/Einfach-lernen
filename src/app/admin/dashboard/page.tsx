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

  // Nächste 3 Tage mit Slots
  const futureSlotDates = Array.from(
    new Set(
      slots
        .filter((s) => s.freigegeben && s.datum >= heuteStr)
        .map((s) => s.datum)
        .sort()
    )
  ).slice(0, 3);

  const naechste3Tage = futureSlotDates;

  const slotsByDayAndStatus = new Map<string, { gebucht: typeof slots; frei: typeof slots }>();

  // Gruppiere Slots nach Datum und Status (gebucht/frei)
  for (const slot of slots.filter((s) => s.freigegeben && naechste3Tage.includes(s.datum))) {
    if (!slotsByDayAndStatus.has(slot.datum)) {
      slotsByDayAndStatus.set(slot.datum, { gebucht: [], frei: [] });
    }
    const belegt = await countBuchungenFuerSlot(slot.id);
    const frei = slot.max_teilnehmer - belegt;
    const dayData = slotsByDayAndStatus.get(slot.datum)!;
    if (frei === 0) {
      dayData.gebucht.push(slot);
    } else if (belegt > 0) {
      dayData.gebucht.push(slot);
    } else {
      dayData.frei.push(slot);
    }
  }

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
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Nächste 3 Tage</h2>
            {naechste3Tage.every((d) => slotsByDayAndStatus.get(d)!.gebucht.length === 0 && slotsByDayAndStatus.get(d)!.frei.length === 0) ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Keine bevorstehenden Termine.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {naechste3Tage.map((datum) => {
                  const dayData = slotsByDayAndStatus.get(datum)!;
                  const allSlots = [...dayData.gebucht, ...dayData.frei];
                  if (allSlots.length === 0) return null;

                  const datumFormatted = new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  });

                  return (
                    <div key={datum}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 10px", textTransform: "capitalize" }}>
                        {datumFormatted}
                      </p>

                      {/* Gebucht */}
                      {dayData.gebucht.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            🔴 Gebucht
                          </p>
                          {dayData.gebucht.map((slot) => (
                            <div
                              key={slot.id}
                              style={{
                                fontSize: 12,
                                color: "#374151",
                                padding: "6px 10px",
                                background: "#fef2f2",
                                borderLeft: "3px solid #dc2626",
                                marginBottom: 4,
                                borderRadius: 4,
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{slot.uhrzeit_von}–{slot.uhrzeit_bis}</span>
                              <span style={{ color: "#9ca3af", marginLeft: 8 }}>{slot.titel}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Frei */}
                      {dayData.frei.length > 0 && (
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            🟢 Frei
                          </p>
                          {dayData.frei.map((slot) => (
                            <div
                              key={slot.id}
                              style={{
                                fontSize: 12,
                                color: "#374151",
                                padding: "6px 10px",
                                background: "#f0fdf4",
                                borderLeft: "3px solid #16a34a",
                                marginBottom: 4,
                                borderRadius: 4,
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{slot.uhrzeit_von}–{slot.uhrzeit_bis}</span>
                              <span style={{ color: "#9ca3af", marginLeft: 8 }}>{slot.titel}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
                {buchungen
                  .map((b) => ({ b, slot: slots.find((s) => s.id === b.zeitslot_id) }))
                  .sort((a, b) => {
                    const datumA = a.slot?.datum ?? "";
                    const datumB = b.slot?.datum ?? "";
                    if (datumA !== datumB) return datumB.localeCompare(datumA);
                    return (b.slot?.uhrzeit_von ?? "").localeCompare(a.slot?.uhrzeit_von ?? "");
                  })
                  .slice(0, 5)
                  .map(({ b, slot }) => {
                  return (
                    <div key={b.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>
                          {b.vorname} {b.nachname}
                        </p>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.email}
                        </p>
                        <p style={{ fontSize: 11, color: "#1a5c4a", fontWeight: 600, margin: "2px 0 0" }}>
                          {b.kurs_name}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {slot ? (
                          <>
                            <p style={{ fontSize: 11, color: "#374151", fontWeight: 600, margin: 0, whiteSpace: "nowrap" }}>
                              {new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", { day: "numeric", month: "short" })}
                            </p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: "1px 0 0", whiteSpace: "nowrap" }}>
                              {slot.uhrzeit_von}–{slot.uhrzeit_bis} Uhr
                            </p>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>–</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
