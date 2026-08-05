import { test, expect, type Page } from "@playwright/test";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

async function openHome(page: Page) {
  await page.goto("/");
}

test("desktop navigation links point to the correct pages", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop nav hidden on mobile");

  await openHome(page);

  const header = page.locator("header");
  for (const link of navLinks) {
    await expect(
      header.getByRole("link", { name: link.label, exact: true }),
    ).toHaveAttribute("href", link.href);
  }
});

test("footer legal links point to the correct pages", async ({ page }) => {
  await openHome(page);

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
