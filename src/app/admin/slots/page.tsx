import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import SlotsVerwaltung from "./SlotsVerwaltung";
import { getAlleSlots, countBuchungenFuerSlot } from "@/lib/slots-store";

export const dynamic = "force-dynamic";

export default async function SlotsPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const slots = await getAlleSlots();
  const slotsWithPlaetze = await Promise.all(
    slots.map(async (s) => ({
      ...s,
      freie_plaetze: s.max_teilnehmer - (await countBuchungenFuerSlot(s.id)),
    }))
  );

  return (
    <AdminLayout>
      <SlotsVerwaltung initialSlots={slotsWithPlaetze} />
    </AdminLayout>
  );
}
