import { expect, test } from "@playwright/test";

const CALENDLY_URL = process.env.CALENDLY_URL;

test.describe("Calendly CTA", () => {
  test.skip(!CALENDLY_URL, "CALENDLY_URL not set; Calendly smoke test skipped");

  test("contact page links to Calendly", async ({ page }) => {
    await page.goto("/contact");

    const link = page.getByRole("link", {
      name: /pick a time that works for you/i,
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", CALENDLY_URL!);
    await expect(link).toHaveAttribute("target", "_blank");
  });
});
