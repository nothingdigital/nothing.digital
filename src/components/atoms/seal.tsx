import { cn } from "@/lib/utils";

interface SealProps {
  className?: string;
}

// ponytail: SVG seal based on the business-card stamp.
export function Seal({ className }: SealProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-24 w-24", className)}
      fill="currentColor"
      role="img"
      aria-label="The Business of Nothing LLC. Established 2026, Northport, Alabama."
    >
      <defs>
        <path id="seal-top" d="M 28,100 A 72,72 0 0,1 172,100" fill="none" />
        <path id="seal-bottom" d="M 28,100 A 72,72 0 0,0 172,100" fill="none" />
      </defs>

      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="100"
        r="64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle cx="36" cy="100" r="2" />
      <circle cx="164" cy="100" r="2" />

      <text
        fontSize="10"
        letterSpacing="1.4"
        className="font-display uppercase"
      >
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          The Business of Nothing LLC
        </textPath>
      </text>

      <text fontSize="8" letterSpacing="1" className="font-display uppercase">
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          Est. 2026 · Northport, AL
        </textPath>
      </text>
    </svg>
  );
}
