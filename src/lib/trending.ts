// PHASE-5 — trending job logic (API-005/API-006). GitHub snapshots + scoring
// only. NEVER imports the OpenRouter adapter (NOGOAL-004, FR-018, SUS-003).
import { searchRepositories, type RepoSearchItem } from "./github";
import type { RepoSnapshot, WeeklyTopRepository } from "./ports";
import { rankTopRepositories, type RankCandidate } from "./trending-score";
import {
  dailyReason,
  dailyScore,
  nicheQualityScore,
  nicheReason,
  rankBy,
  type ScoredCandidate,
} from "./discovery/scoring";
import type { Stores } from "./stores";

// Candidate discovery queries (popular + recently active public repos).
const CANDIDATE_QUERIES = [
  "stars:>20000 sort:updated",
  "stars:>5000 language:typescript sort:updated",
  "stars:>5000 language:python sort:updated",
  "stars:>2000 topic:ai sort:updated",
];

export interface TrendingDeps {
  stores: Stores;
  fetchCandidates?: () => Promise<RepoSearchItem[]>;
}

async function defaultFetchCandidates(): Promise<RepoSearchItem[]> {
  const seen = new Map<string, RepoSearchItem>();
  for (const q of CANDIDATE_QUERIES) {
    try {
      const items = await searchRepositories(q, 20);
      for (const it of items) {
        if (!it.owner || !it.repo) continue;
        const key = `${it.owner}/${it.repo}`.toLowerCase();
        if (!seen.has(key)) seen.set(key, it);
      }
    } catch {
      // one failing query must not abort the whole job
    }
  }
  return [...seen.values()];
}

export async function updateTrendingSnapshots(
  date: string,
  deps: TrendingDeps,
  dryRun = false,
): Promise<{ snapshotsCreated: number }> {
  const fetchCandidates = deps.fetchCandidates ?? defaultFetchCandidates;
  const candidates = await fetchCandidates();
  if (dryRun) return { snapshotsCreated: candidates.length };

  let created = 0;
  for (const c of candidates) {
    const snapshot: RepoSnapshot = {
      repo_key: `${c.owner}/${c.repo}`.toLowerCase(),
      owner: c.owner.toLowerCase(),
      repo: c.repo,
      stars: c.stars,
      forks: c.forks,
      open_issues: null,
      language: c.language,
      pushed_at: null,
      snapshot_date: date,
    };
    await deps.stores.snapshots.upsert(snapshot);
    created++;
  }
  return { snapshotsCreated: created };
}

export async function updateWeeklyTrending(
  weekStart: string,
  weekEnd: string,
  snapshotDate: string,
  deps: TrendingDeps,
): Promise<{ itemsWritten: number }> {
  const today = await deps.stores.snapshots.getByDate(snapshotDate);

  const candidates: RankCandidate[] = [];
  for (const s of today) {
    const prev = await deps.stores.snapshots.getPrevious(s.repo_key, snapshotDate);
    candidates.push({
      repo_key: s.repo_key,
      owner: s.owner,
      repo: s.repo,
      github_url: `https://github.com/${s.owner}/${s.repo}`,
      description: null,
      language: s.language,
      stars: s.stars,
      forks: s.forks,
      starsDelta: prev ? s.stars - prev.stars : 0,
      forksDelta: prev ? s.forks - prev.forks : 0,
    });
  }

  const ranked = rankTopRepositories(candidates, 10);
  const items: WeeklyTopRepository[] = ranked.map((r) => ({
    period_type: "weekly",
    week_start: weekStart,
    week_end: weekEnd,
    rank: r.rank,
    repo_key: r.repo_key,
    owner: r.owner,
    repo: r.repo,
    github_url: r.github_url,
    description: r.description,
    language: r.language,
    stars: r.stars,
    forks: r.forks,
    stars_delta: r.starsDelta,
    forks_delta: r.forksDelta,
    weekly_score: r.weekly_score,
    reason: r.reason,
    is_fallback: false,
  }));

  await deps.stores.rankings.replacePeriod("weekly", weekStart, weekEnd, items);
  return { itemsWritten: items.length };
}

// PHASE-3 (Vision) — daily discovery: snapshots + Daily Top + Niche Finds.
// GitHub API + Postgres only, never OpenRouter (FR-018, NOGOAL-001).
export async function updateDailyDiscovery(
  day: string,
  deps: TrendingDeps,
): Promise<{ snapshotsCreated: number; dailyWritten: number; nicheWritten: number }> {
  const fetchCandidates = deps.fetchCandidates ?? defaultFetchCandidates;
  const candidates = await fetchCandidates();

  // 1) Snapshots (idempotent upsert).
  for (const c of candidates) {
    await deps.stores.snapshots.upsert({
      repo_key: `${c.owner}/${c.repo}`.toLowerCase(),
      owner: c.owner.toLowerCase(),
      repo: c.repo,
      stars: c.stars,
      forks: c.forks,
      open_issues: null,
      language: c.language,
      pushed_at: null,
      snapshot_date: day,
    });
  }

  const disc = candidates.map((c) => ({
    owner: c.owner,
    repo: c.repo,
    stars: c.stars,
    forks: c.forks,
    language: c.language,
    description: c.description,
  }));

  // 2) Daily Top 5 (popularity/engagement blend).
  const daily = rankBy(disc, dailyScore, (c) => dailyReason(c), 5).map((r) => toRankingRow("daily", day, r));
  await deps.stores.rankings.replacePeriod("daily", day, day, daily);

  // 3) Niche Finds (quality, not star-dominant).
  const niche = rankBy(disc, nicheQualityScore, (c) => nicheReason(c), 10).map((r) => toRankingRow("niche", day, r));
  await deps.stores.rankings.replacePeriod("niche", day, day, niche);

  return { snapshotsCreated: candidates.length, dailyWritten: daily.length, nicheWritten: niche.length };
}

function toRankingRow(
  period: "daily" | "niche",
  day: string,
  r: ScoredCandidate,
): WeeklyTopRepository {
  return {
    period_type: period,
    week_start: day,
    week_end: day,
    rank: r.rank,
    repo_key: `${r.owner}/${r.repo}`.toLowerCase(),
    owner: r.owner.toLowerCase(),
    repo: r.repo,
    github_url: `https://github.com/${r.owner}/${r.repo}`,
    description: r.description,
    language: r.language,
    stars: r.stars,
    forks: r.forks,
    stars_delta: null,
    forks_delta: null,
    weekly_score: r.score,
    reason: r.reason,
    is_fallback: false,
  };
}

// Date helpers (ISO week, Monday-based). Pure given an input date.
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function weekBounds(ref: Date): { weekStart: string; weekEnd: string } {
  const day = ref.getUTCDay(); // 0=Sun..6=Sat
  const mondayOffset = (day + 6) % 7;
  const monday = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate() - mondayOffset));
  const sunday = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 6));
  return { weekStart: isoDate(monday), weekEnd: isoDate(sunday) };
}
