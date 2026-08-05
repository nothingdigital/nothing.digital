import { test, expect } from "@playwright/test";

test("home title is not double-suffixed", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nothing\.Digital/);
  const title = await page.title();
  const matches = title.match(/Nothing\.Digital/g) ?? [];
  expect(matches).toHaveLength(1);
});

test("about title is single-suffixed", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveTitle("About — Nothing.Digital");
});

test("pricing page is reachable and linked from nav", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: /menu/i }).click();
  }
  await page
    .getByRole("link", { name: "Pricing", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/pricing/);
  await expect(
    page.getByRole("heading", { name: "Pricing", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(/\$5K–\$15K/)).toBeVisible();
});

test("cookie consent banner is not present", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /accept|essential|reject/i }),
  ).toHaveCount(0);
});

test("mobile menu opens, closes with Escape, and exposes aria-expanded", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile menu only");

  await page.goto("/");
  const toggle = page.getByRole("button", { name: /menu/i });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.locator("header").getByRole("link", { name: "Pricing", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
