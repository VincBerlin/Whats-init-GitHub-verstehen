import { describe, it, expect } from "vitest";
import { parseRepoInput, isValidOwner, isValidRepo } from "./repo-normalize";

// TEST-001 (FR-001, FR-002, SEC-004)
describe("parseRepoInput — normalization", () => {
  const expectKey = (input: string, repo_key: string) => {
    const r = parseRepoInput(input);
    expect(r.ok, `${input} should parse`).toBe(true);
    if (r.ok) expect(r.value.repo_key).toBe(repo_key);
  };

  it("normalizes full https URL", () => expectKey("https://github.com/vercel/next.js", "vercel/next.js"));
  it("lowercases the repo_key", () => expectKey("https://github.com/Vercel/Next.js", "vercel/next.js"));
  it("handles trailing slash", () => expectKey("https://github.com/vercel/next.js/", "vercel/next.js"));
  it("strips .git suffix", () => expectKey("https://github.com/vercel/next.js.git", "vercel/next.js"));
  it("ignores query and fragment", () => expectKey("https://github.com/vercel/next.js?tab=readme#top", "vercel/next.js"));
  it("handles www host", () => expectKey("https://www.github.com/vercel/next.js", "vercel/next.js"));
  it("handles bare host without scheme", () => expectKey("github.com/vercel/next.js", "vercel/next.js"));
  it("handles bare owner/repo", () => expectKey("vercel/next.js", "vercel/next.js"));
  it("handles ssh form", () => expectKey("git@github.com:vercel/next.js.git", "vercel/next.js"));
  it("ignores deep paths (tree/blob)", () => expectKey("https://github.com/vercel/next.js/tree/main/packages", "vercel/next.js"));

  it("preserves repo display case but lowercases owner", () => {
    const r = parseRepoInput("https://github.com/Vercel/Next.js");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.owner).toBe("vercel");
      expect(r.value.repo).toBe("Next.js");
      expect(r.value.github_url).toBe("https://github.com/Vercel/Next.js");
    }
  });
});

describe("parseRepoInput — rejection (SSRF / malformed)", () => {
  it("rejects empty", () => expect(parseRepoInput("").ok).toBe(false));
  it("rejects non-github host", () => {
    const r = parseRepoInput("https://evil.com/a/b");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("not_github");
  });
  it("rejects gitlab", () => expect(parseRepoInput("https://gitlab.com/a/b").ok).toBe(false));
  it("rejects internal SSRF target", () => expect(parseRepoInput("http://169.254.169.254/latest").ok).toBe(false));
  it("rejects owner-only", () => expect(parseRepoInput("https://github.com/vercel").ok).toBe(false));
  it("rejects bad owner chars", () => expect(parseRepoInput("foo!/bar").ok).toBe(false));
  it("rejects repo named '..'", () => expect(parseRepoInput("foo/..").ok).toBe(false));
});

describe("identifier validators", () => {
  it("accepts valid owner", () => expect(isValidOwner("vercel")).toBe(true));
  it("rejects leading hyphen owner", () => expect(isValidOwner("-bad")).toBe(false));
  it("accepts dotted repo", () => expect(isValidRepo("next.js")).toBe(true));
  it("rejects empty repo", () => expect(isValidRepo("")).toBe(false));
});
