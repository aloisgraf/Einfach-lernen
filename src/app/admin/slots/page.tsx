import AdminLayout from "@/components/AdminLayout";
import SlotsVerwaltung from "./SlotsVerwaltung";
import { getAlleSlots, getFreiePlaetze } from "@/lib/slots-store";

export const dynamic = "force-dynamic";

export default function SlotsPage() {
  const slots = getAlleSlots().map((s) => ({
    ...s,
    freie_plaetze: getFreiePlaetze(s.id),
  }));

  return (
    <AdminLayout>
      <SlotsVerwaltung initialSlots={slots} />
    </AdminLayout>
  );
}
