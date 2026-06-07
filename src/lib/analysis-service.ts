// PHASE-2 — cache-first analysis orchestration. Enforces the cost-control
// invariants: cache before LLM (ARCH-007), rate-limit + bot before LLM
// (SEC-008), at most one LLM call per repo_key under concurrency (DATA-004).
import { randomUUID } from "node:crypto";
import type { AnalyzerPort } from "./analyzer-port";
import { AnalyzerError } from "./analyzer-port";
import { isLikelyBot } from "./bot-protection";
import { checkRateLimit, getRateLimitConfig, type RateLimitConfig } from "./rate-limit";
import { parseRepoInput } from "./repo-normalize";
import type { ClientContext } from "./request-context";
import type { Stores } from "./stores";

export interface AnalyzeRequest {
  input: string;
  client: ClientContext;
}

export type AnalyzeResult =
  | { status: "ok"; source: "cache" | "new_analysis"; repo_key: string; analysis: unknown; repoMetadata: unknown }
  | { status: "analysis_in_progress"; repo_key: string; retryAfterSeconds: number }
  | { status: "error"; code: string; message: string; repo_key?: string };

export interface AnalysisServiceConfig {
  lockTtlMs: number;
  rateLimit: RateLimitConfig;
}

export function getServiceConfig(): AnalysisServiceConfig {
  return {
    lockTtlMs: Number(process.env.ANALYSIS_LOCK_TTL_MS ?? 3 * 60 * 1000),
    rateLimit: getRateLimitConfig(),
  };
}

export interface AnalysisServiceDeps {
  stores: Stores;
  analyzer: AnalyzerPort;
  config?: AnalysisServiceConfig;
}

export async function runAnalysis(
  req: AnalyzeRequest,
  deps: AnalysisServiceDeps,
): Promise<AnalyzeResult> {
  const { stores, analyzer } = deps;
  const config = deps.config ?? getServiceConfig();
  const { client } = req;

  const parsed = parseRepoInput(req.input);
  if (!parsed.ok) {
    await stores.usage.record({
      event_type: "error",
      ...hashes(client),
      cache_hit: false,
      status: parsed.error,
    });
    return { status: "error", code: parsed.error, message: errorMessage(parsed.error) };
  }
  const repo = parsed.value;
  const repoKey = repo.repo_key;

  // 1) Cache-first (ARCH-007): a hit never calls the analyzer.
  const cached = await stores.cache.get(repoKey);
  if (cached) {
    await stores.cache.touch(repoKey);
    await stores.usage.record({
      event_type: "cache_hit",
      repo_key: repoKey,
      ...hashes(client),
      cache_hit: true,
      status: "ok",
    });
    return { status: "ok", source: "cache", repo_key: repoKey, analysis: cached.analysis_json, repoMetadata: cached.repo_metadata_json };
  }

  // 2) Bot protection before any external call (SEC-008).
  if (isLikelyBot(client.user_agent_raw)) {
    await stores.usage.record({
      event_type: "bot_blocked",
      repo_key: repoKey,
      ...hashes(client),
      cache_hit: false,
      status: "bot_blocked",
    });
    return { status: "error", code: "bot_blocked", message: "Automatisierte Anfrage blockiert.", repo_key: repoKey };
  }

  // 3) Rate limit before any external call (SEC-008).
  const rl = await checkRateLimit(stores.usage, client.ip_hash, config.rateLimit);
  if (!rl.allowed) {
    await stores.usage.record({
      event_type: "blocked_rate_limit",
      repo_key: repoKey,
      ...hashes(client),
      cache_hit: false,
      status: "blocked_rate_limit",
    });
    return { status: "error", code: "rate_limited", message: "Zu viele Anfragen. Bitte später erneut versuchen.", repo_key: repoKey };
  }

  // 4) Acquire per-repo_key lock — max one LLM call under concurrency (DATA-004).
  const lockId = randomUUID();
  const lock = await stores.lock.acquire(repoKey, lockId, config.lockTtlMs);
  if (lock === "in_progress") {
    await stores.usage.record({
      event_type: "locked_repo_analysis",
      repo_key: repoKey,
      ...hashes(client),
      cache_hit: false,
      status: "in_progress",
    });
    return { status: "analysis_in_progress", repo_key: repoKey, retryAfterSeconds: 5 };
  }

  try {
    // Double-check cache after acquiring the lock (another request may have
    // completed between our miss and our lock).
    const afterLock = await stores.cache.get(repoKey);
    if (afterLock) {
      await stores.lock.complete(repoKey, lockId);
      await stores.cache.touch(repoKey);
      await stores.usage.record({
        event_type: "cache_hit",
        repo_key: repoKey,
        ...hashes(client),
        cache_hit: true,
        status: "ok",
      });
      return { status: "ok", source: "cache", repo_key: repoKey, analysis: afterLock.analysis_json, repoMetadata: afterLock.repo_metadata_json };
    }

    const out = await analyzer.analyze(repo);
    const saved = await stores.cache.put({
      repo_key: repoKey,
      owner: repo.owner,
      repo: repo.repo,
      github_url: repo.github_url,
      analysis_json: out.analysis,
      repo_metadata_json: out.repoMetadata,
      provider: out.provider,
      model: out.model,
      analyzer_version: out.analyzerVersion,
    });
    await stores.usage.record({
      event_type: "openrouter_call",
      repo_key: repoKey,
      ...hashes(client),
      provider: out.provider,
      model: out.model,
      estimated_input_tokens: out.usage?.inputTokens ?? null,
      estimated_output_tokens: out.usage?.outputTokens ?? null,
      cache_hit: false,
      status: "ok",
    });
    await stores.lock.complete(repoKey, lockId);
    return { status: "ok", source: "new_analysis", repo_key: repoKey, analysis: saved.analysis_json, repoMetadata: saved.repo_metadata_json };
  } catch (err) {
    const code = err instanceof AnalyzerError ? err.code : "error";
    const eventType =
      code === "github_fetch_failed" || code === "github_not_found"
        ? "github_fetch_failed"
        : code === "validation_failed"
          ? "validation_failed"
          : "llm_failed";
    await stores.lock.fail(repoKey, lockId, code);
    await stores.usage.record({
      event_type: eventType,
      repo_key: repoKey,
      ...hashes(client),
      cache_hit: false,
      status: code,
    });
    return { status: "error", code, message: errorMessage(code), repo_key: repoKey };
  }
}

function hashes(c: ClientContext) {
  return {
    ip_hash: c.ip_hash,
    session_hash: c.session_hash,
    user_agent_hash: c.user_agent_hash,
  };
}

function errorMessage(code: string): string {
  switch (code) {
    case "not_github":
      return "Bitte eine gültige öffentliche GitHub-URL angeben.";
    case "malformed":
      return "Die URL ist ungültig.";
    case "empty_input":
      return "Bitte eine GitHub-URL eingeben.";
    case "github_not_found":
      return "Repository nicht gefunden.";
    case "github_fetch_failed":
      return "GitHub-Daten konnten nicht geladen werden.";
    case "validation_failed":
      return "Die Analyse war ungültig und wurde verworfen.";
    case "llm_failed":
      return "Die Analyse konnte nicht erstellt werden.";
    default:
      return "Unbekannter Fehler.";
  }
}
