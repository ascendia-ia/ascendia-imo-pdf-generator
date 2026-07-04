import { createClient } from "@/lib/supabase/server";

export type ClientBranding = {
  name: string;
  phone: string;
  logoUrl: string | null;
};

export type PdfGeneratorAccess = {
  allowed: boolean;
  authenticated: boolean;
  branding: ClientBranding | null;
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

export async function getPdfGeneratorAccess(): Promise<PdfGeneratorAccess> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      allowed: false,
      authenticated: false,
      branding: null
    };
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, phone, logo_path")
    .eq("owner_user_id", user.id)
    .maybeSingle<{ id: string; name: string; phone: string; logo_path: string | null }>();

  if (clientError || !client) {
    return {
      allowed: false,
      authenticated: true,
      branding: null
    };
  }

  const { data: access, error: accessError } = await supabase
    .from("client_app_access")
    .select("enabled")
    .eq("client_id", client.id)
    .eq("app_key", "pdf_generator")
    .maybeSingle<{ enabled: boolean }>();

  return {
    allowed: !accessError && access?.enabled === true,
    authenticated: true,
    branding: {
      name: client.name,
      phone: client.phone,
      logoUrl: getLogoUrl(client.logo_path)
    }
  };
}
