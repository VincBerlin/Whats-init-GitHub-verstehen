// PHASE-4 — "Ich will …" command workflows (DATA-008). Data-only, no LLM.
import type { CommandWorkflow } from "@/types/knowledge";

export const WORKFLOWS: CommandWorkflow[] = [
  {
    slug: "projekt-auf-github-hochladen",
    title: "Ich will ein Projekt auf GitHub hochladen",
    goal: "Ein neues lokales Projekt zum ersten Mal auf GitHub veröffentlichen.",
    difficulty: "easy",
    category: "project-start",
    shortExplanation:
      "Lege auf GitHub ein leeres Repository an, verbinde deinen Ordner damit und pushe den ersten Commit.",
    commands: [
      { label: "Repository initialisieren", code: "git init", copyable: true },
      { label: "Dateien vormerken", code: "git add .", copyable: true },
      { label: "Ersten Commit erstellen", code: 'git commit -m "Initialer Commit"', copyable: true },
      { label: "Mit GitHub verbinden", code: "git remote add origin https://github.com/owner/repo.git", copyable: true },
      { label: "Hochladen", code: "git push -u origin main", copyable: true },
    ],
    whenToUse: "Wenn dein Projekt nur lokal existiert und du es zum ersten Mal online stellen willst.",
    commonMistakes: ["Vergessen, eine .gitignore für .env / node_modules anzulegen", "Die Website-URL statt der Repo-URL als Remote nutzen"],
    riskLevel: "safe",
    relatedCommands: ["aenderungen-speichern", "push-und-pull"],
  },
  {
    slug: "aenderungen-speichern",
    title: "Ich will meine Änderungen speichern",
    goal: "Aktuelle Änderungen dauerhaft als Commit festhalten.",
    difficulty: "easy",
    category: "save-changes",
    shortExplanation: "Wähle die Änderungen aus (add) und speichere sie mit einer Nachricht (commit).",
    commands: [
      { label: "Status ansehen", code: "git status", copyable: true },
      { label: "Alles vormerken", code: "git add .", copyable: true },
      { label: "Speichern", code: 'git commit -m "Beschreibe deine Änderung"', copyable: true },
    ],
    whenToUse: "Nach jedem abgeschlossenen, sinnvollen Arbeitsschritt.",
    commonMistakes: ["Nichtssagende Nachrichten wie 'fix'", "Versehentlich Secrets mit git add . vormerken"],
    riskLevel: "safe",
    relatedCommands: ["push-und-pull", "letzten-commit-rueckgaengig"],
  },
  {
    slug: "push-und-pull",
    title: "Ich will hoch- und runterladen (push & pull)",
    goal: "Lokale und entfernte Änderungen synchron halten.",
    difficulty: "easy",
    category: "push-pull",
    shortExplanation: "Hole zuerst die neuesten Änderungen (pull), dann lade deine hoch (push).",
    commands: [
      { label: "Neueste Änderungen holen", code: "git pull", copyable: true },
      { label: "Eigene Commits hochladen", code: "git push", copyable: true },
    ],
    whenToUse: "Immer wenn du im Team arbeitest oder an mehreren Geräten.",
    commonMistakes: ["Pushen ohne vorher zu pullen → abgelehnter Push", "Mit --force die Arbeit anderer überschreiben"],
    riskLevel: "careful",
    relatedCommands: ["aenderungen-speichern", "merge-konflikt-loesen"],
  },
  {
    slug: "branch-erstellen-und-mergen",
    title: "Ich will an einem Feature arbeiten (Branch)",
    goal: "Ein Feature isoliert entwickeln und sauber zurück in main bringen.",
    difficulty: "medium",
    category: "save-changes",
    shortExplanation: "Erstelle einen Branch, arbeite dort, und führe ihn am Ende mit main zusammen.",
    commands: [
      { label: "Branch erstellen & wechseln", code: "git switch -c feature/mein-feature", copyable: true },
      { label: "Zurück zu main", code: "git switch main", copyable: true },
      { label: "Feature einmergen", code: "git merge feature/mein-feature", copyable: true },
    ],
    whenToUse: "Für jedes neue Feature oder jeden Bugfix, damit main stabil bleibt.",
    commonMistakes: ["Direkt auf main entwickeln", "Branch wochenlang nicht aktualisieren"],
    riskLevel: "safe",
    relatedCommands: ["merge-konflikt-loesen", "push-und-pull"],
  },
  {
    slug: "merge-konflikt-loesen",
    title: "Ich will einen Merge-Konflikt lösen",
    goal: "Widersprüchliche Änderungen sauber zusammenführen.",
    difficulty: "medium",
    category: "save-changes",
    shortExplanation:
      "Git markiert die Konfliktstellen in den Dateien. Entscheide pro Stelle, welcher Code bleibt, dann committe.",
    commands: [
      { label: "Konfliktdateien anzeigen", code: "git status", copyable: true },
      { label: "Nach dem Bearbeiten vormerken", code: "git add .", copyable: true },
      { label: "Merge abschließen", code: "git commit", copyable: true },
      { label: "Merge abbrechen (Notausgang)", code: "git merge --abort", copyable: true },
    ],
    whenToUse: "Wenn push, pull oder merge einen Konflikt melden.",
    commonMistakes: ["Konfliktmarker (<<<<, ====, >>>>) im Code vergessen", "Konflikte 'wegklicken', ohne sie zu verstehen"],
    riskLevel: "careful",
    relatedCommands: ["push-und-pull", "branch-erstellen-und-mergen"],
  },
  {
    slug: "letzten-commit-rueckgaengig",
    title: "Ich will den letzten Commit rückgängig machen",
    goal: "Einen Fehler im letzten Commit korrigieren oder zurücknehmen.",
    difficulty: "medium",
    category: "undo",
    shortExplanation:
      "Wenn noch nicht gepusht: reset --soft behält deine Änderungen. Wenn schon gepusht: revert ist die sichere Wahl.",
    commands: [
      { label: "Lokal: Commit lösen, Änderungen behalten", code: "git reset --soft HEAD~1", copyable: true },
      { label: "Bereits gepusht: sicher zurücknehmen", code: "git revert HEAD", copyable: true },
    ],
    whenToUse: "Wenn der letzte Commit falsch war oder zu früh erstellt wurde.",
    commonMistakes: ["reset --hard verwenden und ungespeicherte Arbeit verlieren", "reset auf bereits gepushten Commits nutzen"],
    riskLevel: "dangerous",
    relatedCommands: ["aenderungen-speichern"],
  },
  {
    slug: "fork-und-beitragen",
    title: "Ich will zu einem Open-Source-Projekt beitragen",
    goal: "Über einen Fork und einen Pull Request Änderungen vorschlagen.",
    difficulty: "advanced",
    category: "forks",
    shortExplanation:
      "Forke das Projekt, klone deinen Fork, arbeite auf einem Branch und öffne einen Pull Request zum Original.",
    commands: [
      { label: "Deinen Fork klonen", code: "git clone https://github.com/dein-name/repo.git", copyable: true },
      { label: "Original als Upstream hinzufügen", code: "git remote add upstream https://github.com/original/repo.git", copyable: true },
      { label: "Branch erstellen", code: "git switch -c fix/mein-beitrag", copyable: true },
      { label: "Pull Request öffnen", code: "gh pr create --fill", copyable: true },
    ],
    whenToUse: "Wenn du zu einem Projekt beitragen willst, bei dem du keine Schreibrechte hast.",
    commonMistakes: ["Auf main des Forks arbeiten statt auf einem Branch", "upstream nicht regelmäßig nachziehen"],
    riskLevel: "safe",
    relatedCommands: ["branch-erstellen-und-mergen", "push-und-pull"],
  },
];

export function getWorkflow(slug: string): CommandWorkflow | undefined {
  return WORKFLOWS.find((w) => w.slug === slug);
}
