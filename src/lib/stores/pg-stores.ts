// Postgres adapter implementations of the persistence ports (production).
import { randomUUID } from "node:crypto";
import type { Pool, QueryResultRow } from "pg";
import type {
  AnalysisCacheRecord,
  AnalysisCacheStore,
  AnalysisLockStore,
  LockResult,
  NewAnalysisCacheRecord,
  UsageEvent,
  UsageEventStore,
  UsageEventType,
} from "../ports";

function toRecord(row: QueryResultRow): AnalysisCacheRecord {
  return {
    id: row.id,
    repo_key: row.repo_key,
    owner: row.owner,
    repo: row.repo,
    github_url: row.github_url,
    analysis_json: row.analysis_json,
    repo_metadata_json: row.repo_metadata_json,
    provider: row.provider,
    model: row.model,
    analyzer_version: row.analyzer_version,
    created_at: new Date(row.created_at).toISOString(),
    updated_at: new Date(row.updated_at).toISOString(),
    last_accessed_at: row.last_accessed_at ? new Date(row.last_accessed_at).toISOString() : null,
    access_count: Number(row.access_count),
    is_stale: row.is_stale,
  };
}

export class PgAnalysisCacheStore implements AnalysisCacheStore {
  constructor(private pool: Pool) {}

  async get(repoKey: string): Promise<AnalysisCacheRecord | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM analysis_cache WHERE repo_key = $1",
      [repoKey],
    );
    return rows[0] ? toRecord(rows[0]) : null;
  }

  async put(r: NewAnalysisCacheRecord): Promise<AnalysisCacheRecord> {
    const { rows } = await this.pool.query(
      `INSERT INTO analysis_cache
        (id, repo_key, owner, repo, github_url, analysis_json, repo_metadata_json, provider, model, analyzer_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (repo_key) DO UPDATE SET
         analysis_json = EXCLUDED.analysis_json,
         repo_metadata_json = EXCLUDED.repo_metadata_json,
         provider = EXCLUDED.provider,
         model = EXCLUDED.model,
         analyzer_version = EXCLUDED.analyzer_version,
         updated_at = now(),
         is_stale = false
       RETURNING *`,
      [
        randomUUID(),
        r.repo_key,
        r.owner,
        r.repo,
        r.github_url,
        JSON.stringify(r.analysis_json),
        JSON.stringify(r.repo_metadata_json),
        r.provider,
        r.model,
        r.analyzer_version,
      ],
    );
    return toRecord(rows[0]);
  }

  async touch(repoKey: string): Promise<void> {
    await this.pool.query(
      "UPDATE analysis_cache SET access_count = access_count + 1, last_accessed_at = now() WHERE repo_key = $1",
      [repoKey],
    );
  }
}

export class PgUsageEventStore implements UsageEventStore {
  constructor(private pool: Pool) {}

  async record(e: UsageEvent): Promise<void> {
    await this.pool.query(
      `INSERT INTO usage_events
        (event_type, repo_key, ip_hash, session_hash, user_agent_hash, provider, model,
         estimated_input_tokens, estimated_output_tokens, estimated_cost, cache_hit, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        e.event_type,
        e.repo_key ?? null,
        e.ip_hash ?? null,
        e.session_hash ?? null,
        e.user_agent_hash ?? null,
        e.provider ?? null,
        e.model ?? null,
        e.estimated_input_tokens ?? null,
        e.estimated_output_tokens ?? null,
        e.estimated_cost ?? null,
        e.cache_hit,
        e.status,
      ],
    );
  }

  async countRecent(ipHash: string, eventTypes: UsageEventType[], windowMs: number): Promise<number> {
    const { rows } = await this.pool.query(
      `SELECT count(*)::int AS c FROM usage_events
       WHERE ip_hash = $1 AND event_type = ANY($2)
         AND created_at >= now() - make_interval(secs => $3::double precision / 1000)`,
      [ipHash, eventTypes, windowMs],
    );
    return rows[0]?.c ?? 0;
  }
}

export class PgAnalysisLockStore implements AnalysisLockStore {
  constructor(private pool: Pool) {}

  async acquire(repoKey: string, lockId: string, ttlMs: number): Promise<LockResult> {
    // Atomic: insert, or take over only an expired / non-running lock.
    const { rows } = await this.pool.query(
      `INSERT INTO analysis_locks (repo_key, lock_id, status, expires_at)
       VALUES ($1, $2, 'running', now() + make_interval(secs => $3::double precision / 1000))
       ON CONFLICT (repo_key) DO UPDATE SET
         lock_id = EXCLUDED.lock_id,
         status = 'running',
         created_at = now(),
         expires_at = EXCLUDED.expires_at,
         error_code = NULL
       WHERE analysis_locks.status <> 'running' OR analysis_locks.expires_at < now()
       RETURNING lock_id`,
      [repoKey, lockId, ttlMs],
    );
    return rows.length > 0 ? "acquired" : "in_progress";
  }

  async complete(repoKey: string, lockId: string): Promise<void> {
    await this.pool.query(
      "UPDATE analysis_locks SET status = 'completed' WHERE repo_key = $1 AND lock_id = $2",
      [repoKey, lockId],
    );
  }

  async fail(repoKey: string, lockId: string, errorCode: string): Promise<void> {
    await this.pool.query(
      "UPDATE analysis_locks SET status = 'failed', error_code = $3 WHERE repo_key = $1 AND lock_id = $2",
      [repoKey, lockId, errorCode],
    );
  }
}
