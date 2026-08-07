export type VerticalPack = "trades" | "pro" | "hospitality";

export type PlaceCandidate = {
  placeId: string;
  name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  types: string[];
  rating: number | null;
  reviewCount: number | null;
  vertical: VerticalPack;
  query: string;
};

export type ScoreResult = {
  score: number;
  reasons: string[];
};

export type ScoredLead = PlaceCandidate &
  ScoreResult & {
    email: string | null;
    emailSource: "hunter" | "mailto" | "none";
    suppressed: boolean;
  };

export type CategoryQuery = {
  vertical: VerticalPack;
  textQuery: string;
};
