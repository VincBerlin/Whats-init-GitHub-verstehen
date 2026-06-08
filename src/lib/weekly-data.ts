// PHASE-5 + Vision PHASE-2/3 — read Daily/Weekly/Niche rankings for display.
// DB read only, no live GitHub fetch and no OpenRouter on the page-view path
// (NFR-001, FR-010/011, FR-017). Honest fallbacks; never fake data as real.
import { WEEKLY_SEED_FALLBACK } from "@/data/trending-seed";
import type { RankingPeriod } from "@/lib/ports";
import { NICHE_MAX_STARS } from "@/lib/discovery/scoring";
import { getStores } from "./stores";

export interface WeeklyDisplayItem {
  rank: number;
  owner: string;
  repo: string;
  github_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  reason: string;
  analyseHref: string;
  isFallback: boolean; // BLOCKER-002: must reach the UI so the honesty label can render
}

async function getRanking(period: RankingPeriod): Promise<WeeklyDisplayItem[]> {
  try {
    const rows = await getStores().rankings.getLatest(period);
    return rows.map((r) => ({
      rank: r.rank,
      owner: r.owner,
      repo: r.repo,
      github_url: r.github_url,
      description: r.description,
      language: r.language,
      stars: r.stars,
      reason: r.reason,
      analyseHref: `/analyse/${r.owner}/${r.repo}`,
      isFallback: r.is_fallback ?? false, // preserve the stored honesty flag
    }));
  } catch {
    return [];
  }
}

function seed(limit: number): WeeklyDisplayItem[] {
  return WEEKLY_SEED_FALLBACK.slice(0, limit).map((s, i) => ({
    rank: i + 1,
    owner: s.owner,
    repo: s.repo,
    github_url: `https://github.com/${s.owner}/${s.repo}`,
    description: s.description,
    language: s.language,
    stars: s.stars,
    reason: "Beispiel (noch keine Daten)",
    analyseHref: `/analyse/${s.owner}/${s.repo}`,
    isFallback: true, // a seed is always a sample, never real data
  }));
}

export async function getWeeklyTop(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = await getRanking("weekly");
  return items.length > 0 ? { items, isFallback: false } : { items: seed(10), isFallback: true };
}

export async function getDailyTop(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = await getRanking("daily");
  // BLOCKER-002: derive isFallback from the STORED rows (popularity-only first run
  // with no 24h delta is_fallback:true), never hardcode false when DB rows exist.
  return items.length > 0
    ? { items: items.slice(0, 3), isFallback: items[0]?.isFallback ?? false }
    : { items: seed(3), isFallback: true };
}

// Niche has no honest seed (it is a quality-ranking concept), so empty → no fake data.
// Defensive cap at 5 + a read-side >50k re-filter so a giant reaching the store via any
// other write path (seed/migration/future job) can never be displayed (TERM-004/FR-006).
export async function getNiche(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = (await getRanking("niche")).filter((i) => i.stars <= NICHE_MAX_STARS);
  // Symmetric with getDailyTop/getWeeklyTop: derive the honesty flag from the stored
  // rows so any future sample-flagged niche state stays honestly labeled.
  return { items: items.slice(0, 5), isFallback: items[0]?.isFallback ?? false };
}
