import { NextRequest, NextResponse } from "next/server";
import type { Resend } from "resend";

import { getFromEmail } from "@/brand";
import { env } from "@/lib/env";

import {
  contactConfirmationEmailTemplate,
  teamNotificationEmailTemplate,
  nurtureDay0EmailTemplate,
} from "@/lib/email/templates";
import { notifyN8n } from "@/lib/n8n";
import { scoreLead } from "@/lib/admin/client-ops";
import { getRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { getResendClient } from "@/lib/resend";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

const TEAM_EMAIL = env.private.CONTACT_NOTIFY_EMAIL ?? "team@nothing.digital";
const CALENDLY =
  env.private.CALENDLY_URL || "https://calendly.com/nothing-digital/30min";

async function storeSubmission(data: ContactInput) {
  const supabase = getServiceRoleClient();
  if (!supabase) return null;

  const { data: submission, error } = await supabase
    .from("contact_submissions")
    .insert({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      service: data.service ?? null,
      budget: data.budget ?? null,
      timeline: data.timeline ?? null,
      message: data.message,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[contact] Supabase insert failed:", error.message);
    return null;
  }

  return submission.id;
}

async function sendConfirmationEmail(resend: Resend, data: ContactInput) {
  await resend.emails.send({
    from: getFromEmail(),
    to: data.email,
    subject: "We received your message — Nothing.Digital",
    html: contactConfirmationEmailTemplate(data, CALENDLY),
  });
}

async function sendTeamNotification(
  resend: Resend,
  data: ContactInput,
  submissionId: string,
) {
  await resend.emails.send({
    from: getFromEmail(),
    to: TEAM_EMAIL,
    subject: `New contact submission from ${data.name}`,
    html: teamNotificationEmailTemplate(data, submissionId),
  });
}

async function sendNurtureEmail(resend: Resend, data: ContactInput) {
  await resend.emails.send({
    from: getFromEmail(),
    to: data.email,
    subject: "Let's schedule a call — Nothing.Digital",
    html: nurtureDay0EmailTemplate(data, CALENDLY),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let data: unknown;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = contactSchema.safeParse(data);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.issues },
      { status: 400 },
    );
  }

  const validated = parseResult.data;

  if (validated.website && validated.website.length > 0) {
    return NextResponse.json(
      { success: true, message: "Submission received" },
      { status: 201 },
    );
  }

  const limiter = getRateLimiter();
  const rateLimit = await limiter.limit(`contact:${getClientIp(request)}`);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }

  const submissionId = await storeSubmission(validated);

  if (!submissionId) {
    return NextResponse.json(
      { error: "Failed to store submission. Please try again later." },
      { status: 500 },
    );
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("[contact] Resend client unavailable (missing API key)");
    return NextResponse.json(
      { error: "Failed to send notification. Please try again later." },
      { status: 500 },
    );
  }

  try {
    await sendConfirmationEmail(resend, validated);
    // Always Resend team notify; n8n is optional fan-out below (never replace).
    await sendTeamNotification(resend, validated, submissionId);
    if (scoreLead(validated) > 60) {
      await sendNurtureEmail(resend, validated);
    }
  } catch (error) {
    console.error("[contact] Email delivery failed:", error);
    return NextResponse.json(
      { error: "Failed to send notification. Please try again later." },
      { status: 500 },
    );
  }

  // ponytail: optional fan-out after critical path; never blocks 201.
  void notifyN8n("contact", {
    id: submissionId,
    name: validated.name,
    email: validated.email,
    company: validated.company ?? null,
    service: validated.service ?? null,
  });

  return NextResponse.json(
    { success: true, message: "Submission received" },
    { status: 201 },
  );
}
