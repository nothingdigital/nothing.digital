import * as React from "react";
import { render, screen } from "@testing-library/react";

import { BlogCard } from "./blog-card";

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
  slug: "why-performance-matters",
  title: "Why Performance Matters",
  excerpt: "Speed shapes revenue, trust, and search visibility.",
  date: "2026-07-15",
  author: "Alex Vance",
  tags: ["Performance", "SEO"],
};

it("renders title, excerpt, and author", () => {
  render(<BlogCard {...baseProps} />);

  expect(
    screen.getByRole("heading", { name: /why performance matters/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/speed shapes revenue/i)).toBeInTheDocument();
  expect(screen.getByText(/alex vance/i)).toBeInTheDocument();
});

it("formats the date for display", () => {
  render(<BlogCard {...baseProps} />);

  expect(screen.getByText(/july 15, 2026/i)).toBeInTheDocument();
});

it("renders tag badges", () => {
  render(<BlogCard {...baseProps} />);

  expect(screen.getByText("Performance")).toBeInTheDocument();
  expect(screen.getByText("SEO")).toBeInTheDocument();
});

it("links to the post detail page", () => {
  render(<BlogCard {...baseProps} />);

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/blog/why-performance-matters",
  );
});

it("renders cover image with alt text", () => {
  render(<BlogCard {...baseProps} coverImage="/cover.jpg" />);

  expect(screen.getByAltText("Why Performance Matters cover")).toHaveAttribute(
    "src",
    "/cover.jpg",
  );
});

it("falls back to placeholder when no cover image is provided", () => {
  render(<BlogCard {...baseProps} />);

  expect(screen.getByAltText("Why Performance Matters cover")).toHaveAttribute(
    "src",
    "/images/placeholder.svg",
  );
});
