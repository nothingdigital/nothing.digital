import { describe, expect, it } from "vitest";

import {
  briefAssistInputSchema,
  briefAssistOutputSchema,
  inboxDraftSchema,
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
