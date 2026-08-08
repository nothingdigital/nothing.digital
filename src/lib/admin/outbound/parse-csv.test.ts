import { describe, expect, it } from "vitest";

import { leadStatusForImport, parseLeadFinderCsv } from "./parse-csv";

describe("parseLeadFinderCsv", () => {
  it("parses lead-finder export columns", () => {
    const csv = `email,companyName,website,phone,address,city,vertical,query,placeId,score,reasons,emailSource,rating,reviewCount,suppressed
hi@acme.com,Acme HVAC,https://acme.com,205-555-0100,"1 Main St",Northport AL,trades,plumber,place-1,42,no HTTPS|thin site,hunter,4.5,12,false
,No Email Co,https://noemail.com,,,Northport AL,pro,dentist,place-2,20,ok,none,,,false
`;

    const { rows, error } = parseLeadFinderCsv(csv);
    expect(error).toBeNull();
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      placeId: "place-1",
      name: "Acme HVAC",
      email: "hi@acme.com",
      score: 42,
      reasons: ["no HTTPS", "thin site"],
      emailSource: "hunter",
      personalization: null,
    });
    expect(leadStatusForImport(rows[0]!)).toBe("ready");
    expect(leadStatusForImport(rows[1]!)).toBe("needs_email");
  });

  it("prefers aiScore and imports personalization", () => {
    const csv = `email,companyName,website,phone,address,city,vertical,query,placeId,score,reasons,emailSource,rating,reviewCount,suppressed,aiScore,aiReason,personalization
hi@acme.com,Acme HVAC,https://acme.com,205-555-0100,"1 Main St",Northport AL,trades,plumber,place-1,42,no HTTPS,hunter,4.5,12,false,88,Weak site good fit,Saw your HVAC page could use clearer CTAs.
`;
    const { rows, error } = parseLeadFinderCsv(csv);
    expect(error).toBeNull();
    expect(rows[0]?.score).toBe(88);
    expect(rows[0]?.reasons).toEqual(
      expect.arrayContaining([
        "no HTTPS",
        "rule-score:42",
        "ai:Weak site good fit",
      ]),
    );
    expect(rows[0]?.personalization).toContain("HVAC");
  });

  it("rejects missing required columns", () => {
    const { error } = parseLeadFinderCsv("email,name\na@b.com,x\n");
    expect(error).toMatch(/Missing required column/);
  });
});
