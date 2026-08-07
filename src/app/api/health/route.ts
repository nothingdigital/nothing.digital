import { env, isListmonkConfigured } from "@/lib/env";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    integrations: {
      // Core path — if these are false, contact/newsletter are broken.
      supabase: Boolean(env.private.SUPABASE_SERVICE_ROLE_KEY),
      resend: Boolean(env.private.RESEND_API_KEY),
      // Sidecars — false means unset/invalid env, not an outage.
      sentry: Boolean(env.private.SENTRY_DSN),
      umami: Boolean(
        env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID &&
        env.public.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
      ),
      calendly: Boolean(env.private.CALENDLY_URL),
      listmonk: isListmonkConfigured(),
      ai: Boolean(env.private.AI_GATEWAY_API_KEY),
    },
  });
}
