import { describe, expect, it } from "vitest";

import { buildInstantlyCsv, countApprovedReady } from "./instantly-csv";

describe("buildInstantlyCsv", () => {
  it("exports only approved rows with email", () => {
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
      },
    ]);

    expect(csv).toContain("a@acme.com");
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
