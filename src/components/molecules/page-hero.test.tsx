import { render, screen } from "@testing-library/react";

import { PageHero } from "./page-hero";

it("renders kicker, title, and description", () => {
  render(
    <PageHero
      kicker="What we do"
      title="Services"
      description="All the things."
    />,
  );

  expect(screen.getByText("What we do")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Services", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByText("All the things.")).toBeInTheDocument();
});
