import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { newsletterWelcomeEmailTemplate } from "@/lib/email/templates";
import { getRateLimiter } from "@/lib/rate-limit";
import { getResendClient } from "@/lib/resend";
import { getServiceRoleClient } from "@/lib/supabase/server";
import {
  newsletterSchema,
  type NewsletterInput,
} from "@/lib/validations/newsletter";

const FROM_EMAIL = "Nothing.Digital <hello@nothing.digital>";

function formatZodErrors(
  error: z.ZodError,
): Array<{ path: PropertyKey[]; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
}

async function findExistingSubscriber(email: string) {
  const supabase = getServiceRoleClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error(
      "[newsletter] Existing subscriber lookup failed:",
      error.message,
    );
    return null;
  }

  return data;
}

async function insertSubscriber(email: string) {
  const supabase = getServiceRoleClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    console.error("[newsletter] Supabase insert failed:", error.message);
    return false;
  }

  return true;
}

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

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
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
      {
        error: "Validation failed",
        details: formatZodErrors(parseResult.error),
      },
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

  const existing = await findExistingSubscriber(email);
  if (existing) {
    return NextResponse.json(
      { success: true, message: "Already subscribed" },
      { status: 200 },
    );
  }

  const inserted = await insertSubscriber(email);
  if (!inserted) {
    console.warn(
      "[newsletter] Stored without Supabase (key missing or insert failed).",
    );
  }

  await sendWelcomeEmail(email);

  return NextResponse.json(
    { success: true, message: "Subscribed successfully" },
    { status: 201 },
  );
}
