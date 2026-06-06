// PHASE-5 + Vision PHASE-2/3 — read Daily/Weekly/Niche rankings for display.
// DB read only, no live GitHub fetch and no OpenRouter on the page-view path
// (NFR-001, FR-010/011, FR-017). Honest fallbacks; never fake data as real.
import { WEEKLY_SEED_FALLBACK } from "@/data/trending-seed";
import type { RankingPeriod } from "@/lib/ports";
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
  }));
}

export async function getWeeklyTop(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = await getRanking("weekly");
  return items.length > 0 ? { items, isFallback: false } : { items: seed(10), isFallback: true };
}

export async function getDailyTop(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = await getRanking("daily");
  return items.length > 0 ? { items: items.slice(0, 5), isFallback: false } : { items: seed(5), isFallback: true };
}

// Niche has no honest seed (it is a quality-ranking concept), so empty → no fake data.
export async function getNiche(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  const items = await getRanking("niche");
  return { items, isFallback: false };
}
