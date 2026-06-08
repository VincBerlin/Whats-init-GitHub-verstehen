// PHASE-2 — analyzer port. The cost-incurring "fetch GitHub + run LLM" step is
// behind this interface so the service stays provider-agnostic (ARCH-002).
// PHASE-3 swaps the implementation to the OpenRouter adapter.
import type { RepoKey } from "./repo-normalize";

export interface AnalyzerOutput {
  analysis: unknown; // validated AnalysisResult
  repoMetadata: unknown;
  provider: string;
  model: string;
  analyzerVersion: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export type AnalyzerErrorCode =
  | "github_fetch_failed"
  | "github_not_found"
  | "llm_failed"
  | "validation_failed";

export class AnalyzerError extends Error {
  constructor(public code: AnalyzerErrorCode, message: string) {
    super(message);
    this.name = "AnalyzerError";
  }
}

export interface AnalyzerPort {
  analyze(repo: RepoKey): Promise<AnalyzerOutput>;
}
