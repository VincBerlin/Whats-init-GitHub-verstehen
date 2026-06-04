export interface SearchTerm {
  title: string;
  description: string;
  url: string;
  category: "Lexikon" | "Academy";
  keywords: string[];
}

// PHASE-1: Suchindex zeigt auf den neuen /github-Hub. Die vollständige,
// datengetriebene Suche über die Wissensmodule folgt in PHASE-4.
export const SEARCH_TERMS: SearchTerm[] = [
  {
    title: "Git & GitHub — Wissens-Hub",
    description: "Befehle, Workflows und Shortcuts auf einen Blick.",
    url: "/github",
    category: "Academy",
    keywords: ["git", "github", "befehle", "commands", "hilfe", "wissen"],
  },
  {
    title: "Shortcuts & Workflows",
    description: "Fertige Terminal-Abläufe zum Kopieren.",
    url: "/github/shortcuts",
    category: "Academy",
    keywords: ["shortcut", "workflow", "terminal", "push", "pull", "clone"],
  },
];

export function searchTerms(query: string, limit = 6): SearchTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return SEARCH_TERMS
    .map((term) => {
      const hay = [term.title, term.description, ...term.keywords]
        .join(" ")
        .toLowerCase();
      const score = hay.includes(q) ? (term.title.toLowerCase().includes(q) ? 2 : 1) : 0;
      return { term, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.term);
}
