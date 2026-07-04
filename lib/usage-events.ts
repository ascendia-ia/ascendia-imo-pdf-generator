import { createClient } from "@/lib/supabase/server";

export type AppUsageEventType = "pdf_generated" | "listing_imported";
export type AppUsageStatus = "success" | "error";

type TrackUsageEventInput = {
  eventType: AppUsageEventType;
  title?: string;
  sourceUrl?: string;
  durationMs?: number;
  status?: AppUsageStatus;
  errorMessage?: string;
};

function cleanText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function trackUsageEvent({
  eventType,
  title,
  sourceUrl,
  durationMs,
  status = "success",
  errorMessage
}: TrackUsageEventInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("owner_user_id", user.id)
      .maybeSingle<{ id: string }>();

    if (clientError || !client) {
      return;
    }

    await supabase.from("app_usage_events").insert({
      app_key: "pdf_generator",
      event_type: eventType,
      user_id: user.id,
      client_id: client.id,
      status,
      title: cleanText(title, 240),
      source_url: cleanText(sourceUrl, 1000),
      duration_ms: typeof durationMs === "number" ? Math.max(0, Math.round(durationMs)) : null,
      error_message: cleanText(errorMessage, 500)
    });
  } catch {
    // Usage tracking should never block a successful customer workflow.
  }
}
