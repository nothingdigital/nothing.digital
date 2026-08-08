import { z } from "zod";

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

export const opsBriefSchema = z.object({
  headline: z.string().min(1).max(120),
  bullets: z.array(z.string().min(1).max(200)).min(1).max(8),
  focusHint: z.string().min(1).max(280),
});

export type OpsBrief = z.infer<typeof opsBriefSchema>;

export const invoiceCoverSchema = z.object({
  subject: z.string().min(1).max(200),
  coverNote: z.string().min(1).max(1500),
});

export type InvoiceCoverDraft = z.infer<typeof invoiceCoverSchema>;

export const outboundPersonalizationSchema = z.object({
  line: z.string().min(8).max(160),
});

export type OutboundPersonalization = z.infer<
  typeof outboundPersonalizationSchema
>;
