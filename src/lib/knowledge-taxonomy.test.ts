import { describe, it, expect } from "vitest";
import { ENRICHED_TOPICS, groupByCategory, enrich, CATEGORY_ORDER } from "./knowledge-taxonomy";
import { getKnowledgeItem } from "@/data/github-knowledge";

// PHASE-4 (FR-012/013/015)
describe("knowledge taxonomy", () => {
  it("enriches every topic with required metadata", () => {
    for (const t of ENRICHED_TOPICS) {
      expect(["beginner", "intermediate", "advanced"]).toContain(t.level);
      expect(["safe", "careful", "dangerous"]).toContain(t.riskLevel);
      expect(Array.isArray(t.tags)).toBe(true);
      expect(Array.isArray(t.searchSynonyms)).toBe(true);
    }
  });

  it("flags risky topics (FR-015)", () => {
    expect(enrich(getKnowledgeItem("rueckgaengig-machen")!).riskLevel).toBe("dangerous");
    expect(enrich(getKnowledgeItem("git-rebase")!).riskLevel).toBe("careful");
  });

  it("groups into ordered, non-empty categories", () => {
    const groups = groupByCategory();
    expect(groups.length).toBeGreaterThan(3);
    // every group non-empty and follows CATEGORY_ORDER
    const order = groups.map((g) => g.category);
    const expectedOrder = CATEGORY_ORDER.filter((c) => order.includes(c));
    expect(order).toEqual(expectedOrder);
    for (const g of groups) expect(g.items.length).toBeGreaterThan(0);
  });

  it("covers all topics across groups (no topic lost)", () => {
    const grouped = groupByCategory().flatMap((g) => g.items.length);
    const total = grouped.reduce((a, b) => a + b, 0);
    expect(total).toBe(ENRICHED_TOPICS.length);
  });
});
