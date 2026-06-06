// PHASE-4 — curated launch set of Git/GitHub knowledge (German). Source: domain
// knowledge curated for "What's in it?" (the project's encyclopedia source file
// was not provided in-repo). Data-only; no LLM at runtime.
import type { GitHubKnowledgeItem } from "@/types/knowledge";

export const KNOWLEDGE_ITEMS: GitHubKnowledgeItem[] = [
  {
    slug: "was-ist-git",
    title: "Was ist Git?",
    category: "git-basics",
    age16Summary:
      "Git ist ein Werkzeug, das jede Version deines Codes speichert. Du kannst jederzeit zu einem früheren Stand zurück und mit anderen am selben Projekt arbeiten, ohne dass etwas verloren geht.",
    expertExplanation:
      "Git ist ein verteiltes Versionskontrollsystem. Jeder Klon enthält die komplette Historie, nicht nur den aktuellen Stand. Änderungen werden als unveränderliche Commits gespeichert, die über Hashes verknüpft sind. Dadurch sind Branching, Merging und das Zusammenarbeiten ohne zentralen Server jederzeit möglich.",
    whenToUse: ["Für jedes Code-Projekt, allein oder im Team", "Wenn du Änderungen nachvollziehbar speichern willst", "Bevor du Code auf GitHub veröffentlichst"],
    risks: ["Ohne regelmäßige Commits gehen Zwischenstände verloren", "Secrets, die einmal committet wurden, bleiben in der Historie"],
    commonMistakes: ["Git mit GitHub verwechseln — Git ist das Werkzeug, GitHub ein Hosting-Dienst", "Große Binärdateien direkt einchecken"],
    relatedSlugs: ["git-init", "git-clone", "was-ist-github"],
    faq: [
      { question: "Ist Git dasselbe wie GitHub?", answer: "Nein. Git ist das Versionskontroll-Werkzeug auf deinem Rechner. GitHub ist eine Plattform, die Git-Repositories online hostet." },
    ],
  },
  {
    slug: "was-ist-github",
    title: "Was ist GitHub?",
    category: "git-basics",
    age16Summary:
      "GitHub ist eine Website, auf der dein Git-Projekt online liegt. Andere können es ansehen, mitarbeiten, Fehler melden und Verbesserungen vorschlagen.",
    expertExplanation:
      "GitHub ist eine Hosting-Plattform für Git-Repositories mit Funktionen für Zusammenarbeit: Pull Requests, Issues, Code-Review, Actions (CI/CD) und Releases. Es ist kein Ersatz für Git, sondern eine Schicht darüber für Team-Workflows und Veröffentlichung.",
    whenToUse: ["Code öffentlich oder privat sichern und teilen", "Im Team über Pull Requests zusammenarbeiten", "Open-Source-Projekte veröffentlichen"],
    risks: ["Öffentliche Repos sind für alle sichtbar — keine Secrets veröffentlichen", "Lizenz fehlt → andere dürfen den Code rechtlich nicht nutzen"],
    relatedSlugs: ["was-ist-git", "pull-request", "projekt-veroeffentlichen"],
  },
  {
    slug: "git-init",
    title: "git init — Neues Repository starten",
    category: "git-commands",
    age16Summary: "Mit git init machst du aus einem normalen Ordner ein Git-Projekt. Ab dann merkt sich Git alle Änderungen darin.",
    expertExplanation:
      "git init legt im aktuellen Verzeichnis ein verstecktes .git-Verzeichnis an und initialisiert ein leeres Repository. Der erste Branch heißt standardmäßig main. Erst nach dem ersten Commit existiert eine Historie.",
    syntax: "git init",
    copyCommand: "git init",
    whenToUse: ["Ein neues lokales Projekt unter Versionskontrolle stellen", "Bevor du eine Verbindung zu einem GitHub-Repo herstellst"],
    risks: ["Ein init im falschen (z. B. Home-)Verzeichnis verfolgt versehentlich riesige Ordner"],
    commonMistakes: ["Vergessen, vor dem ersten Commit eine .gitignore anzulegen"],
    relatedSlugs: ["git-add-commit", "gitignore", "git-remote"],
  },
  {
    slug: "git-clone",
    title: "git clone — Repository herunterladen",
    category: "git-commands",
    age16Summary: "Mit git clone lädst du ein Projekt von GitHub komplett auf deinen Rechner — inklusive aller Versionen.",
    expertExplanation:
      "git clone kopiert ein entferntes Repository samt vollständiger Historie und richtet automatisch die Remote 'origin' ein. Anschließend kannst du lokal arbeiten, committen und mit push/pull synchronisieren.",
    syntax: "git clone <url>",
    copyCommand: "git clone https://github.com/owner/repo.git",
    whenToUse: ["Ein bestehendes Projekt lokal bearbeiten", "Eine Kopie zum Ausprobieren holen"],
    risks: ["Sehr große Repos brauchen viel Speicher und Zeit (ggf. --depth 1 für flachen Klon)"],
    commonMistakes: ["Statt des Repos die Website-URL kopieren", "In einen Ordner klonen, der schon ein Repo ist"],
    relatedSlugs: ["git-remote", "git-push-pull", "was-ist-github"],
  },
  {
    slug: "git-add-commit",
    title: "git add & git commit — Änderungen speichern",
    category: "git-commands",
    age16Summary: "git add wählt aus, welche Änderungen gespeichert werden. git commit speichert sie dann dauerhaft mit einer kurzen Beschreibung.",
    expertExplanation:
      "git add überführt Änderungen aus dem Arbeitsverzeichnis in die Staging-Area. git commit schreibt den gestagten Stand als unveränderlichen Commit mit Nachricht und Autor in die Historie. Die Zweistufigkeit erlaubt es, gezielt nur bestimmte Änderungen zu einem Commit zu bündeln.",
    syntax: "git add <pfad>\ngit commit -m \"Nachricht\"",
    copyCommand: "git add . && git commit -m \"Beschreibe deine Änderung\"",
    whenToUse: ["Nach jedem abgeschlossenen, sinnvollen Arbeitsschritt", "Bevor du pushst oder den Branch wechselst"],
    risks: ["git add . staged auch versehentlich Secrets oder große Dateien"],
    commonMistakes: ["Nichtssagende Nachrichten wie 'fix'", "Alles in einen riesigen Commit packen"],
    relatedSlugs: ["git-init", "git-push-pull", "gitignore"],
    faq: [
      { question: "Was ist eine gute Commit-Nachricht?", answer: "Kurz, im Imperativ, beschreibt das Warum: z. B. 'feat: Login-Formular validieren'." },
    ],
  },
  {
    slug: "git-branch",
    title: "git branch — Mit Branches arbeiten",
    category: "branching",
    age16Summary: "Ein Branch ist eine Parallel-Version deines Projekts. Du kannst etwas Neues ausprobieren, ohne den funktionierenden Stand kaputtzumachen.",
    expertExplanation:
      "Branches sind leichtgewichtige, bewegliche Zeiger auf Commits. Feature-Arbeit findet auf eigenen Branches statt und wird per Merge oder Pull Request zurück nach main integriert. So bleibt main stabil, während mehrere Features parallel entstehen.",
    syntax: "git switch -c <branch-name>",
    copyCommand: "git switch -c feature/mein-feature",
    whenToUse: ["Für jedes neue Feature oder jeden Bugfix", "Wenn mehrere Leute gleichzeitig arbeiten"],
    risks: ["Lang lebende Branches führen zu großen, schwierigen Merges"],
    commonMistakes: ["Direkt auf main entwickeln", "Branch-Namen ohne erkennbares Schema"],
    relatedSlugs: ["git-merge", "git-rebase", "pull-request"],
  },
  {
    slug: "git-merge",
    title: "git merge — Branches zusammenführen",
    category: "branching",
    age16Summary: "Mit merge bringst du die Änderungen aus einem Branch in einen anderen. So landen fertige Features im Hauptstand.",
    expertExplanation:
      "git merge integriert die Historie eines Branches in den aktuellen. Bei divergierenden Änderungen entsteht ein Merge-Commit; bei linearer Historie ein Fast-Forward. Konflikte treten auf, wenn dieselben Zeilen unterschiedlich geändert wurden, und müssen manuell aufgelöst werden.",
    syntax: "git merge <branch-name>",
    copyCommand: "git merge feature/mein-feature",
    whenToUse: ["Ein fertiges Feature nach main übernehmen", "Den aktuellen main-Stand in deinen Feature-Branch holen"],
    risks: ["Merge-Konflikte können bei falscher Auflösung Code zerstören"],
    commonMistakes: ["Konflikte 'wegklicken', ohne sie zu verstehen"],
    relatedSlugs: ["git-branch", "git-push-pull", "git-rebase"],
  },
  {
    slug: "git-rebase",
    title: "git rebase — Historie begradigen",
    category: "branching",
    age16Summary: "Rebase setzt deine Commits sauber auf den neuesten Stand auf, sodass die Historie wie eine gerade Linie aussieht.",
    expertExplanation:
      "git rebase verschiebt Commits auf eine neue Basis und schreibt dabei deren Hashes neu. Das ergibt eine lineare, lesbare Historie. Weil Commits neu geschrieben werden, darf man bereits geteilte/gepushte Branches nur mit Vorsicht rebasen.",
    syntax: "git rebase <basis-branch>",
    copyCommand: "git rebase main",
    whenToUse: ["Feature-Branch vor dem Merge auf main aktualisieren", "Lokale Commits aufräumen, bevor du pushst"],
    risks: ["Rebase auf bereits gepushten, geteilten Branches zerstört Kollegen die Historie"],
    commonMistakes: ["git push --force ohne --force-with-lease auf geteilten Branches"],
    relatedSlugs: ["git-merge", "git-branch", "rueckgaengig-machen"],
  },
  {
    slug: "rueckgaengig-machen",
    title: "Änderungen rückgängig machen (revert & reset)",
    category: "undo",
    age16Summary: "Hast du etwas falsch gemacht? git revert und git reset bringen dich zu einem früheren Stand zurück.",
    expertExplanation:
      "git revert erzeugt einen neuen Commit, der einen früheren rückgängig macht — sicher für geteilte Historie. git reset verschiebt den Branch-Zeiger zurück; --soft behält Änderungen gestaged, --hard verwirft sie unwiderruflich. Auf gepushten Branches ist revert die sichere Wahl.",
    syntax: "git revert <commit>\ngit reset --hard <commit>",
    copyCommand: "git revert HEAD",
    whenToUse: ["Einen fehlerhaften Commit zurücknehmen", "Lokale, ungewollte Änderungen verwerfen"],
    risks: ["git reset --hard löscht ungespeicherte Arbeit unwiderruflich", "reset auf gepushten Commits erzeugt Konflikte"],
    commonMistakes: ["reset --hard statt revert auf einem geteilten Branch nutzen"],
    relatedSlugs: ["git-add-commit", "git-rebase"],
    faq: [
      { question: "Revert oder reset?", answer: "Auf bereits gepushten/geteilten Branches immer revert. reset nur lokal, bevor du gepusht hast." },
    ],
  },
  {
    slug: "git-remote",
    title: "git remote — Verbindung zu GitHub",
    category: "remote",
    age16Summary: "Eine Remote ist die Online-Adresse deines Projekts auf GitHub. So weiß Git, wohin es deinen Code hochladen soll.",
    expertExplanation:
      "Eine Remote ist ein benannter Verweis auf ein entferntes Repository (üblicherweise 'origin'). git remote add verknüpft ein lokales Repo mit GitHub. Erst danach funktionieren push und pull gegen diese Adresse.",
    syntax: "git remote add origin <url>",
    copyCommand: "git remote add origin https://github.com/owner/repo.git",
    whenToUse: ["Ein lokal erstelltes Projekt mit GitHub verbinden", "Eine zweite Remote (z. B. Fork) hinzufügen"],
    risks: ["Falsche URL → push schlägt fehl oder landet im falschen Repo"],
    commonMistakes: ["origin doppelt hinzufügen statt mit set-url zu ändern"],
    relatedSlugs: ["git-push-pull", "git-clone", "projekt-veroeffentlichen"],
  },
  {
    slug: "git-push-pull",
    title: "git push & git pull — Synchronisieren",
    category: "remote",
    age16Summary: "push lädt deine Commits zu GitHub hoch, pull holt die neuesten Änderungen von dort herunter.",
    expertExplanation:
      "git push überträgt lokale Commits zur Remote; git pull holt entfernte Änderungen und führt sie zusammen (fetch + merge). Bei parallelem Arbeiten ist vor dem Push ein Pull/Rebase nötig, um Konflikte früh zu lösen.",
    syntax: "git push -u origin main\ngit pull",
    copyCommand: "git push -u origin main",
    whenToUse: ["Deine Arbeit sichern und teilen", "Vor dem Weiterarbeiten den aktuellen Stand holen"],
    risks: ["push --force kann die Arbeit anderer überschreiben"],
    commonMistakes: ["Pushen ohne vorher zu pullen → abgelehnter Push (non-fast-forward)"],
    relatedSlugs: ["git-remote", "git-add-commit", "git-merge"],
  },
  {
    slug: "gitignore",
    title: ".gitignore — Dateien ausschließen",
    category: "repo-management",
    age16Summary: "In die .gitignore schreibst du, welche Dateien Git ignorieren soll — zum Beispiel Passwörter oder den node_modules-Ordner.",
    expertExplanation:
      ".gitignore definiert Glob-Muster für Pfade, die Git nicht verfolgen soll. Sie wirkt nur auf noch nicht getrackte Dateien — bereits committete müssen mit git rm --cached entfernt werden. Typisch ausgeschlossen: Abhängigkeiten, Build-Artefakte und vor allem Secrets/.env.",
    syntax: ".env\nnode_modules/\n.next/",
    copyCommand: "echo \".env\" >> .gitignore",
    whenToUse: ["Direkt nach git init", "Bevor du Abhängigkeiten installierst oder Secrets anlegst"],
    risks: ["Eine bereits committete .env bleibt trotz .gitignore in der Historie"],
    commonMistakes: ["node_modules oder .env versehentlich vor dem Anlegen der .gitignore committen"],
    relatedSlugs: ["git-init", "ssh-keys", "git-add-commit"],
  },
  {
    slug: "ssh-keys",
    title: "SSH-Keys & Authentifizierung",
    category: "security",
    age16Summary: "Mit einem SSH-Key beweist du GitHub sicher, dass du es bist — ohne jedes Mal ein Passwort einzugeben.",
    expertExplanation:
      "SSH-Schlüssel sind ein asymmetrisches Schlüsselpaar: Der private Schlüssel bleibt auf deinem Rechner, der öffentliche wird bei GitHub hinterlegt. Für HTTPS-Zugriff nutzt man stattdessen Personal Access Tokens. Beide ersetzen die unsichere Passwort-Authentifizierung.",
    syntax: "ssh-keygen -t ed25519 -C \"deine@mail.de\"",
    copyCommand: "ssh-keygen -t ed25519 -C \"deine@mail.de\"",
    whenToUse: ["Einmalige Einrichtung pro Rechner", "Wenn push/pull ständig nach Passwort fragt"],
    risks: ["Privaten Schlüssel niemals teilen oder committen", "Tokens mit zu weiten Rechten ausstellen"],
    commonMistakes: ["Den öffentlichen mit dem privaten Schlüssel verwechseln"],
    relatedSlugs: ["gitignore", "github-actions"],
  },
  {
    slug: "github-cli",
    title: "GitHub CLI (gh) — GitHub im Terminal",
    category: "github-cli",
    age16Summary: "Mit dem Programm gh steuerst du GitHub direkt aus dem Terminal: Repos anlegen, Pull Requests öffnen, Issues verwalten.",
    expertExplanation:
      "Die GitHub CLI (gh) bringt GitHub-Funktionen ins Terminal: Authentifizierung, Repo-Erstellung, Pull Requests, Issues, Releases und Workflow-Runs. Sie ergänzt Git, ersetzt es aber nicht — Git verwaltet die Versionen, gh die GitHub-Plattform.",
    syntax: "gh repo create\ngh pr create",
    copyCommand: "gh pr create --fill",
    whenToUse: ["Schnell ein Repo oder einen Pull Request aus dem Terminal erstellen", "CI-Runs und Issues ohne Browser prüfen"],
    risks: ["gh auth speichert Tokens lokal — Rechner-Zugriff schützen"],
    commonMistakes: ["gh mit git verwechseln"],
    relatedSlugs: ["pull-request", "was-ist-github", "github-actions"],
  },
  {
    slug: "github-actions",
    title: "GitHub Actions — Automatisierung & CI/CD",
    category: "github-actions",
    age16Summary: "GitHub Actions führt bei jeder Änderung automatisch Aufgaben aus — zum Beispiel Tests laufen lassen oder die App veröffentlichen.",
    expertExplanation:
      "GitHub Actions ist eine CI/CD-Plattform: In YAML-Workflows definierst du Trigger (z. B. push, pull_request) und Jobs aus einzelnen Steps, die auf Runnern laufen. Typische Einsätze sind Tests, Linting, Builds und Deployments. Secrets werden verschlüsselt in den Repo-Einstellungen hinterlegt.",
    syntax: ".github/workflows/ci.yml",
    copyCommand: "mkdir -p .github/workflows",
    whenToUse: ["Tests bei jedem Push automatisch laufen lassen", "Automatisch bauen und deployen"],
    risks: ["Secrets niemals im Klartext in die YAML schreiben", "Nicht vertrauenswürdige Actions Dritter können Code ausführen"],
    commonMistakes: ["Workflows nicht auf bestimmte Branches/Pfade einschränken → unnötige Läufe"],
    relatedSlugs: ["github-cli", "ssh-keys", "pull-request"],
  },
  {
    slug: "pull-request",
    title: "Pull Request — Änderungen vorschlagen",
    category: "publishing",
    age16Summary: "Ein Pull Request ist die Bitte: 'Bitte übernehmt meine Änderungen.' Andere können sie ansehen, kommentieren und freigeben.",
    expertExplanation:
      "Ein Pull Request (PR) bündelt die Commits eines Branches zur Review und Integration in einen Zielbranch. Er ermöglicht Diskussion, Code-Review, automatische Checks (Actions) und kontrolliertes Mergen. PRs sind der Standard-Workflow für Zusammenarbeit auf GitHub.",
    syntax: "gh pr create --fill",
    copyCommand: "gh pr create --fill",
    whenToUse: ["Ein Feature im Team zur Review stellen", "Zu einem fremden Open-Source-Projekt beitragen"],
    risks: ["Riesige PRs sind schwer zu reviewen und fehleranfällig"],
    commonMistakes: ["Direkt auf main pushen statt einen PR zu öffnen"],
    relatedSlugs: ["git-branch", "github-cli", "projekt-veroeffentlichen"],
  },
  {
    slug: "projekt-veroeffentlichen",
    title: "Ein Projekt auf GitHub veröffentlichen",
    category: "publishing",
    age16Summary: "So bringst du dein lokales Projekt zum ersten Mal online auf GitHub.",
    expertExplanation:
      "Veröffentlichen heißt: lokales Repo initialisieren, ein leeres GitHub-Repo erstellen, beide per Remote verbinden und den ersten Commit pushen. Eine README und eine LIZENZ machen das Projekt nutzbar und rechtlich klar.",
    syntax: "git init\ngit remote add origin <url>\ngit push -u origin main",
    copyCommand: "git push -u origin main",
    whenToUse: ["Erstveröffentlichung eines neuen Projekts", "Ein lokales Projekt sichtbar machen"],
    risks: ["Secrets in der Historie werden mit veröffentlicht", "Ohne Lizenz dürfen andere den Code nicht nutzen"],
    commonMistakes: [".env oder Keys vor dem ersten Push nicht ignorieren"],
    relatedSlugs: ["git-init", "git-remote", "gitignore", "pull-request"],
  },

  // PHASE-5 (Vision) — curated troubleshooting/common modules (human-authored,
  // accurate; NOT AI-bulk-generated, per OUT-005/RISK-008).
  {
    slug: "permission-denied-publickey",
    title: "Fehler: Permission denied (publickey)",
    category: "security",
    age16Summary:
      "Dieser Fehler bedeutet: GitHub erkennt deinen SSH-Schlüssel nicht. Meist fehlt der öffentliche Schlüssel in deinem GitHub-Konto oder der SSH-Agent kennt ihn nicht.",
    expertExplanation:
      "„Permission denied (publickey)“ tritt auf, wenn die SSH-Authentifizierung scheitert: kein passender Key beim Agent, der öffentliche Schlüssel ist nicht in den GitHub-SSH-Settings hinterlegt, oder die falsche Remote-URL (HTTPS statt SSH). Prüfe die Verbindung mit `ssh -T git@github.com`.",
    syntax: "ssh -T git@github.com\nssh-add ~/.ssh/id_ed25519",
    copyCommand: "ssh -T git@github.com",
    whenToUse: ["Wenn push/pull über SSH abgelehnt wird", "Nach dem Einrichten eines neuen Rechners"],
    risks: ["Privaten Schlüssel niemals weitergeben"],
    commonMistakes: ["Öffentlichen Schlüssel nicht bei GitHub hinterlegt", "HTTPS-Remote statt SSH-Remote verwendet"],
    relatedSlugs: ["ssh-keys", "git-remote"],
    faq: [
      { question: "Wie prüfe ich, ob mein Key funktioniert?", answer: "Mit `ssh -T git@github.com` — bei Erfolg begrüßt dich GitHub mit deinem Benutzernamen." },
    ],
  },
  {
    slug: "merge-konflikt",
    title: "Merge-Konflikte verstehen",
    category: "branching",
    age16Summary:
      "Ein Merge-Konflikt entsteht, wenn zwei Änderungen dieselbe Stelle anders bearbeiten. Git kann dann nicht selbst entscheiden und markiert die Stelle, damit du sie auflöst.",
    expertExplanation:
      "Bei einem Konflikt markiert Git die betroffenen Bereiche mit `<<<<<<<`, `=======`, `>>>>>>>`. Du wählst pro Stelle den richtigen Code, entfernst die Marker, `git add` die Datei und schließt mit `git commit` ab. `git merge --abort` bricht einen Merge sicher ab.",
    syntax: "git status\n# Konflikte bearbeiten\ngit add .\ngit commit",
    copyCommand: "git merge --abort",
    whenToUse: ["Wenn merge, pull oder rebase einen Konflikt melden"],
    risks: ["Konfliktmarker versehentlich im Code belassen", "Fremde Änderungen ungeprüft überschreiben"],
    commonMistakes: ["Konflikt „auflösen“, ohne den Code zu verstehen"],
    relatedSlugs: ["git-merge", "git-rebase", "git-push-pull"],
  },
  {
    slug: "detached-head",
    title: "Detached HEAD verstehen",
    category: "undo",
    age16Summary:
      "„Detached HEAD“ heißt: du schaust dir einen einzelnen Commit an, statt auf einem Branch zu arbeiten. Neue Commits hier gehen verloren, wenn du keinen Branch erstellst.",
    expertExplanation:
      "Ein detached HEAD entsteht beim Auschecken eines konkreten Commits/Tags statt eines Branches. Commits in diesem Zustand gehören zu keinem Branch und können von der Garbage Collection entfernt werden. Mit `git switch -c <branch>` sicherst du deine Arbeit auf einen neuen Branch.",
    syntax: "git switch -c rettung\ngit switch main",
    copyCommand: "git switch -c mein-branch",
    whenToUse: ["Nach `git checkout <commit>`/Tag", "Wenn Git „You are in detached HEAD state“ meldet"],
    risks: ["Commits im detached-Zustand gehen ohne Branch verloren"],
    commonMistakes: ["Im detached HEAD weiterarbeiten und den Branch vergessen"],
    relatedSlugs: ["git-branch", "rueckgaengig-machen"],
  },
  {
    slug: "git-stash",
    title: "git stash — Änderungen zwischenspeichern",
    category: "git-commands",
    age16Summary:
      "Mit git stash legst du deine aktuellen, noch nicht committeten Änderungen kurz beiseite — zum Beispiel um schnell den Branch zu wechseln — und holst sie später zurück.",
    expertExplanation:
      "git stash sichert uncommittete Änderungen auf einen Stash-Stack und stellt das saubere Arbeitsverzeichnis wieder her. `git stash pop` spielt die letzten Änderungen zurück und entfernt sie vom Stack; `git stash list` zeigt alle Stashes.",
    syntax: "git stash\ngit stash pop",
    copyCommand: "git stash",
    whenToUse: ["Schnell den Branch wechseln, ohne zu committen", "Halbfertige Arbeit kurz parken"],
    risks: ["Vergessene Stashes stauen sich an", "Konflikte beim Zurückspielen möglich"],
    commonMistakes: ["stash pop bei Konflikten nicht sauber auflösen"],
    relatedSlugs: ["git-add-commit", "git-branch"],
  },
  {
    slug: "fetch-vs-pull",
    title: "git fetch vs. git pull",
    category: "remote",
    age16Summary:
      "git fetch lädt nur die Neuigkeiten herunter, ohne deinen Code zu verändern. git pull lädt sie herunter UND führt sie direkt zusammen (fetch + merge).",
    expertExplanation:
      "git fetch aktualisiert die Remote-Tracking-Branches, lässt deinen Arbeitsstand aber unangetastet — du kannst die Änderungen erst prüfen. git pull ist fetch + merge (oder fetch + rebase mit `--rebase`) in einem Schritt. Wer kontrolliert vorgehen will, nutzt fetch und merged bewusst.",
    syntax: "git fetch origin\ngit pull --rebase",
    copyCommand: "git fetch origin",
    whenToUse: ["Vor dem Mergen erst die Remote-Änderungen prüfen", "Team-Arbeit mit häufigen Updates"],
    risks: ["git pull kann unerwartete Merge-Commits erzeugen"],
    commonMistakes: ["Blind pullen statt Änderungen vorher zu sichten"],
    relatedSlugs: ["git-push-pull", "git-remote", "merge-konflikt"],
  },
];

export function getKnowledgeItem(slug: string): GitHubKnowledgeItem | undefined {
  return KNOWLEDGE_ITEMS.find((i) => i.slug === slug);
}

export function getKnowledgeByCategory(category: GitHubKnowledgeItem["category"]): GitHubKnowledgeItem[] {
  return KNOWLEDGE_ITEMS.filter((i) => i.category === category);
}
