import { expect, test } from "@playwright/test";

test("404 page renders with home and contact links", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByText(/page not found/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /back home/i })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("link", { name: /contact us/i })).toHaveAttribute(
    "href",
    "/contact",
  );
});
