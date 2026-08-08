import { describe, expect, it } from "vitest";

import { buildInstantlyCsv, countApprovedReady } from "./instantly-csv";

describe("buildInstantlyCsv", () => {
  it("exports approved+email rows with personalization column", () => {
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
      {
        email: "empty@acme.com",
        name: "Empty",
        website: null,
        phone: null,
        city: "Northport, AL",
        score: 10,
        reasons: [],
        status: "approved",
        personalization: null,
      },
    ]);

    expect(csv).toContain(
      "email,companyName,website,phone,city,score,reasons,personalization",
    );
    expect(csv).toContain("a@acme.com");
    expect(csv).toContain("Saw your Northport site looks thin on services.");
    expect(csv).toContain("empty@acme.com");
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
});
