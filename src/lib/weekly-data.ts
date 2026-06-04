// PHASE-5 — read Weekly Top 10 for display. DB read only, no live GitHub fetch
// and no OpenRouter on the page-view path (NFR-001, FR-017). Falls back to a
// clearly-labelled static seed list when no weekly data exists yet.
import { WEEKLY_SEED_FALLBACK } from "@/data/trending-seed";
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

export async function getWeeklyTop(): Promise<{ items: WeeklyDisplayItem[]; isFallback: boolean }> {
  try {
    const rows = await getStores().weeklyTop.getLatestWeek();
    if (rows.length > 0) {
      return {
        isFallback: false,
        items: rows.map((r) => ({
          rank: r.rank,
          owner: r.owner,
          repo: r.repo,
          github_url: r.github_url,
          description: r.description,
          language: r.language,
          stars: r.stars,
          reason: r.reason,
          analyseHref: `/analyse/${r.owner}/${r.repo}`,
        })),
      };
    }
  } catch {
    // DB unavailable → fall through to seed fallback
  }
  return {
    isFallback: true,
    items: WEEKLY_SEED_FALLBACK.map((s, i) => ({
      rank: i + 1,
      owner: s.owner,
      repo: s.repo,
      github_url: `https://github.com/${s.owner}/${s.repo}`,
      description: s.description,
      language: s.language,
      stars: s.stars,
      reason: "Beispiel (noch keine Wochendaten)",
      analyseHref: `/analyse/${s.owner}/${s.repo}`,
    })),
  };
}
