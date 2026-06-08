import { describe, it, expect } from "vitest";
import { matchErrors, availableCategories } from "./error-matcher";
import { ERROR_PATTERNS } from "@/data/error-patterns";

// PHASE-3 (homepage-tools-discovery) — debugger matcher + DATA-004 pattern DB.
// Deterministic, client-side, no network/LLM (NFR-002).

const CATEGORIES = ["git", "github", "actions", "deployment", "node", "auth"];
const SEVERITIES = ["info", "warning", "danger"];
// SEC-006: commands that are destructive / irreversible.
const DESTRUCTIVE = /reset\s+--hard|clean\s+-[a-z]*f|push\s+--force|--force-with-lease|filter-repo|filter-branch|\bbfg\b/i;

describe("DATA-004 pattern DB", () => {
  it("DoD-004: has at least 12 patterns with unique ids", () => {
    expect(ERROR_PATTERNS.length).toBeGreaterThanOrEqual(12);
    const ids = ERROR_PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every pattern has the full DATA-004 field set with valid enums", () => {
    for (const p of ERROR_PATTERNS) {
      expect(p.matchers.length, `${p.id} matchers`).toBeGreaterThan(0);
      expect(p.simpleCause.length, `${p.id} simpleCause`).toBeGreaterThan(10);
      expect(p.technicalCause.length, `${p.id} technicalCause`).toBeGreaterThan(10);
      expect(p.fixCommands.length, `${p.id} fixCommands`).toBeGreaterThan(0);
      expect(p.explanation.length, `${p.id} explanation`).toBeGreaterThan(10);
      expect(Array.isArray(p.relatedLinks), `${p.id} relatedLinks`).toBe(true);
      expect(CATEGORIES, `${p.id} category`).toContain(p.category);
      expect(SEVERITIES, `${p.id} severity`).toContain(p.severity);
    }
  });

  it("SEC-006: any pattern with a destructive fix is severity 'danger' AND carries a riskWarning", () => {
    for (const p of ERROR_PATTERNS) {
      const hasDestructive = p.fixCommands.some((c) => DESTRUCTIVE.test(c));
      if (hasDestructive) {
        expect(p.severity, `${p.id} has a destructive command → must be 'danger'`).toBe("danger");
        expect((p.riskWarning ?? "").length, `${p.id} has a destructive command → must have a riskWarning`).toBeGreaterThan(10);
      }
    }
  });

  it("at least one pattern actually exercises the SEC-006 path (reset --hard / history rewrite)", () => {
    const destructive = ERROR_PATTERNS.filter((p) => p.fixCommands.some((c) => DESTRUCTIVE.test(c)));
    expect(destructive.length).toBeGreaterThanOrEqual(1);
    for (const p of destructive) expect(p.riskWarning).toBeTruthy();
  });
});

describe("DBG coverage — the required error classes match real pasted strings", () => {
  const cases: [string, string][] = [
    ["git@github.com: Permission denied (publickey).", "permission-denied-publickey"],
    ["##[error]Process completed with exit code 127", "exit-code-127"],
    ["##[error]Process completed with exit code 137", "exit-code-137"],
    ["Automatic merge failed; fix conflicts and then commit the result. <<<<<<<", "merge-conflict"],
    ["You are in 'detached HEAD' state.", "detached-head"],
    ["! [rejected] main -> main (non-fast-forward)\nfailed to push some refs", "non-fast-forward"],
    ["remote: Repository not found.\nfatal: repository 'x' not found", "repository-not-found"],
    ["remote: Support for password authentication was removed. Authentication failed", "https-auth-failed"],
    ["remote: error: File big.zip is 150 MB; this exceeds GitHub's file size limit of 100 MB", "large-file-detected"],
    ["bash: npm: command not found", "npm-command-not-found"],
    ["Failed to compile.\nModule not found: Can't resolve './x'", "next-build-failed"],
    ["Railway deployment crashed: Healthcheck failed", "railway-deploy-failed"],
  ];
  for (const [input, id] of cases) {
    it(`ranks ${id} FIRST (the beginner sees the right cause)`, () => {
      const r = matchErrors(input);
      // Top-rank, not merely present — the user reads result[0] first (VAL-002).
      expect(r[0]?.pattern.id, `expected ${id} as top match for: ${input}`).toBe(id);
    });
  }

  // Log-format drift: alternate real-world phrasings should still surface the class.
  const alternates: [string, string][] = [
    ["fatal: Authentication failed for 'https://github.com/owner/repo.git/'", "https-auth-failed"],
    ["error: failed to push some refs to 'github.com'\nhint: Updates were rejected because the tip of your current branch is behind", "non-fast-forward"],
    ["remote: error: GH001: Large files detected. File data.csv is 142.00 MB", "large-file-detected"],
  ];
  for (const [input, id] of alternates) {
    it(`also matches ${id} on an alternate phrasing`, () => {
      expect(matchErrors(input).some((m) => m.pattern.id === id)).toBe(true);
    });
  }
});

describe("specificity — benign / non-error logs must NOT produce a (scary) card", () => {
  // Regression guard for over-generic matchers (bare 127/137, 'file is', 'is not defined').
  const benign = [
    "Cloning into 'repo'... remote: Counting objects: 127, done.",
    "Resolving deltas: 100% (137/137), done.",
    "npm WARN deprecated foo@1.2.137: use bar instead",
    "The config file is missing a required key",
    "ReferenceError: window is not defined",
    "Server listening on port 8127",
    "ECONNREFUSED 127.0.0.1:5432",
  ];
  for (const input of benign) {
    it(`no match for: ${input}`, () => {
      const r = matchErrors(input);
      expect(r, `benign input should not surface a diagnosis: ${input}`).toEqual([]);
    });
    it(`no 'danger' card for: ${input}`, () => {
      expect(matchErrors(input).some((m) => m.pattern.severity === "danger")).toBe(false);
    });
  }
});

describe("matchErrors behavior", () => {
  it("returns nothing for empty input", () => {
    expect(matchErrors("")).toEqual([]);
  });
  it("ranks the most-specific match first by hit count", () => {
    const r = matchErrors("Automatic merge failed; fix conflicts and then commit the result. <<<<<<<");
    expect(r[0]?.pattern.id).toBe("merge-conflict");
  });
  it("filters by category", () => {
    const r = matchErrors("Process completed with exit code 1", "git");
    expect(r.length).toBe(0); // it's an actions error
  });
  it("availableCategories returns the distinct categories present", () => {
    const cats = availableCategories();
    expect(new Set(cats).size).toBe(cats.length);
    for (const c of cats) expect(CATEGORIES).toContain(c);
  });
});
