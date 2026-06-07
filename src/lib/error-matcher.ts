// PHASE-6 — deterministic error matcher. Pure function, no network/LLM (SCOPE-005).
import { ERROR_PATTERNS, type ErrorPattern } from "@/data/error-patterns";

export interface ErrorMatch {
  pattern: ErrorPattern;
  hits: number;
}

export function matchErrors(input: string, tool?: "git" | "actions"): ErrorMatch[] {
  const text = (input ?? "").toLowerCase();
  if (!text.trim()) return [];
  const pool = tool ? ERROR_PATTERNS.filter((p) => p.tool === tool) : ERROR_PATTERNS;

  return pool
    .map((pattern) => ({
      pattern,
      hits: pattern.signals.reduce((n, sig) => (text.includes(sig.toLowerCase()) ? n + 1 : n), 0),
    }))
    .filter((m) => m.hits > 0)
    .sort((a, b) => b.hits - a.hits);
}
