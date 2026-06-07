import { describe, it, expect, beforeEach } from "vitest";
import { runAnalysis, type AnalysisServiceConfig } from "./analysis-service";
import type { AnalyzerPort } from "./analyzer-port";
import { AnalyzerError } from "./analyzer-port";
import {
  MemoryAnalysisCacheStore,
  MemoryAnalysisLockStore,
  MemoryUsageEventStore,
} from "./stores/memory-stores";
import type { Stores } from "./stores";
import { hashValue, type ClientContext } from "./request-context";

const CONFIG: AnalysisServiceConfig = {
  lockTtlMs: 60_000,
  rateLimit: { maxNewAnalyses: 3, windowMs: 60_000 },
};

function freshStores(): Stores {
  return {
    cache: new MemoryAnalysisCacheStore(),
    usage: new MemoryUsageEventStore(),
    lock: new MemoryAnalysisLockStore(),
  };
}

function countingAnalyzer() {
  let calls = 0;
  const analyzer: AnalyzerPort = {
    analyze: async (repo) => {
      calls += 1;
      await Promise.resolve();
      return {
        analysis: { repoName: repo.repo, ok: true },
        repoMetadata: { full_name: repo.repo_key },
        provider: "test",
        model: "test-model",
        analyzerVersion: "test-v1",
      };
    },
  };
  return { analyzer, calls: () => calls };
}

function human(ip = "203.0.113.5"): ClientContext {
  const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537 Chrome/120 Safari/537";
  return {
    ip_hash: hashValue(ip),
    user_agent_hash: hashValue(ua),
    session_hash: null,
    user_agent_raw: ua,
  };
}

beforeEach(() => {
  process.env.HASH_SALT = "test-salt";
});

// TEST-002 (AC-001, FR-003, FR-004)
describe("cache-first flow", () => {
  it("calls analyzer once on miss, then serves cache without calling again", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();

    const r1 = await runAnalysis({ input: "https://github.com/vercel/next.js", client: human() }, { stores, analyzer: a.analyzer, config: CONFIG });
    expect(r1.status).toBe("ok");
    if (r1.status === "ok") expect(r1.source).toBe("new_analysis");
    expect(a.calls()).toBe(1);

    const r2 = await runAnalysis({ input: "https://github.com/vercel/next.js", client: human() }, { stores, analyzer: a.analyzer, config: CONFIG });
    expect(r2.status).toBe("ok");
    if (r2.status === "ok") expect(r2.source).toBe("cache");
    expect(a.calls()).toBe(1); // ARCH-007: no second LLM call on hit

    // PHASE-5 (SSR cached analysis): a cache hit returns BOTH analysis and
    // repoMetadata so the page can be rendered server-side without any LLM/GitHub call.
    if (r2.status === "ok") {
      expect(r2.analysis).toBeTruthy();
      expect(r2.repoMetadata).toBeTruthy();
    }

    const cached = await stores.cache.get("vercel/next.js");
    expect(cached?.access_count).toBe(1);
  });

  it("records a cache_hit usage event with hashes only (no raw IP)", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();
    const c = human("198.51.100.9");
    await runAnalysis({ input: "vercel/next.js", client: c }, { stores, analyzer: a.analyzer, config: CONFIG });
    await runAnalysis({ input: "vercel/next.js", client: c }, { stores, analyzer: a.analyzer, config: CONFIG });
    const mem = stores.usage as MemoryUsageEventStore;
    const hit = mem.events.find((e) => e.event_type === "cache_hit");
    expect(hit).toBeTruthy();
    expect(hit?.ip_hash).toBe(hashValue("198.51.100.9"));
    expect(JSON.stringify(mem.events)).not.toContain("198.51.100.9");
  });
});

// TEST-008 (AC-002, FR-006) concurrency
describe("analysis lock (cost control)", () => {
  it("issues at most one analyzer call for concurrent same-repo requests", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();
    const results = await Promise.all([
      runAnalysis({ input: "vercel/next.js", client: human() }, { stores, analyzer: a.analyzer, config: CONFIG }),
      runAnalysis({ input: "vercel/next.js", client: human() }, { stores, analyzer: a.analyzer, config: CONFIG }),
    ]);
    expect(a.calls()).toBe(1);
    const inProgress = results.filter((r) => r.status === "analysis_in_progress");
    const ok = results.filter((r) => r.status === "ok");
    expect(ok.length).toBe(1);
    expect(inProgress.length).toBe(1);
  });
});

// TEST-003 (AC-003, AC-004, SEC-008)
describe("guards before external call", () => {
  it("blocks bots before calling analyzer", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();
    const bot: ClientContext = {
      ip_hash: hashValue("203.0.113.7"),
      user_agent_hash: hashValue("curl/8.1"),
      session_hash: null,
      user_agent_raw: "curl/8.1",
    };
    const r = await runAnalysis({ input: "vercel/next.js", client: bot }, { stores, analyzer: a.analyzer, config: CONFIG });
    expect(r.status).toBe("error");
    if (r.status === "error") expect(r.code).toBe("bot_blocked");
    expect(a.calls()).toBe(0);
  });

  it("blocks when rate limit exceeded before calling analyzer", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();
    const c = human("203.0.113.42");
    // pre-seed counted events to hit the limit (maxNewAnalyses=3)
    for (let i = 0; i < 3; i++) {
      await stores.usage.record({ event_type: "cache_miss", ip_hash: c.ip_hash, cache_hit: false, status: "ok" });
    }
    const r = await runAnalysis({ input: "vercel/next.js", client: c }, { stores, analyzer: a.analyzer, config: CONFIG });
    expect(r.status).toBe("error");
    if (r.status === "error") expect(r.code).toBe("rate_limited");
    expect(a.calls()).toBe(0);
  });

  it("rejects non-github input without calling analyzer", async () => {
    const stores = freshStores();
    const a = countingAnalyzer();
    const r = await runAnalysis({ input: "https://evil.com/a/b", client: human() }, { stores, analyzer: a.analyzer, config: CONFIG });
    expect(r.status).toBe("error");
    if (r.status === "error") expect(r.code).toBe("not_github");
    expect(a.calls()).toBe(0);
  });
});

// failure path: analyzer error releases the lock (recoverable) and logs
describe("analyzer failure handling", () => {
  it("frees the lock on failure so a retry can proceed", async () => {
    const stores = freshStores();
    let calls = 0;
    const flaky: AnalyzerPort = {
      analyze: async () => {
        calls += 1;
        if (calls === 1) throw new AnalyzerError("llm_failed", "boom");
        return { analysis: { ok: true }, repoMetadata: {}, provider: "test", model: "m", analyzerVersion: "v1" };
      },
    };
    const r1 = await runAnalysis({ input: "vercel/next.js", client: human() }, { stores, analyzer: flaky, config: CONFIG });
    expect(r1.status).toBe("error");
    const r2 = await runAnalysis({ input: "vercel/next.js", client: human() }, { stores, analyzer: flaky, config: CONFIG });
    expect(r2.status).toBe("ok");
    expect(calls).toBe(2);
  });
});

// TEST-013 (SEC-002): hashing never returns the raw value
describe("hashing", () => {
  it("hashes raw values deterministically and never returns the raw value", () => {
    const h = hashValue("203.0.113.1");
    expect(h).not.toBe("203.0.113.1");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(hashValue("203.0.113.1")).toBe(h);
    expect(hashValue(null)).toBeNull();
  });
});
