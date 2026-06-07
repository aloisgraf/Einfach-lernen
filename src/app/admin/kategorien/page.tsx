import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import KategorienVerwaltung from "./KategorienVerwaltung";
import { getKurskategorien } from "@/lib/einstellungen-store";

export const dynamic = "force-dynamic";

export default async function KategorienPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const kategorien = await getKurskategorien();

  return (
    <AdminLayout>
      <KategorienVerwaltung initialKategorien={kategorien} />
    </AdminLayout>
  );
}
