// PHASE-2 / TASK-2.1 — pure domain utility (no I/O, no infra imports).
// FR-001: normalize valid GitHub URL variants to canonical lowercase owner/repo.
// FR-002 / SEC-004: reject non-GitHub URLs and malformed owner/repo at the trust boundary.

export interface RepoKey {
  owner: string;
  repo: string;
  repo_key: string; // canonical lowercase "owner/repo"
  github_url: string; // canonical https URL
}

export type RepoParseError =
  | "empty_input"
  | "not_github"
  | "malformed";

export type RepoParseResult =
  | { ok: true; value: RepoKey }
  | { ok: false; error: RepoParseError };

// GitHub owner: 1–39 chars, alphanumeric or single hyphens, no leading/trailing hyphen.
const OWNER_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
// GitHub repo: alphanumeric, hyphen, underscore, dot; not "." or ".."; max 100.
const REPO_RE = /^[A-Za-z0-9_.-]{1,100}$/;

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

export function isValidOwner(value: string): boolean {
  return OWNER_RE.test(value);
}

export function isValidRepo(value: string): boolean {
  return REPO_RE.test(value) && value !== "." && value !== "..";
}

function stripGitSuffix(repo: string): string {
  return repo.endsWith(".git") ? repo.slice(0, -4) : repo;
}

function build(owner: string, repo: string): RepoParseResult {
  const cleanRepo = stripGitSuffix(repo.trim());
  const cleanOwner = owner.trim();
  if (!isValidOwner(cleanOwner) || !isValidRepo(cleanRepo)) {
    return { ok: false, error: "malformed" };
  }
  const repo_key = `${cleanOwner}/${cleanRepo}`.toLowerCase();
  return {
    ok: true,
    value: {
      owner: cleanOwner.toLowerCase(),
      repo: cleanRepo,
      repo_key,
      github_url: `https://github.com/${cleanOwner}/${cleanRepo}`,
    },
  };
}

/**
 * Accepts: full https/http URL, github.com/owner/repo, owner/repo, ssh form,
 * with/without trailing slash, .git suffix, query string, and fragment.
 * Rejects: empty, non-github hosts (SSRF), malformed identifiers.
 */
export function parseRepoInput(input: string): RepoParseResult {
  if (!input || typeof input !== "string") return { ok: false, error: "empty_input" };
  const raw = input.trim();
  if (!raw) return { ok: false, error: "empty_input" };

  // ssh form: git@github.com:owner/repo(.git)
  const ssh = raw.match(/^git@([^:]+):([^/]+)\/(.+)$/);
  if (ssh) {
    if (!GITHUB_HOSTS.has(ssh[1].toLowerCase())) return { ok: false, error: "not_github" };
    return build(ssh[2], ssh[3].replace(/\/.*$/, ""));
  }

  // URL form (has a scheme or starts with a host)
  if (/^[a-z]+:\/\//i.test(raw) || /^(www\.)?github\.com\//i.test(raw)) {
    let url: URL;
    try {
      url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
    } catch {
      return { ok: false, error: "malformed" };
    }
    if (!GITHUB_HOSTS.has(url.hostname.toLowerCase())) return { ok: false, error: "not_github" };
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return { ok: false, error: "malformed" };
    return build(parts[0], parts[1]);
  }

  // bare owner/repo
  const parts = raw.split("/").filter(Boolean);
  if (parts.length === 2) return build(parts[0], parts[1]);

  // anything else with a scheme but non-github already handled; reject the rest.
  if (raw.includes("://")) return { ok: false, error: "not_github" };
  return { ok: false, error: "malformed" };
}
