import { describe, it, expect } from "vitest";
import { BLOG_ARTICLES, blogWordCount, getBlogArticle } from "./blog";

// PHASE-2 (Master Plan) — blog content governance (>=1200 words, no placeholders)
describe("blog articles", () => {
  it("has at least 5 articles with unique slugs", () => {
    expect(BLOG_ARTICLES.length).toBeGreaterThanOrEqual(5);
    const slugs = BLOG_ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each article is at least 1,200 words", () => {
    for (const a of BLOG_ARTICLES) {
      expect(blogWordCount(a), `${a.slug} word count`).toBeGreaterThanOrEqual(1200);
    }
  });

  it("each article has description, sections, faq and metadata", () => {
    for (const a of BLOG_ARTICLES) {
      expect(a.description.length).toBeGreaterThan(40);
      expect(a.sections.length).toBeGreaterThanOrEqual(4);
      expect(a.faq.length).toBeGreaterThanOrEqual(3);
      expect(a.readingMinutes).toBeGreaterThan(0);
      expect(a.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("contains no placeholder markers", () => {
    for (const a of BLOG_ARTICLES) {
      const text = JSON.stringify(a).toLowerCase();
      expect(text.includes("platzhalter")).toBe(false);
      expect(text.includes("lorem ipsum")).toBe(false);
    }
  });

  it("resolves by slug", () => {
    expect(getBlogArticle("merge-konflikt-loesen")?.category).toBe("troubleshooting");
  });
});
