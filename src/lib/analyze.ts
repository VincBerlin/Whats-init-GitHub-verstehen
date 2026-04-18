import { AnalysisResult, GitHubRepo } from "@/types/analysis";

// Simple in-memory cache — replace with Redis/Vercel KV in production
const cache = new Map<string, { data: AnalysisResult; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

const SYSTEM_PROMPT = `Du bist ein brillanter Technical Writer und Senior Developer Relations Engineer.
Analysiere das übergebene GitHub-Repository und seine README.

REGELN ZUR SPRACHE:
- Vermeide unnötigen Jargon, aber nutze NIEMALS Wörter wie "Anfänger", "Beginner" oder "Amateure"
- Sprich den Leser auf Augenhöhe an: "Entwickler", "du", "dein Projekt"
- Erkläre Konzepte brillant, präzise und vertrauenswürdig
- Schreibe auf Deutsch

REGEL FÜR smartRecommendation:
Nutze dieses Feld NUR wenn es sich um einen im Internet bekannten, viralen autonomen Agenten handelt, der selbstständig Code ausführt oder Shell-Zugriff hat.
Formuliere es als sachlichen, beruhigenden Pro-Tipp (z.B. VPS-Nutzung) — kein Rot, keine Panikmache.
In 95% der Fälle (Libraries, Frameworks, CLIs, Design-Systeme) MUSS dieses Feld null sein.

REGEL FÜR aiPrompts:
Gib 3 konkrete, deutsche Sätze die der Nutzer direkt in Claude oder Cursor eingeben kann.
Jeder Prompt löst eine echte Aufgabe: Installation, Integration, Nutzung.

Gib STRIKT dieses JSON ohne Markdown-Wrapper zurück:
{
  "repoName": "string",
  "starsInterpretation": "string (z.B. 'Industriestandard' bei >10k, 'Wächst schnell' bei >1k)",
  "category": "string (Library | Framework | CLI | Agent | MCP | Design System | Template | Web App | Toolkit)",
  "coreBenefit": "string (1 präziser Satz zum Kern-Nutzen)",
  "smartRecommendation": "string | null",
  "installation": {
    "local": "string | null",
    "global": "string | null",
    "clone": "string"
  },
  "aiPrompts": [
    { "intent": "string (kurzes Label)", "prompt": "string (der deutsche Satz)" }
  ],
  "seoDeepDiveHtml": "string (semantisches HTML mit h2, h3, p, ul — min. 300 Wörter für SEO)",
  "keywordsForInternalLinking": ["string (3-6 relevante Begriffe für /wiki/)"]
}`;

const GITHUB_IDENTIFIER_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;


function getGitHubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "whats-in-it-app",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function isValidGitHubIdentifier(value: string): boolean {
  return GITHUB_IDENTIFIER_RE.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseAnalysisResult(rawText: string): AnalysisResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/\{[\s\S]+\}/);
    if (!jsonMatch) throw new Error("LLM returned invalid JSON");
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (!isObject(parsed)) {
    throw new Error("LLM returned invalid analysis payload");
  }

  const installation = parsed.installation;
  const aiPrompts = parsed.aiPrompts;
  const keywords = parsed.keywordsForInternalLinking;

  if (
    typeof parsed.repoName !== "string" ||
    typeof parsed.starsInterpretation !== "string" ||
    typeof parsed.category !== "string" ||
    typeof parsed.coreBenefit !== "string" ||
    (parsed.smartRecommendation !== null && typeof parsed.smartRecommendation !== "string") ||
    !isObject(installation) ||
    (installation.local !== null && typeof installation.local !== "string") ||
    (installation.global !== null && typeof installation.global !== "string") ||
    typeof installation.clone !== "string" ||
    !Array.isArray(aiPrompts) ||
    aiPrompts.length === 0 ||
    aiPrompts.some(
      (item) =>
        !isObject(item) ||
        typeof item.intent !== "string" ||
        typeof item.prompt !== "string"
    ) ||
    typeof parsed.seoDeepDiveHtml !== "string" ||
    !Array.isArray(keywords) ||
    keywords.some((item) => typeof item !== "string")
  ) {
    throw new Error("LLM returned malformed analysis");
  }

  return {
    repoName: parsed.repoName,
    starsInterpretation: parsed.starsInterpretation,
    category: parsed.category,
    coreBenefit: parsed.coreBenefit,
    smartRecommendation: parsed.smartRecommendation,
    installation: {
      local: installation.local,
      global: installation.global,
      clone: installation.clone,
    },
    aiPrompts: aiPrompts.map((item) => ({
      intent: item.intent,
      prompt: item.prompt,
    })),
    seoDeepDiveHtml: parsed.seoDeepDiveHtml,
    keywordsForInternalLinking: keywords,
  };
}

async function fetchGitHubData(owner: string, repo: string): Promise<GitHubRepo> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: getGitHubHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "";
    const data = await res.json();
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return decoded.substring(0, 6000);
  } catch {
    return "";
  }
}

export async function analyzeRepo(owner: string, repo: string): Promise<AnalysisResult> {
  if (!isValidGitHubIdentifier(owner) || !isValidGitHubIdentifier(repo)) {
    throw new Error("Invalid owner or repo format");
  }

  const cacheKey = `${owner}/${repo}`;

  // Cache hit — costs 0 tokens
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  const [ghData, readme] = await Promise.all([
    fetchGitHubData(owner, repo),
    fetchReadme(owner, repo),
  ]);

  const userMessage = `Repository: ${ghData.full_name}
Beschreibung: ${ghData.description || "keine"}
Stars: ${ghData.stargazers_count.toLocaleString()}
Sprache: ${ghData.language || "unbekannt"}
Topics: ${(ghData.topics || []).join(", ") || "keine"}
Lizenz: ${ghData.license?.name || "unbekannt"}
Clone URL: ${ghData.clone_url}

README (Auszug):
${readme || "kein README gefunden"}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const llmRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 8192, responseMimeType: "application/json" },
      }),
    }
  );

  if (!llmRes.ok) {
    const err = await llmRes.text();
    throw new Error(`LLM error: ${err}`);
  }

  const llmData = await llmRes.json();
  const rawText = llmData.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const analysis = parseAnalysisResult(rawText);

  cache.set(cacheKey, { data: analysis, ts: Date.now() });
  return analysis;
}

export async function fetchGitHubMeta(owner: string, repo: string): Promise<GitHubRepo> {
  return fetchGitHubData(owner, repo);
}
