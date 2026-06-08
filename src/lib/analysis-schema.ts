// PHASE-3 / TASK-3.2 — strict validation of LLM output. The LLM produces the
// qualitative fields; deterministic, attacker/hallucination-sensitive facts
// (stars, forks, clone URL, license) are injected from GitHub metadata, never
// trusted from the model. No HTML fields exist (SEC-006).
import { z } from "zod";
import type { AnalysisResult, GitHubRepo } from "@/types/analysis";

const score = z.number().min(0).max(100);

const QualityScoreSchema = z.object({
  total: score,
  activity: score,
  documentation: score,
  installationClarity: score,
  community: score,
  security: score,
  maintenance: score,
});

const ConcernSchema = z.object({
  level: z.enum(["low", "medium", "high"]),
  title: z.string().min(1),
  explanation: z.string().min(1),
  whatToCheck: z.string().min(1),
});

const nullableStr = z.string().nullable();

const InstallationSchema = z.object({
  clone: z.string().nullable().optional(),
  npm: nullableStr,
  pnpm: nullableStr,
  yarn: nullableStr,
  pip: nullableStr,
  docker: nullableStr,
  manual: nullableStr,
});

// Schema for what the model returns (no repositoryFacts — those come from GitHub).
export const LlmAnalysisSchema = z.object({
  repoName: z.string().min(1),
  category: z.string().min(1),
  coreBenefit: z.string().min(1),
  beginnerSummary: z.string().min(1),
  professionalAssessment: z.string().min(1),
  useCases: z.array(z.string().min(1)).min(1),
  notFor: z.array(z.string().min(1)),
  qualityScore: QualityScoreSchema,
  concerns: z.array(ConcernSchema),
  installation: InstallationSchema,
  commandsUsed: z.array(
    z.object({
      command: z.string().min(1),
      explanation: z.string().min(1),
      linkSlug: z.string().nullable(),
    }),
  ),
  aiPrompts: z.array(z.object({ intent: z.string().min(1), prompt: z.string().min(1) })).min(1),
  faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
});

export type LlmAnalysis = z.infer<typeof LlmAnalysisSchema>;

export class SchemaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaValidationError";
  }
}

/** Tolerant JSON extraction: handles markdown fences and surrounding prose. */
export function extractJson(rawText: string): unknown {
  const text = rawText.trim();
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const candidate = fenced ? fenced[1] : text.match(/\{[\s\S]+\}/)?.[0];
    if (!candidate) throw new SchemaValidationError("No JSON object found in LLM output");
    try {
      return JSON.parse(candidate);
    } catch {
      throw new SchemaValidationError("LLM output is not valid JSON");
    }
  }
}

function factsFromGitHub(gh: GitHubRepo) {
  return {
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    license: gh.license?.name ?? null,
    language: gh.language ?? null,
    lastUpdated: gh.pushed_at ?? gh.updated_at ?? null,
    openIssues: gh.open_issues_count ?? null,
    defaultBranch: gh.default_branch ?? null,
  };
}

/** Validate raw LLM text and compose the final AnalysisResult with real GitHub facts. */
export function buildAnalysisResult(rawText: string, gh: GitHubRepo): AnalysisResult {
  const parsed = extractJson(rawText);
  const result = LlmAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    throw new SchemaValidationError(
      "LLM output failed schema validation: " + result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    );
  }
  const llm = result.data;
  return {
    ...llm,
    installation: {
      ...llm.installation,
      // Deterministic, never trust the model for the clone command.
      clone: `git clone ${gh.clone_url}`,
    },
    repositoryFacts: factsFromGitHub(gh),
  };
}
