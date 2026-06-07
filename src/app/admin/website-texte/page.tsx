import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import WebsiteTexteVerwaltung from "./WebsiteTexteVerwaltung";
import { getWebsiteTexte } from "@/lib/einstellungen-store";

export const dynamic = "force-dynamic";

export default async function WebsiteTextePage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const texte = await getWebsiteTexte();

  return (
    <AdminLayout>
      <WebsiteTexteVerwaltung initialTexte={texte} />
    </AdminLayout>
  );
}
