// In-memory adapter implementations for tests and local dev (no DATABASE_URL).
// NOT for production: not persistent, single-instance only.
import { randomUUID } from "node:crypto";
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

export class MemoryAnalysisCacheStore implements AnalysisCacheStore {
  private byKey = new Map<string, AnalysisCacheRecord>();

  async get(repoKey: string): Promise<AnalysisCacheRecord | null> {
    return this.byKey.get(repoKey) ?? null;
  }

  async put(record: NewAnalysisCacheRecord): Promise<AnalysisCacheRecord> {
    const now = new Date().toISOString();
    const existing = this.byKey.get(record.repo_key);
    const full: AnalysisCacheRecord = {
      id: existing?.id ?? randomUUID(),
      created_at: existing?.created_at ?? now,
      updated_at: now,
      last_accessed_at: existing?.last_accessed_at ?? null,
      access_count: existing?.access_count ?? 0,
      is_stale: false,
      ...record,
    };
    this.byKey.set(record.repo_key, full);
    return full;
  }

  async touch(repoKey: string): Promise<void> {
    const rec = this.byKey.get(repoKey);
    if (rec) {
      rec.access_count += 1;
      rec.last_accessed_at = new Date().toISOString();
    }
  }
}

export class MemoryUsageEventStore implements UsageEventStore {
  events: Array<UsageEvent & { created_at: number }> = [];

  async record(event: UsageEvent): Promise<void> {
    this.events.push({ ...event, created_at: Date.now() });
  }

  async countRecent(ipHash: string, eventTypes: UsageEventType[], windowMs: number): Promise<number> {
    const cutoff = Date.now() - windowMs;
    const set = new Set(eventTypes);
    return this.events.filter(
      (e) => e.ip_hash === ipHash && e.created_at >= cutoff && set.has(e.event_type),
    ).length;
  }
}

interface LockRow {
  lock_id: string;
  status: "running" | "completed" | "failed";
  expires_at: number;
}

export class MemoryAnalysisLockStore implements AnalysisLockStore {
  private locks = new Map<string, LockRow>();

  // Synchronous check-then-set models Postgres' atomic INSERT ... ON CONFLICT.
  async acquire(repoKey: string, lockId: string, ttlMs: number): Promise<LockResult> {
    const now = Date.now();
    const existing = this.locks.get(repoKey);
    const live = existing && existing.status === "running" && existing.expires_at > now;
    if (live) return "in_progress";
    this.locks.set(repoKey, { lock_id: lockId, status: "running", expires_at: now + ttlMs });
    return "acquired";
  }

  async complete(repoKey: string, lockId: string): Promise<void> {
    const l = this.locks.get(repoKey);
    if (l && l.lock_id === lockId) l.status = "completed";
  }

  async fail(repoKey: string, lockId: string): Promise<void> {
    const l = this.locks.get(repoKey);
    if (l && l.lock_id === lockId) l.status = "failed";
  }
}

export class MemorySnapshotStore implements SnapshotStore {
  private rows: RepoSnapshot[] = [];

  async upsert(s: RepoSnapshot): Promise<void> {
    const idx = this.rows.findIndex((r) => r.repo_key === s.repo_key && r.snapshot_date === s.snapshot_date);
    if (idx >= 0) this.rows[idx] = s;
    else this.rows.push(s);
  }

  async getPrevious(repoKey: string, beforeDate: string): Promise<RepoSnapshot | null> {
    const prev = this.rows
      .filter((r) => r.repo_key === repoKey && r.snapshot_date < beforeDate)
      .sort((a, b) => (a.snapshot_date < b.snapshot_date ? 1 : -1));
    return prev[0] ?? null;
  }

  async getByDate(snapshotDate: string): Promise<RepoSnapshot[]> {
    return this.rows.filter((r) => r.snapshot_date === snapshotDate);
  }
}

export class MemoryRankingStore implements RankingStore {
  private rows: WeeklyTopRepository[] = [];

  async replacePeriod(
    period: RankingPeriod,
    periodStart: string,
    _periodEnd: string,
    items: WeeklyTopRepository[],
  ): Promise<void> {
    this.rows = this.rows
      .filter((r) => !(r.period_type === period && r.week_start === periodStart))
      .concat(items);
  }

  async getLatest(period: RankingPeriod): Promise<WeeklyTopRepository[]> {
    const scoped = this.rows.filter((r) => r.period_type === period);
    if (scoped.length === 0) return [];
    const latest = scoped.reduce((m, r) => (r.week_start > m ? r.week_start : m), scoped[0].week_start);
    return scoped.filter((r) => r.week_start === latest).sort((a, b) => a.rank - b.rank);
  }
}
