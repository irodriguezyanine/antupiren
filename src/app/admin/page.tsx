import { redirect } from "next/navigation";

import { AdminEditor } from "@/components/admin-editor";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/content-store";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();
  return <AdminEditor initialContent={content} />;
}
