// PHASE-5 — static fallback for the Weekly Top 10 empty state (MISSING-008 /
// JOURNEY-003 failure path). Shown only when no weekly data exists yet. These
// are illustrative example repos, clearly labelled, and never call an LLM.
export interface SeedRepo {
  owner: string;
  repo: string;
  description: string;
  language: string;
  stars: number;
}

export const WEEKLY_SEED_FALLBACK: SeedRepo[] = [
  { owner: "vercel", repo: "next.js", description: "Das React-Framework für Produktion.", language: "TypeScript", stars: 130000 },
  { owner: "shadcn-ui", repo: "ui", description: "Wiederverwendbare Komponenten zum Kopieren.", language: "TypeScript", stars: 80000 },
  { owner: "facebook", repo: "react", description: "Die Bibliothek für Web- und UI-Interfaces.", language: "JavaScript", stars: 230000 },
  { owner: "microsoft", repo: "vscode", description: "Quelloffener Code-Editor.", language: "TypeScript", stars: 165000 },
  { owner: "ollama", repo: "ollama", description: "LLMs lokal ausführen.", language: "Go", stars: 100000 },
  { owner: "langchain-ai", repo: "langchain", description: "Framework für LLM-Anwendungen.", language: "Python", stars: 95000 },
  { owner: "tailwindlabs", repo: "tailwindcss", description: "Utility-First CSS-Framework.", language: "CSS", stars: 83000 },
  { owner: "vuejs", repo: "core", description: "Das progressive JavaScript-Framework.", language: "TypeScript", stars: 48000 },
  { owner: "denoland", repo: "deno", description: "Sichere Laufzeit für JavaScript & TypeScript.", language: "Rust", stars: 98000 },
  { owner: "rust-lang", repo: "rust", description: "Sprache für sichere, schnelle Software.", language: "Rust", stars: 98000 },
];
