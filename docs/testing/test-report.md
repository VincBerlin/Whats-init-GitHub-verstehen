# Test Report — What's in it?

Date: 2026-06-04 · `npm test` → 74 tests, 9 files, all passing.

| Test file | PRD link | Covers |
|---|---|---|
| `src/lib/repo-normalize.test.ts` (22) | TEST-001, FR-001/002, SEC-004 | URL normalization + SSRF/malformed rejection |
| `src/lib/analysis-service.test.ts` (8) | TEST-002/003/008, AC-001/002/003/004 | cache-first, lock concurrency, bot/rate-limit guards, hashing, failure recovery |
| `src/lib/analysis-schema.test.ts` (8) | TEST-005, FR-008/009, SEC-006 | zod validation, markdown-fence parsing, fact injection, no-HTML |
| `src/lib/openrouter.test.ts` (4) | TEST-004, API-003 | OpenRouter contract (mocked), error mapping, server-side key |
| `src/data/knowledge.test.ts` (7) | TEST-006, FR-016 | unique slugs, related-slug resolution, no-LLM-import guard, non-thin content |
| `src/lib/trending-score.test.ts` (5) | TEST-007/010 | momentum scoring + ranking |
| `src/lib/trending.test.ts` (10) | TEST-010, API-005/006, SEC-003 | snapshot/weekly jobs, idempotency, cron auth, week bounds |
| `src/lib/seo.test.ts` (8) | TEST-011, FR-019/020/021 | robots/sitemap/ads.txt, ad-policy, legal-page existence |
| `src/lib/redirects.test.ts` (2) | TEST-012, FR-011/012 | legacy /lernen, /wiki → /github redirects |

## Not covered here (require live secrets/DB — see Reality Ledger)
- Postgres adapter behavior against a real database (TEST-002/008 at the real boundary).
- Real OpenRouter call (TEST-004 real boundary).
- Live GitHub API + end-to-end browser (TEST-009/011 e2e). MISSING: e2e runner command (Playwright recommended as a follow-up).
