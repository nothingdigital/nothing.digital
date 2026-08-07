import { describe, expect, it } from "vitest";

import {
  buildInstantlyCsv,
  countApprovedReady,
  countMissingPersonalization,
} from "./instantly-csv";

describe("buildInstantlyCsv", () => {
  it("legacy export omits personalization column when flag off", () => {
    const csv = buildInstantlyCsv([
      {
        email: "a@acme.com",
        name: "Acme",
        website: "https://acme.com",
        phone: null,
        city: "Northport, AL",
        score: 40,
        reasons: ["thin"],
        status: "approved",
        personalization: "Saw your Northport site looks thin on services.",
      },
      {
        email: "b@acme.com",
        name: "Ready",
        website: null,
        phone: null,
        city: "Northport, AL",
        score: 30,
        reasons: [],
        status: "ready",
        personalization: null,
      },
      {
        email: null,
        name: "NoMail",
        website: null,
        phone: null,
        city: "Northport, AL",
        score: 10,
        reasons: [],
        status: "approved",
        personalization: null,
      },
    ]);

    expect(csv).toContain("email,companyName,website,phone,city,score,reasons");
    expect(csv).not.toContain("personalization");
    expect(csv).toContain("a@acme.com");
    expect(csv).not.toContain(
      "Saw your Northport site looks thin on services.",
    );
    expect(csv).not.toContain("b@acme.com");
    expect(
      countApprovedReady([
        {
          email: "a@acme.com",
          name: "Acme",
          website: null,
          phone: null,
          city: "Northport, AL",
          score: 1,
          reasons: [],
          status: "approved",
        },
      ]),
    ).toBe(1);
  });

  it("includes personalization column when requirePersonalization is true", () => {
    const csv = buildInstantlyCsv(
      [
        {
          email: "with@acme.com",
          name: "With",
          website: null,
          phone: null,
          city: "Northport, AL",
          score: 10,
          reasons: [],
          status: "approved",
          personalization: "Local trades site could use clearer CTAs.",
        },
        {
          email: "without@acme.com",
          name: "Without",
          website: null,
          phone: null,
          city: "Northport, AL",
          score: 10,
          reasons: [],
          status: "approved",
          personalization: null,
        },
      ],
      true,
    );

    expect(csv).toContain(
      "email,companyName,website,phone,city,score,reasons,personalization",
    );
    expect(csv).toContain("with@acme.com");
    expect(csv).toContain("Local trades site could use clearer CTAs.");
    expect(csv).not.toContain("without@acme.com");
  });

  it("counts missing personalization on approved+email rows", () => {
    expect(
      countMissingPersonalization([
        {
          email: "a@acme.com",
          name: "A",
          website: null,
          phone: null,
          city: "X",
          score: 1,
          reasons: [],
          status: "approved",
          personalization: null,
        },
        {
          email: "b@acme.com",
          name: "B",
          website: null,
          phone: null,
          city: "X",
          score: 1,
          reasons: [],
          status: "approved",
          personalization: "Has a line already saved here.",
        },
      ]),
    ).toBe(1);
  });
});
