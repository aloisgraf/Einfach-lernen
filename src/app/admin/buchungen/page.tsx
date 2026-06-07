import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import { getAlleBuchungen, getAlleSlots } from "@/lib/slots-store";
import BuchungenList from "./BuchungenList";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eceb",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

export default async function BuchungenPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
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
          <BuchungenList initialBuchungen={buchungenMitSlot.map((b) => ({ buchung: b, slot: b.slot }))} />
        )}
      </div>
    </AdminLayout>
  );
}
