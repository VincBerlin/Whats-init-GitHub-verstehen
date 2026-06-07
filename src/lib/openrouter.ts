// PHASE-3 / TASK-3.1 — OpenRouter adapter (API-003). Server-side only:
// OPENROUTER_API_KEY never reaches the client. Gemini is just the model slug.
import { buildAnalysisResult, SchemaValidationError } from "./analysis-schema";
import { AnalyzerError, type AnalyzerPort } from "./analyzer-port";
import { fetchReadme, fetchRepo, GitHubError } from "./github";

export const ANALYZER_VERSION = "openrouter-v1";

const SYSTEM_PROMPT = `Du bist ein brillanter Technical Writer und Senior Developer Relations Engineer.
Analysiere das übergebene öffentliche GitHub-Repository und seine README für ein deutschsprachiges Publikum (ab ca. 16 Jahren, Selbstlernende, Gründer, Entwickler).

SPRACHE:
- Schreibe auf Deutsch, präzise, vertrauenswürdig, auf Augenhöhe ("du", "dein Projekt").
- Kein unnötiger Jargon. Vermeide die Wörter "Anfänger", "Beginner", "Amateure".

WICHTIG:
- Gib NUR gültiges JSON zurück (kein Markdown, kein HTML, keine Code-Fences).
- Erfinde KEINE Stars/Forks/Lizenz-Zahlen — diese werden separat aus GitHub-Metadaten ergänzt.
- qualityScore-Felder sind ganze Zahlen 0–100 (total = ehrliche Gesamteinschätzung).
- concerns: ehrliche, sachliche Hinweise (level low/medium/high). Keine Panikmache; leeres Array, wenn nichts Relevantes.
- installation: nur tatsächlich plausible Befehle, sonst null. Das clone-Feld bitte leer lassen oder null (wird automatisch gesetzt).
- commandsUsed: typische Terminal-Befehle zur Nutzung, linkSlug immer null.
- aiPrompts: 3 konkrete deutsche Sätze, die man direkt in Claude/Cursor eingeben kann (Installation, Integration, Nutzung).
- faq: 2–4 echte, hilfreiche Fragen/Antworten.

Gib STRIKT dieses JSON-Schema zurück:
{
  "repoName": "string",
  "category": "string (Library | Framework | CLI | Agent | MCP | Design System | Template | Web App | Toolkit | Andere)",
  "coreBenefit": "string (1 präziser Satz zum Kern-Nutzen)",
  "beginnerSummary": "string (2-3 Sätze, verständlich erklärt)",
  "professionalAssessment": "string (2-4 Sätze technische Einordnung)",
  "useCases": ["string", "..."],
  "notFor": ["string", "..."],
  "qualityScore": { "total": 0, "activity": 0, "documentation": 0, "installationClarity": 0, "community": 0, "security": 0, "maintenance": 0 },
  "concerns": [ { "level": "low|medium|high", "title": "string", "explanation": "string", "whatToCheck": "string" } ],
  "installation": { "clone": null, "npm": "string|null", "pnpm": "string|null", "yarn": "string|null", "pip": "string|null", "docker": "string|null", "manual": "string|null" },
  "commandsUsed": [ { "command": "string", "explanation": "string", "linkSlug": null } ],
  "aiPrompts": [ { "intent": "string", "prompt": "string" } ],
  "faq": [ { "question": "string", "answer": "string" } ]
}`;

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new AnalyzerError("llm_failed", "OPENROUTER_API_KEY not set");
  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-flash",
    baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  };
}

interface OpenRouterResponse {
  text: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export async function callOpenRouter(userMessage: string, config: OpenRouterConfig): Promise<OpenRouterResponse> {
  let res: Response;
  try {
    res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://whatsinit.app",
        "X-Title": "What's in it?",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 4096,
      }),
    });
  } catch (err) {
    throw new AnalyzerError("llm_failed", err instanceof Error ? err.message : String(err));
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AnalyzerError("llm_failed", `OpenRouter error ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  if (!text) throw new AnalyzerError("llm_failed", "OpenRouter returned empty content");
  return {
    text,
    usage: {
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    },
  };
}

function buildUserMessage(gh: { full_name: string; description: string | null; stargazers_count: number; language: string | null; topics: string[]; license: { name: string } | null; clone_url: string }, readme: string): string {
  return `Repository: ${gh.full_name}
Beschreibung: ${gh.description || "keine"}
Stars: ${gh.stargazers_count.toLocaleString("de-DE")}
Sprache: ${gh.language || "unbekannt"}
Topics: ${(gh.topics || []).join(", ") || "keine"}
Lizenz: ${gh.license?.name || "unbekannt"}
Clone URL: ${gh.clone_url}

README (Auszug):
${readme || "kein README gefunden"}`;
}

export const openRouterAnalyzer: AnalyzerPort = {
  async analyze(repo) {
    const config = getOpenRouterConfig();

    let gh, readme;
    try {
      [gh, readme] = await Promise.all([fetchRepo(repo.owner, repo.repo), fetchReadme(repo.owner, repo.repo)]);
    } catch (err) {
      if (err instanceof GitHubError) {
        throw new AnalyzerError(err.status === 404 ? "github_not_found" : "github_fetch_failed", err.message);
      }
      throw new AnalyzerError("github_fetch_failed", err instanceof Error ? err.message : String(err));
    }

    const { text, usage } = await callOpenRouter(buildUserMessage(gh, readme), config);

    let analysis;
    try {
      analysis = buildAnalysisResult(text, gh);
    } catch (err) {
      if (err instanceof SchemaValidationError) throw new AnalyzerError("validation_failed", err.message);
      throw err;
    }

    return {
      analysis,
      repoMetadata: gh,
      provider: "openrouter",
      model: config.model,
      analyzerVersion: ANALYZER_VERSION,
      usage,
    };
  },
};
