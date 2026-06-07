import { describe, it, expect } from "vitest";
import { searchKnowledge } from "./knowledge-search";

// TEST-002 / AC-004 / AC-005
describe("searchKnowledge", () => {
  it("returns empty for blank query", () => {
    expect(searchKnowledge("  ")).toEqual({ knowledge: [], workflows: [] });
  });

  it("finds push/pull content for 'git push'", () => {
    const r = searchKnowledge("git push");
    const slugs = [...r.knowledge.map((k) => k.slug), ...r.workflows.map((w) => w.slug)];
    expect(slugs.some((s) => s.includes("push"))).toBe(true);
  });

  it("finds SSH content for 'ssh'", () => {
    const r = searchKnowledge("ssh");
    expect(r.knowledge.some((k) => k.slug === "ssh-keys")).toBe(true);
  });

  it("returns no results for nonsense", () => {
    const r = searchKnowledge("zzzznotarealthing");
    expect(r.knowledge.length).toBe(0);
    expect(r.workflows.length).toBe(0);
  });

  it("ranks title matches above body matches", () => {
    const r = searchKnowledge("merge");
    expect(r.knowledge[0]?.slug).toBe("git-merge");
  });
});
