import { describe, it, expect } from "vitest";
import { AUTHORITY_PAGES, authorityWordCount, getAuthorityPage } from "./authority";

// PHASE-1 (Master Plan) — content authority governance (SCOPE-001, no thin/placeholder)
describe("authority pages", () => {
  it("has unique slugs", () => {
    const slugs = AUTHORITY_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each page is at least 1,500 words (no thin content)", () => {
    for (const p of AUTHORITY_PAGES) {
      expect(authorityWordCount(p), `${p.slug} word count`).toBeGreaterThanOrEqual(1500);
    }
  });

  it("each page has title, description, sections and FAQ", () => {
    for (const p of AUTHORITY_PAGES) {
      expect(p.title.length).toBeGreaterThan(10);
      expect(p.description.length).toBeGreaterThan(40);
      expect(p.sections.length).toBeGreaterThanOrEqual(4);
      expect(p.faq.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("contains no placeholder markers", () => {
    for (const p of AUTHORITY_PAGES) {
      const text = JSON.stringify(p).toLowerCase();
      expect(text.includes("platzhalter")).toBe(false);
      expect(text.includes("lorem ipsum")).toBe(false);
      expect(text.includes("todo")).toBe(false);
    }
  });

  it("resolves by slug", () => {
    expect(getAuthorityPage("what-is-github")?.title).toContain("GitHub");
  });
});
