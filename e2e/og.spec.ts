import { expect, test } from "@playwright/test";

test("homepage Open Graph and Twitter meta tags are present", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});

test("default OG image is reachable", async ({ request }) => {
  const response = await request.get("/og/default.png");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});
