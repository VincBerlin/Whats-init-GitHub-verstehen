import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { GET as adsTxt } from "@/app/ads.txt/route";
import { isAllowedPlacement, adsEnabled } from "@/lib/ad-policy";

// TEST-011 (FR-019, FR-020, FR-021)
describe("robots", () => {
  it("disallows /api and declares a sitemap", () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.disallow).toContain("/api/");
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);
  it("includes legal/trust pages", () => {
    for (const p of ["/about", "/contact", "/privacy", "/terms", "/impressum"]) {
      expect(urls.some((u) => u.endsWith(p)), `sitemap missing ${p}`).toBe(true);
    }
  });
  it("includes knowledge detail pages", () => {
    expect(urls.some((u) => u.includes("/github/was-ist-git"))).toBe(true);
  });
  it("never lists API routes", () => {
    expect(urls.some((u) => u.includes("/api/"))).toBe(false);
  });
});

describe("ads.txt", () => {
  it("returns a placeholder until a publisher id is configured", async () => {
    delete process.env.ADSENSE_PUBLISHER_ID;
    const res = adsTxt();
    const body = await res.text();
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("PLATZHALTER");
  });
});

describe("ad policy", () => {
  it("allows designated zones and rejects action-adjacent ones", () => {
    expect(isAllowedPlacement("sidebar")).toBe(true);
    expect(isAllowedPlacement("content-break")).toBe(true);
    expect(isAllowedPlacement("inline-with-copy")).toBe(false);
    expect(isAllowedPlacement("next-to-cta")).toBe(false);
  });
  it("is disabled by default (no ads without explicit enable + publisher id)", () => {
    delete process.env.NEXT_PUBLIC_ADS_ENABLED;
    expect(adsEnabled()).toBe(false);
  });
});

describe("legal/trust pages exist (FR-019)", () => {
  it("has a page file for each required route", () => {
    const base = join(process.cwd(), "src/app");
    for (const p of ["about", "contact", "privacy", "terms", "impressum"]) {
      expect(existsSync(join(base, p, "page.tsx")), `missing /${p}`).toBe(true);
    }
  });
});
