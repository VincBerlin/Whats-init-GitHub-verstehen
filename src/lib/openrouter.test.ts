import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { openRouterAnalyzer } from "./openrouter";
import { AnalyzerError } from "./analyzer-port";
import type { RepoKey } from "./repo-normalize";

const repo: RepoKey = {
  owner: "vercel",
  repo: "next.js",
  repo_key: "vercel/next.js",
  github_url: "https://github.com/vercel/next.js",
};

const ghJson = {
  full_name: "vercel/next.js",
  description: "The React Framework",
  stargazers_count: 120000,
  forks_count: 25000,
  language: "JavaScript",
  topics: ["react"],
  html_url: "https://github.com/vercel/next.js",
  clone_url: "https://github.com/vercel/next.js.git",
  homepage: null,
  license: { name: "MIT License" },
  updated_at: "2026-01-01T00:00:00Z",
  pushed_at: "2026-02-01T00:00:00Z",
  open_issues_count: 2000,
  default_branch: "canary",
  owner: { login: "vercel", avatar_url: "https://avatars.githubusercontent.com/u/1" },
};

const validLlm = {
  repoName: "next.js",
  category: "Framework",
  coreBenefit: "Das React-Framework.",
  beginnerSummary: "Hilft Websites zu bauen.",
  professionalAssessment: "Reifes Framework.",
  useCases: ["Web-Apps"],
  notFor: [],
  qualityScore: { total: 95, activity: 98, documentation: 90, installationClarity: 92, community: 99, security: 85, maintenance: 95 },
  concerns: [],
  installation: { clone: null, npm: "npm i next", pnpm: null, yarn: null, pip: null, docker: null, manual: null },
  commandsUsed: [],
  aiPrompts: [{ intent: "Start", prompt: "Neues Projekt." }],
  faq: [],
};

function ok(json: unknown) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(json), text: () => Promise.resolve("") } as Response);
}

beforeEach(() => {
  process.env.OPENROUTER_API_KEY = "test-key";
  process.env.OPENROUTER_MODEL = "google/gemini-2.5-flash";
});
afterEach(() => vi.unstubAllGlobals());

// TEST-004 (API-003, FR-007)
describe("openRouterAnalyzer", () => {
  it("fetches GitHub, calls OpenRouter, validates and composes the result", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url.includes("/readme")) return ok({ content: Buffer.from("# Readme").toString("base64") });
      if (url.includes("api.github.com/repos/")) return ok(ghJson);
      if (url.includes("/chat/completions")) {
        return ok({ choices: [{ message: { content: JSON.stringify(validLlm) } }], usage: { prompt_tokens: 1000, completion_tokens: 500 } });
      }
      throw new Error("unexpected url " + url);
    });
    vi.stubGlobal("fetch", fetchMock);

    const out = await openRouterAnalyzer.analyze(repo);
    expect(out.provider).toBe("openrouter");
    expect(out.model).toBe("google/gemini-2.5-flash");
    expect(out.usage?.inputTokens).toBe(1000);
    const analysis = out.analysis as { repoName: string; repositoryFacts: { stars: number } };
    expect(analysis.repoName).toBe("next.js");
    expect(analysis.repositoryFacts.stars).toBe(120000);
    // the OpenRouter call must carry the API key server-side
    const orCall = fetchMock.mock.calls.find((c) => String(c[0]).includes("/chat/completions"));
    expect((orCall?.[1] as RequestInit)?.headers).toMatchObject({ Authorization: "Bearer test-key" });
  });

  it("maps a GitHub 404 to github_not_found", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("/readme")) return ok({ content: "" });
      return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}), text: () => Promise.resolve("") } as Response);
    }));
    await expect(openRouterAnalyzer.analyze(repo)).rejects.toMatchObject({ code: "github_not_found" });
  });

  it("maps an OpenRouter error to llm_failed", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("/readme")) return ok({ content: "" });
      if (url.includes("api.github.com/repos/")) return ok(ghJson);
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}), text: () => Promise.resolve("upstream error") } as Response);
    }));
    await expect(openRouterAnalyzer.analyze(repo)).rejects.toBeInstanceOf(AnalyzerError);
  });

  it("rejects when OPENROUTER_API_KEY is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;
    await expect(openRouterAnalyzer.analyze(repo)).rejects.toMatchObject({ code: "llm_failed" });
  });
});
