import type { PlaceCandidate } from "../../src/lib/leads/places";

export type { PlaceCandidate };
export type VerticalPack = "trades" | "pro" | "hospitality";

export type ScoreResult = {
  score: number;
  reasons: string[];
};

export type ScoredLead = PlaceCandidate &
  ScoreResult & {
    email: string | null;
    emailSource: "hunter" | "mailto" | "none";
    suppressed: boolean;
    /** Optional LLM fit score when `--ai-rank` ran. */
    aiScore?: number | null;
    aiReason?: string | null;
    /** Optional Instantly one-liner; HITL only — never auto-sent. */
    personalization?: string | null;
  };

export type CategoryQuery = {
  vertical: VerticalPack;
  textQuery: string;
};
