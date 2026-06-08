// PHASE-6 (Master Plan) — error pattern database for the Git & Actions debugger.
// Deterministic, client-side matching only — never a network or LLM call (SCOPE-005).
export interface ErrorPattern {
  id: string;
  tool: "git" | "actions";
  title: string;
  signals: string[]; // lowercase substrings that identify this error
  cause: string;
  fix: string[];
  related?: { label: string; href: string }[];
}

export const ERROR_PATTERNS: ErrorPattern[] = [
  {
    id: "permission-denied-publickey",
    tool: "git",
    title: "Permission denied (publickey)",
    signals: ["permission denied (publickey)", "git@github.com: permission denied"],
    cause: "GitHub erkennt deinen SSH-Schlüssel nicht: kein Schlüssel beim Agent, öffentlicher Schlüssel nicht in GitHub hinterlegt, oder die Remote nutzt HTTPS statt SSH.",
    fix: [
      "Verbindung testen: ssh -T git@github.com",
      "Schlüssel beim Agent registrieren: ssh-add ~/.ssh/id_ed25519",
      "Öffentlichen Schlüssel (id_ed25519.pub) in GitHub → Settings → SSH keys hinterlegen",
      "Remote prüfen: git remote -v sollte git@github.com:... zeigen",
    ],
    related: [
      { label: "SSH-Fehler beheben (Blog)", href: "/blog/ssh-permission-denied-beheben" },
      { label: "SSH-Keys (Wissen)", href: "/github/ssh-keys" },
    ],
  },
  {
    id: "non-fast-forward",
    tool: "git",
    title: "Updates were rejected (non-fast-forward)",
    signals: ["non-fast-forward", "updates were rejected", "failed to push some refs", "tip of your current branch is behind"],
    cause: "Die Remote enthält Commits, die du lokal noch nicht hast. Git lehnt den Push ab, um diese nicht zu überschreiben.",
    fix: [
      "Zuerst die Remote-Änderungen holen: git pull --rebase",
      "Konflikte ggf. auflösen, dann erneut pushen: git push",
      "Niemals blind mit --force pushen auf geteilten Branches",
    ],
    related: [
      { label: "push & pull (Blog)", href: "/blog/erstes-projekt-auf-github" },
      { label: "git fetch vs pull", href: "/github/fetch-vs-pull" },
    ],
  },
  {
    id: "merge-conflict",
    tool: "git",
    title: "Merge conflict",
    signals: ["conflict", "automatic merge failed", "fix conflicts and then commit", "<<<<<<<"],
    cause: "Zwei Änderungen betreffen dieselbe Stelle; Git kann nicht automatisch entscheiden.",
    fix: [
      "Konfliktdateien anzeigen: git status",
      "Marker <<<<<<< ======= >>>>>>> bearbeiten und entfernen",
      "Datei vormerken: git add <datei>, dann git commit",
      "Notausgang: git merge --abort",
    ],
    related: [
      { label: "Merge-Konflikt lösen (Blog)", href: "/blog/merge-konflikt-loesen" },
      { label: "Merge-Konflikte (Wissen)", href: "/github/merge-konflikt" },
    ],
  },
  {
    id: "not-a-git-repository",
    tool: "git",
    title: "fatal: not a git repository",
    signals: ["not a git repository", "fatal: not a git repository"],
    cause: "Du bist nicht in einem Git-Repository (oder einem seiner Unterordner).",
    fix: [
      "Ins richtige Projektverzeichnis wechseln (cd)",
      "Oder ein neues Repository starten: git init",
    ],
    related: [{ label: "git init (Wissen)", href: "/github/git-init" }],
  },
  {
    id: "unrelated-histories",
    tool: "git",
    title: "refusing to merge unrelated histories",
    signals: ["refusing to merge unrelated histories"],
    cause: "Zwei Repositories ohne gemeinsame Historie sollen zusammengeführt werden (häufig nach git init auf beiden Seiten).",
    fix: [
      "Bewusst zusammenführen: git pull origin main --allow-unrelated-histories",
      "Anschließend entstehende Konflikte normal auflösen",
    ],
    related: [{ label: "git remote (Wissen)", href: "/github/git-remote" }],
  },
  {
    id: "local-changes-overwritten",
    tool: "git",
    title: "Your local changes would be overwritten",
    signals: ["your local changes to the following files would be overwritten", "please commit your changes or stash them"],
    cause: "Ein pull/checkout würde nicht committete lokale Änderungen überschreiben.",
    fix: [
      "Änderungen committen, oder",
      "Beiseitelegen: git stash, dann git pull, dann git stash pop",
    ],
    related: [{ label: "git stash (Wissen)", href: "/github/git-stash" }],
  },
  {
    id: "remote-origin-exists",
    tool: "git",
    title: "remote origin already exists",
    signals: ["remote origin already exists"],
    cause: "Es gibt bereits eine Remote namens origin.",
    fix: [
      "Bestehende URL ändern: git remote set-url origin <url>",
      "Oder origin entfernen und neu setzen: git remote remove origin",
    ],
    related: [{ label: "git remote (Wissen)", href: "/github/git-remote" }],
  },
  {
    id: "detached-head",
    tool: "git",
    title: "You are in 'detached HEAD' state",
    signals: ["detached head", "you are in 'detached head' state"],
    cause: "Du hast einen einzelnen Commit/Tag ausgecheckt statt eines Branches; neue Commits hier können verloren gehen.",
    fix: [
      "Arbeit auf einen Branch sichern: git switch -c mein-branch",
      "Oder zurück zu main: git switch main",
    ],
    related: [{ label: "Detached HEAD (Wissen)", href: "/github/detached-head" }],
  },
  {
    id: "https-auth-failed",
    tool: "git",
    title: "Authentication failed (HTTPS)",
    signals: ["authentication failed", "support for password authentication was removed", "invalid username or password"],
    cause: "Über HTTPS akzeptiert GitHub kein Passwort mehr — nötig ist ein Personal Access Token (PAT).",
    fix: [
      "Personal Access Token in GitHub → Settings → Developer settings erstellen",
      "Beim Push als Passwort den Token verwenden",
      "Alternativ auf SSH umstellen: git remote set-url origin git@github.com:owner/repo.git",
    ],
    related: [{ label: "SSH-Keys & Auth (Wissen)", href: "/github/ssh-keys" }],
  },
  {
    id: "actions-exit-1",
    tool: "actions",
    title: "Process completed with exit code 1",
    signals: ["process completed with exit code 1", "##[error]process completed with exit code"],
    cause: "Ein Step ist fehlgeschlagen (z. B. ein Test oder Lint). Exit-Code 1 ist die generische Fehlermeldung.",
    fix: [
      "Im Actions-Log den ERSTEN roten Step öffnen — dort steht die eigentliche Ursache",
      "Den fehlgeschlagenen Befehl lokal nachstellen, um ihn zu reproduzieren",
    ],
    related: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
  {
    id: "actions-npm-ci-lock",
    tool: "actions",
    title: "npm ci can only install with an existing package-lock.json",
    signals: ["npm ci can only install", "the npm ci command can only install with an existing package-lock"],
    cause: "npm ci benötigt eine eingecheckte package-lock.json, die im Repository fehlt.",
    fix: [
      "Lokal npm install ausführen und die erzeugte package-lock.json committen",
      "Sicherstellen, dass package-lock.json nicht in .gitignore steht",
    ],
    related: [{ label: ".gitignore (Wissen)", href: "/github/gitignore" }],
  },
  {
    id: "actions-permissions",
    tool: "actions",
    title: "Resource not accessible by integration",
    signals: ["resource not accessible by integration", "permission to", "denied to github-actions"],
    cause: "Dem Workflow fehlen die nötigen Berechtigungen (GITHUB_TOKEN-Permissions sind zu eng).",
    fix: [
      "Im Workflow die benötigten permissions setzen, z. B. permissions: contents: write",
      "Repo-Einstellung 'Workflow permissions' prüfen",
    ],
    related: [{ label: "GitHub Actions (Wissen)", href: "/github/github-actions" }],
  },
  {
    id: "actions-secret-invalid",
    tool: "actions",
    title: "Context access might be invalid (Secret)",
    signals: ["context access might be invalid", "secrets.", "is not defined"],
    cause: "Ein referenziertes Secret existiert nicht oder ist im aktuellen Kontext nicht verfügbar.",
    fix: [
      "Secret in Settings → Secrets and variables → Actions anlegen",
      "Namen exakt prüfen; Secrets stehen z. B. in Forks/PRs eingeschränkt zur Verfügung",
      "Secrets niemals im Klartext in die YAML schreiben",
    ],
    related: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
];
