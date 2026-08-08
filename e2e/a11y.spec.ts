import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/services",
  "/services/website-development",
  "/pricing",
  "/about",
  "/blog",
  "/blog/why-performance-matters",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

for (const path of pages) {
  test(`a11y scan for ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
