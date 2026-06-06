import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import SilbenVerwaltung from "./SilbenVerwaltung";
import { getAlleSilbenWoerter } from "@/lib/silbenspiel-store";

export const dynamic = "force-dynamic";

export default async function SilbenspielAdminPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const woerter = await getAlleSilbenWoerter();

  return (
    <AdminLayout>
      <SilbenVerwaltung initialWoerter={woerter} />
    </AdminLayout>
  );
}
