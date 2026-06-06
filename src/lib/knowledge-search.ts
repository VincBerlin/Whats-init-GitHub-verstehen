// PHASE-1 / FR-002, FR-014 — knowledge search over static data. No LLM, no
// external API (ARCH-007). PHASE-4 enriches with tags/synonyms.
import { WORKFLOWS } from "@/data/git-workflows";
import { ENRICHED_TOPICS } from "@/lib/knowledge-taxonomy";
import type { CommandWorkflow, GitHubKnowledgeItem } from "@/types/knowledge";

export interface KnowledgeSearchResult {
  knowledge: GitHubKnowledgeItem[];
  workflows: CommandWorkflow[];
}

function score(haystackStrong: string, haystackWeak: string, terms: string[]): number {
  let s = 0;
  for (const t of terms) {
    if (haystackStrong.includes(t)) s += 3;
    else if (haystackWeak.includes(t)) s += 1;
  }
  return s;
}

export function searchKnowledge(query: string): KnowledgeSearchResult {
  const q = query.trim().toLowerCase();
  if (!q) return { knowledge: [], workflows: [] };
  const terms = q.split(/\s+/).filter(Boolean);

  const knowledge = ENRICHED_TOPICS.map((k) => ({
    item: k as GitHubKnowledgeItem,
    s: score(
      `${k.title} ${k.slug} ${k.category} ${k.searchSynonyms.join(" ")} ${k.tags.join(" ")}`.toLowerCase(),
      `${k.age16Summary} ${k.expertExplanation} ${k.whenToUse.join(" ")}`.toLowerCase(),
      terms,
    ),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.item);

  const workflows = WORKFLOWS.map((w) => ({
    item: w,
    s: score(`${w.title} ${w.slug}`.toLowerCase(), `${w.goal} ${w.shortExplanation}`.toLowerCase(), terms),
  }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.item);

  return { knowledge, workflows };
}
