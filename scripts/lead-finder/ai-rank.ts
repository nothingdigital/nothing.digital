import { createGateway, generateText, Output } from "ai";
import { z } from "zod";

import type { ScoredLead } from "./types";

const DEFAULT_MODEL = "openai/gpt-4.1-mini";

export const leadRankSchema = z.object({
  aiScore: z.number().min(0).max(100),
  aiReason: z.string().min(8).max(200),
  personalization: z.string().min(8).max(160),
});

export type LeadRankResult = z.infer<typeof leadRankSchema>;

export type LeadRankInput = {
  name: string;
  vertical: string;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  ruleScore: number;
  reasons: string[];
  html: string | null;
};

const SYSTEM_PROMPT = `You rank local SMB leads for Nothing.Digital (senior web/software/AI studio).

Score 0–100 for outbound fit: weak/outdated/no website, local Northport-area SMB, looks like they could use a better site or digital help = higher.
Chains, national brands, already-polished modern sites, wrong ICP = lower.

Also write:
- aiReason: one short sentence why this score (internal).
- personalization: one Instantly merge line (8–160 chars), specific to this business, no fake facts, no pricing, no emoji.

Never invent emails, phones, or that you visited in person.`;

/** Strip tags/scripts for a small prompt-safe snippet. */
export function htmlSnippet(html: string | null, max = 2500): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function formatLeadRankPrompt(input: LeadRankInput): string {
  return [
    `Business: ${input.name}`,
    `Vertical: ${input.vertical}`,
    `Website: ${input.website ?? "none"}`,
    `Rating: ${input.rating ?? "—"} (${input.reviewCount ?? 0} reviews)`,
    `Rule score: ${input.ruleScore}`,
    `Rule reasons: ${input.reasons.join("|") || "none"}`,
    `Site text snippet:`,
    htmlSnippet(input.html) || "(no HTML)",
  ].join("\n");
}

export function sortLeadsByAiThenRule(leads: ScoredLead[]): ScoredLead[] {
  return [...leads].sort((a, b) => {
    const aKey = a.aiScore ?? a.score;
    const bKey = b.aiScore ?? b.score;
    if (bKey !== aKey) return bKey - aKey;
    return b.score - a.score;
  });
}

type RankLeadFn = (input: LeadRankInput) => Promise<LeadRankResult>;

export async function createGatewayRankLead(options: {
  apiKey: string;
  model?: string;
}): Promise<RankLeadFn> {
  const model = createGateway({ apiKey: options.apiKey })(
    options.model?.trim() || DEFAULT_MODEL,
  );

  return async (input: LeadRankInput) => {
    const { output } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: formatLeadRankPrompt(input),
      output: Output.object({ schema: leadRankSchema }),
    });
    if (!output) throw new Error("Model returned no lead rank.");
    return output;
  };
}

/**
 * Rank top-N leads by rule score. Failures leave the row unchanged.
 * Does not send email or touch Instantly.
 */
export async function applyAiRanks(
  leads: ScoredLead[],
  options: {
    rankLead: RankLeadFn;
    limit: number;
    htmlByPlaceId?: Map<string, string | null>;
    onProgress?: (done: number, total: number, name: string) => void;
  },
): Promise<ScoredLead[]> {
  const limit = Math.max(0, Math.min(options.limit, leads.length));
  const byRule = [...leads].sort((a, b) => b.score - a.score);
  const targets = new Set(byRule.slice(0, limit).map((l) => l.placeId));

  const out: ScoredLead[] = [];
  let done = 0;
  const total = targets.size;

  for (const lead of leads) {
    if (!targets.has(lead.placeId)) {
      out.push(lead);
      continue;
    }

    try {
      const ranked = await options.rankLead({
        name: lead.name,
        vertical: lead.vertical,
        website: lead.website,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        ruleScore: lead.score,
        reasons: lead.reasons,
        html: options.htmlByPlaceId?.get(lead.placeId) ?? null,
      });
      out.push({
        ...lead,
        aiScore: ranked.aiScore,
        aiReason: ranked.aiReason,
        personalization: ranked.personalization,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`AI rank skipped for ${lead.name}: ${message}`);
      out.push(lead);
    }

    done += 1;
    options.onProgress?.(done, total, lead.name);
  }

  return sortLeadsByAiThenRule(out);
}
