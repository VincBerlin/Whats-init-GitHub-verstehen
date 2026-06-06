# Vision Sprint — Final Quality Gate (PHASE-8)

Date: 2026-06-06 · Branch: `vision-sprint` · Source: `WHATS_IN_IT_PLANUNG_VISION_PRD.md`

## Gates (this environment)
| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | ✅ clean |
| Unit/integration | `npm test` | ✅ 91 passed (12 files) |
| Build | `npm run build` | ✅ pass (homepage dynamic; knowledge SSG; legal/SEO static) |
| E2E smoke | `npm run test:e2e` | ✅ 8 passed (chromium, prod build) |

## Definition of Done
| ID | Item | Status |
|---|---|---|
| DOD-001 | Search: URL/owner-repo + knowledge terms | ✅ FR-001/002, e2e |
| DOD-002 | Dead mockup cards removed | ✅ FR-004 |
| DOD-003 | Light mode readable | ✅ token + accent-contrast overrides (FR-016) |
| DOD-004 | Daily Top 5 under search, 5 horizontal | ✅ FR-005/006 |
| DOD-005 | Weekly Top 10 below Daily, layout kept | ✅ |
| DOD-006 | Niche Finds, not star-dominant | ✅ nicheQualityScore tests |
| DOD-007 | Daily/Weekly/Niche = GitHub API + Postgres only | ✅ no-LLM guard test |
| DOD-008 | Discovery schedulable, CRON_SECRET-protected | ✅ /api/jobs/* + cron workflow |
| DOD-009 | Homepage no GitHub/OpenRouter on pageview | ✅ DB-read only |
| DOD-010 | /github categorized, no chaotic pills | ✅ FR-012 |
| DOD-011 | Topic metadata for all topics | ✅ taxonomy enrichment test |
| DOD-012 | Encyclopedia backlog represented | ✅ +5 topics, docs/content/backlog.md |
| DOD-013 | Navigation explains Analyze/Git/Discover… | ✅ |
| DOD-014 | DE/EN staged, route-safe | ✅ toggle + i18n arch (PHASE-6) |
| DOD-015 | AdSlot policy prevents risky placements | ✅ ad-policy tests |
| DOD-016 | No fake rankings as real | ✅ honest fallbacks / `is_fallback` |
| DOD-017 | Legal/Consent/AdSense blockers documented | ✅ adsense-readiness.md |
| DOD-018 | lint/test/build pass | ✅ |
| DOD-019 | E2E smoke passes | ✅ |
| DOD-020 | No new secrets committed/logged | ✅ |

## Reality Ledger (honest — what is vs isn't live-verified here)
- **Unit/build/e2e verified:** search routing, niche/daily scoring (not star-dominant),
  no-LLM-in-discovery guard, taxonomy, ad policy, all pages render (e2e), SSG preserved.
- **Needs live DB + run (not exercised here):**
  - Migration `0002_rankings.sql` against the real Postgres (`npm run migrate`).
  - First `update-daily-discovery` job run → real Daily/Niche rankings (homepage shows seed until then).
  - `RankingStore` pg adapter against live DB (covered by memory-fake tests only).
- **Operator/legal before public AdSense:** legal `[PLATZHALTER]`, CMP, publisher id, PageSpeed.

## Required deploy step for this sprint
Run the new migration before/with deploy:
```bash
DATABASE_URL="<public url>" npm run migrate   # applies 0002_rankings.sql
```
Then trigger `POST /api/jobs/update-daily-discovery` (Bearer CRON_SECRET) once so Daily Top 5 + Niche populate.

## Commits (vision-sprint)
vision-1 search/cards/light · vision-3 daily backend + rankings · vision-2 homepage layout ·
vision-4 taxonomy · vision-5 content · vision-6 i18n · vision-7 adsense · vision-8 final gate.
