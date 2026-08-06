import { NextRequest, NextResponse } from "next/server";

import { newsletterWelcomeEmailTemplate } from "@/lib/email/templates";
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

  const supabase = getServiceRoleClient();
  if (supabase) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      console.error("[newsletter] Supabase upsert failed:", error.message);
    }
  } else {
    console.warn("[newsletter] Stored without Supabase (key missing).");
  }

  await sendWelcomeEmail(email);

  return NextResponse.json(
    { success: true, message: "Subscribed successfully" },
    { status: 201 },
  );
}
