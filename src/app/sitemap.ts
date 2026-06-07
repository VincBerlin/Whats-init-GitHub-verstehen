import type { MetadataRoute } from "next";
import { KNOWLEDGE_ITEMS } from "@/data/github-knowledge";
import { BLOG_ARTICLES } from "@/data/blog";
import { siteUrl } from "@/lib/site";

// PHASE-6 / FR-020 — sitemap of indexable public pages. Analysis pages are
// generated on demand and intentionally excluded until they have content.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticPaths = [
    "",
    "/what-is-whats-in-it",
    "/what-is-github",
    "/blog",
    "/github",
    "/github/shortcuts",
    "/github/commands",
    "/github/cli",
    "/github/actions",
    "/github/trending",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/impressum",
  ];
  const now = new Date();
  const staticEntries = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const knowledgeEntries = KNOWLEDGE_ITEMS.map((k) => ({
    url: `${base}/github/${k.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const blogEntries = BLOG_ARTICLES.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticEntries, ...knowledgeEntries, ...blogEntries];
}
