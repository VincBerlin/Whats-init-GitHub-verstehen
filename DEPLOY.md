# Deploy & Launch Readiness — What's in it?

This document covers deploying the existing Next.js app to Railway, running the DB
migration, and the smoke/launch checklist. No secrets are committed; all secrets are
set in the Railway dashboard.

## 1. Railway configuration

`railway.json` (already in repo) defines the deploy:

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

- Builder: NIXPACKS (auto-detects Node). Start command is `npm run start` (`next start`).
- Node `>=20.9.0` (see `package.json` `engines`).
- Healthcheck: `GET /api/health`.

### Postgres service (manual — required)
Persistent cache, locks, usage events and trending need Postgres.

1. In the Railway project: **New → Database → PostgreSQL**.
2. Railway exposes a connection string. Set it as the app's `DATABASE_URL` variable
   (use the **private** networking URL if app + DB are in the same project).
3. Without `DATABASE_URL` the app falls back to in-memory stores (dev only, NOT
   persistent) — never run production without Postgres.

## 2. Environment variables (set in Railway → Variables)

Never hardcode or commit real values. Template: `.env.example`.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string (from the Railway Postgres service) |
| `OPENROUTER_API_KEY` | yes | Server-side LLM key (analysis). Never exposed to the client |
| `OPENROUTER_MODEL` | recommended | Model slug; default `google/gemini-2.5-flash` |
| `OPENROUTER_BASE_URL` | optional | Default `https://openrouter.ai/api/v1` |
| `HASH_SALT` | yes | HMAC salt for abuse-monitoring hashes (must be stable in prod) |
| `CRON_SECRET` | yes | Bearer secret for `/api/jobs/*` cron routes |
| `GITHUB_TOKEN` | recommended | Raises GitHub API rate limit 60 → 5000/h |
| `SITE_URL` | recommended | Public base URL for `robots.txt` / `sitemap.xml` (e.g. `https://whatsinit.app`) |
| `DATABASE_SSL` | optional | `true` for external/SSL Postgres |
| `NEXT_PUBLIC_ADS_ENABLED` | optional | `true` only after AdSense approval (ads stay off otherwise) |
| `ADSENSE_PUBLISHER_ID` | optional | `pub-XXXX…`; required for real `ads.txt` + ad slots |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | optional | `ca-pub-XXXX…` AdSense client for `<ins>` slots |

> Note: the ad flag is **`NEXT_PUBLIC_ADS_ENABLED`** (with `D`). Ads render only when
> both `NEXT_PUBLIC_ADS_ENABLED=true` and a publisher id are set.

## 3. Database migration

The migration runner applies `migrations/*.sql` in order, tracked in `schema_migrations`.

```bash
# locally against the Railway DB, or in a Railway one-off shell:
DATABASE_URL="postgres://…" npm run migrate
```

Idempotent and safe to re-run. Rollback for the initial schema: `migrations/0001_init.down.sql`
(destructive — review before running, per ROLLBACK-001).

## 4. Deploy checklist (in order)

1. [ ] Create Railway **Postgres** service.
2. [ ] Set `DATABASE_URL` (+ all required env vars above).
3. [ ] Run `npm run migrate` against `DATABASE_URL`.
4. [ ] Deploy the app (push to the connected branch / `railway up`).
5. [ ] Check health: `GET /api/health` returns ok.
6. [ ] Run a first analysis: open `/analyse/vercel/next.js` (or POST `/api/analyze`).
7. [ ] Run the **same** analysis again.
8. [ ] Verify in `usage_events`: the second request is a `cache_hit` and produced
       **no** new `openrouter_call` (cost-control invariant).
9. [ ] Trigger trending jobs (or run the GitHub Actions `Trending Jobs` workflow):
       `POST /api/jobs/update-trending-snapshots` then `/api/jobs/update-weekly-trending`
       with `Authorization: Bearer $CRON_SECRET` → homepage Weekly Top 10 populates.
10. [ ] Verify `/robots.txt`, `/sitemap.xml`, `/ads.txt` respond.

### Manual OpenRouter live check (real boundary)
```bash
curl -s -X POST "$SITE_URL/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/vercel/next.js"}' | head
# Expect: {"status":"ok","source":"new_analysis",...}; repeat → "source":"cache".
```

## 5. E2E smoke tests (Playwright)

```bash
npm run test:e2e:install   # one-time: download chromium (+ deps)
npm run build              # e2e runs against the production build
npm run test:e2e           # starts `npm run start` and runs e2e/smoke.spec.ts
# Or against an already-running/deployed app:
E2E_BASE_URL="https://your-app.up.railway.app" npm run test:e2e
```

The smoke suite checks: home loads, GitHub URL submission reaches `/analyse/...`,
`/github` + `/github/shortcuts` + `/github/trending` + a knowledge detail page load,
legal pages load, and `robots.txt`/`sitemap.xml`/`ads.txt` respond. It does **not**
call OpenRouter for real and does not require DB/secrets.

## 6. Final launch checklist

### Automatically tested (CI: `npm run lint && npm run test && npm run build`)
- URL normalization / SSRF rejection, cache-first + lock + rate-limit + bot logic,
  schema validation, OpenRouter adapter contract (mocked), knowledge-data integrity,
  trending scoring + jobs + cron auth, robots/sitemap/ads.txt/ad-policy, legacy redirects.
- E2E smoke (Playwright) for public pages (run separately).

### Only statically verified (build prerender)
- Knowledge hub pages, legal/trust pages, `robots.txt`, `sitemap.xml`, `ads.txt`.

### Must be verified manually before go-live (real boundaries — not exercised in CI)
- [ ] Postgres adapter against the real DB (cache survives restart; lock works).
- [ ] Real OpenRouter analysis succeeds; second call is a cache hit.
- [ ] Live GitHub fetch + trending jobs populate the Weekly Top 10.

### Placeholders to replace before AdSense / go-live
- [ ] `/impressum`, `/privacy`, `/contact`: replace all `[PLATZHALTER]` (owner name,
      address, e-mail) and have the legal texts reviewed.
- [ ] `ads.txt`: set `ADSENSE_PUBLISHER_ID` (real entry appears automatically).
- [ ] Consent Management Platform for EWR/UK/CH before enabling ad cookies (MISSING-007).

### Env vars still required at deploy time
- [ ] `DATABASE_URL`, `OPENROUTER_API_KEY`, `HASH_SALT`, `CRON_SECRET`
      (hard-required); `GITHUB_TOKEN`, `SITE_URL`, `OPENROUTER_MODEL` (recommended).

### Known accepted risks
- `npm audit`: `postcss` (via `next`, 2 moderate) is build-time only and not
  exploitable here (no untrusted CSS). `vitest` (1 critical) is dev-only and only via
  `vitest --ui`, which is never run. Follow-up: upgrade `vitest` to v4 in a separate PR.
