import {
  Code,
  Globe,
  GraduationCap,
  Mail,
  Monitor,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

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
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    description:
      "Practical AI built into your product, site, or ops — on a fixed timeline.",
    icon: Sparkles,
    href: routes.services.aiSolutions,
  },
  {
    slug: "tech-literacy",
    title: "Tech Literacy",
    description:
      "Patient, jargon-free sessions for older adults and beginners — computers, internet, everyday tech.",
    icon: Monitor,
    href: routes.services.techLiteracy,
  },
  {
    slug: "coding-sql",
    title: "Coding & SQL",
    description:
      "Project-based coding and SQL for kids, youth, and curious beginners.",
    icon: GraduationCap,
    href: routes.services.codingSql,
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
  "ai-solutions": {
    slug: "ai-solutions",
    title: "AI Solutions",
    description:
      "Practical AI built into your business, website, or product — delivered on a fixed timeline.",
    href: routes.services.aiSolutions,
    problem:
      "AI demos look impressive. Most never fit your real workflow, and teams are left guessing what to trust.",
    solution:
      "We implement AI where it earns its keep — assistants, content helpers with people in charge of the narrative, and process automation — then teach your team how to run it.",
    features: [
      "AI assistants and chat embedded in your product or site",
      "Workflow automation with human review where it matters",
      "Content helpers that keep people in charge of the narrative",
      "Team enablement so adoption sticks after launch",
      "Integration with tools you already use",
      "Clear success metrics and iteration plan",
    ],
    techStack: [
      {
        name: "Vercel AI SDK",
        rationale:
          "Ship streaming assistants and tool calls without a fragile custom stack.",
      },
      {
        name: "OpenAI / Anthropic APIs",
        rationale:
          "Pick the model that fits the job — quality, cost, and latency — not a vendor slogan.",
      },
      {
        name: "Next.js",
        rationale:
          "AI features live next to your product UI so shipping stays simple.",
      },
      {
        name: "PostgreSQL + vector search when needed",
        rationale: "Ground answers in your data instead of generic chat fluff.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description:
          "Map the workflow, data sources, and where AI actually saves time.",
      },
      {
        title: "Design",
        description:
          "Define prompts, guardrails, and the human-in-the-loop checkpoints.",
      },
      {
        title: "Develop",
        description:
          "Build, evaluate, and harden the integration against real cases.",
      },
      {
        title: "Deliver",
        description:
          "Launch, train your team, and measure outcomes on a fixed timeline.",
      },
    ],
    faqItems: [
      {
        question: "Do you only build chatbots?",
        answer:
          "No. Chat is one pattern. We also automate document review, support triage, internal search, and content drafts — always with clear ownership and review.",
      },
      {
        question: "Will you train our team?",
        answer:
          "Yes. Implementation includes practical enablement so your team can use and maintain what we ship — not a black box handoff.",
      },
    ],
    jsonLd: serviceJsonLd(
      "AI Solutions",
      "Practical AI built into your business, website, or product — delivered on a fixed timeline.",
    ),
  },
  "tech-literacy": {
    slug: "tech-literacy",
    title: "Tech Literacy",
    description:
      "Patient, jargon-free teaching for older adults and absolute beginners — computers, internet basics, and everyday technology.",
    href: routes.services.techLiteracy,
    problem:
      "New devices and apps change fast. Feeling behind is frustrating — and asking for help can feel worse.",
    solution:
      "One-on-one or small-group sessions that move at your pace: devices, browsers, email, and online safety — no shame, no jargon. When you want to learn to code, we point you to Coding & SQL.",
    features: [
      "Private or small-group sessions",
      "Devices, accounts, and everyday apps",
      "Browsers, email, and online safety",
      "Passwords, scams, and privacy basics",
      "Notes you can keep and refer back to",
      "Clear next steps after each session",
    ],
    techStack: [
      {
        name: "Your devices",
        rationale:
          "We teach on the phone, tablet, or computer you already use.",
      },
      {
        name: "Common platforms",
        rationale:
          "Windows, macOS, iOS, Android, Chrome, and the apps you rely on day to day.",
      },
      {
        name: "Safety-first habits",
        rationale: "Updates, 2FA, and scam awareness before advanced tricks.",
      },
      {
        name: "Patient pacing",
        rationale:
          "Repeat, practice, and notes — never a lecture that leaves you behind.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description: "Learn your goals, comfort level, and the tools you use.",
      },
      {
        title: "Design",
        description: "Build a short lesson plan matched to what you need next.",
      },
      {
        title: "Practice",
        description: "Work together with hands-on exercises, not lectures.",
      },
      {
        title: "Follow-up",
        description:
          "Leave with notes and confidence to keep going on your own.",
      },
    ],
    faqItems: [
      {
        question: "Is this only for older adults?",
        answer:
          "It is built especially for older adults and absolute beginners, but anyone who wants patient, practical tech help is welcome.",
      },
      {
        question: "Do sessions happen in person or online?",
        answer:
          "Either. We can meet locally when it works, or join by video. Tell us what is easiest when you book.",
      },
    ],
    jsonLd: serviceJsonLd(
      "Tech Literacy",
      "Patient, jargon-free teaching for older adults and absolute beginners — computers, internet basics, and everyday technology.",
    ),
  },
  "coding-sql": {
    slug: "coding-sql",
    title: "Coding & SQL",
    description:
      "Project-based coding and SQL foundations for kids, youth, and curious beginners.",
    href: routes.services.codingSql,
    problem:
      "Most coding courses bury beginners in theory. Kids and adults learn faster when they build something real.",
    solution:
      "Short, project-based lessons: small programs, databases, and SQL queries — so learners see how data and code actually work.",
    features: [
      "Youth-friendly pacing with clear goals",
      "Hands-on projects, not slide decks",
      "Intro programming fundamentals",
      "SQL queries and how databases store data",
      "Open to adults and beginners of any age",
      "Parent/guardian clarity on progress and next steps",
    ],
    techStack: [
      {
        name: "Beginner-friendly languages",
        rationale:
          "Start where confidence sticks — Python or similar — then grow from there.",
      },
      {
        name: "SQL + relational databases",
        rationale:
          "Real queries against real tables so “data” stops being abstract.",
      },
      {
        name: "Browser-based tools",
        rationale:
          "Low setup friction so sessions focus on learning, not installs.",
      },
      {
        name: "Small projects",
        rationale: "Each lesson ends with something they can show and explain.",
      },
    ],
    processSteps: [
      {
        title: "Discover",
        description:
          "Match age, interest, and experience so the first project fits.",
      },
      {
        title: "Design",
        description: "Pick a short project path and the skills it will teach.",
      },
      {
        title: "Build",
        description: "Code, query, and debug together on a real mini-project.",
      },
      {
        title: "Review",
        description:
          "Celebrate what they shipped and outline the next skills to unlock.",
      },
    ],
    faqItems: [
      {
        question: "What ages do you teach?",
        answer:
          "Especially kids and youth, but adults and total beginners are welcome. We adjust pace and projects to the learner.",
      },
      {
        question: "Do parents need to be technical?",
        answer:
          "No. We share plain-language progress notes and what to practice between sessions.",
      },
    ],
    jsonLd: serviceJsonLd(
      "Coding & SQL",
      "Project-based coding and SQL foundations for kids, youth, and curious beginners.",
    ),
  },
};
