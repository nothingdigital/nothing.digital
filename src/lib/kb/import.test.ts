import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import { extractByFilename, extractXlsx } from "./import";

describe("extractXlsx", () => {
  it("turns a sheet into a markdown table", async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Name", "Qty"],
      ["Widget", 2],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

    const result = await extractXlsx(buf);
    expect(result.ok).toBe(true);
    expect(result.markdown).toContain("## Inventory");
    expect(result.markdown).toContain("| Name | Qty |");
    expect(result.markdown).toContain("| Widget | 2 |");
  });
});

describe("extractByFilename", () => {
  it("routes .numbers to empty extract", async () => {
    const result = await extractByFilename(
      "handbook.numbers",
      Buffer.from("x"),
    );
    expect(result.ok).toBe(false);
    expect(result.markdown).toBe("");
    expect(result.error).toMatch(/Numbers/i);
  });

  it("rejects unknown extensions", async () => {
    const result = await extractByFilename("notes.txt", Buffer.from("hi"));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/No extractor/);
  });

  it("rejects garbage docx", async () => {
    const result = await extractByFilename(
      "bad.docx",
      Buffer.from("not-a-docx"),
    );
    expect(result.ok).toBe(false);
    expect(result.markdown).toBe("");
  });
});
