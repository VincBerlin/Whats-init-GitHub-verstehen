// PHASE-4 — handy Git/terminal shortcuts (DATA-008 companion). Data-only, no LLM.
import type { TerminalShortcut } from "@/types/knowledge";

export const TERMINAL_SHORTCUTS: TerminalShortcut[] = [
  {
    slug: "status-kurz",
    title: "Kurzer Status",
    description: "Kompakte Übersicht der geänderten Dateien.",
    command: "git status -sb",
    category: "inspect",
  },
  {
    slug: "log-graph",
    title: "Historie als Graph",
    description: "Commit-Verlauf als übersichtlicher Baum in einer Zeile pro Commit.",
    command: "git log --oneline --graph --decorate --all",
    category: "inspect",
  },
  {
    slug: "alias-quick-commit",
    title: "Alias: schnell committen",
    description: "Legt den Alias 'git cm' für add + commit an.",
    command: "git config --global alias.cm '!git add -A && git commit -m'",
    category: "alias",
  },
  {
    slug: "alias-last",
    title: "Alias: letzter Commit",
    description: "Zeigt den letzten Commit mit 'git last'.",
    command: "git config --global alias.last 'log -1 HEAD --stat'",
    category: "alias",
  },
  {
    slug: "undo-staging",
    title: "Staging rückgängig",
    description: "Nimmt versehentlich vorgemerkte Dateien wieder aus dem Staging.",
    command: "git restore --staged .",
    category: "productivity",
  },
  {
    slug: "branch-wechsel-vorher",
    title: "Zum vorherigen Branch",
    description: "Springt zurück zum zuletzt genutzten Branch.",
    command: "git switch -",
    category: "navigation",
  },
  {
    slug: "stash-zwischenspeichern",
    title: "Änderungen zwischenspeichern",
    description: "Legt nicht-committete Änderungen beiseite und holt sie später zurück.",
    command: "git stash && git stash pop",
    category: "productivity",
  },
];
