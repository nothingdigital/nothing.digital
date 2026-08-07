import { describe, expect, it } from "vitest";

import {
  briefAssistInputSchema,
  briefAssistOutputSchema,
  inboxDraftSchema,
  invoiceCoverSchema,
  opsBriefSchema,
  outboundPersonalizationSchema,
} from "@/lib/ai/types";

describe("inboxDraftSchema", () => {
  it("accepts a valid draft", () => {
    const result = inboxDraftSchema.safeParse({
      triage: "good-fit",
      triageReason: "Clear website ask",
      subject: "Re: your project",
      body: "Thanks for reaching out — happy to hop on a short call.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid triage", () => {
    const result = inboxDraftSchema.safeParse({
      triage: "spam",
      triageReason: "x",
      subject: "Hi",
      body: "Hello",
    });
    expect(result.success).toBe(false);
  });
});

describe("briefAssistOutputSchema", () => {
  it("accepts enum suggestions or null", () => {
    const result = briefAssistOutputSchema.safeParse({
      message: "We need a new marketing site with booking.",
      suggestedService: "website-development",
      suggestedBudget: "5k-15k",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invented budget strings", () => {
    const result = briefAssistOutputSchema.safeParse({
      message: "We need a new marketing site with booking.",
      suggestedService: "website-development",
      suggestedBudget: "$12,000",
    });
    expect(result.success).toBe(false);
  });
});

describe("briefAssistInputSchema", () => {
  it("requires the four core answers", () => {
    expect(
      briefAssistInputSchema.safeParse({
        goal: "Launch site",
        currentState: "Squarespace",
        mustHaves: "CMS",
        timelineFeel: "this quarter",
      }).success,
    ).toBe(true);

    expect(
      briefAssistInputSchema.safeParse({
        goal: "Launch site",
      }).success,
    ).toBe(false);
  });
});

describe("opsBriefSchema", () => {
  it("accepts a short headline + bullets", () => {
    const parsed = opsBriefSchema.parse({
      headline: "Three loops need you",
      bullets: ["Follow up Ada invoice", "Triage 2 inbox", "Approve 4 leads"],
      focusHint: "Billing first — oldest overdue.",
    });
    expect(parsed.bullets).toHaveLength(3);
  });

  it("rejects empty headline", () => {
    expect(() =>
      opsBriefSchema.parse({ headline: "", bullets: ["x"], focusHint: "y" }),
    ).toThrow();
  });
});

describe("invoiceCoverSchema", () => {
  it("accepts subject + cover note", () => {
    const parsed = invoiceCoverSchema.parse({
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Hi — your invoice is ready whenever you are.",
    });
    expect(parsed.coverNote.length).toBeGreaterThan(0);
  });

  it("rejects empty cover note", () => {
    expect(() =>
      invoiceCoverSchema.parse({
        subject: "Invoice INV-1",
        coverNote: "",
      }),
    ).toThrow();
  });
});

describe("outboundPersonalizationSchema", () => {
  it("accepts a short line", () => {
    const parsed = outboundPersonalizationSchema.parse({
      line: "Noticed your Northport site could use a clearer services page.",
    });
    expect(parsed.line.length).toBeGreaterThanOrEqual(8);
  });

  it("rejects lines that are too short", () => {
    expect(() => outboundPersonalizationSchema.parse({ line: "Hi" })).toThrow();
  });
});
