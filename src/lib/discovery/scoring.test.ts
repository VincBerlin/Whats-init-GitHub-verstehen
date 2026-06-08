import { describe, it, expect } from "vitest";
import { dailyScore, nicheQualityScore, nicheEligible, NICHE_MAX_STARS, rankBy, dailyReason, nicheReason, type DiscoveryCandidate } from "./scoring";

// TEST-006 / STORY-003 — niche must not be star-dominant
describe("nicheQualityScore", () => {
  const smallQuality: DiscoveryCandidate = { owner: "a", repo: "gem", stars: 250, forks: 60, language: "TS", description: "Nützliches Tool" };
  const megaStale: DiscoveryCandidate = { owner: "b", repo: "giant", stars: 50000, forks: 1000, language: null, description: null };

  it("can rank a small high-quality repo above a mega stale giant", () => {
    expect(nicheQualityScore(smallQuality)).toBeGreaterThan(nicheQualityScore(megaStale));
  });

  it("rewards fork engagement and completeness", () => {
    const withMeta = nicheQualityScore(smallQuality);
    const withoutMeta = nicheQualityScore({ ...smallQuality, description: null, language: null });
    expect(withMeta).toBeGreaterThan(withoutMeta);
  });
});

// TERM-004 / TEST-009 — niche hard-excludes giants at the selector boundary.
describe("nicheEligible (>50k hard-exclude)", () => {
  const mk = (stars: number): DiscoveryCandidate => ({ owner: "a", repo: "r", stars, forks: 10, language: "TS", description: "x" });
  it("excludes a >50k giant", () => {
    expect(nicheEligible(mk(50001))).toBe(false);
    expect(nicheEligible(mk(90000))).toBe(false);
  });
  it("includes repos at or below the threshold", () => {
    expect(nicheEligible(mk(NICHE_MAX_STARS))).toBe(true);
    expect(nicheEligible(mk(300))).toBe(true);
  });
  it("filtering removes giants before ranking (FILTER, not score nudge)", () => {
    const pool = [mk(90000), mk(300), mk(3000)].filter(nicheEligible);
    expect(pool.length).toBe(2);
    expect(pool.some((c) => c.stars > NICHE_MAX_STARS)).toBe(false);
  });
});

describe("dailyScore", () => {
  it("is monotonic in popularity", () => {
    expect(dailyScore({ owner: "a", repo: "x", stars: 10000, forks: 100, language: null, description: null }))
      .toBeGreaterThan(dailyScore({ owner: "a", repo: "y", stars: 100, forks: 10, language: null, description: null }));
  });
});

describe("rankBy", () => {
  const cands: DiscoveryCandidate[] = [
    { owner: "a", repo: "big", stars: 90000, forks: 500, language: null, description: null },
    { owner: "b", repo: "niche", stars: 300, forks: 90, language: "Go", description: "gut" },
  ];
  it("daily ranking favors the popular repo", () => {
    const r = rankBy(cands, dailyScore, dailyReason, 5);
    expect(r[0].repo).toBe("big");
  });
  it("niche ranking favors the quality repo", () => {
    const r = rankBy(cands, nicheQualityScore, nicheReason, 5);
    expect(r[0].repo).toBe("niche");
    expect(r[0].rank).toBe(1);
  });
});
