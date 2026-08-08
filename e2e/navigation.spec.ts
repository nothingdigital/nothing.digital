import { test, expect } from "@playwright/test";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

test("desktop navigation links point to the correct pages", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop nav hidden on mobile");

  await page.goto("/");

  const header = page.locator("header");
  for (const link of navLinks) {
    await expect(
      header.getByRole("link", { name: link.label, exact: true }),
    ).toHaveAttribute("href", link.href);
  }
});

test("footer legal links point to the correct pages", async ({ page }) => {
  await page.goto("/");

  const footer = page.locator("footer");
  await expect(
    footer.getByRole("link", { name: /privacy policy/i }),
  ).toHaveAttribute("href", "/privacy");
  await expect(
    footer.getByRole("link", { name: /terms of service/i }),
  ).toHaveAttribute("href", "/terms");
  await expect(
    footer.getByRole("link", { name: /accessibility/i }),
  ).toHaveAttribute("href", "/accessibility");
});
