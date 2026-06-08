// PHASE-3 (Vision) — Daily & Niche discovery scoring. Pure, no I/O, no LLM
// (SUS-002, NOGOAL-001). Niche must NOT be dominated by absolute stars (STORY-003).

export interface DiscoveryCandidate {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
}

/** Daily "interesting" score: blended popularity + engagement (deterministic). */
export function dailyScore(c: DiscoveryCandidate): number {
  const popularity = Math.log10(Math.max(c.stars, 0) + 1) * 10;
  const engagement = Math.log10(Math.max(c.forks, 0) + 1) * 6;
  return Math.round((popularity + engagement) * 100) / 100;
}

/**
 * Niche quality score: rewards healthy, functional repos in a growth band rather
 * than mega-stars. A 200-star repo with good fork engagement + description can
 * outrank a 50k-star stale giant.
 */
export function nicheQualityScore(c: DiscoveryCandidate): number {
  const stars = Math.max(c.stars, 0);
  const forks = Math.max(c.forks, 0);

  // Growth band: peak interest for ~100..5000 stars, penalty far outside.
  let band: number;
  if (stars < 20) band = 5;
  else if (stars < 100) band = 25;
  else if (stars <= 5000) band = 50; // sweet spot
  else if (stars <= 20000) band = 30;
  else band = 12; // mega-repos are not "niche finds"

  // Engagement: forks per star (capped) — signals real usage, not vanity stars.
  const ratio = stars > 0 ? Math.min(forks / stars, 0.5) : 0;
  const engagement = ratio * 40;

  // Completeness signals.
  const meta = (c.description ? 8 : 0) + (c.language ? 6 : 0);

  return Math.round((band + engagement + meta) * 100) / 100;
}

// TERM-004 / TEST-009: niche discovery hard-excludes giants. This is a FILTER at the
// selector boundary (a giant never appears), not a score penalty (which would only
// rank it lower). Daily Top is NOT filtered — popular giants may legitimately appear there.
export const NICHE_MAX_STARS = 50000;

export function nicheEligible(c: DiscoveryCandidate): boolean {
  return Math.max(c.stars, 0) <= NICHE_MAX_STARS;
}

export interface ScoredCandidate extends DiscoveryCandidate {
  rank: number;
  score: number;
  reason: string;
}

export function rankBy(
  candidates: DiscoveryCandidate[],
  scorer: (c: DiscoveryCandidate) => number,
  reason: (c: DiscoveryCandidate, score: number) => string,
  topN: number,
): ScoredCandidate[] {
  return candidates
    .map((c) => ({ ...c, score: scorer(c), reason: "" }))
    .sort((a, b) => b.score - a.score || b.stars - a.stars)
    .slice(0, topN)
    .map((c, i) => ({ ...c, rank: i + 1, reason: reason(c, c.score) }));
}

export function dailyReason(c: DiscoveryCandidate): string {
  return `${c.stars.toLocaleString("de-DE")} Stars${c.language ? ` · ${c.language}` : ""}`;
}

export function nicheReason(c: DiscoveryCandidate): string {
  const ratio = c.stars > 0 ? c.forks / c.stars : 0;
  if (ratio > 0.15) return `Starke Nutzung (${c.forks.toLocaleString("de-DE")} Forks bei ${c.stars.toLocaleString("de-DE")} Stars).`;
  if (c.stars >= 100 && c.stars <= 5000) return `Hochwertiges Projekt im Wachstumsbereich (${c.stars.toLocaleString("de-DE")} Stars).`;
  return `Funktionales Repo mit Potenzial${c.language ? ` (${c.language})` : ""}.`;
}
