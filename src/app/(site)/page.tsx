import Link from "next/link";
import { ArrowRight, Clock, Target, Users } from "lucide-react";
import dynamic from "next/dynamic";

import { SectionContainer } from "@/components/atoms/section-container";
import { Reveal } from "@/components/atoms/reveal";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { HeroClock } from "@/components/atoms/hero-clock";
import { routes } from "@/lib/routes";
import { serviceSummaries } from "@/lib/services";

// ponytail: lazy-load newsletter form because it sits below the fold and bundles react-hook-form.
const NewsletterForm = dynamic(() =>
  import("@/components/organisms/newsletter-form").then(
    (m) => m.NewsletterForm,
  ),
);

// ponytail: static differentiator copy; move to CMS when content grows.
const differentiators = [
  {
    title: "Built on time",
    description:
      "Fixed timelines agreed up front. Weekly demos, no black-box development, no surprise slips.",
    icon: <Clock className="h-6 w-6" />,
  },
  {
    title: "Senior only",
    description:
      "The people who scope your project are the people who build it. No hand-offs to juniors, no account-manager telephone.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Measured outcomes",
    description:
      "Every engagement defines success metrics before kickoff — conversion, activation, revenue — and reports against them.",
    icon: <Target className="h-6 w-6" />,
  },
];

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SectionContainer className="pb-16 pt-20 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div className="relative text-center md:text-left">
            <div
              aria-hidden
              className="hero-glow pointer-events-none absolute -inset-16"
            />
            <p className="relative font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Est. on time, every time
            </p>
            <h1 className="relative mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Built on time.{" "}
              <span className="italic text-primary">Built to last.</span>
            </h1>
            <p className="relative mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:mx-0 md:text-xl">
              Nothing.Digital ships premium websites, custom software,
              applications, email marketing, and AI — plus hands-on teaching for
              tech literacy and coding — delivered precisely when you need it.
            </p>
            <div className="relative mt-10 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.55)] sm:w-auto"
              >
                <Link href={routes.contact}>
                  Book a free scoping call <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href={routes.services.index}>Explore services</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <HeroClock />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted" id="services">
        <Reveal>
          <SectionHeading
            kicker="What we do"
            title="Services"
            description="End-to-end digital expertise."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSummaries.map((service, index) => (
            <Reveal
              key={service.href}
              delay={index * 0.08}
              className="h-full [&>a]:h-full"
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={<service.icon className="h-6 w-6" />}
                href={service.href}
              />
            </Reveal>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="why-us">
        <Reveal>
          <SectionHeading
            kicker="Why Nothing Digital"
            title="Small studio. Senior hands."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} className="h-full">
              <div className="h-full rounded-xl border-2 border-border bg-card p-6 shadow-md transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-display text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer variant="primary" id="newsletter">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary-foreground">
              The monthly dispatch
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Stay in the loop
            </h2>
            <p className="mt-4 text-primary-foreground">
              One email a month. No spam, just insights.
            </p>
            <div className="mt-8 inline-block w-full max-w-md text-left">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </SectionContainer>

      <SectionContainer>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Your move
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Ready to build?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Book a free scoping call — we will map scope, timeline, and budget
              before you commit.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                asChild
                className="w-full shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.55)] sm:w-auto"
              >
                <Link href={routes.contact}>Book a free scoping call</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </SectionContainer>
    </>
  );
}
