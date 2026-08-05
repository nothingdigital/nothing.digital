import { render, screen } from "@testing-library/react";

import { SectionContainer } from "./section-container";

describe("SectionContainer", () => {
  it("renders children with default variant", () => {
    render(<SectionContainer>content</SectionContainer>);

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies muted variant class", () => {
    render(<SectionContainer variant="muted">muted</SectionContainer>);

    expect(screen.getByText("muted").closest("section")).toHaveClass(
      "bg-muted",
    );
  });

  it("applies primary variant class", () => {
    render(<SectionContainer variant="primary">primary</SectionContainer>);

    expect(screen.getByText("primary").closest("section")).toHaveClass(
      "bg-primary",
    );
  });

  it("passes id to section", () => {
    render(<SectionContainer id="newsletter">newsletter</SectionContainer>);

    expect(document.getElementById("newsletter")).toBeInTheDocument();
  });
});
