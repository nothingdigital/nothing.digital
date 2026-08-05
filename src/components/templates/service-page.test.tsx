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

  const cta = screen.getByRole("link", { name: /discuss your project/i });
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

it("renders related case studies when provided", () => {
  render(
    <ServicePageTemplate
      {...defaultProps}
      caseStudies={[
        {
          title: "Acme Launch",
          description: "Great results.",
          href: "/portfolio/acme-launch",
        },
      ]}
    />,
  );

  expect(screen.getByText("Acme Launch")).toBeInTheDocument();
  expect(screen.getByText("Great results.")).toBeInTheDocument();
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
