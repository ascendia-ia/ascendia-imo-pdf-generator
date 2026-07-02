import { createClient } from "@/lib/supabase/server";

export type ClientBranding = {
  name: string;
  phone: string;
  logoUrl: string | null;
};

function getLogoUrl(logoPath: string | null) {
  if (!logoPath) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl}/storage/v1/object/public/client-assets/${logoPath}`;
}

export async function getClientBranding(): Promise<ClientBranding | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("clients")
    .select("name, phone, logo_path")
    .eq("owner_user_id", user.id)
    .maybeSingle<{ name: string; phone: string; logo_path: string | null }>();

  if (error || !data) {
    return null;
  }

  return {
    name: data.name,
    phone: data.phone,
    logoUrl: getLogoUrl(data.logo_path)
  };
}
