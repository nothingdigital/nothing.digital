import { test, expect, type Page } from "@playwright/test";

async function openContact(page: Page) {
  await page.goto("/contact");
}

test("contact page renders form fields", async ({ page }) => {
  await openContact(page);

  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /send message/i }),
  ).toBeVisible();
});

test("contact form shows validation errors on empty submit", async ({
  page,
}) => {
  await openContact(page);

  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/name is required/i)).toBeVisible();
  await expect(page.getByText(/valid email required/i)).toBeVisible();
  await expect(
    page.getByText(/message must be at least 10 characters/i),
  ).toBeVisible();
});

test("contact form submits successfully", async ({ page }) => {
  await openContact(page);

  await page.getByLabel(/name/i).fill("Jane Doe");
  await page.getByLabel(/email/i).fill("jane@example.com");
  await page
    .getByLabel(/message/i)
    .fill("I need a new website for my business.");
  await page.getByLabel(/i agree to the privacy policy/i).check();

  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/thanks/i)).toBeVisible();
});
