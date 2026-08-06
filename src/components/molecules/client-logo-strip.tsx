import { cn } from "@/lib/utils";

// ponytail: placeholder logo strip. Replace with real client logos once assets + clearance exist.
// Initials map to anonymized categories; no fabricated client names.
const PLACEHOLDER_LOGOS = [
  { initials: "FP", label: "Fintech Platform" },
  { initials: "RB", label: "Retail Brand" },
  { initials: "SS", label: "SaaS Startup" },
  { initials: "HO", label: "Healthcare Org" },
  { initials: "MB", label: "Media Brand" },
];

export function ClientLogoStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale",
        className,
      )}
      aria-label="Trusted by teams across fintech, retail, SaaS, healthcare, and media"
    >
      {PLACEHOLDER_LOGOS.map(({ initials, label }) => (
        <div
          key={initials}
          className="flex h-12 items-center gap-2 rounded-md border border-border bg-card px-3"
          title={label}
        >
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="text-muted-foreground"
          >
            <rect
              width="32"
              height="32"
              rx="6"
              fill="currentColor"
              fillOpacity="0.12"
            />
            <text
              x="16"
              y="21"
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontWeight="600"
              fill="currentColor"
            >
              {initials}
            </text>
          </svg>
          <span className="sr-only">{label}</span>
        </div>
      ))}
    </div>
  );
}
