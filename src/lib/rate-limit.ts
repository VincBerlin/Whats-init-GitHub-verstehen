// PHASE-2 / TASK-2.4 — per-IP rate limit on NEW analyses (cache misses), the
// only cost-incurring path. Conservative env-configurable defaults
// (ASSUMPTION: thresholds MISSING in PRD — confirm before production tuning).
import type { UsageEventStore, UsageEventType } from "./ports";

export interface RateLimitConfig {
  maxNewAnalyses: number;
  windowMs: number;
}

export function getRateLimitConfig(): RateLimitConfig {
  return {
    maxNewAnalyses: Number(process.env.RATE_LIMIT_MAX ?? 20),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60 * 60 * 1000), // 1h
  };
}

// Events that count as "a new analysis was attempted" for this IP.
const COUNTED: UsageEventType[] = ["cache_miss", "openrouter_call"];

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
}

export async function checkRateLimit(
  usage: UsageEventStore,
  ipHash: string | null,
  config: RateLimitConfig = getRateLimitConfig(),
): Promise<RateLimitResult> {
  // No IP hash (e.g. local/unknown) → do not block, but it is still counted via events.
  if (!ipHash) return { allowed: true, current: 0, limit: config.maxNewAnalyses };
  const current = await usage.countRecent(ipHash, COUNTED, config.windowMs);
  return {
    allowed: current < config.maxNewAnalyses,
    current,
    limit: config.maxNewAnalyses,
  };
}
