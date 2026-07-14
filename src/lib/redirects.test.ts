import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

// TEST-012 (FR-011/FR-012): old hardcoded /lernen and /wiki routes must be
// permanently redirected to the /github hub and must no longer render old content.
describe("legacy route redirects", () => {
  it("declares a redirects() function", () => {
    expect(typeof nextConfig.redirects).toBe("function");
  });

  it("permanently redirects legacy /lernen and /wiki/* to /github", async () => {
    const redirects = await nextConfig.redirects!();
    const bySource = new Map(redirects.map((r) => [r.source, r]));

    for (const src of ["/lernen", "/wiki", "/wiki/:slug*"]) {
      expect(bySource.get(src)?.destination).toBe("/github");
      expect(bySource.get(src)?.permanent).toBe(true);
    }
  });

  it("OPEN-001: permanently redirects /github/trending to /repositories", async () => {
    const redirects = await nextConfig.redirects!();
    const r = redirects.find((x) => x.source === "/github/trending");
    expect(r?.destination).toBe("/repositories");
    expect(r?.permanent).toBe(true);
  });

  it("every redirect is permanent", async () => {
    const redirects = await nextConfig.redirects!();
    for (const r of redirects) expect(r.permanent).toBe(true);
  });
});
