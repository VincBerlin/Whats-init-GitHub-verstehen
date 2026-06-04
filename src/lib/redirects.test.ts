import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

// TEST-012 (FR-011/FR-012): old hardcoded /lernen and /wiki routes must be
// permanently redirected to the /github hub and must no longer render old content.
describe("legacy route redirects", () => {
  it("declares a redirects() function", () => {
    expect(typeof nextConfig.redirects).toBe("function");
  });

  it("permanently redirects /lernen and /wiki/* to /github", async () => {
    const redirects = await nextConfig.redirects!();
    const sources = redirects.map((r) => r.source);

    expect(sources).toContain("/lernen");
    expect(sources).toContain("/wiki/:slug*");

    for (const r of redirects) {
      expect(r.destination).toBe("/github");
      expect(r.permanent).toBe(true);
    }
  });
});
