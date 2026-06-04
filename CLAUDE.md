# CLAUDE.md

Guidance for Claude Code / Cursor working in this repository.
Authoritative product spec: `docs/prd/whats-in-it-live-ready-full.prd.md`. Agent rules: `AGENTS.md`.

## What This App Does

**What's in it?** is a German-language Next.js 16 (App Router, React 19) web app:
a free, ad-financed, **no-account / no-paywall** GitHub Repository Intelligence &
Knowledge Hub. A user pastes a public GitHub URL → the app fetches repo metadata + README
→ runs a structured analysis via **OpenRouter** (Gemini behind a server-side adapter) →
renders a typed result. It also offers a static Git/GitHub knowledge hub and a Weekly Top 10.

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Run production build
npm run lint     # ESLint (flat config)
npm test         # Vitest (run mode)
npm run migrate  # Apply SQL migrations (needs DATABASE_URL)
```
Node `>=20.9.0`.

## Architecture (Ports & Adapters)

UI/routes → application services → domain → ports → infrastructure adapters.
External services (GitHub, OpenRouter, Postgres) sit behind interfaces in `src/lib/ports.ts`
and `src/lib/analyzer-port.ts`. No business logic in React components; no DB queries in UI.

### Analysis request flow (cache-first, cost-controlled)
1. `/` form or `/analyse/[owner]/[repo]` (SSR) → `runAnalysis()` in `src/lib/analysis-service.ts`.
2. `repo-normalize.ts` canonicalizes the URL to a lowercase `repo_key` (rejects non-GitHub/SSRF).
3. **Cache-first**: `analysis_cache` is checked before any LLM call (ARCH-007). A hit never calls OpenRouter.
4. On miss: **bot protection** + **rate limit** run before any external call; then an
   **analysis lock** (`analysis_locks`) guarantees at most one OpenRouter call per `repo_key`
   under concurrency.
5. `openRouterAnalyzer` (`src/lib/openrouter.ts`) fetches GitHub data (`github.ts`), calls
   OpenRouter, validates output with zod (`analysis-schema.ts`), and injects real GitHub facts.
6. Result is persisted and rendered by `AnalysisCard` as typed fields — **no `dangerouslySetInnerHTML`**.

### Persistence
- Postgres via `pg` (prod). Without `DATABASE_URL`, in-memory stores are used (dev only, not persistent).
- Stores: `src/lib/stores/{pg-stores,memory-stores,index}.ts`. Schema: `migrations/0001_init.sql`.
- Tables: `analysis_cache`, `usage_events` (hash-only), `analysis_locks`, `repo_snapshots`, `weekly_top_repositories`.

### Knowledge hub (static, no LLM)
- Data: `src/data/{github-knowledge,git-workflows,terminal-shortcuts}.ts`.
- Routes: `/github`, `/github/[slug]` (SSG), `/github/shortcuts`, `/commands`, `/cli`, `/actions`.
- These pages must **never** import the OpenRouter adapter (enforced by a test).

### Weekly Top 10 (snapshots + scoring, no LLM)
- `trending-score.ts` (pure scoring), `trending.ts` (jobs), cron routes `/api/jobs/*` (Bearer `CRON_SECRET`).
- Homepage + `/github/trending` read stored data (ISR hourly); static seed fallback when empty.

## Environment
See `.env.example`. Key vars: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default
`google/gemini-2.5-flash`), `DATABASE_URL`, `HASH_SALT`, `CRON_SECRET`, `GITHUB_TOKEN`,
`SITE_URL`. Secrets are server-side only and never logged.

## Hard rules
- Cache before OpenRouter; one LLM call per `repo_key`; `/github*` + trending never call OpenRouter.
- No raw LLM HTML; validate GitHub URLs server-side; public repos only.
- No accounts/subscriptions/paywall/global-daily-budget. Never commit secrets.

## Deployment
Railway (`railway.json`, NIXPACKS, `npm run start`, healthcheck `/api/health`). Provision a
Postgres instance, run `npm run migrate`, and set the env vars above in Railway Variables.
The `.github/workflows/trending.yml` cron drives the Weekly Top 10 jobs (needs `APP_URL` + `CRON_SECRET`).
