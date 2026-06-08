import { describe, it, expect } from "vitest";
import { dailyScore, nicheQualityScore, rankBy, dailyReason, nicheReason, type DiscoveryCandidate } from "./scoring";

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
