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
    });
    expect(leadStatusForImport(rows[0]!)).toBe("ready");
    expect(leadStatusForImport(rows[1]!)).toBe("needs_email");
  });

  it("rejects missing required columns", () => {
    const { error } = parseLeadFinderCsv("email,name\na@b.com,x\n");
    expect(error).toMatch(/Missing required column/);
  });
});
