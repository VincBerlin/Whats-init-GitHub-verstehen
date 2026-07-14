// PHASE-3 (homepage-tools-discovery) — error pattern database for the Git/GitHub/
// Actions/Deployment debugger. Deterministic, client-side matching only — never a
// network or LLM call (NFR-002, SCOPE-005). Schema = DATA-004 DebugPattern.
//
// SEC-006: any pattern whose fixCommands contain a destructive operation
// (reset --hard, clean -fd, force push, history rewrite) MUST carry severity
// "danger" and a riskWarning. Enforced by src/lib/error-matcher.test.ts.

export type DebugCategory = "git" | "github" | "actions" | "deployment" | "node" | "auth";
export type DebugSeverity = "info" | "warning" | "danger";

export interface DebugPattern {
  id: string;
  title: string;
  matchers: string[]; // lowercase substrings that identify this error
  category: DebugCategory;
  severity: DebugSeverity;
  simpleCause: string; // plain language for a beginner / non-coder (USER-001)
  technicalCause: string; // precise cause for a developer (USER-002)
  fixCommands: string[]; // ordered, copy-pasteable steps
  explanation: string; // why the fix works / how to avoid it next time
  relatedLinks: { label: string; href: string }[];
  riskWarning?: string; // SEC-006: shown when a fix is destructive
}

export const ERROR_PATTERNS: DebugPattern[] = [
  // ── DBG-001 — auth ──────────────────────────────────────────────────────
  {
    id: "permission-denied-publickey",
    title: "Permission denied (publickey)",
    matchers: ["permission denied (publickey)", "git@github.com: permission denied"],
    category: "auth",
    severity: "warning",
    simpleCause: "GitHub erkennt deinen Computer nicht als berechtigt. Dein SSH-Schlüssel ist nicht hinterlegt oder nicht aktiv.",
    technicalCause: "Kein passender SSH-Key beim Agent geladen, der öffentliche Schlüssel ist nicht in GitHub hinterlegt, oder die Remote nutzt SSH ohne gültigen Key.",
    fixCommands: [
      "Verbindung testen: ssh -T git@github.com",
      "Schlüssel beim Agent registrieren: ssh-add ~/.ssh/id_ed25519",
      "Öffentlichen Schlüssel (~/.ssh/id_ed25519.pub) in GitHub → Settings → SSH keys hinterlegen",
      "Remote prüfen: git remote -v sollte git@github.com:... zeigen",
    ],
    explanation: "GitHub akzeptiert Pushes über SSH nur, wenn dein öffentlicher Schlüssel hinterlegt und der private Schlüssel lokal aktiv ist.",
    relatedLinks: [
      { label: "SSH-Fehler beheben (Blog)", href: "/blog/ssh-permission-denied-beheben" },
      { label: "SSH-Keys (Wissen)", href: "/github/ssh-keys" },
    ],
  },
  // ── DBG-002 — exit code 127 ─────────────────────────────────────────────
  {
    id: "exit-code-127",
    title: "Process completed with exit code 127 (command not found)",
    // Specific only — a bare "127" matches ports/IPs/hashes (false positives).
    matchers: ["process completed with exit code 127", "exit code 127", "command not found"],
    category: "actions",
    severity: "warning",
    simpleCause: "Ein Befehl wurde aufgerufen, den es auf dem Server nicht gibt — oft ein Tippfehler oder ein fehlendes Programm.",
    technicalCause: "Exit-Code 127 = die Shell konnte das Kommando nicht finden (nicht im PATH, nicht installiert, oder ein Setup-Step fehlt).",
    fixCommands: [
      "Befehlsnamen auf Tippfehler prüfen",
      "Fehlendes Tool im Workflow installieren (z. B. ein Setup-Step vor dem Aufruf)",
      "Bei npm-Skripten: npm ci vor dem Aufruf ausführen, damit lokale Binaries existieren",
    ],
    explanation: "127 heißt fast immer 'Kommando nicht gefunden'. Stelle sicher, dass das Tool installiert und im PATH ist, bevor es aufgerufen wird.",
    relatedLinks: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
  // ── DBG-003 — exit code 137 ─────────────────────────────────────────────
  {
    id: "exit-code-137",
    title: "Process completed with exit code 137 (out of memory / killed)",
    // Specific only — a bare "137" matches line numbers/counts (false positives).
    matchers: ["process completed with exit code 137", "exit code 137", "killed", "out of memory", "oomkilled"],
    category: "actions",
    severity: "warning",
    simpleCause: "Der Vorgang wurde abgebrochen, weil der Speicher (RAM) ausging.",
    technicalCause: "Exit-Code 137 = 128 + 9 (SIGKILL). Der Prozess wurde vom System hart beendet, meist wegen Speicherüberschreitung (OOM) im Runner/Container.",
    fixCommands: [
      "Speicherbedarf senken (z. B. Tests/Builds in kleineren Schritten oder mit weniger Parallelität)",
      "Node-Heap begrenzen/erhöhen: NODE_OPTIONS=--max-old-space-size=2048",
      "Bei Docker/Deploy: Speicherlimit des Plans erhöhen",
    ],
    explanation: "137 ist ein erzwungenes Kill-Signal, fast immer durch zu wenig Arbeitsspeicher. Reduziere den Verbrauch oder erhöhe das Limit.",
    relatedLinks: [{ label: "GitHub Actions (Wissen)", href: "/github/github-actions" }],
  },
  // ── DBG-004 — merge conflict ────────────────────────────────────────────
  {
    id: "merge-conflict",
    title: "Merge conflict",
    matchers: ["conflict", "automatic merge failed", "fix conflicts and then commit", "<<<<<<<"],
    category: "git",
    severity: "warning",
    simpleCause: "Zwei Änderungen betreffen dieselbe Stelle. Git weiß nicht, welche gewinnt — das musst du entscheiden.",
    technicalCause: "Überlappende Änderungen an denselben Zeilen können nicht automatisch zusammengeführt werden; Git markiert die Konfliktstellen.",
    fixCommands: [
      "Konfliktdateien anzeigen: git status",
      "Marker <<<<<<< ======= >>>>>>> bearbeiten und entfernen",
      "Datei vormerken: git add <datei>, dann git commit",
      "Notausgang (bricht den Merge ab): git merge --abort",
    ],
    explanation: "Du wählst pro Konfliktstelle die richtige Version, entfernst die Marker und schließt den Merge mit einem Commit ab.",
    relatedLinks: [
      { label: "Merge-Konflikt lösen (Blog)", href: "/blog/merge-konflikt-loesen" },
      { label: "Merge-Konflikte (Wissen)", href: "/github/merge-konflikt" },
    ],
  },
  // ── DBG-005 — detached HEAD ─────────────────────────────────────────────
  {
    id: "detached-head",
    title: "You are in 'detached HEAD' state",
    matchers: ["detached head", "you are in 'detached head' state"],
    category: "git",
    severity: "info",
    simpleCause: "Du arbeitest gerade nicht auf einem Branch, sondern auf einem einzelnen alten Stand. Neue Commits könnten verloren gehen.",
    technicalCause: "HEAD zeigt direkt auf einen Commit/Tag statt auf eine Branch-Referenz; Commits hier sind nicht von einem Branch erreichbar.",
    fixCommands: [
      "Arbeit auf einen neuen Branch sichern: git switch -c mein-branch",
      "Oder zurück zu main: git switch main",
    ],
    explanation: "Lege einen Branch an, bevor du committest, damit deine Arbeit nicht verwaist.",
    relatedLinks: [{ label: "Detached HEAD (Wissen)", href: "/github/detached-head" }],
  },
  // ── DBG-006 — non-fast-forward ──────────────────────────────────────────
  {
    id: "non-fast-forward",
    title: "Updates were rejected (non-fast-forward)",
    matchers: ["non-fast-forward", "updates were rejected", "failed to push some refs", "tip of your current branch is behind"],
    category: "git",
    severity: "warning",
    simpleCause: "Auf GitHub liegen Commits, die du lokal noch nicht hast. Git lehnt deinen Push ab, um sie nicht zu überschreiben.",
    technicalCause: "Die Remote-Branch-Spitze ist deiner lokalen voraus; ein nicht-fast-forward-Push würde fremde Commits verlieren.",
    fixCommands: [
      "Remote-Änderungen holen und einbauen: git pull --rebase",
      "Konflikte ggf. auflösen, dann erneut pushen: git push",
    ],
    explanation: "Hol dir zuerst die fehlenden Commits (pull --rebase), dann passt dein Push als fast-forward. Auf geteilten Branches niemals blind mit --force überschreiben.",
    relatedLinks: [
      { label: "push & pull (Blog)", href: "/blog/erstes-projekt-auf-github" },
      { label: "git fetch vs pull", href: "/github/fetch-vs-pull" },
    ],
  },
  // ── DBG-007 — repository not found ──────────────────────────────────────
  {
    id: "repository-not-found",
    title: "Repository not found",
    matchers: ["repository not found", "could not read from remote repository", "fatal: repository", "remote: not found"],
    category: "git",
    severity: "warning",
    simpleCause: "GitHub findet das Repository nicht — der Name ist falsch geschrieben, oder du hast keinen Zugriff darauf.",
    technicalCause: "Die Remote-URL zeigt auf ein nicht existierendes/privates Repo, oder die Authentifizierung reicht für ein privates Repo nicht aus.",
    fixCommands: [
      "Remote-URL prüfen: git remote -v (owner/repo korrekt geschrieben?)",
      "URL korrigieren: git remote set-url origin git@github.com:owner/repo.git",
      "Bei privatem Repo: Zugriffsrechte / Token prüfen",
    ],
    explanation: "Meist ein Tippfehler im owner/repo oder fehlender Zugriff. Korrigiere die URL oder stelle den Zugang sicher.",
    relatedLinks: [{ label: "git remote (Wissen)", href: "/github/git-remote" }],
  },
  // ── DBG-008 — authentication failed (HTTPS) ─────────────────────────────
  {
    id: "https-auth-failed",
    title: "Authentication failed (HTTPS)",
    matchers: ["authentication failed", "support for password authentication was removed", "invalid username or password"],
    category: "auth",
    severity: "warning",
    simpleCause: "GitHub akzeptiert dein Passwort nicht mehr. Über HTTPS brauchst du einen Zugriffstoken statt eines Passworts.",
    technicalCause: "GitHub hat Passwort-Authentifizierung über HTTPS entfernt; nötig ist ein Personal Access Token (PAT) oder SSH.",
    fixCommands: [
      "Personal Access Token in GitHub → Settings → Developer settings erstellen",
      "Beim Push als Passwort den Token verwenden",
      "Alternativ auf SSH umstellen: git remote set-url origin git@github.com:owner/repo.git",
    ],
    explanation: "Nutze einen PAT als Passwort oder wechsle auf SSH — ein normales Konto-Passwort funktioniert über HTTPS nicht mehr.",
    relatedLinks: [{ label: "SSH-Keys & Auth (Wissen)", href: "/github/ssh-keys" }],
  },
  // ── DBG-009 — large file detected ───────────────────────────────────────
  {
    id: "large-file-detected",
    title: "Large file detected / File exceeds GitHub's file size limit",
    matchers: ["large file", "exceeds github's file size limit", "this exceeds github's file size limit of 100", "gh001", "remote: error: file"],
    category: "github",
    severity: "danger",
    simpleCause: "Eine zu große Datei (über 100 MB) soll zu GitHub — das ist nicht erlaubt. Sie muss aus der Historie entfernt werden.",
    technicalCause: "GitHub lehnt Blobs >100 MB ab. Wurde die Datei bereits committet, steckt sie in der Historie und ein einfaches Löschen reicht nicht.",
    fixCommands: [
      "Datei aus dem letzten Commit nehmen: git rm --cached <große-datei> && git commit --amend",
      "Datei künftig ignorieren: in .gitignore eintragen",
      "Steckt sie tief in der Historie: git filter-repo --path <große-datei> --invert-paths",
      "Für echte Großdateien: Git LFS verwenden (git lfs track)",
    ],
    explanation: "Große Dateien gehören nicht in Git. Entferne sie aus der Historie (filter-repo) oder nutze Git LFS, und ignoriere sie künftig.",
    riskWarning: "git filter-repo schreibt die gesamte Git-Historie neu (geänderte Commit-Hashes). Auf geteilten Branches müssen danach alle neu klonen. Vorher ein Backup/Klon des Repos anlegen.",
    relatedLinks: [{ label: ".gitignore (Wissen)", href: "/github/gitignore" }],
  },
  // ── DBG-010 — npm command not found ─────────────────────────────────────
  {
    id: "npm-command-not-found",
    title: "npm: command not found",
    matchers: ["npm: command not found", "npm command not found", "bash: npm", "node: command not found"],
    category: "node",
    severity: "warning",
    simpleCause: "Node.js/npm ist auf dem Rechner oder im Workflow nicht installiert.",
    technicalCause: "Die npm/node-Binary ist nicht im PATH — lokal nicht installiert, oder im CI fehlt ein Node-Setup-Step.",
    fixCommands: [
      "Lokal: Node.js (inkl. npm) von nodejs.org installieren, Terminal neu starten",
      "In GitHub Actions vor npm einen Setup-Step einfügen: uses: actions/setup-node@v4 mit node-version",
      "Installation prüfen: node -v && npm -v",
    ],
    explanation: "npm kommt mit Node.js. Installiere Node lokal bzw. richte im Workflow setup-node ein, bevor npm-Befehle laufen.",
    relatedLinks: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
  // ── DBG-011 — next build failed ─────────────────────────────────────────
  {
    id: "next-build-failed",
    title: "next build failed",
    matchers: ["next build", "build error occurred", "failed to compile", "type error:", "module not found"],
    category: "node",
    severity: "warning",
    simpleCause: "Der Production-Build von Next.js bricht ab — meist wegen eines Code- oder Typ-Fehlers, der im Dev-Modus nicht auffiel.",
    technicalCause: "next build prüft strenger als der Dev-Server: Typfehler, fehlende Module oder Lint-Fehler stoppen den Build.",
    fixCommands: [
      "Build lokal nachstellen: npm run build (zeigt die echte Fehlerzeile)",
      "Bei 'Module not found': Import-Pfad/Groß-Kleinschreibung prüfen, Abhängigkeit installieren",
      "Bei 'Type error': den gemeldeten Typfehler an der genannten Datei:Zeile beheben",
    ],
    explanation: "Reproduziere den Build lokal — die erste gemeldete Fehlerzeile nennt Datei und Ursache. Production-Builds sind strenger als der Dev-Server.",
    relatedLinks: [{ label: "What's in it (Wissen)", href: "/what-is-whats-in-it" }],
  },
  // ── DBG-012 — railway deploy failed ─────────────────────────────────────
  {
    id: "railway-deploy-failed",
    title: "Railway deploy failed",
    matchers: ["railway", "deploy failed", "build failed", "healthcheck failed", "deployment crashed", "nixpacks"],
    category: "deployment",
    severity: "warning",
    simpleCause: "Das Deployment auf Railway ist fehlgeschlagen — entweder beim Bauen, beim Start, oder beim Healthcheck.",
    technicalCause: "Build-Fehler (fehlende Dependencies/Env), Start-Crash (falsches Start-Kommando/Port), oder der Healthcheck-Pfad antwortet nicht.",
    fixCommands: [
      "Build-Logs in Railway öffnen und die erste rote Zeile lesen",
      "Pflicht-Env-Variablen in Railway → Variables setzen (z. B. DATABASE_URL)",
      "Start-Kommando prüfen (npm run start) und auf $PORT lauschen",
      "Healthcheck-Pfad prüfen (z. B. /api/health antwortet 200)",
    ],
    explanation: "Trenne Build- von Laufzeitfehlern: Logs lesen, fehlende Env setzen, korrektes Start-Kommando auf $PORT, erreichbarer Healthcheck.",
    relatedLinks: [{ label: "What's in it (Wissen)", href: "/what-is-whats-in-it" }],
  },
  // ── extra git/actions patterns (kept from the existing DB) ──────────────
  {
    id: "not-a-git-repository",
    title: "fatal: not a git repository",
    matchers: ["not a git repository", "fatal: not a git repository"],
    category: "git",
    severity: "info",
    simpleCause: "Du bist in einem Ordner, der kein Git-Projekt ist.",
    technicalCause: "Im aktuellen Verzeichnis (und seinen Eltern) gibt es kein .git-Verzeichnis.",
    fixCommands: [
      "Ins richtige Projektverzeichnis wechseln (cd <projekt>)",
      "Oder ein neues Repository starten: git init",
    ],
    explanation: "Git-Befehle funktionieren nur innerhalb eines Repositories. Wechsle hinein oder initialisiere eines.",
    relatedLinks: [{ label: "git init (Wissen)", href: "/github/git-init" }],
  },
  {
    id: "unrelated-histories",
    title: "refusing to merge unrelated histories",
    matchers: ["refusing to merge unrelated histories"],
    category: "git",
    severity: "warning",
    simpleCause: "Zwei Projekte ohne gemeinsame Vorgeschichte sollen verbunden werden (oft nach git init auf beiden Seiten).",
    technicalCause: "Die zu mergenden Branches teilen keinen gemeinsamen Vorfahren; Git verweigert den Merge zur Sicherheit.",
    fixCommands: [
      "Bewusst zusammenführen: git pull origin main --allow-unrelated-histories",
      "Anschließend entstehende Konflikte normal auflösen",
    ],
    explanation: "Mit --allow-unrelated-histories erlaubst du den Merge ausdrücklich — danach normale Konfliktauflösung.",
    relatedLinks: [{ label: "git remote (Wissen)", href: "/github/git-remote" }],
  },
  {
    id: "local-changes-overwritten",
    title: "Your local changes would be overwritten",
    matchers: ["your local changes to the following files would be overwritten", "please commit your changes or stash them"],
    category: "git",
    severity: "danger",
    simpleCause: "Ein pull/checkout würde deine noch nicht gespeicherten Änderungen überschreiben. Sichere sie zuerst.",
    technicalCause: "Nicht committete Änderungen im Working Tree kollidieren mit den Dateien, die pull/checkout einspielen würde.",
    fixCommands: [
      "Sicher beiseitelegen: git stash → git pull → git stash pop",
      "Oder committen: git add -A && git commit -m \"WIP\"",
      "Verwerfen (UNWIDERRUFLICH): git reset --hard",
    ],
    explanation: "Stash oder Commit bewahren deine Arbeit. git reset --hard ist nur sinnvoll, wenn du die lokalen Änderungen wirklich wegwerfen willst.",
    riskWarning: "git reset --hard löscht alle nicht committeten Änderungen unwiderruflich. Nutze es nur, wenn du diese Änderungen sicher nicht mehr brauchst.",
    relatedLinks: [{ label: "git stash (Wissen)", href: "/github/git-stash" }],
  },
  {
    id: "remote-origin-exists",
    title: "remote origin already exists",
    matchers: ["remote origin already exists"],
    category: "git",
    severity: "info",
    simpleCause: "Es gibt schon eine Remote namens 'origin' — du musst sie ändern statt neu hinzuzufügen.",
    technicalCause: "git remote add origin schlägt fehl, weil die Referenz origin bereits gesetzt ist.",
    fixCommands: [
      "Bestehende URL ändern: git remote set-url origin <url>",
      "Oder origin entfernen und neu setzen: git remote remove origin && git remote add origin <url>",
    ],
    explanation: "origin existiert bereits; setze die URL um statt sie erneut anzulegen.",
    relatedLinks: [{ label: "git remote (Wissen)", href: "/github/git-remote" }],
  },
  {
    id: "actions-exit-1",
    title: "Process completed with exit code 1",
    matchers: ["process completed with exit code 1", "##[error]process completed with exit code"],
    category: "actions",
    severity: "warning",
    simpleCause: "Ein Schritt im Workflow ist fehlgeschlagen (z. B. ein Test oder Lint). Die echte Ursache steht weiter oben im Log.",
    technicalCause: "Exit-Code 1 ist generisch: irgendein Kommando im Step endete mit Fehler; die spezifische Meldung steht im ersten roten Step.",
    fixCommands: [
      "Im Actions-Log den ERSTEN roten Step öffnen — dort steht die eigentliche Ursache",
      "Den fehlgeschlagenen Befehl lokal nachstellen, um ihn zu reproduzieren",
    ],
    explanation: "Exit-Code 1 sagt nur 'etwas schlug fehl'. Öffne den ersten roten Step für die konkrete Fehlermeldung.",
    relatedLinks: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
  {
    id: "actions-npm-ci-lock",
    title: "npm ci can only install with an existing package-lock.json",
    matchers: ["npm ci can only install", "the npm ci command can only install with an existing package-lock"],
    category: "actions",
    severity: "warning",
    simpleCause: "npm ci braucht eine eingecheckte package-lock.json, die im Repository fehlt.",
    technicalCause: "npm ci installiert ausschließlich aus einer vorhandenen package-lock.json; ohne Lockfile bricht es ab.",
    fixCommands: [
      "Lokal npm install ausführen und die erzeugte package-lock.json committen",
      "Sicherstellen, dass package-lock.json nicht in .gitignore steht",
    ],
    explanation: "Committe die Lockfile — npm ci baut reproduzierbar genau aus ihr.",
    relatedLinks: [{ label: ".gitignore (Wissen)", href: "/github/gitignore" }],
  },
  {
    id: "actions-permissions",
    title: "Resource not accessible by integration",
    matchers: ["resource not accessible by integration", "denied to github-actions"],
    category: "actions",
    severity: "warning",
    simpleCause: "Dem Workflow fehlen Rechte für die Aktion (z. B. ins Repo schreiben).",
    technicalCause: "Die GITHUB_TOKEN-Permissions sind zu eng; der Job darf die angeforderte Ressource nicht ändern.",
    fixCommands: [
      "Im Workflow die nötigen permissions setzen, z. B. permissions: contents: write",
      "Repo-Einstellung 'Workflow permissions' prüfen (Settings → Actions)",
    ],
    explanation: "Erhöhe gezielt die permissions des Jobs auf das, was er wirklich braucht.",
    relatedLinks: [{ label: "GitHub Actions (Wissen)", href: "/github/github-actions" }],
  },
  {
    id: "actions-secret-invalid",
    title: "Context access might be invalid (Secret)",
    matchers: ["context access might be invalid", "secrets."],
    category: "actions",
    severity: "warning",
    simpleCause: "Ein verwendetes Secret existiert nicht oder ist hier nicht verfügbar.",
    technicalCause: "Die Referenz secrets.X ist im aktuellen Kontext leer (nicht angelegt, oder in Forks/PRs eingeschränkt).",
    fixCommands: [
      "Secret in Settings → Secrets and variables → Actions anlegen",
      "Namen exakt prüfen (Groß-/Kleinschreibung)",
      "Beachten: Secrets sind in Fork-PRs eingeschränkt verfügbar",
    ],
    explanation: "Lege das Secret an und prüfe den Namen; nie Secrets im Klartext in die YAML schreiben.",
    relatedLinks: [{ label: "GitHub Actions (Blog)", href: "/blog/erster-github-actions-workflow" }],
  },
];
