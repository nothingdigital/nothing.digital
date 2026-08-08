#!/usr/bin/env tsx
/**
 * Northport, AL lead finder: Places → score → enrich → CSV.
 *
 *   pnpm lead-finder --fixture
 *   GOOGLE_PLACES_API_KEY=... pnpm lead-finder
 *   GOOGLE_PLACES_API_KEY=... HUNTER_API_KEY=... pnpm lead-finder --verticals=trades,pro
 *   AI_GATEWAY_API_KEY=... pnpm lead-finder --fixture --ai-rank --ai-limit=5
 *
 * Never import into Listmonk. See docs/runbooks/outbound-pilot.md.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyAiRanks, createGatewayRankLead } from "./ai-rank";
import { allCategoryQueries } from "./categories";
import { leadsToCsv, leadsToInstantlyCsv } from "./csv";
import { enrichLead } from "./enrich";
import { FIXTURE_CANDIDATES } from "./fixtures";
import { discoverCandidates, parseVerticals } from "./places";
import { fetchWebsiteSnapshot, scoreWebsite } from "./scorer";
import { isSuppressed, loadSuppressionList } from "./suppress";
import type { PlaceCandidate, ScoredLead } from "./types";

function argFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function argValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

async function scoreAndEnrich(
  candidates: PlaceCandidate[],
  options: {
    skipFetch: boolean;
    hunterApiKey?: string;
    blocklist: Set<string>;
    delayMs: number;
  },
): Promise<{ leads: ScoredLead[]; htmlByPlaceId: Map<string, string | null> }> {
  const results: ScoredLead[] = [];
  const htmlByPlaceId = new Map<string, string | null>();

  for (const candidate of candidates) {
    const snapshot =
      options.skipFetch || !candidate.website
        ? null
        : await fetchWebsiteSnapshot(candidate.website);

    htmlByPlaceId.set(candidate.placeId, snapshot?.html ?? null);

    const { score, reasons } = scoreWebsite(candidate.website, snapshot);
    const enrich = options.skipFetch
      ? { email: null as string | null, source: "none" as const }
      : await enrichLead({
          website: candidate.website,
          html: snapshot?.html ?? null,
          hunterApiKey: options.hunterApiKey,
        });

    results.push({
      ...candidate,
      score,
      reasons,
      email: enrich.email,
      emailSource: enrich.source,
      suppressed: isSuppressed(
        enrich.email,
        candidate.website,
        options.blocklist,
      ),
    });

    if (options.delayMs > 0 && candidate.website && !options.skipFetch) {
      await new Promise((r) => setTimeout(r, options.delayMs));
    }
  }

  return {
    leads: results.sort((a, b) => b.score - a.score),
    htmlByPlaceId,
  };
}

async function main() {
  const useFixture = argFlag("fixture");
  const useAiRank = argFlag("ai-rank");
  const verticals = parseVerticals(argValue("verticals"));
  const outDir = resolve(argValue("out") ?? "data/lead-finder/out");
  const suppressPath = resolve(
    argValue("suppress") ?? "data/lead-finder/do-not-contact.csv",
  );
  const minScore = Number(argValue("min-score") ?? "0");
  const aiLimit = Number(argValue("ai-limit") ?? "40");
  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  const hunterKey = process.env.HUNTER_API_KEY;
  const aiKey = process.env.AI_GATEWAY_API_KEY;

  if (!useFixture && !placesKey) {
    console.error("Set GOOGLE_PLACES_API_KEY or pass --fixture for a dry run.");
    process.exit(1);
  }

  if (useAiRank && !aiKey) {
    console.error("Set AI_GATEWAY_API_KEY when using --ai-rank.");
    process.exit(1);
  }

  const blocklist = loadSuppressionList(suppressPath);
  console.log(`Suppression entries: ${blocklist.size} (${suppressPath})`);

  const candidates = useFixture
    ? FIXTURE_CANDIDATES.filter((row) =>
        verticals ? verticals.includes(row.vertical) : true,
      )
    : await discoverCandidates(placesKey!, allCategoryQueries(verticals));

  console.log(`Candidates: ${candidates.length}`);

  const { leads: scored, htmlByPlaceId } = await scoreAndEnrich(candidates, {
    skipFetch: useFixture,
    hunterApiKey: hunterKey,
    blocklist,
    delayMs: useFixture ? 0 : 150,
  });

  let ranked = scored;
  if (useAiRank && aiKey) {
    const limit = Number.isFinite(aiLimit) ? aiLimit : 40;
    console.log(`AI ranking top ${limit} by rule score…`);
    const rankLead = await createGatewayRankLead({
      apiKey: aiKey,
      model: process.env.AI_MODEL,
    });
    ranked = await applyAiRanks(scored, {
      rankLead,
      limit,
      htmlByPlaceId,
      onProgress: (done, total, name) => {
        console.log(`  AI ${done}/${total}: ${name}`);
      },
    });
  }

  const filtered = ranked.filter((lead) => {
    const key = lead.aiScore ?? lead.score;
    return key >= minScore;
  });
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const allPath = resolve(outDir, `northport-leads-${stamp}.csv`);
  const instantlyPath = resolve(outDir, `instantly-import-${stamp}.csv`);

  writeFileSync(allPath, leadsToCsv(filtered));
  writeFileSync(instantlyPath, leadsToInstantlyCsv(filtered));

  const withEmail = filtered.filter((l) => l.email && !l.suppressed).length;
  const withAi = filtered.filter((l) => l.aiScore != null).length;
  console.log(`Wrote ${allPath}`);
  console.log(`Wrote ${instantlyPath} (${withEmail} rows with email)`);
  if (useAiRank) {
    console.log(`AI-ranked rows: ${withAi}`);
  }
  console.log(
    `High-intent (score≥30): ${filtered.filter((l) => (l.aiScore ?? l.score) >= 30).length}`,
  );
  console.log(
    "Next: human-review CSV → Instantly only. Never Listmonk. See docs/runbooks/outbound-pilot.md",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
