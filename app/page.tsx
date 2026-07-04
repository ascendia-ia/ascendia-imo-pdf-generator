import PdfGenerator from "./pdf-generator";
import { redirect } from "next/navigation";
import { getPdfGeneratorAccess } from "@/lib/client-branding";

export default async function Home() {
  const access = await getPdfGeneratorAccess();

  if (!access.authenticated) {
    redirect("/login");
  }

  if (!access.allowed) {
    redirect("/no-access");
  }

  return <PdfGenerator branding={access.branding} />;
}
