import { SectionContainer } from "@/components/atoms/section-container";

export interface PageHeroProps {
  kicker: string;
  title: string;
  description: string;
}

export function PageHero({ kicker, title, description }: PageHeroProps) {
  return (
    <SectionContainer className="pt-24 md:pt-32">
      <div className="relative mx-auto max-w-3xl text-center">
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute -inset-16"
        />
        <p className="relative font-mono text-xs uppercase tracking-[0.35em] text-accent">
          {kicker}
        </p>
        <h1 className="relative mt-3 font-display text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="relative mt-4 text-lg text-muted-foreground">
          {description}
        </p>
      </div>
    </SectionContainer>
  );
}
