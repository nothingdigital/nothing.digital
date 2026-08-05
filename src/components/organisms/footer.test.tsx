import { render, screen } from "@testing-library/react";

import { Footer } from "./footer";

it("renders sitemap links", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute(
    "href",
    "/services",
  );
  expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute(
    "href",
    "/pricing",
  );
  expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
    "href",
    "/about",
  );
  expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
    "href",
    "/contact",
  );
});

it("renders legal links", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
    "href",
    "/privacy",
  );
  expect(
    screen.getByRole("link", { name: /terms of service/i }),
  ).toHaveAttribute("href", "/terms");
  expect(screen.getByRole("link", { name: /accessibility/i })).toHaveAttribute(
    "href",
    "/accessibility",
  );
});

it("renders the newsletter form", () => {
  render(<Footer />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /subscribe/i }),
  ).toBeInTheDocument();
});
