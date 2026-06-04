// PHASE-2 — Ports (interfaces) for persistence. Domain/application code depends
// on these, never on pg directly (ARCH-001, ARCH-002). Adapters: pg (prod),
// in-memory (tests/dev).

export interface AnalysisCacheRecord {
  id: string;
  repo_key: string;
  owner: string;
  repo: string;
  github_url: string;
  analysis_json: unknown; // validated AnalysisResult (PHASE-3 schema)
  repo_metadata_json: unknown;
  provider: string;
  model: string;
  analyzer_version: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string | null;
  access_count: number;
  is_stale: boolean;
}

export type NewAnalysisCacheRecord = Pick<
  AnalysisCacheRecord,
  | "repo_key"
  | "owner"
  | "repo"
  | "github_url"
  | "analysis_json"
  | "repo_metadata_json"
  | "provider"
  | "model"
  | "analyzer_version"
>;

export interface AnalysisCacheStore {
  /** Cache lookup. Must run before any OpenRouter call (ARCH-007). */
  get(repoKey: string): Promise<AnalysisCacheRecord | null>;
  /** Persist a freshly validated analysis (upsert by repo_key). */
  put(record: NewAnalysisCacheRecord): Promise<AnalysisCacheRecord>;
  /** Cache-hit bookkeeping: access_count++ and last_accessed_at = now. No LLM. */
  touch(repoKey: string): Promise<void>;
}

export type UsageEventType =
  | "cache_hit"
  | "cache_miss"
  | "openrouter_call"
  | "blocked_rate_limit"
  | "bot_blocked"
  | "locked_repo_analysis"
  | "github_fetch_failed"
  | "llm_failed"
  | "validation_failed"
  | "error";

export interface UsageEvent {
  event_type: UsageEventType;
  repo_key?: string | null;
  ip_hash?: string | null;
  session_hash?: string | null;
  user_agent_hash?: string | null;
  provider?: string | null;
  model?: string | null;
  estimated_input_tokens?: number | null;
  estimated_output_tokens?: number | null;
  estimated_cost?: number | null;
  cache_hit: boolean;
  status: string;
}

export interface UsageEventStore {
  record(event: UsageEvent): Promise<void>;
  /** Count events of given types for an ip_hash within the last windowMs. */
  countRecent(ipHash: string, eventTypes: UsageEventType[], windowMs: number): Promise<number>;
}

export type LockResult = "acquired" | "in_progress";

export interface AnalysisLockStore {
  /** Atomically acquire a lock for repo_key. Returns "in_progress" if another
   *  live lock exists; takes over expired locks. */
  acquire(repoKey: string, lockId: string, ttlMs: number): Promise<LockResult>;
  complete(repoKey: string, lockId: string): Promise<void>;
  fail(repoKey: string, lockId: string, errorCode: string): Promise<void>;
}
