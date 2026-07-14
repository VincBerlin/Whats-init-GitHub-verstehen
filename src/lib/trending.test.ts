import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { updateTrendingSnapshots, updateWeeklyTrending, updateDailyDiscovery, weekBounds } from "./trending";
import { isAuthorizedCron } from "./cron-auth";
import {
  MemoryAnalysisCacheStore,
  MemoryAnalysisLockStore,
  MemoryRankingStore,
  MemorySnapshotStore,
  MemoryUsageEventStore,
} from "./stores/memory-stores";
import type { Stores } from "./stores";

function freshStores(): Stores {
  return {
    cache: new MemoryAnalysisCacheStore(),
    usage: new MemoryUsageEventStore(),
    lock: new MemoryAnalysisLockStore(),
    snapshots: new MemorySnapshotStore(),
    rankings: new MemoryRankingStore(),
  };
}

const candidates = [
  { owner: "a", repo: "rocket", stars: 1000, forks: 100, language: "TS", description: "x" },
  { owner: "b", repo: "steady", stars: 5000, forks: 300, language: "Go", description: "y" },
];

// TEST-010 (API-005, API-006, FR-018)
describe("trending jobs", () => {
  it("snapshot job stores one snapshot per candidate (no LLM)", async () => {
    const stores = freshStores();
    const res = await updateTrendingSnapshots("2026-06-01", { stores, fetchCandidates: async () => candidates });
    expect(res.snapshotsCreated).toBe(2);
    expect((await stores.snapshots.getByDate("2026-06-01")).length).toBe(2);
  });

  it("dryRun does not write snapshots", async () => {
    const stores = freshStores();
    const res = await updateTrendingSnapshots("2026-06-01", { stores, fetchCandidates: async () => candidates }, true);
    expect(res.snapshotsCreated).toBe(2);
    expect((await stores.snapshots.getByDate("2026-06-01")).length).toBe(0);
  });

  it("weekly job ranks by week-over-week growth and writes top list", async () => {
    const stores = freshStores();
    // week 1 baseline
    await updateTrendingSnapshots("2026-06-01", { stores, fetchCandidates: async () => candidates });
    // week 2: 'rocket' surges, 'steady' barely moves
    await updateTrendingSnapshots("2026-06-08", {
      stores,
      fetchCandidates: async () => [
        { owner: "a", repo: "rocket", stars: 4000, forks: 250, language: "TS", description: "x" },
        { owner: "b", repo: "steady", stars: 5050, forks: 305, language: "Go", description: "y" },
      ],
    });

    const res = await updateWeeklyTrending("2026-06-08", "2026-06-14", "2026-06-08", { stores });
    expect(res.itemsWritten).toBe(2);

    const top = await stores.rankings.getLatest("weekly");
    expect(top[0].rank).toBe(1);
    expect(top[0].repo_key).toBe("a/rocket"); // bigger weekly growth wins
    expect(top[0].stars_delta).toBe(3000);
  });

  it("weekly job is idempotent (replaceWeek)", async () => {
    const stores = freshStores();
    await updateTrendingSnapshots("2026-06-08", { stores, fetchCandidates: async () => candidates });
    await updateWeeklyTrending("2026-06-08", "2026-06-14", "2026-06-08", { stores });
    await updateWeeklyTrending("2026-06-08", "2026-06-14", "2026-06-08", { stores });
    const top = await stores.rankings.getLatest("weekly");
    expect(top.length).toBe(2); // not duplicated
  });
});

// Vision PHASE-3 — daily discovery writes daily + niche, no LLM
describe("daily discovery", () => {
  it("PHASE-4: daily keeps giants, niche hard-excludes >50k giants", async () => {
    const stores = freshStores();
    const cands = [
      { owner: "big", repo: "giant", stars: 90000, forks: 800, language: "C", description: null },
      { owner: "small", repo: "gem", stars: 300, forks: 90, language: "TS", description: "nützlich" },
      { owner: "mid", repo: "tool", stars: 3000, forks: 400, language: "Go", description: "tool" },
    ];
    const res = await updateDailyDiscovery("2026-06-09", { stores, fetchCandidates: async () => cands });
    expect(res.snapshotsCreated).toBe(3);
    expect(res.dailyWritten).toBe(3); // daily not filtered (≤3 of 3 cands)
    expect(res.nicheWritten).toBe(2); // giant excluded → only gem + tool eligible

    const daily = await stores.rankings.getLatest("daily");
    expect(daily[0].repo_key).toBe("big/giant"); // popularity wins daily (giants allowed here)

    const niche = await stores.rankings.getLatest("niche");
    // TEST-009: a >50k giant must NEVER appear in niche.
    expect(niche.some((n) => n.repo_key === "big/giant")).toBe(false);
    expect(niche.every((n) => n.period_type === "niche")).toBe(true);
  });

  it("OBS-001: caps Daily at 3 and Niche at 5 when enough candidates exist", async () => {
    const stores = freshStores();
    const cands = [
      { owner: "big", repo: "giant", stars: 80000, forks: 900, language: "C", description: "huge" },
      ...Array.from({ length: 8 }, (_, i) => ({
        owner: `o${i}`, repo: `r${i}`, stars: 200 + i * 250, forks: 40 + i * 20,
        language: "TS", description: `useful ${i}`,
      })),
    ];
    const res = await updateDailyDiscovery("2026-06-12", { stores, fetchCandidates: async () => cands });
    expect(res.dailyWritten).toBe(3);
    expect(res.nicheWritten).toBe(5);

    const niche = await stores.rankings.getLatest("niche");
    expect(niche.length).toBe(5);
    expect(niche.every((n) => n.stars <= 50000)).toBe(true); // no giant slipped in
  });

  it("TEST-009: a repo at exactly 50000 stars IS niche-eligible (<=, not <)", async () => {
    const stores = freshStores();
    const cands = [
      { owner: "edge", repo: "fifty", stars: 50000, forks: 200, language: "TS", description: "edge" },
      { owner: "over", repo: "giant", stars: 50001, forks: 200, language: "TS", description: "over" },
    ];
    await updateDailyDiscovery("2026-06-13", { stores, fetchCandidates: async () => cands });
    const niche = await stores.rankings.getLatest("niche");
    expect(niche.some((n) => n.repo_key === "edge/fifty")).toBe(true); // 50000 included
    expect(niche.some((n) => n.repo_key === "over/giant")).toBe(false); // 50001 excluded
  });

  it("BLOCKER-002: a giant in first-run daily is flagged sample, no 'seit gestern' reason", async () => {
    const stores = freshStores();
    await updateDailyDiscovery("2026-06-14", { stores, fetchCandidates: async () => [
      { owner: "big", repo: "giant", stars: 90000, forks: 800, language: "C", description: null },
    ] });
    const daily = await stores.rankings.getLatest("daily");
    expect(daily[0].repo_key).toBe("big/giant");
    expect(daily[0].is_fallback).toBe(true); // no 24h history → sample
    expect(daily[0].reason).not.toMatch(/seit gestern/); // no fabricated movement
  });

  it("marks daily as fallback without 24h history, true with delta (PHASE-4)", async () => {
    const stores = freshStores();
    const day1 = [{ owner: "a", repo: "x", stars: 100, forks: 10, language: "TS", description: "x" }];
    // first run: no prior snapshot → fallback
    await updateDailyDiscovery("2026-06-10", { stores, fetchCandidates: async () => day1 });
    const d1 = await stores.rankings.getLatest("daily");
    expect(d1[0].is_fallback).toBe(true);

    // next day: prior snapshot exists → true ranking with delta
    await updateDailyDiscovery("2026-06-11", {
      stores,
      fetchCandidates: async () => [{ owner: "a", repo: "x", stars: 180, forks: 12, language: "TS", description: "x" }],
    });
    const d2 = await stores.rankings.getLatest("daily");
    expect(d2[0].is_fallback).toBe(false);
    expect(d2[0].stars_delta).toBe(80);
  });

  it("does not pollute weekly rankings", async () => {
    const stores = freshStores();
    await updateDailyDiscovery("2026-06-09", { stores, fetchCandidates: async () => [
      { owner: "a", repo: "b", stars: 100, forks: 10, language: "TS", description: "x" },
    ] });
    expect((await stores.rankings.getLatest("weekly")).length).toBe(0);
  });
});

// SEC-003
describe("cron auth", () => {
  beforeEach(() => { process.env.CRON_SECRET = "s3cr3t"; });
  afterEach(() => { delete process.env.CRON_SECRET; });

  it("accepts the correct bearer token", () => expect(isAuthorizedCron("Bearer s3cr3t")).toBe(true));
  it("rejects wrong token", () => expect(isAuthorizedCron("Bearer nope")).toBe(false));
  it("rejects missing header", () => expect(isAuthorizedCron(null)).toBe(false));
  it("rejects query-style/no-bearer", () => expect(isAuthorizedCron("s3cr3t")).toBe(false));
  it("fails closed when no secret configured", () => {
    delete process.env.CRON_SECRET;
    expect(isAuthorizedCron("Bearer s3cr3t")).toBe(false);
  });
});

describe("weekBounds", () => {
  it("computes Monday..Sunday for a mid-week date", () => {
    // 2026-06-03 is a Wednesday
    expect(weekBounds(new Date("2026-06-03T12:00:00Z"))).toEqual({ weekStart: "2026-06-01", weekEnd: "2026-06-07" });
  });
});
