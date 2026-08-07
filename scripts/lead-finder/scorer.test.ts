import { describe, expect, it } from "vitest";
import { leadsToCsv, leadsToInstantlyCsv } from "./csv";
import { enrichFromHtml } from "./enrich";
import { scoreWebsite, classifyWebsiteUrl } from "./scorer";
import { isSuppressed } from "./suppress";
import type { ScoredLead } from "./types";

describe("classifyWebsiteUrl", () => {
  it("detects missing and social-only URLs", () => {
    expect(classifyWebsiteUrl(null)).toBe("none");
    expect(classifyWebsiteUrl("https://facebook.com/biz")).toBe("social");
    expect(classifyWebsiteUrl("https://acmeplumbing.com")).toBe("site");
  });
});

describe("scoreWebsite", () => {
  it("scores no website high", () => {
    const result = scoreWebsite(null, null);
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.reasons).toContain("no-website");
  });

  it("scores social-only high", () => {
    const result = scoreWebsite("https://www.facebook.com/shop", null);
    expect(result.reasons).toContain("social-only");
    expect(result.score).toBeGreaterThanOrEqual(35);
  });

  it("scores downtime and missing viewport", () => {
    const result = scoreWebsite("https://example.com", {
      ok: false,
      status: 500,
      finalUrl: "https://example.com",
      html: "<html><body>coming soon</body></html>",
      timedOut: false,
      https: true,
    });
    expect(result.reasons).toEqual(
      expect.arrayContaining(["http-500", "park-or-coming-soon"]),
    );
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("scores healthy modern page lower", () => {
    const result = scoreWebsite("https://example.com", {
      ok: true,
      status: 200,
      finalUrl: "https://example.com",
      html: '<html><head><meta name="viewport" content="width=device-width"></head><body>Hello © 2025</body></html>',
      timedOut: false,
      https: true,
    });
    expect(result.score).toBeLessThan(20);
  });
});

describe("enrichFromHtml", () => {
  it("extracts mailto", () => {
    expect(
      enrichFromHtml('<a href="mailto:Owner@Biz.com">email</a>').email,
    ).toBe("owner@biz.com");
  });

  it("ignores junk mailtos", () => {
    expect(enrichFromHtml('<a href="mailto:x@example.com">x</a>').email).toBe(
      null,
    );
  });
});

describe("suppress + csv", () => {
  it("matches email and domain blocks", () => {
    const block = new Set(["skip@biz.com", "blocked.com"]);
    expect(isSuppressed("skip@biz.com", null, block)).toBe(true);
    expect(isSuppressed("a@blocked.com", null, block)).toBe(true);
    expect(isSuppressed("ok@ok.com", "https://blocked.com", block)).toBe(true);
    expect(isSuppressed("ok@ok.com", "https://ok.com", block)).toBe(false);
  });

  it("exports Instantly rows only with email and not suppressed", () => {
    const leads: ScoredLead[] = [
      {
        placeId: "1",
        name: "A",
        phone: null,
        address: null,
        website: null,
        types: [],
        rating: null,
        reviewCount: null,
        vertical: "trades",
        query: "q",
        score: 50,
        reasons: ["no-website"],
        email: "a@biz.com",
        emailSource: "mailto",
        suppressed: false,
      },
      {
        placeId: "2",
        name: "B",
        phone: null,
        address: null,
        website: null,
        types: [],
        rating: null,
        reviewCount: null,
        vertical: "pro",
        query: "q",
        score: 40,
        reasons: ["social-only"],
        email: "b@biz.com",
        emailSource: "hunter",
        suppressed: true,
      },
      {
        placeId: "3",
        name: "C",
        phone: null,
        address: null,
        website: null,
        types: [],
        rating: null,
        reviewCount: null,
        vertical: "hospitality",
        query: "q",
        score: 30,
        reasons: ["no-website"],
        email: null,
        emailSource: "none",
        suppressed: false,
      },
    ];

    const instantly = leadsToInstantlyCsv(leads);
    expect(instantly).toContain("a@biz.com");
    expect(instantly).not.toContain("b@biz.com");
    expect(leadsToCsv(leads).split("\n").length).toBeGreaterThan(3);
  });
});
