# Deploy Readiness — Homepage Tools & Repository Discovery Correction

Plumbline `/agileteam` sprint `homepage-tools-discovery` (2026-06-08). Companion to the
root `DEPLOY.md`. **No new infrastructure.**

## Migration status
- **No new migrations.** Discovery reuses the existing `weekly_top_repositories` table
  (`migrations/0002_rankings.sql`). `npm run migrate` state is unchanged by this sprint.

## Env vars
- **No new env required.** Homepage tools (calculator/debugger), `/repositories`, and the
  discovery counters add zero env vars and zero LLM/network calls — proven at the runtime
  boundary by the Playwright "NO LLM/external network call" e2e (watches `page.on('request')`
  across `/`, the embedded tools, `/repositories`, `/tools/*`). The analyze path still uses
  `OPENROUTER_API_KEY` only on a cache miss — unchanged (the LLM cost boundary is untouched).

## What changed operationally
- `/github/trending` now permanently redirects (308) to `/repositories` (ISR, hourly).
- Daily Top **3** / Niche Top **5** (was 5 / 10). The daily discovery cron (`/api/jobs/*`,
  unchanged Bearer auth + schedule) now writes `dailyWritten:3` / `nicheWritten:5`; niche
  hard-excludes >50k-star giants at the selector boundary.
- The Daily list shows an honest "Beispiel-Auswahl (noch keine 24‑h‑Bewegung)" label until a
  real 24h delta exists — no fabricated "today's movement" (BLOCKER-002).

## Post-deploy checks (this sprint)
- [ ] Homepage `/` shows the three embedded tools (Analyze form + calculator + debugger) and
      no example-repo line.
- [ ] `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + the "Wie wird hier bewertet?"
      ranking explanation; `/github/trending` 308-redirects to it.
- [ ] After the daily cron runs against the live DB: niche shows no >50k giant; the daily
      sample label disappears once a 24h delta exists.
- [ ] Spot-check: pasting a real Git error in the debugger shows cause + fix; a destructive
      fix (`git reset --hard`, history rewrite) shows the red "⚠ Achtung" danger box.

## Rollback
- Revert the feature commits (`feat(homepage|calculator|debugger|discovery|repositories)`),
  or to drop only the redirect, remove the `/github/trending → /repositories` entry in
  `next.config.ts`. **No DB migration to roll back** (schema unchanged).
