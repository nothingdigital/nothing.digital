import { z } from "zod";

import { serviceSlugs } from "@/lib/routes";
import { budgetValues } from "@/lib/validations/contact";

export const inboxTriageValues = [
  "urgent",
  "good-fit",
  "needs-clarification",
  "archive-candidate",
] as const;

export const inboxDraftSchema = z.object({
  triage: z.enum(inboxTriageValues),
  triageReason: z.string().min(1).max(280),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(4000),
});

export type InboxDraft = z.infer<typeof inboxDraftSchema>;

export const briefAssistInputSchema = z.object({
  goal: z.string().min(1).max(500),
  currentState: z.string().min(1).max(500),
  mustHaves: z.string().min(1).max(500),
  timelineFeel: z.string().min(1).max(200),
  constraints: z.string().max(500).optional().default(""),
  website: z.string().max(100).optional(),
});

export type BriefAssistInput = z.infer<typeof briefAssistInputSchema>;

export const briefAssistOutputSchema = z.object({
  message: z.string().min(10).max(2000),
  suggestedService: z.enum(serviceSlugs).nullable(),
  suggestedBudget: z.enum(budgetValues).nullable(),
});

export type BriefAssistOutput = z.infer<typeof briefAssistOutputSchema>;
