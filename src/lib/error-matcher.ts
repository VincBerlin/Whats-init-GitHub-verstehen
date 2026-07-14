// PHASE-3 — deterministic error matcher. Pure function, no network/LLM (NFR-002).
import { ERROR_PATTERNS, type DebugPattern, type DebugCategory } from "@/data/error-patterns";

export interface ErrorMatch {
  pattern: DebugPattern;
  hits: number;
}

export function matchErrors(input: string, category?: DebugCategory): ErrorMatch[] {
  const text = (input ?? "").toLowerCase();
  if (!text.trim()) return [];
  const pool = category ? ERROR_PATTERNS.filter((p) => p.category === category) : ERROR_PATTERNS;

  return pool
    .map((pattern) => ({
      pattern,
      hits: pattern.matchers.reduce((n, sig) => (text.includes(sig.toLowerCase()) ? n + 1 : n), 0),
    }))
    .filter((m) => m.hits > 0)
    .sort((a, b) => b.hits - a.hits);
}

/** Distinct categories present in the pattern DB, in first-seen order. */
export function availableCategories(): DebugCategory[] {
  const seen: DebugCategory[] = [];
  for (const p of ERROR_PATTERNS) if (!seen.includes(p.category)) seen.push(p.category);
  return seen;
}
