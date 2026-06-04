// In-memory adapter implementations for tests and local dev (no DATABASE_URL).
// NOT for production: not persistent, single-instance only.
import { randomUUID } from "node:crypto";
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
