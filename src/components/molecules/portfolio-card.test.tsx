import * as React from "react";
import { render, screen } from "@testing-library/react";

import { PortfolioCard } from "./portfolio-card";

vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" {...props} />
  ),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const baseProps = {
  slug: "acme-launch",
  title: "Acme Launch",
  client: "Acme Co.",
  industry: "E-commerce",
  services: ["Website Development", "Email Marketing"],
};

it("renders title, client, and industry", () => {
  render(<PortfolioCard {...baseProps} />);

  expect(
    screen.getByRole("heading", { name: /acme launch/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/acme co\. — e-commerce/i)).toBeInTheDocument();
});

it("renders service badges", () => {
  render(<PortfolioCard {...baseProps} />);

  expect(screen.getByText("Website Development")).toBeInTheDocument();
  expect(screen.getByText("Email Marketing")).toBeInTheDocument();
});

it("links to the detail page", () => {
  render(<PortfolioCard {...baseProps} />);

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/portfolio/acme-launch",
  );
});

it("renders cover image with alt text", () => {
  render(<PortfolioCard {...baseProps} coverImage="/cover.jpg" />);

  const image = screen.getByAltText("Acme Launch cover");
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute("src", "/cover.jpg");
});

it("falls back to placeholder when no cover image is provided", () => {
  render(<PortfolioCard {...baseProps} />);

  expect(screen.getByAltText("Acme Launch cover")).toHaveAttribute(
    "src",
    "/images/placeholder.svg",
  );
});
