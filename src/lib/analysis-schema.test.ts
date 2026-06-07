import { describe, it, expect } from "vitest";
import { buildAnalysisResult, extractJson, SchemaValidationError } from "./analysis-schema";
import type { GitHubRepo } from "@/types/analysis";

const gh: GitHubRepo = {
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
  owner: { login: "vercel", avatar_url: "https://avatars.githubusercontent.com/u/14985020" },
};

const validLlm = {
  repoName: "next.js",
  category: "Framework",
  coreBenefit: "Das React-Framework für Produktion.",
  beginnerSummary: "Next.js hilft dir, schnelle Websites mit React zu bauen.",
  professionalAssessment: "Reifes, breit eingesetztes Framework mit starker Community.",
  useCases: ["Web-Apps", "SSR"],
  notFor: ["Reine statische Seiten ohne Build"],
  qualityScore: { total: 95, activity: 98, documentation: 90, installationClarity: 92, community: 99, security: 85, maintenance: 95 },
  concerns: [{ level: "low", title: "Komplexität", explanation: "Viele Features.", whatToCheck: "Doku lesen." }],
  installation: { clone: null, npm: "npm i next", pnpm: "pnpm add next", yarn: null, pip: null, docker: null, manual: null },
  commandsUsed: [{ command: "next dev", explanation: "Startet den Dev-Server.", linkSlug: null }],
  aiPrompts: [{ intent: "Start", prompt: "Erstelle ein neues Next.js Projekt." }],
  faq: [{ question: "Was ist Next.js?", answer: "Ein React-Framework." }],
};

// TEST-005 (FR-008, FR-009, SEC-006)
describe("buildAnalysisResult", () => {
  it("validates a correct payload and injects real GitHub facts", () => {
    const result = buildAnalysisResult(JSON.stringify(validLlm), gh);
    expect(result.repoName).toBe("next.js");
    expect(result.repositoryFacts.stars).toBe(120000);
    expect(result.repositoryFacts.forks).toBe(25000);
    expect(result.repositoryFacts.license).toBe("MIT License");
    expect(result.repositoryFacts.defaultBranch).toBe("canary");
    // clone is deterministic, never trusted from the model
    expect(result.installation.clone).toBe("git clone https://github.com/vercel/next.js.git");
  });

  it("parses JSON wrapped in markdown fences", () => {
    const wrapped = "```json\n" + JSON.stringify(validLlm) + "\n```";
    expect(buildAnalysisResult(wrapped, gh).repoName).toBe("next.js");
  });

  it("rejects invalid JSON", () => {
    expect(() => buildAnalysisResult("not json at all", gh)).toThrow(SchemaValidationError);
  });

  it("rejects payload missing a required field", () => {
    const bad = { ...validLlm } as Record<string, unknown>;
    delete bad.qualityScore;
    expect(() => buildAnalysisResult(JSON.stringify(bad), gh)).toThrow(SchemaValidationError);
  });

  it("rejects out-of-range scores", () => {
    const bad = { ...validLlm, qualityScore: { ...validLlm.qualityScore, total: 250 } };
    expect(() => buildAnalysisResult(JSON.stringify(bad), gh)).toThrow(SchemaValidationError);
  });

  it("rejects an invalid concern level", () => {
    const bad = { ...validLlm, concerns: [{ level: "critical", title: "x", explanation: "y", whatToCheck: "z" }] };
    expect(() => buildAnalysisResult(JSON.stringify(bad), gh)).toThrow(SchemaValidationError);
  });

  it("produces no raw HTML field (SEC-006)", () => {
    const result = buildAnalysisResult(JSON.stringify(validLlm), gh);
    expect(JSON.stringify(result)).not.toContain("seoDeepDiveHtml");
    expect(result).not.toHaveProperty("seoDeepDiveHtml");
  });
});

describe("extractJson", () => {
  it("throws on empty/garbage", () => {
    expect(() => extractJson("no json here")).toThrow(SchemaValidationError);
  });
});
