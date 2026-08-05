import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Applications",
  description:
    "Mobile and web applications built for scale, engagement, and long-term maintainability.",
  alternates: { canonical: routes.services.applications },
  openGraph: {
    title: "Applications",
    description:
      "Mobile and web applications built for scale, engagement, and long-term maintainability.",
    url: routes.services.applications,
    type: "website",
  },
};

const features = [
  "Cross-platform mobile apps",
  "Progressive web applications",
  "Real-time data and collaboration",
  "Authentication and user management",
  "Offline support and sync",
  "App store publishing assistance",
];

const techStack = [
  {
    name: "React Native / Expo",
    rationale: "Ship iOS and Android from one codebase without doubling cost.",
  },
  {
    name: "Next.js",
    rationale: "Progressive web apps and companion web UIs with strong SEO.",
  },
  {
    name: "Node.js",
    rationale: "APIs and realtime services that scale with your user base.",
  },
  {
    name: "PostgreSQL",
    rationale: "Solid data layer for auth, sync, and product analytics.",
  },
];

const processSteps = [
  {
    title: "Discover",
    description: "Define user personas, journeys, and core features.",
  },
  {
    title: "Design",
    description: "Prototype intuitive interfaces and interactions.",
  },
  {
    title: "Develop",
    description: "Engineer robust frontends, backends, and APIs.",
  },
  {
    title: "Deliver",
    description: "Release, monitor, and refine based on usage data.",
  },
];

const faqItems = [
  {
    question: "Do you build native mobile apps?",
    answer:
      "We typically use cross-platform frameworks to ship iOS and Android from a single codebase, reducing cost and time to market.",
  },
  {
    question: "Can you take over an existing app?",
    answer:
      "Yes. We audit the codebase, stabilize critical issues, and recommend a roadmap before making changes.",
  },
];

const jsonLd = {
  "@type": "Service",
  name: "Applications",
  description:
    "Mobile and web applications built for scale, engagement, and long-term maintainability.",
  provider: {
    "@type": "Organization",
    name: "Nothing.Digital",
    url: "https://nothing.digital",
  },
};

export default function ApplicationsPage() {
  return (
    <MarketingLayout>
      <ServicePageTemplate
        title="Applications"
        description="Mobile and web applications built for scale, engagement, and long-term maintainability."
        problem="Users expect fast, reliable apps. A poor mobile experience loses engagement and market share."
        solution="We design and build web and mobile applications that keep users engaged and your engineering team sane."
        features={features}
        techStack={techStack}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
