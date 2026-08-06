import { NextRequest, NextResponse } from "next/server";

import { newsletterWelcomeEmailTemplate } from "@/lib/email/templates";
import { isListmonkConfigured } from "@/lib/env";
import { subscribeToListmonk } from "@/lib/listmonk";
import { notifyN8n } from "@/lib/n8n";
import { getRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { getResendClient } from "@/lib/resend";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validations/newsletter";

const FROM_EMAIL = "Nothing.Digital <hello@nothing.digital>";

async function sendWelcomeEmail(email: string) {
  const resend = getResendClient();
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Nothing.Digital newsletter",
    html: newsletterWelcomeEmailTemplate(),
  });
}

async function storeInSupabase(email: string) {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    console.warn("[newsletter] Stored without Supabase (key missing).");
    return;
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("[newsletter] Supabase upsert failed:", error.message);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let data: unknown;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = newsletterSchema.safeParse(data);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.issues },
      { status: 400 },
    );
  }

  const { email } = parseResult.data;

  const limiter = getRateLimiter();
  const rateLimit = await limiter.limit(`newsletter:${getClientIp(request)}`);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }

  // ponytail: Listmonk when configured; else Supabase + Resend welcome.
  if (isListmonkConfigured()) {
    const result = await subscribeToListmonk(email);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 502 },
      );
    }

    void notifyN8n("newsletter", { email, provider: "listmonk" });

    return NextResponse.json(
      {
        success: true,
        message: "Check your email to confirm your subscription.",
      },
      { status: 201 },
    );
  }

  await storeInSupabase(email);
  await sendWelcomeEmail(email);
  void notifyN8n("newsletter", { email, provider: "supabase" });

  return NextResponse.json(
    { success: true, message: "Subscribed successfully" },
    { status: 201 },
  );
}
