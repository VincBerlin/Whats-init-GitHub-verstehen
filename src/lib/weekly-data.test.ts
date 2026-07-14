import { describe, it, expect } from "vitest";
import { getDailyTop, getNiche } from "./weekly-data";
import { getStores } from "./stores";
import type { WeeklyTopRepository } from "./ports";

// PHASE-4 (homepage-tools-discovery) — test the DISPLAY getters the UI actually reads
// (not just the store rows). This is the boundary that page.tsx → DailyTopRepos/NicheFinds
// consume; the prior suite only asserted on store rows, which let a read-path regression
// (is_fallback dropped) pass green. BLOCKER-002 + FR-006 read-side guards.

function row(over: Partial<WeeklyTopRepository>): WeeklyTopRepository {
  return {
    period_type: "daily",
    week_start: "2026-06-20",
    week_end: "2026-06-20",
    rank: 1,
    repo_key: "o/r",
    owner: "o",
    repo: "r",
    github_url: "https://github.com/o/r",
    description: "x",
    language: "TS",
    stars: 1000,
    forks: 100,
    stars_delta: null,
    forks_delta: null,
    weekly_score: 1,
    reason: "x",
    is_fallback: false,
    ...over,
  };
}

describe("getDailyTop surfaces the stored is_fallback (BLOCKER-002)", () => {
  it("isFallback=true when the stored first-run rows are flagged (no 24h delta)", async () => {
    await getStores().rankings.replacePeriod("daily", "2026-06-20", "2026-06-20", [
      row({ rank: 1, repo_key: "a/x", owner: "a", repo: "x", is_fallback: true }),
    ]);
    const { items, isFallback } = await getDailyTop();
    expect(items.length).toBe(1);
    expect(isFallback).toBe(true); // must NOT be hardcoded false when DB rows exist
  });

  it("isFallback=false once the stored rows are real (delta-backed)", async () => {
    // Same week_start as the row default so this replaces the prior period's rows.
    await getStores().rankings.replacePeriod("daily", "2026-06-20", "2026-06-20", [
      row({ rank: 1, repo_key: "a/x", owner: "a", repo: "x", is_fallback: false }),
    ]);
    const { isFallback } = await getDailyTop();
    expect(isFallback).toBe(false);
  });
});

describe("getNiche re-filters giants on the display path (FR-006 defense-in-depth)", () => {
  it("a >50k row that reached the store is never displayed", async () => {
    await getStores().rankings.replacePeriod("niche", "2026-06-22", "2026-06-22", [
      row({ period_type: "niche", rank: 1, repo_key: "big/giant", owner: "big", repo: "giant", stars: 90000 }),
      row({ period_type: "niche", rank: 2, repo_key: "small/gem", owner: "small", repo: "gem", stars: 300 }),
    ]);
    const { items } = await getNiche();
    expect(items.some((i) => i.repo === "giant")).toBe(false);
    expect(items.some((i) => i.repo === "gem")).toBe(true);
  });

  it("getNiche derives isFallback from stored rows (symmetry)", async () => {
    await getStores().rankings.replacePeriod("niche", "2026-06-23", "2026-06-23", [
      row({ period_type: "niche", rank: 1, repo_key: "a/n", owner: "a", repo: "n", stars: 400, is_fallback: true }),
    ]);
    expect((await getNiche()).isFallback).toBe(true);
  });
});
