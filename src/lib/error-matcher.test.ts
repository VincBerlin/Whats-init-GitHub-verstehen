import { describe, it, expect } from "vitest";
import { matchErrors } from "./error-matcher";
import { ERROR_PATTERNS } from "@/data/error-patterns";

// PHASE-6 (Master Plan) — debugger matcher (deterministic, no network/LLM)
describe("error patterns data", () => {
  it("has at least 10 patterns with unique ids", () => {
    expect(ERROR_PATTERNS.length).toBeGreaterThanOrEqual(10);
    const ids = ERROR_PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every pattern has signals, cause and at least one fix step", () => {
    for (const p of ERROR_PATTERNS) {
      expect(p.signals.length).toBeGreaterThan(0);
      expect(p.cause.length).toBeGreaterThan(10);
      expect(p.fix.length).toBeGreaterThan(0);
    }
  });
});

describe("matchErrors", () => {
  it("returns nothing for empty input", () => {
    expect(matchErrors("")).toEqual([]);
  });

  it("matches a pasted SSH error", () => {
    const r = matchErrors("git@github.com: Permission denied (publickey).\nfatal: Could not read from remote repository.");
    expect(r[0]?.pattern.id).toBe("permission-denied-publickey");
  });

  it("matches a non-fast-forward push rejection", () => {
    const r = matchErrors("! [rejected] main -> main (non-fast-forward)\nerror: failed to push some refs");
    expect(r.some((m) => m.pattern.id === "non-fast-forward")).toBe(true);
  });

  it("matches an Actions exit code 1", () => {
    const r = matchErrors("##[error]Process completed with exit code 1", "actions");
    expect(r[0]?.pattern.id).toBe("actions-exit-1");
  });

  it("filters by tool", () => {
    const r = matchErrors("Process completed with exit code 1", "git");
    expect(r.length).toBe(0); // it's an actions error
  });

  it("ranks more-specific matches higher by hit count", () => {
    const r = matchErrors("Automatic merge failed; fix conflicts and then commit the result. <<<<<<<");
    expect(r[0]?.pattern.id).toBe("merge-conflict");
  });
});
