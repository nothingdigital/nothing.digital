import { Output, generateText } from "ai";
import type { z } from "zod";

import {
  inboxDraftSchema,
  invoiceCoverSchema,
  opsBriefSchema,
  type InboxDraft,
  type InvoiceCoverDraft,
  type OpsBrief,
} from "@/lib/ai/types";
import {
  formatInvoiceCoverInput,
  formatOpsBriefInput,
  type InvoiceCoverFacts,
} from "@/lib/ai/format-prompt-input";
import { getGatewayModel } from "@/lib/ai/gateway";
import { isModuleEnabled } from "@/brand";
import type { LoopCollection } from "@/lib/admin/loops/types";
import { env } from "@/lib/env";

function flagOn(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

/** Module + gateway + master kill switch. */
export function isAiEnabled(): boolean {
  return (
    isModuleEnabled("ai") &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_ENABLED)
  );
}

export const isInboxDraftsEnabled = isAiEnabled;
export const isOpsBriefEnabled = isAiEnabled;
export const isInvoiceCoverEnabled = isAiEnabled;

async function draftObject<T>({
  system,
  prompt,
  schema,
  empty,
}: {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  empty: string;
}): Promise<T> {
  const { output } = await generateText({
    model: getGatewayModel(
      env.private.AI_GATEWAY_API_KEY,
      env.private.AI_MODEL,
    ),
    system,
    prompt,
    output: Output.object({ schema }),
  });
  if (!output) throw new Error(empty);
  return output;
}

const inboxReplySystemPrompt = `You are the founder of Nothing.Digital, a senior digital studio (web, software, apps, email, AI solutions, tech literacy).

Write a warm, concise reply to a contact form submission.
Voice: direct, professional, human — no buzzword soup, no emoji, no invented pricing or delivery dates.
Invite a short scoping call or clarifying reply when appropriate.
If budget/scope is unclear, ask one focused question.
Never promise timelines, fixed quotes, or legal terms.

Also classify triage for internal use only:
- urgent: ready to buy / time-sensitive / clear fit with budget signal
- good-fit: solid lead, not urgent
- needs-clarification: incomplete ask
- archive-candidate: spam, off-topic, or clearly not a fit`;

const opsBriefSystemPrompt = `You are the founder's ops chief of staff for Nothing.Digital.
Given today's open/later/recently-closed loops, write a tight briefing.
Rules:
- Use only the provided loop facts. Do not invent clients, amounts, or deadlines.
- Prefer billing/inbox urgency over setup chores.
- Bullets are actionable and short. No emoji. No pricing guesses.`;

const invoiceCoverSystemPrompt = `You write a short invoice cover note for Nothing.Digital.
Rules:
- Use ONLY the amount/due/title provided. Never invent or alter prices or dates.
- Warm, direct, human. No emoji. No legal promises.
- coverNote is plain text (2–5 short paragraphs max).
- subject like "Invoice {number} from Nothing.Digital" unless a clearer variant fits.`;

export async function draftInboxReply(submission: {
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
}): Promise<InboxDraft> {
  return draftObject({
    system: inboxReplySystemPrompt,
    prompt: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Company: ${submission.company ?? "—"}`,
      `Service: ${submission.service ?? "—"}`,
      `Budget: ${submission.budget ?? "—"}`,
      `Message:`,
      submission.message,
    ].join("\n"),
    schema: inboxDraftSchema,
    empty: "Model returned no draft.",
  });
}

export async function draftOpsBrief(
  collection: LoopCollection,
): Promise<OpsBrief> {
  return draftObject({
    system: opsBriefSystemPrompt,
    prompt: formatOpsBriefInput(collection),
    schema: opsBriefSchema,
    empty: "Model returned no ops brief.",
  });
}

export async function draftInvoiceCoverNote(
  facts: InvoiceCoverFacts,
): Promise<InvoiceCoverDraft> {
  return draftObject({
    system: invoiceCoverSystemPrompt,
    prompt: formatInvoiceCoverInput(facts),
    schema: invoiceCoverSchema,
    empty: "Model returned no invoice cover.",
  });
}
