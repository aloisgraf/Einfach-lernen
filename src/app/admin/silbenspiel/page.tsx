import AdminLayout from "@/components/AdminLayout";
import SilbenVerwaltung from "./SilbenVerwaltung";
import { getAlleSilbenWoerter } from "@/lib/silbenspiel-store";

export const dynamic = "force-dynamic";

export default async function SilbenspielAdminPage() {
  const woerter = await getAlleSilbenWoerter();

  return (
    <AdminLayout>
      <SilbenVerwaltung initialWoerter={woerter} />
    </AdminLayout>
  );
}
