import { render, screen } from "@testing-library/react";

import { ServicePageTemplate } from "./service-page";

const defaultProps = {
  title: "Test Service",
  description: "Test service description.",
  problem: "A big problem.",
  solution: "A smart solution.",
  features: ["Feature one", "Feature two"],
  processSteps: [{ title: "Step one", description: "Do the first thing." }],
  faqItems: [{ question: "First question?", answer: "First answer." }],
};

it("renders the service title and description", () => {
  render(<ServicePageTemplate {...defaultProps} />);

  expect(
    screen.getByRole("heading", { name: /test service/i, level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByText(/test service description/i)).toBeInTheDocument();
});

it("renders features, process steps, FAQ, and a contact CTA", () => {
  render(<ServicePageTemplate {...defaultProps} />);

  expect(screen.getByText("Feature one")).toBeInTheDocument();
  expect(screen.getByText("Step one")).toBeInTheDocument();
  expect(screen.getByText("First question?")).toBeInTheDocument();

  const cta = screen.getByRole("link", { name: /book a free scoping call/i });
  expect(cta).toHaveAttribute("href", "/contact");
});

it("skips empty sections when no data is provided", () => {
  render(
    <ServicePageTemplate
      {...defaultProps}
      features={[]}
      processSteps={[]}
      faqItems={[]}
    />,
  );

  expect(screen.queryByText("Feature one")).not.toBeInTheDocument();
  expect(screen.queryByText("Step one")).not.toBeInTheDocument();
  expect(screen.queryByText("First question?")).not.toBeInTheDocument();
});

it("renders tech stack when provided", () => {
  render(
    <ServicePageTemplate
      {...defaultProps}
      techStack={[
        {
          name: "Next.js",
          rationale: "Static by default.",
        },
      ]}
    />,
  );

  expect(screen.getByText("Next.js")).toBeInTheDocument();
  expect(screen.getByText("Static by default.")).toBeInTheDocument();
});

it("renders JSON-LD schema when provided", () => {
  render(
    <ServicePageTemplate
      {...defaultProps}
      jsonLd={{ "@type": "Service", name: "Test" }}
    />,
  );

  const script = document.querySelector('script[type="application/ld+json"]');
  expect(script).toBeInTheDocument();
});
