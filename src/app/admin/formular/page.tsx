import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import FormularVerwaltung from "./FormularVerwaltung";
import { getBuchungsformularTexte } from "@/lib/einstellungen-store";

export const dynamic = "force-dynamic";

export default async function FormularPage() {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const texte = await getBuchungsformularTexte();

  return (
    <AdminLayout>
      <FormularVerwaltung initialTexte={texte} />
    </AdminLayout>
  );
}
