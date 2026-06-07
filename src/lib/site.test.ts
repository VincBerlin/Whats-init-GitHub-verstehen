import { describe, it, expect, afterEach } from "vitest";
import { siteUrl } from "./site";

// Regression: SITE_URL set without a scheme (bare Railway host) must not break
// `new URL(siteUrl())` (metadataBase) at build time.
afterEach(() => {
  delete process.env.SITE_URL;
});

describe("siteUrl", () => {
  it("prepends https:// when the scheme is missing", () => {
    process.env.SITE_URL = "whats-in-it-app-production.up.railway.app";
    expect(siteUrl()).toBe("https://whats-in-it-app-production.up.railway.app");
    expect(() => new URL(siteUrl())).not.toThrow();
  });

  it("keeps an existing scheme and trims trailing slashes", () => {
    process.env.SITE_URL = "https://whatsinit.app/";
    expect(siteUrl()).toBe("https://whatsinit.app");
  });

  it("falls back to the default when unset", () => {
    expect(siteUrl()).toBe("https://whatsinit.app");
    expect(() => new URL(siteUrl())).not.toThrow();
  });
});
