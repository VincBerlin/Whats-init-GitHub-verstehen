// PHASE-4 (Vision) — knowledge taxonomy: ordered categories, derived metadata
// (level, riskLevel, tags, synonyms) so /github is structured, searchable and
// risk-aware without hand-editing every item (FR-012/013/015).
import { KNOWLEDGE_ITEMS } from "@/data/github-knowledge";
import type { GitHubKnowledgeItem, KnowledgeCategory } from "@/types/knowledge";

export type RiskLevel = "safe" | "careful" | "dangerous";
export type Level = "beginner" | "intermediate" | "advanced";

export const CATEGORY_ORDER: KnowledgeCategory[] = [
  "git-basics",
  "git-commands",
  "branching",
  "remote",
  "undo",
  "repo-management",
  "security",
  "github-cli",
  "github-actions",
  "publishing",
];

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  "git-basics": "Grundlagen",
  "git-commands": "Tägliche Befehle",
  branching: "Branches & Merging",
  remote: "Remote & Synchronisieren",
  undo: "Fehler beheben",
  "repo-management": "Repository-Verwaltung",
  security: "Sicherheit",
  "github-cli": "GitHub CLI",
  "github-actions": "Automatisierung (Actions)",
  "github-api": "GitHub API",
  publishing: "Veröffentlichen & Zusammenarbeit",
};

const RISK_OVERRIDES: Record<string, RiskLevel> = {
  "rueckgaengig-machen": "dangerous",
  "git-rebase": "careful",
  "git-push-pull": "careful",
};

const LEVEL_BY_CATEGORY: Partial<Record<KnowledgeCategory, Level>> = {
  branching: "intermediate",
  "github-actions": "intermediate",
  security: "intermediate",
  "github-api": "advanced",
};

const SYNONYMS: Record<string, string[]> = {
  "was-ist-git": ["git", "versionskontrolle", "version control"],
  "was-ist-github": ["github", "hosting", "remote"],
  "git-clone": ["clone", "klonen", "herunterladen", "download"],
  "git-add-commit": ["commit", "add", "speichern", "stage", "staging"],
  "git-branch": ["branch", "zweig", "feature branch", "switch", "checkout"],
  "git-merge": ["merge", "zusammenführen", "konflikt", "conflict"],
  "git-rebase": ["rebase", "historie", "begradigen"],
  "rueckgaengig-machen": ["reset", "revert", "undo", "rückgängig", "zurücksetzen"],
  "git-remote": ["remote", "origin", "verbinden"],
  "git-push-pull": ["push", "pull", "hochladen", "fetch", "synchronisieren", "non-fast-forward"],
  gitignore: ["gitignore", "ignorieren", "ignore", "env"],
  "ssh-keys": ["ssh", "key", "authentifizierung", "permission denied publickey", "token"],
  "github-cli": ["gh", "cli", "terminal"],
  "github-actions": ["actions", "ci", "cd", "workflow", "yaml", "pipeline"],
  "pull-request": ["pr", "pull request", "review", "merge request"],
  "projekt-veroeffentlichen": ["veröffentlichen", "publish", "first push", "remote add"],
};

export interface EnrichedTopic extends GitHubKnowledgeItem {
  level: Level;
  riskLevel: RiskLevel;
  searchSynonyms: string[];
  tags: string[];
}

export function enrich(item: GitHubKnowledgeItem): EnrichedTopic {
  return {
    ...item,
    level: LEVEL_BY_CATEGORY[item.category] ?? "beginner",
    riskLevel: RISK_OVERRIDES[item.slug] ?? "safe",
    searchSynonyms: SYNONYMS[item.slug] ?? [],
    tags: [item.category, ...(SYNONYMS[item.slug] ?? []).slice(0, 3)],
  };
}

export const ENRICHED_TOPICS: EnrichedTopic[] = KNOWLEDGE_ITEMS.map(enrich);

export interface CategoryGroup {
  category: KnowledgeCategory;
  label: string;
  items: EnrichedTopic[];
}

export function groupByCategory(items: EnrichedTopic[] = ENRICHED_TOPICS): CategoryGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
}

export const RISK_BADGE: Record<RiskLevel, { text: string; cls: string } | null> = {
  safe: null,
  careful: { text: "Vorsicht", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  dangerous: { text: "Riskant", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
};
