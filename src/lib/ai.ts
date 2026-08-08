import { Output, createGateway, generateText } from "ai";

import {
  briefAssistOutputSchema,
  inboxDraftSchema,
  invoiceCoverSchema,
  opsBriefSchema,
  outboundPersonalizationSchema,
  type BriefAssistInput,
  type BriefAssistOutput,
  type InboxDraft,
  type InvoiceCoverDraft,
  type OpsBrief,
  type OutboundPersonalization,
} from "@/lib/ai/types";
import {
  formatInvoiceCoverInput,
  formatOpsBriefInput,
  formatOutboundLineInput,
  type InvoiceCoverFacts,
  type OutboundLineFacts,
} from "@/lib/ai/format-prompt-input";
import { isModuleEnabled } from "@/brand";
import type { LoopCollection } from "@/lib/admin/loops/types";
import { env } from "@/lib/env";

const DEFAULT_MODEL = "openai/gpt-4.1-mini";

function flagOn(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function aiModuleOn(): boolean {
  return isModuleEnabled("ai");
}

export function isInboxDraftsEnabled(): boolean {
  return (
    aiModuleOn() &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_INBOX_DRAFTS_ENABLED)
  );
}

export function isBriefAssistantEnabled(): boolean {
  return (
    aiModuleOn() &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_BRIEF_ASSISTANT_ENABLED)
  );
}

export function isOpsBriefEnabled(): boolean {
  return (
    aiModuleOn() &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_OPS_BRIEF_ENABLED)
  );
}

export function isInvoiceCoverEnabled(): boolean {
  return (
    aiModuleOn() &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_INVOICE_COVER_ENABLED)
  );
}

export function isOutboundPersonalizationEnabled(): boolean {
  return (
    aiModuleOn() &&
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_OUTBOUND_PERSONALIZATION_ENABLED)
  );
}

function getGatewayModel() {
  const apiKey = env.private.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    throw new Error("AI_GATEWAY_API_KEY is not configured.");
  }
  return createGateway({ apiKey })(
    env.private.AI_MODEL?.trim() || DEFAULT_MODEL,
  );
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

const briefAssistSystemPrompt = `You help a visitor draft a project brief for Nothing.Digital's contact form.

Rules:
- Output a clear first-person message the visitor can send (as if they wrote it).
- Do not invent prices, timelines, guarantees, or legal claims.
- If they ask for a quote, steer them to published /pricing ballparks and a scoping call — never invent a custom dollar amount.
- suggestedService must be one of the studio's service slugs or null.
- suggestedBudget must be one of <5k | 5k-15k | 15k-50k | 50k+ or null.
- Keep message under 2000 characters.`;

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

const outboundPersonalizationSystemPrompt = `You write one Instantly personalization line for Nothing.Digital cold outreach.
Rules:
- One sentence, 8–160 characters.
- Reference only real website/city/vertical/reasons from the input.
- No fake case studies, no pricing, no invented project names.
- Do not claim "I loved your redesign of X" unless X is in the input.
- No emoji. Plain text only.`;

export async function draftInboxReply(submission: {
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
}): Promise<InboxDraft> {
  const { output } = await generateText({
    model: getGatewayModel(),
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
    output: Output.object({ schema: inboxDraftSchema }),
  });

  if (!output) {
    throw new Error("Model returned no draft.");
  }

  return output;
}

export async function draftProjectBrief(
  input: BriefAssistInput,
): Promise<BriefAssistOutput> {
  const { output } = await generateText({
    model: getGatewayModel(),
    system: briefAssistSystemPrompt,
    prompt: [
      `Goal: ${input.goal}`,
      `Current state: ${input.currentState}`,
      `Must-haves: ${input.mustHaves}`,
      `Timeline feel: ${input.timelineFeel}`,
      `Constraints: ${input.constraints || "—"}`,
    ].join("\n"),
    output: Output.object({ schema: briefAssistOutputSchema }),
  });

  if (!output) {
    throw new Error("Model returned no brief.");
  }

  return output;
}

export async function draftOpsBrief(
  collection: LoopCollection,
): Promise<OpsBrief> {
  const { output } = await generateText({
    model: getGatewayModel(),
    system: opsBriefSystemPrompt,
    prompt: formatOpsBriefInput(collection),
    output: Output.object({ schema: opsBriefSchema }),
  });
  if (!output) throw new Error("Model returned no ops brief.");
  return output;
}

export async function draftInvoiceCoverNote(
  facts: InvoiceCoverFacts,
): Promise<InvoiceCoverDraft> {
  const { output } = await generateText({
    model: getGatewayModel(),
    system: invoiceCoverSystemPrompt,
    prompt: formatInvoiceCoverInput(facts),
    output: Output.object({ schema: invoiceCoverSchema }),
  });
  if (!output) throw new Error("Model returned no invoice cover.");
  return output;
}

export async function draftOutboundPersonalization(
  facts: OutboundLineFacts,
): Promise<OutboundPersonalization> {
  const { output } = await generateText({
    model: getGatewayModel(),
    system: outboundPersonalizationSystemPrompt,
    prompt: formatOutboundLineInput(facts),
    output: Output.object({ schema: outboundPersonalizationSchema }),
  });
  if (!output) throw new Error("Model returned no personalization line.");
  return output;
}
