import { Output, createGateway, generateText } from "ai";

import {
  briefAssistOutputSchema,
  inboxDraftSchema,
  type BriefAssistInput,
  type BriefAssistOutput,
  type InboxDraft,
} from "@/lib/ai/types";
import { env } from "@/lib/env";

const DEFAULT_MODEL = "openai/gpt-4.1-mini";

function flagOn(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function isInboxDraftsEnabled(): boolean {
  return (
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_INBOX_DRAFTS_ENABLED)
  );
}

export function isBriefAssistantEnabled(): boolean {
  return (
    Boolean(env.private.AI_GATEWAY_API_KEY) &&
    flagOn(env.private.AI_BRIEF_ASSISTANT_ENABLED)
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
