import { SectionContainer } from "@/components/atoms/section-container";

export interface PageHeroProps {
  kicker: string;
  title: string;
  description: string;
}

export function PageHero({ kicker, title, description }: PageHeroProps) {
  return (
    <SectionContainer className="pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </div>
    </SectionContainer>
  );
}
