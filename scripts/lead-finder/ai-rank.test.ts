import { describe, expect, it, vi } from "vitest";

import {
  applyAiRanks,
  formatLeadRankPrompt,
  htmlSnippet,
  sortLeadsByAiThenRule,
} from "./ai-rank";
import type { ScoredLead } from "./types";

function baseLead(
  partial: Partial<ScoredLead> & Pick<ScoredLead, "placeId" | "name" | "score">,
): ScoredLead {
  return {
    phone: null,
    address: null,
    website: null,
    types: [],
    rating: null,
    reviewCount: null,
    vertical: "trades",
    query: "q",
    reasons: ["no-website"],
    email: null,
    emailSource: "none",
    suppressed: false,
    ...partial,
  };
}

describe("htmlSnippet", () => {
  it("strips tags and scripts", () => {
    const snip = htmlSnippet(
      "<html><script>evil()</script><style>x{}</style><body>Hello <b>World</b></body></html>",
    );
    expect(snip).toContain("Hello World");
    expect(snip).not.toContain("evil");
    expect(snip).not.toContain("<");
  });

  it("returns empty for null", () => {
    expect(htmlSnippet(null)).toBe("");
  });
});

describe("formatLeadRankPrompt", () => {
  it("includes rule score and business name", () => {
    const prompt = formatLeadRankPrompt({
      name: "River City HVAC",
      vertical: "trades",
      website: null,
      rating: 4.2,
      reviewCount: 18,
      ruleScore: 45,
      reasons: ["no-website"],
      html: null,
    });
    expect(prompt).toContain("River City HVAC");
    expect(prompt).toContain("Rule score: 45");
    expect(prompt).toContain("(no HTML)");
  });
});

describe("sortLeadsByAiThenRule", () => {
  it("prefers aiScore when present", () => {
    const sorted = sortLeadsByAiThenRule([
      baseLead({ placeId: "a", name: "A", score: 90, aiScore: 10 }),
      baseLead({ placeId: "b", name: "B", score: 20, aiScore: 80 }),
      baseLead({ placeId: "c", name: "C", score: 50 }),
    ]);
    expect(sorted.map((l) => l.placeId)).toEqual(["b", "c", "a"]);
  });
});

describe("applyAiRanks", () => {
  it("ranks only top N by rule score", async () => {
    const rankLead = vi.fn(async () => ({
      aiScore: 77,
      aiReason: "Weak site, good local trades fit for a rebuild.",
      personalization:
        "Noticed your Northport HVAC listing lacks a clear services page.",
    }));

    const leads = [
      baseLead({ placeId: "low", name: "Low", score: 10 }),
      baseLead({ placeId: "high", name: "High", score: 80 }),
      baseLead({ placeId: "mid", name: "Mid", score: 40 }),
    ];

    const result = await applyAiRanks(leads, { rankLead, limit: 2 });
    expect(rankLead).toHaveBeenCalledTimes(2);
    const rankedIds = result
      .filter((l) => l.aiScore != null)
      .map((l) => l.placeId)
      .sort();
    expect(rankedIds).toEqual(["high", "mid"]);
    expect(result[0]?.placeId).toBe("high");
  });

  it("keeps row when rank fails", async () => {
    const rankLead = vi.fn(async () => {
      throw new Error("gateway down");
    });
    const leads = [baseLead({ placeId: "x", name: "X", score: 50 })];
    const result = await applyAiRanks(leads, { rankLead, limit: 5 });
    expect(result[0]?.aiScore).toBeUndefined();
    expect(result[0]?.score).toBe(50);
  });
});
