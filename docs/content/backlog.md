# Knowledge Content Backlog (GOAL-011 / FR-018)

Live content is **human-authored, accurate** — never AI-bulk-generated (OUT-005, RISK-008).
This backlog lists prioritised modules to author next; each must be reviewed before publish.

## Live now (22 topics)
Grundlagen, tägliche Befehle, Branches/Merge/Rebase, Undo (reset/revert), Remote/push/pull/fetch,
gitignore, SSH-Keys, GitHub CLI, Actions, Pull Request, Veröffentlichen, plus troubleshooting:
permission denied (publickey), merge-Konflikte, detached HEAD, git stash, fetch vs pull.

## Backlog — priorité 1 (troubleshooting, high search demand)
- `git pull` non-fast-forward / rejected push
- `.gitignore` greift nicht (already tracked → `git rm --cached`)
- "fatal: not a git repository"
- Große Datei versehentlich committet (BFG / filter-repo) — **review: destructive**
- Zugangsdaten/Token versehentlich gepusht — Secret-Rotation

## Backlog — priorité 2 (depth modules)
- GitHub Actions: erster CI-Workflow Schritt für Schritt
- GitHub CLI: PR-Review-Flow, Issues, Releases
- GitHub Security: Dependabot, Secret Scanning, branch protection
- GitHub API: Grundlagen, Rate Limits, Authentifizierung
- GitHub Copilot: Einführung, Grenzen

## Backlog — priorité 3 (concept/compare)
- Monorepo vs Polyrepo, Forking-Workflow vs Branching-Workflow
- Tags & Releases, Semantic Versioning
- Conventional Commits

## Authoring rules
- Deutsch, ab ~16 Jahren verständlich; definition-first (citability/GEO).
- Pflichtfelder pro Topic (FR-013): slug, title, category, age16Summary, expertExplanation,
  whenToUse, risks, relatedSlugs (auflösbar). riskLevel/synonyms via taxonomy enrichment.
- Keine ungeprüften AI-Texte. Gefährliche Befehle bekommen Risk-Badge + Warnung.
