# Launch Quality Gate — What's in it?

Date: 2026-06-04 · Scope: PHASE-1 … PHASE-7 (live-ready build)

## Gate results (this environment)

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | ✅ pass (clean) |
| Unit/integration tests | `npm test` | ✅ 74 passed (9 files) |
| Build | `npm run build` | ✅ pass (39 routes; static/SSG/dynamic) |
| Dependency audit | `npm audit` | ⚠ see "Security" below |

## Definition of Done

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| DOD-001 | P0 acceptance criteria pass | ✅ | tests (cache/lock/schema/jobs/seo/redirects) |
| DOD-002 | Direct Gemini key removed from production path | ✅ | `analyze.ts` deleted; only `openRouterAnalyzer`; grep clean |
| DOD-003 | OpenRouter key server-only | ✅ | `openrouter.ts` server adapter; routes/page `runtime="nodejs"`; no client import |
| DOD-004 | Cache-hit never calls OpenRouter | ✅ (logic) | `analysis-service.test.ts` |
| DOD-005 | Concurrent same repo → max one OpenRouter call | ✅ (logic) | lock test |
| DOD-006 | No raw LLM HTML | ✅ | `dangerouslySetInnerHTML` removed; grep + schema test |
| DOD-007 | `/github*` + trending have no OpenRouter dependency | ✅ | `knowledge.test.ts` import guard; `trending.ts` |
| DOD-008 | SEO/legal files exist or marked | ✅ | robots/sitemap/ads.txt + 5 legal pages (placeholders marked) |
| DOD-009 | Rollback plan reviewed | ✅ | `migrations/0001_init.down.sql`; ROLLBACK notes in PRD |
| DOD-010 | No unresolved BLOCKER before production | ⚠ | see "Open items" — all user-accepted or deploy-time |

## Reality Ledger (honest evidence class)

**Tests prove internal correctness, not that the assembled system delivers value.**
The three real external boundaries are NOT exercised in this build environment
(no secrets/DB present). They are written and unit/contract-tested, and must be
validated once deployed.

| Capability | Evidence class | wired-in-prod? | Note |
|---|---|---|---|
| repo-normalize, scoring, schema validation | unit (real logic) | ✅ | pure functions, fully tested |
| Cache / lock / rate-limit / bot flow | integration-fake (in-memory store) | ⚠ RED | logic proven on memory fake; **Postgres adapter (`pg-stores.ts`) NOT run against a live DB here** |
| OpenRouter analysis | contract (mocked fetch) | ⚠ RED | **never called a real OpenRouter endpoint** (no API key in env) |
| GitHub fetch / trending candidates | contract (mocked fetch) | ⚠ RED | live GitHub API not exercised here |
| Static knowledge hub, legal, robots/sitemap/ads.txt | production-verified | ✅ | actually prerendered by `npm run build` |
| Homepage Weekly Top 10 | seed-fallback only | ⚠ | live DB path renders only after migrate + cron run |

### Required post-deploy validation (do before public launch)
1. Provision Railway Postgres, set `DATABASE_URL`, run `npm run migrate`.
2. Set `OPENROUTER_API_KEY`, `HASH_SALT`, `CRON_SECRET`, `GITHUB_TOKEN`, `SITE_URL`.
3. Smoke-test one real analysis (`/analyse/vercel/next.js`) → confirms OpenRouter + Postgres cache.
4. Re-request the same repo → confirm cache hit (no second OpenRouter call) in `usage_events`.
5. Trigger `update-trending-snapshots` then `update-weekly-trending` → confirm homepage Top 10 populates.
6. Verify `/robots.txt`, `/sitemap.xml`, `/ads.txt` respond.

## Security

- Secrets server-side only; never logged (only an "is not set" warning for `HASH_SALT`).
- usage_events store HMAC hashes, never raw IP/user-agent.
- `/api/jobs/*` require Bearer `CRON_SECRET` (timing-safe), fail closed if unset.
- GitHub URLs validated at the trust boundary (SSRF-safe); public repos only.
- `npm audit`: `next`→ transitive `postcss` (2 moderate) is **build-time only**, not exploitable
  (we process no untrusted CSS). `vitest` (1 critical) is **dev-only** and exploitable only via
  `vitest --ui`, which we never run (CI uses `vitest run`). Recommended follow-up: upgrade
  `vitest` to v4 in a dedicated PR (breaking-major; deferred to avoid pre-launch test churn).

## Open items (user-accepted or deploy-time, not code blockers)
- Legal owner details in /impressum, /privacy, /contact are `[PLATZHALTER]` (user-approved). Fill + legal review before AdSense.
- AdSense publisher ID (MISSING-005): ads disabled until `ADSENSE_PUBLISHER_ID` + `NEXT_PUBLIC_ADS_ENABLED=true`.
- Consent Management Platform (MISSING-007): placeholder; required for EWR/UK/CH before enabling ad cookies.
- OpenRouter model slug confirmed as `google/gemini-2.5-flash` (env-overridable); verify availability at deploy.
