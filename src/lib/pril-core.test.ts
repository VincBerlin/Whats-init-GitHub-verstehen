import { describe, it, expect } from "vitest";
// PRIL gate core (config/claude/bin/lib/pril-core.mjs) — unit tests for the
// mechanical Plumbline gates so the governance tooling itself is verified.
// @ts-expect-error — plain .mjs module outside the TS rootDir, imported for test.
import {
  parseCanvasStatus,
  globToRegex,
  matchesAny,
  checkScope,
  checkReality,
  parseJsonl,
  redact,
} from "../../config/claude/bin/lib/pril-core.mjs";

describe("parseCanvasStatus", () => {
  it("reads a plain Status line", () => {
    expect(parseCanvasStatus("foo\nStatus: user-confirmed\nbar")).toBe("user-confirmed");
  });
  it("is case-insensitive on the key", () => {
    expect(parseCanvasStatus("status: draft")).toBe("draft");
  });
  it("returns null when absent", () => {
    expect(parseCanvasStatus("no status here")).toBeNull();
  });
  it("does NOT match a bold-markdown status (the parser artifact we fixed)", () => {
    expect(parseCanvasStatus("**Status:** user-confirmed")).toBeNull();
  });
});

describe("globToRegex / matchesAny", () => {
  it("matches an exact path", () => {
    expect(globToRegex("src/app/page.tsx").test("src/app/page.tsx")).toBe(true);
    expect(globToRegex("src/app/page.tsx").test("src/app/other.tsx")).toBe(false);
  });
  it("** matches nested files under a dir", () => {
    expect(globToRegex("src/components/home/**").test("src/components/home/HomepageTools.tsx")).toBe(true);
  });
  it("**/ matches zero or more dirs then a *.test.ts", () => {
    const g = "src/lib/**/*.test.ts";
    expect(matchesAny("src/lib/homepage-structure.test.ts", [g])).toBe(true);
    expect(matchesAny("src/lib/a/b/x.test.ts", [g])).toBe(true);
    expect(matchesAny("src/lib/x.ts", [g])).toBe(false);
  });
  it("* does not cross a path separator", () => {
    expect(globToRegex("src/*.ts").test("src/a/b.ts")).toBe(false);
  });
});

describe("checkScope", () => {
  const scope = {
    allowed_globs: ["src/app/page.tsx", "src/components/home/**", "src/lib/**/*.test.ts"],
    allowed_deletions: ["src/app/layout 2.tsx"],
  };
  it("passes when all files are in scope", () => {
    expect(checkScope([
      "src/app/page.tsx",
      "src/components/home/HomepageTools.tsx",
      "src/lib/homepage-structure.test.ts",
      "src/app/layout 2.tsx",
    ], scope)).toEqual([]);
  });
  it("flags out-of-scope files", () => {
    expect(checkScope(["src/app/secret.tsx"], scope)).toEqual(["src/app/secret.tsx"]);
  });
});

describe("checkReality", () => {
  const ok = [
    { requirement_id: "FR-001", evidence_class: "production-verified", evidence_ref: "build green", wired_in_prod: true },
    { requirement_id: "FR-002", evidence_class: "real-boundary-smoke", evidence_ref: "e2e types into homepage", wired_in_prod: true },
  ];
  it("passes a clean ledger that covers required reqs", () => {
    expect(checkReality(ok, ["FR-001", "FR-002"])).toEqual([]);
  });
  it("fails unit-fake evidence (below floor)", () => {
    const bad = [{ requirement_id: "FR-009", evidence_class: "unit-fake", evidence_ref: "grep", wired_in_prod: false }];
    const p = checkReality(bad);
    expect(p.some((m) => m.includes("below floor"))).toBe(true);
    expect(p.some((m) => m.includes("wired_in_prod"))).toBe(true);
  });
  it("fails on a forbidden laundering token", () => {
    const bad = [{ requirement_id: "FR-007", evidence_class: "real-boundary-smoke", evidence_ref: "placeholder pricing only", wired_in_prod: true }];
    expect(checkReality(bad).some((m) => m.includes("forbidden token 'placeholder'"))).toBe(true);
  });
  it("does not false-positive 'fake' inside an evidence_class enum", () => {
    // evidence_class is checked against the floor list, not scanned for 'fake'.
    const e = [{ requirement_id: "X", evidence_class: "real-boundary-smoke", evidence_ref: "ran real browser", wired_in_prod: true }];
    expect(checkReality(e)).toEqual([]);
  });
  it("reports a missing required requirement", () => {
    expect(checkReality(ok, ["FR-999"]).some((m) => m.includes("required FR-999"))).toBe(true);
  });
});

describe("parseJsonl", () => {
  it("parses non-blank lines", () => {
    expect(parseJsonl('{"a":1}\n\n{"b":2}\n')).toEqual([{ a: 1 }, { b: 2 }]);
  });
});

describe("redact", () => {
  it("redacts api keys, gh tokens, bearer, emails and KEY= assignments", () => {
    const out = redact("sk-abcdef1234567890 ghp_ABCDEFGHIJKLMNOPQRSTUVWX Bearer abcdef123456 a@b.com OPENROUTER_API_KEY=xyz123");
    expect(out).not.toContain("abcdef1234567890");
    expect(out).not.toContain("ghp_ABCDEFGHIJKLMNOPQRSTUVWX");
    expect(out).not.toContain("a@b.com");
    expect(out).toContain("[REDACTED_EMAIL]");
    expect(out).toContain("OPENROUTER_API_KEY=[REDACTED]");
  });
});
