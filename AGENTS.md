# AGENTS.md — Operating rules for coding agents

Single source of truth: `docs/prd/whats-in-it-live-ready-full.prd.md`.

## What this project is
"What's in it?" — a free, ad-financed, **no-account / no-paywall** German GitHub
Repository Intelligence & Knowledge Hub built on the existing Next.js 16 app.
Continue the project; never rebuild from scratch.

## Read order
1. `AGENTS.md` (this file)
2. `docs/prd/whats-in-it-live-ready-full.prd.md`
3. `CLAUDE.md` (current implementation notes)
4. `docs/ARCHITECTURE.md`, `docs/PRD.md`

## Non-negotiable rules
- Use `OPENROUTER_API_KEY` (server-side) for analysis — never a direct Gemini key.
  Gemini is only a model slug behind OpenRouter (`OPENROUTER_MODEL`).
- Cache-hit for a `repo_key` must never call OpenRouter.
- Concurrent requests for the same `repo_key` trigger at most one OpenRouter call (analysis lock).
- `/github*` knowledge pages and trending jobs must never import or call OpenRouter.
- No raw LLM HTML, no `dangerouslySetInnerHTML` for LLM/README-derived content.
- No user profiles, subscriptions, credits, paywall, or global daily LLM budget in MVP.
- Secrets server-side only; never log `OPENROUTER_API_KEY`, `CRON_SECRET`, `HASH_SALT`, raw IP/user-agent.
- Validate GitHub URLs at the server trust boundary; public repos only.

## Architecture
Ports & Adapters inside Next.js: UI → application services → domain → ports → adapters.
External services (GitHub, OpenRouter, DB) behind interfaces. No business logic in React components.

## Commands
- `npm run lint`
- `npm test`
- `npm run build`

## Stop and ask before
choosing DB provider/ORM, destructive migrations, framework upgrades, accounts/payments,
global daily budget, direct Gemini key, client-side OpenRouter, finalizing legal text,
ad placement next to copy/CTA buttons.

## Phases (execute sequentially; stop only on a defined BLOCKER)
1 Foundation & cleanup · 2 Persistent cache/rate-limit/bot/lock · 3 OpenRouter + safe schema ·
4 Knowledge hub · 5 Weekly Top 10 · 6 AdSense/SEO/legal · 7 Tests, hardening, launch review.
