import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { updateTrendingSnapshots, updateWeeklyTrending, weekBounds } from "./trending";
import { isAuthorizedCron } from "./cron-auth";
import {
  MemoryAnalysisCacheStore,
  MemoryAnalysisLockStore,
  MemorySnapshotStore,
  MemoryUsageEventStore,
  MemoryWeeklyTopStore,
} from "./stores/memory-stores";
import type { Stores } from "./stores";

function freshStores(): Stores {
  return {
    cache: new MemoryAnalysisCacheStore(),
    usage: new MemoryUsageEventStore(),
    lock: new MemoryAnalysisLockStore(),
    snapshots: new MemorySnapshotStore(),
    weeklyTop: new MemoryWeeklyTopStore(),
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

    const top = await stores.weeklyTop.getLatestWeek();
    expect(top[0].rank).toBe(1);
    expect(top[0].repo_key).toBe("a/rocket"); // bigger weekly growth wins
    expect(top[0].stars_delta).toBe(3000);
  });

  it("weekly job is idempotent (replaceWeek)", async () => {
    const stores = freshStores();
    await updateTrendingSnapshots("2026-06-08", { stores, fetchCandidates: async () => candidates });
    await updateWeeklyTrending("2026-06-08", "2026-06-14", "2026-06-08", { stores });
    await updateWeeklyTrending("2026-06-08", "2026-06-14", "2026-06-08", { stores });
    const top = await stores.weeklyTop.getLatestWeek();
    expect(top.length).toBe(2); // not duplicated
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
