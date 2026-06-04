// Store factory: production uses Postgres; without DATABASE_URL falls back to
// in-memory (local dev only — not persistent). Tests inject stores directly.
import { getPool, hasDatabase } from "../db";
import type { AnalysisCacheStore, AnalysisLockStore, UsageEventStore } from "../ports";
import {
  MemoryAnalysisCacheStore,
  MemoryAnalysisLockStore,
  MemoryUsageEventStore,
} from "./memory-stores";
import { PgAnalysisCacheStore, PgAnalysisLockStore, PgUsageEventStore } from "./pg-stores";

export interface Stores {
  cache: AnalysisCacheStore;
  usage: UsageEventStore;
  lock: AnalysisLockStore;
}

let singleton: Stores | null = null;
let warnedDevFallback = false;

export function getStores(): Stores {
  if (singleton) return singleton;

  if (hasDatabase()) {
    const pool = getPool();
    singleton = {
      cache: new PgAnalysisCacheStore(pool),
      usage: new PgUsageEventStore(pool),
      lock: new PgAnalysisLockStore(pool),
    };
  } else {
    if (!warnedDevFallback && process.env.NODE_ENV !== "test") {
      warnedDevFallback = true;
      // Not console.log (lint rule): a startup warning on the error channel.
      console.warn(
        "[stores] DATABASE_URL not set — using in-memory stores (dev only, NOT persistent).",
      );
    }
    singleton = {
      cache: new MemoryAnalysisCacheStore(),
      usage: new MemoryUsageEventStore(),
      lock: new MemoryAnalysisLockStore(),
    };
  }
  return singleton;
}
