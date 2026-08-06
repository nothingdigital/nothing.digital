import { Code, Globe, Mail, Smartphone, type LucideIcon } from "lucide-react";

import { routes, type ServiceSlug } from "@/lib/routes";

export interface ServiceSummary {
  slug: ServiceSlug;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

// ponytail: static service placeholders; replace with CMS/config-driven data when content is ready.
export const serviceSummaries: ServiceSummary[] = [
  {
    slug: "website-development",
    title: "Website Development",
    description:
      "Custom, responsive websites built for performance and conversion.",
    icon: Globe,
    href: routes.services.websiteDevelopment,
  },
  {
    slug: "software-solutions",
    title: "Software Solutions",
    description:
      "Bespoke software and automation tools tailored to your workflow.",
    icon: Code,
    href: routes.services.softwareSolutions,
  },
  {
    slug: "applications",
    title: "Applications",
    description: "Mobile and web apps designed for scale and user engagement.",
    icon: Smartphone,
    href: routes.services.applications,
  },
  {
    slug: "email-marketing",
    title: "Email Marketing",
    description: "Data-driven campaigns that nurture leads and drive revenue.",
    icon: Mail,
    href: routes.services.emailMarketing,
  },
];

export interface ServiceDetail {
  slug: ServiceSlug;
  title: string;
  description: string;
  href: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: { name: string; rationale: string }[];
  processSteps: { title: string; description: string }[];
  faqItems: { question: string; answer: string }[];
  jsonLd: Record<string, unknown>;
}

function serviceJsonLd(title: string, description: string) {
  return {
    "@type": "Service",
    name: title,
    description,
    provider: {
      "@type": "Organization",
      name: "Nothing.Digital",
      url: "https://nothing.digital",
    },
  };
}

export const serviceDetails: Record<ServiceSlug, ServiceDetail> = {
  "website-development": {
    slug: "website-development",
    title: "Website Development",
    description:
      "Custom, responsive websites built for performance, accessibility, and conversion.",
    href: routes.services.websiteDevelopment,
    problem:
      "A slow, outdated, or hard-to-manage website quietly costs you leads and credibility.",
    solution:
      "We design and build fast, accessible websites that communicate your value and turn visitors into customers.",
    features: [
      "Responsive design for every device",
      "Accessibility-first markup",
      "Performance-optimized builds",
      "SEO-ready structure and metadata",
      "CMS integration when you need it",
      "Analytics and conversion tracking",
    ],
    techStack: [
      {
        name: "Next.js",
        rationale:
          "Static HTML by default so Core Web Vitals stay strong without a fight.",
      },
      {
        name: "React",
        rationale:
          "Component model that keeps complex UIs maintainable as you grow.",
      },
      {
        name: "TypeScript",
        rationale:
          "Catches regressions early and makes handoffs safer for your team.",
      },
      {
        name: "Tailwind CSS",
        rationale: "Fast iteration on design systems without CSS debt.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description: "Understand your audience, brand, and business goals.",
      },
      {
        title: "Design",
        description: "Wireframes and visual design tuned for conversion.",
      },
      {
        title: "Develop",
        description: "Clean, maintainable code with modern frameworks.",
      },
      {
        title: "Deliver",
        description: "Launch, monitor, and iterate based on real data.",
      },
    ],
    faqItems: [
      {
        question: "How long does a typical website take?",
        answer:
          "Most brochure sites launch in 4–6 weeks. Larger builds with custom CMS or e-commerce features take 8–12 weeks.",
      },
      {
        question: "Do you work with existing designs?",
        answer:
          "Yes. We can build from your Figma files or design the experience from scratch.",
      },
    ],
    jsonLd: serviceJsonLd(
      "Website Development",
      "Custom, responsive websites built for performance, accessibility, and conversion.",
    ),
  },
  "software-solutions": {
    slug: "software-solutions",
    title: "Software Solutions",
    description:
      "Bespoke software and automation tools that streamline operations and unlock growth.",
    href: routes.services.softwareSolutions,
    problem:
      "Off-the-shelf tools force your team into rigid workflows, creating manual work and missed opportunities.",
    solution:
      "We build custom software and automations that fit your exact process, saving time and reducing errors.",
    features: [
      "Custom internal tools and dashboards",
      "Workflow automation",
      "Third-party API integrations",
      "Data pipelines and reporting",
      "Scalable cloud architecture",
      "Ongoing support and maintenance",
    ],
    techStack: [
      {
        name: "Node.js",
        rationale: "Reliable server runtime for APIs, jobs, and integrations.",
      },
      {
        name: "PostgreSQL",
        rationale:
          "Relational data with integrity when your workflows get complex.",
      },
      {
        name: "TypeScript",
        rationale:
          "Shared types across client and server reduce integration bugs.",
      },
      {
        name: "Next.js",
        rationale:
          "Admin UIs and dashboards that ship with the same stack as the API.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description: "Map your current workflow and identify bottlenecks.",
      },
      {
        title: "Design",
        description: "Architect the simplest system that solves the problem.",
      },
      {
        title: "Develop",
        description: "Build iteratively with clean code and automated tests.",
      },
      {
        title: "Deliver",
        description: "Deploy, train your team, and measure impact.",
      },
    ],
    faqItems: [
      {
        question: "Do you build on top of existing platforms?",
        answer:
          "Absolutely. We integrate with the tools you already use rather than rebuilding what already works.",
      },
      {
        question: "How do you handle ongoing changes?",
        answer:
          "We ship in small, reversible increments and offer maintenance retainers for continuous improvement.",
      },
    ],
    jsonLd: serviceJsonLd(
      "Software Solutions",
      "Bespoke software and automation tools that streamline operations and unlock growth.",
    ),
  },
  applications: {
    slug: "applications",
    title: "Applications",
    description:
      "Mobile and web applications built for scale, engagement, and long-term maintainability.",
    href: routes.services.applications,
    problem:
      "Users expect fast, reliable apps. A poor mobile experience loses engagement and market share.",
    solution:
      "We design and build web and mobile applications that keep users engaged and your engineering team sane.",
    features: [
      "Cross-platform mobile apps",
      "Progressive web applications",
      "Real-time data and collaboration",
      "Authentication and user management",
      "Offline support and sync",
      "App store publishing assistance",
    ],
    techStack: [
      {
        name: "React Native / Expo",
        rationale:
          "Ship iOS and Android from one codebase without doubling cost.",
      },
      {
        name: "Next.js",
        rationale:
          "Progressive web apps and companion web UIs with strong SEO.",
      },
      {
        name: "Node.js",
        rationale: "APIs and realtime services that scale with your user base.",
      },
      {
        name: "PostgreSQL",
        rationale: "Solid data layer for auth, sync, and product analytics.",
      },
    ],
    processSteps: [
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
    ],
    faqItems: [
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
    ],
    jsonLd: serviceJsonLd(
      "Applications",
      "Mobile and web applications built for scale, engagement, and long-term maintainability.",
    ),
  },
  "email-marketing": {
    slug: "email-marketing",
    title: "Email Marketing",
    description:
      "Data-driven email campaigns that nurture leads, retain customers, and drive revenue.",
    href: routes.services.emailMarketing,
    problem:
      "Email lists are valuable, but generic blasts burn trust and leave revenue on the table.",
    solution:
      "We create targeted, automated email programs that turn subscribers into loyal customers.",
    features: [
      "Strategy and segmentation",
      "Template design and development",
      "Automated drip and lifecycle flows",
      "A/B testing and optimization",
      "Deliverability and compliance",
      "Performance reporting",
    ],
    techStack: [
      {
        name: "Klaviyo / HubSpot / Mailchimp",
        rationale:
          "We meet you on the ESP you already use — or recommend one that fits.",
      },
      {
        name: "HTML email templates",
        rationale: "Bulletproof markup that renders cleanly across clients.",
      },
      {
        name: "Analytics & attribution",
        rationale: "Tie opens and clicks to conversions, not vanity metrics.",
      },
      {
        name: "Automation workflows",
        rationale: "Lifecycle journeys that run without constant manual sends.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description: "Audit your list, goals, and current performance.",
      },
      {
        title: "Design",
        description: "Create templates and a content calendar.",
      },
      {
        title: "Develop",
        description: "Build automations, segments, and tracking.",
      },
      {
        title: "Deliver",
        description: "Send, measure, and iterate for higher ROI.",
      },
    ],
    faqItems: [
      {
        question: "Which email platforms do you work with?",
        answer:
          "We work with Mailchimp, Klaviyo, HubSpot, ConvertKit, and most major ESPs.",
      },
      {
        question: "How do you measure success?",
        answer:
          "We track opens, clicks, conversions, and revenue attribution, then optimize based on what moves the needle.",
      },
    ],
    jsonLd: serviceJsonLd(
      "Email Marketing",
      "Data-driven email campaigns that nurture leads, retain customers, and drive revenue.",
    ),
  },
};
