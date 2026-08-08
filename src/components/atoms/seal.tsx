import { cn } from "@/lib/utils";

interface SealProps {
  className?: string;
}

// ponytail: SVG seal from the business-card stamp. Literal uppercase — CSS
// text-transform on textPath mis-positions glyphs and makes the ring look wonky.
export function Seal({ className }: SealProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("aspect-square h-24 w-24 shrink-0", className)}
      fill="currentColor"
      role="img"
      aria-label="The Business of Nothing LLC. Established 2026, Northport, Alabama."
    >
      <defs>
        {/* Top: L→R through top. Bottom: L→R through bottom (letters stay upright). */}
        <path id="seal-top" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
        <path id="seal-bottom" d="M 30,100 A 70,70 0 0,0 170,100" fill="none" />
      </defs>

      {/* Double outer ring (business-card stamp) */}
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <text
        fill="currentColor"
        fontSize="9"
        letterSpacing="1.2"
        className="font-display"
      >
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          • THE BUSINESS OF NOTHING LLC. •
        </textPath>
      </text>

      <text
        fill="currentColor"
        fontSize="7.5"
        letterSpacing="1.1"
        className="font-display"
      >
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          EST. 2026 · NORTHPORT, AL
        </textPath>
      </text>
    </svg>
  );
}
