import { describe, expect, it } from "vitest";

import { inboxReplyEmailTemplate } from "@/lib/email/templates";

describe("inboxReplyEmailTemplate", () => {
  it("escapes HTML in the body", () => {
    const html = inboxReplyEmailTemplate('Hi <script>alert("x")</script>');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
