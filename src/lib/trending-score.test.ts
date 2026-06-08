import { describe, it, expect } from "vitest";
import { weeklyMomentumScore, rankTopRepositories, type RankCandidate } from "./trending-score";

// TEST-007 / TEST-010 (scoring)
describe("weeklyMomentumScore", () => {
  it("rewards weekly growth over pure size", () => {
    const growing = weeklyMomentumScore({ stars: 5000, forks: 500, starsDelta: 800, forksDelta: 50 });
    const stagnant = weeklyMomentumScore({ stars: 5000, forks: 500, starsDelta: 0, forksDelta: 0 });
    expect(growing).toBeGreaterThan(stagnant);
  });

  it("never goes negative for negative deltas (uses baseline)", () => {
    const s = weeklyMomentumScore({ stars: 1000, forks: 100, starsDelta: -50, forksDelta: -5 });
    expect(s).toBeGreaterThanOrEqual(0);
  });

  it("is deterministic", () => {
    const input = { stars: 1234, forks: 88, starsDelta: 12, forksDelta: 3 };
    expect(weeklyMomentumScore(input)).toBe(weeklyMomentumScore(input));
  });
});

describe("rankTopRepositories", () => {
  const mk = (key: string, stars: number, starsDelta: number): RankCandidate => ({
    repo_key: key, owner: key.split("/")[0], repo: key.split("/")[1],
    github_url: `https://github.com/${key}`, description: null, language: "TS",
    stars, forks: 10, starsDelta, forksDelta: 1,
  });

  it("returns at most topN, ranked 1..N by score desc", () => {
    const ranked = rankTopRepositories([mk("a/a", 100, 5), mk("b/b", 100, 500), mk("c/c", 100, 50)], 2);
    expect(ranked).toHaveLength(2);
    expect(ranked[0].repo_key).toBe("b/b");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[0].weekly_score).toBeGreaterThanOrEqual(ranked[1].weekly_score);
  });

  it("handles empty input", () => {
    expect(rankTopRepositories([])).toEqual([]);
  });
});
