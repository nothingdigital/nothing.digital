import { test, expect, type Page } from "@playwright/test";

const serviceTitles = [
  "Website Development",
  "Software Solutions",
  "Applications",
  "Email Marketing",
];

async function openHome(page: Page) {
  await page.goto("/");
}

test("home page has the expected title", async ({ page }) => {
  await openHome(page);

  await expect(page).toHaveTitle(/Nothing\.Digital/);
});

test("home page displays all service cards", async ({ page }) => {
  await openHome(page);

  for (const title of serviceTitles) {
    await expect(
      page.getByRole("heading", { level: 3, name: title }),
    ).toBeVisible();
  }
});

test("home page CTA links to contact", async ({ page }) => {
  await openHome(page);

  await expect(
    page.getByRole("link", { name: /get in touch/i }),
  ).toHaveAttribute("href", "/contact");
});

test("home page includes newsletter section", async ({ page }) => {
  await openHome(page);

  const newsletter = page.locator("#newsletter");
  await expect(
    newsletter.getByRole("heading", { name: /stay in the loop/i }),
  ).toBeVisible();
  await expect(
    newsletter.getByRole("button", { name: /subscribe/i }),
  ).toBeVisible();
});
