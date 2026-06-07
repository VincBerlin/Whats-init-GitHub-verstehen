// PHASE-3 — AnalysisResult schema (DATA-009). No raw HTML fields: every field is
// typed text/list rendered by React components (FR-009/FR-010, SEC-006/SEC-007).

export interface QualityScore {
  total: number;
  activity: number;
  documentation: number;
  installationClarity: number;
  community: number;
  security: number;
  maintenance: number;
}

export interface Concern {
  level: "low" | "medium" | "high";
  title: string;
  explanation: string;
  whatToCheck: string;
}

export interface Installation {
  clone: string;
  npm: string | null;
  pnpm: string | null;
  yarn: string | null;
  pip: string | null;
  docker: string | null;
  manual: string | null;
}

export interface CommandUsed {
  command: string;
  explanation: string;
  linkSlug: string | null;
}

export interface AiPrompt {
  intent: string;
  prompt: string;
}

export interface RepositoryFacts {
  stars: number;
  forks: number;
  license: string | null;
  language: string | null;
  lastUpdated: string | null;
  openIssues: number | null;
  defaultBranch: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AnalysisResult {
  repoName: string;
  category: string;
  coreBenefit: string;
  beginnerSummary: string;
  professionalAssessment: string;
  useCases: string[];
  notFor: string[];
  qualityScore: QualityScore;
  concerns: Concern[];
  installation: Installation;
  commandsUsed: CommandUsed[];
  aiPrompts: AiPrompt[];
  repositoryFacts: RepositoryFacts;
  faq: FaqItem[];
}

export interface GitHubRepo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  html_url: string;
  clone_url: string;
  homepage: string | null;
  license: { name: string } | null;
  updated_at: string;
  pushed_at?: string;
  open_issues_count?: number;
  default_branch?: string;
  archived?: boolean;
  disabled?: boolean;
  created_at?: string;
  owner: { login: string; avatar_url: string };
}
