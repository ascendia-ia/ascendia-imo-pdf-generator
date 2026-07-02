import PdfGenerator from "./pdf-generator";
import { getClientBranding } from "@/lib/client-branding";

export default async function Home() {
  const branding = await getClientBranding();

  return <PdfGenerator branding={branding} />;
}
