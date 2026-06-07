// Postgres adapter implementations of the persistence ports (production).
import { randomUUID } from "node:crypto";
import type { Pool, QueryResultRow } from "pg";
import type {
  AnalysisCacheRecord,
  AnalysisCacheStore,
  AnalysisLockStore,
  LockResult,
  NewAnalysisCacheRecord,
  RankingPeriod,
  RankingStore,
  RepoSnapshot,
  SnapshotStore,
  UsageEvent,
  UsageEventStore,
  UsageEventType,
  WeeklyTopRepository,
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

function toSnapshot(row: QueryResultRow): RepoSnapshot {
  return {
    repo_key: row.repo_key,
    owner: row.owner,
    repo: row.repo,
    stars: Number(row.stars),
    forks: Number(row.forks),
    open_issues: row.open_issues == null ? null : Number(row.open_issues),
    language: row.language ?? null,
    pushed_at: row.pushed_at ? new Date(row.pushed_at).toISOString() : null,
    snapshot_date: typeof row.snapshot_date === "string" ? row.snapshot_date : new Date(row.snapshot_date).toISOString().slice(0, 10),
  };
}

export class PgSnapshotStore implements SnapshotStore {
  constructor(private pool: Pool) {}

  async upsert(s: RepoSnapshot): Promise<void> {
    await this.pool.query(
      `INSERT INTO repo_snapshots (repo_key, owner, repo, stars, forks, open_issues, language, pushed_at, snapshot_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (repo_key, snapshot_date) DO UPDATE SET
         stars = EXCLUDED.stars, forks = EXCLUDED.forks, open_issues = EXCLUDED.open_issues,
         language = EXCLUDED.language, pushed_at = EXCLUDED.pushed_at`,
      [s.repo_key, s.owner, s.repo, s.stars, s.forks, s.open_issues, s.language, s.pushed_at, s.snapshot_date],
    );
  }

  async getPrevious(repoKey: string, beforeDate: string): Promise<RepoSnapshot | null> {
    const { rows } = await this.pool.query(
      "SELECT * FROM repo_snapshots WHERE repo_key = $1 AND snapshot_date < $2 ORDER BY snapshot_date DESC LIMIT 1",
      [repoKey, beforeDate],
    );
    return rows[0] ? toSnapshot(rows[0]) : null;
  }

  async getByDate(snapshotDate: string): Promise<RepoSnapshot[]> {
    const { rows } = await this.pool.query("SELECT * FROM repo_snapshots WHERE snapshot_date = $1", [snapshotDate]);
    return rows.map(toSnapshot);
  }
}

function toWeekly(row: QueryResultRow): WeeklyTopRepository {
  const d = (v: unknown) => (typeof v === "string" ? v : new Date(v as string).toISOString().slice(0, 10));
  return {
    period_type: (row.period_type ?? "weekly") as RankingPeriod,
    week_start: d(row.week_start),
    week_end: d(row.week_end),
    rank: Number(row.rank),
    repo_key: row.repo_key,
    owner: row.owner,
    repo: row.repo,
    github_url: row.github_url,
    description: row.description ?? null,
    language: row.language ?? null,
    stars: Number(row.stars),
    forks: Number(row.forks),
    stars_delta: row.stars_delta == null ? null : Number(row.stars_delta),
    forks_delta: row.forks_delta == null ? null : Number(row.forks_delta),
    weekly_score: Number(row.weekly_score),
    reason: row.reason,
    is_fallback: Boolean(row.is_fallback),
  };
}

export class PgRankingStore implements RankingStore {
  constructor(private pool: Pool) {}

  async replacePeriod(
    period: RankingPeriod,
    periodStart: string,
    _periodEnd: string,
    items: WeeklyTopRepository[],
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "DELETE FROM weekly_top_repositories WHERE period_type = $1 AND week_start = $2",
        [period, periodStart],
      );
      for (const it of items) {
        await client.query(
          `INSERT INTO weekly_top_repositories
            (period_type, week_start, week_end, rank, repo_key, owner, repo, github_url, description, language,
             stars, forks, stars_delta, forks_delta, weekly_score, reason, is_fallback, data_source)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
          [period, it.week_start, it.week_end, it.rank, it.repo_key, it.owner, it.repo, it.github_url,
            it.description, it.language, it.stars, it.forks, it.stars_delta, it.forks_delta,
            it.weekly_score, it.reason, it.is_fallback, "github_api_snapshot"],
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getLatest(period: RankingPeriod): Promise<WeeklyTopRepository[]> {
    const { rows } = await this.pool.query(
      `SELECT * FROM weekly_top_repositories
       WHERE period_type = $1
         AND week_start = (SELECT max(week_start) FROM weekly_top_repositories WHERE period_type = $1)
       ORDER BY rank`,
      [period],
    );
    return rows.map(toWeekly);
  }
}
