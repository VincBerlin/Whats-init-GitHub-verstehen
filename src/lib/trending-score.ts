// PHASE-5 / TERM-008 — Weekly Momentum Score. Pure function, no I/O, no LLM
// (SUS-003). Rewards weekly growth (momentum) with a small size baseline so the
// first population (no prior snapshot → deltas 0) still ranks meaningfully.

export interface ScoreInput {
  stars: number;
  forks: number;
  starsDelta: number;
  forksDelta: number;
}

export function weeklyMomentumScore({ stars, forks, starsDelta, forksDelta }: ScoreInput): number {
  const momentum = Math.max(0, starsDelta) * 1 + Math.max(0, forksDelta) * 3;
  const baseline = Math.round(Math.log10(Math.max(stars, 0) + 1) * 5 + Math.log10(Math.max(forks, 0) + 1) * 2);
  return Math.round((momentum + baseline) * 100) / 100;
}

export function scoreReason({ stars, starsDelta, forksDelta }: ScoreInput): string {
  if (starsDelta > 0 || forksDelta > 0) {
    const parts: string[] = [];
    if (starsDelta > 0) parts.push(`+${starsDelta.toLocaleString("de-DE")} Stars`);
    if (forksDelta > 0) parts.push(`+${forksDelta.toLocaleString("de-DE")} Forks`);
    return `Starkes Wachstum diese Woche (${parts.join(", ")}).`;
  }
  return `Etabliertes Projekt mit ${stars.toLocaleString("de-DE")} Stars (Erstbefüllung).`;
}

export interface RankCandidate {
  repo_key: string;
  owner: string;
  repo: string;
  github_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  starsDelta: number;
  forksDelta: number;
}

export interface RankedRepo extends RankCandidate {
  rank: number;
  weekly_score: number;
  reason: string;
}

/** Pure ranking: score, sort desc, take top N, assign 1-based ranks. */
export function rankTopRepositories(candidates: RankCandidate[], topN = 10): RankedRepo[] {
  return candidates
    .map((c) => ({
      ...c,
      weekly_score: weeklyMomentumScore(c),
      reason: scoreReason(c),
    }))
    .sort((a, b) => b.weekly_score - a.weekly_score || b.stars - a.stars)
    .slice(0, topN)
    .map((c, idx) => ({ ...c, rank: idx + 1 }));
}
