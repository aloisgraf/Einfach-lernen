import AdminLayout from "@/components/AdminLayout";
import { getAlleBuchungen, getAlleSlots } from "@/lib/slots-store";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

export default async function BuchungenPage() {
  const [buchungen, slots] = await Promise.all([getAlleBuchungen(), getAlleSlots()]);
  const slotsById = new Map(slots.map((s) => [s.id, s]));

  const buchungenMitSlot = buchungen.map((b) => ({
    ...b,
    slot: slotsById.get(b.zeitslot_id) ?? null,
  }));

  function formatDatum(datum: string) {
    return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <AdminLayout>
      <div style={{ padding: 36 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Buchungen</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{buchungenMitSlot.length} Buchungen gesamt</p>
        </div>

        {buchungenMitSlot.length === 0 ? (
          <div style={{ ...card, padding: 48, textAlign: "center" }}>
            <Users style={{ width: 40, height: 40, color: "#e5e7eb", margin: "0 auto 16px" }} />
            <p style={{ color: "#9ca3af", fontSize: 14 }}>Noch keine Buchungen vorhanden.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {buchungenMitSlot.map((b) => (
              <div key={b.id} style={{ ...card, padding: 24 }}>
                {/* Slot-Badge + Datum */}
                <div style={{ marginBottom: 20 }}>
                  {b.slot ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "4px 12px", borderRadius: 20,
                      background: "#eaf4ef", color: "#1a5c4a",
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {b.slot.titel} · {formatDatum(b.slot.datum)} · {b.slot.uhrzeit_von}–{b.slot.uhrzeit_bis} Uhr
                    </span>
                  ) : (
                    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "#f3f4f6", color: "#9ca3af", fontSize: 12 }}>
                      Slot gelöscht
                    </span>
                  )}
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0" }}>
                    Angemeldet am {new Date(b.erstellt_am).toLocaleDateString("de-AT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Info-Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Elternteil</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{b.vorname} {b.nachname}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>{b.email}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{b.telefon}</p>
                  </div>

                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Kind</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{b.name_kind}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>{b.schulstufe}</p>
                  </div>

                  <div style={{ background: "#eaf4ef", borderRadius: 10, padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#1a5c4a", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stärken & Lernbedarf</p>
                    <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 2px" }}>Kann gut:</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: "0 0 8px" }}>{b.kind_staerken}</p>
                    <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 2px" }}>Noch lernen:</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{b.kind_lernen}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
