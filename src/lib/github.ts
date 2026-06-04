// PHASE-3 — GitHub adapter (API-002). Read-only public metadata + README.
// Behind a port so analysis and trending share one integration boundary (ARCH-002).
import type { GitHubRepo } from "@/types/analysis";

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "GitHubError";
  }
}

const README_MAX_CHARS = 6000;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "whats-in-it-app",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new GitHubError(res.status, `GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "";
    const data = await res.json();
    if (typeof data.content !== "string") return "";
    return Buffer.from(data.content, "base64").toString("utf-8").substring(0, README_MAX_CHARS);
  } catch {
    return "";
  }
}

/** Candidate search for trending (PHASE-5): top public repos by query. No LLM. */
export interface RepoSearchItem {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
}

export async function searchRepositories(query: string, perPage = 30): Promise<RepoSearchItem[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 3600 } });
  if (!res.ok) throw new GitHubError(res.status, `GitHub search error: ${res.status}`);
  const data = await res.json();
  const items: unknown[] = Array.isArray(data.items) ? data.items : [];
  return items.map((raw) => {
    const it = raw as Record<string, unknown>;
    const ownerObj = it.owner as { login?: string } | undefined;
    return {
      owner: ownerObj?.login ?? "",
      repo: (it.name as string) ?? "",
      stars: (it.stargazers_count as number) ?? 0,
      forks: (it.forks_count as number) ?? 0,
      language: (it.language as string) ?? null,
      description: (it.description as string) ?? null,
    };
  });
}
