import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/services",
  "/services/website-development",
  "/portfolio",
  "/portfolio/acme-launch",
  "/about",
  "/blog",
  "/blog/why-performance-matters",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

async function scanPage(page: Page, path: string) {
  await page.goto(path);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  return results;
}

for (const path of pages) {
  test(`a11y scan for ${path}`, async ({ page }) => {
    const results = await scanPage(page, path);
    expect(results.violations).toEqual([]);
  });
}
