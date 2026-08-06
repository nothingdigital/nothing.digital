import { env, isListmonkConfigured } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    integrations: {
      sentry: Boolean(env.private.SENTRY_DSN),
      umami: Boolean(
        env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID &&
        env.public.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
      ),
      calendly: Boolean(env.private.CALENDLY_URL),
      listmonk: isListmonkConfigured(),
    },
  });
}
