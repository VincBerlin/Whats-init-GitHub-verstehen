# Execution Addendum — Existing Project Must Be Completed to Live-Ready State

Status: authoritative addendum for Claude/Cursor implementation.  
Date: 2026-06-04  
Language: de-DE  
Mode: continue the existing project, do not rebuild from scratch.

## Execution Policy

Claude must work through the full project sequentially until the defined live-ready goal is reached. The agent must not stop after the first phase. The agent must only stop for a defined `BLOCKER`, such as missing database/storage decision, destructive migration risk, missing required secrets for a feature that cannot be mocked, or an unresolved security conflict.

Implementation order:

```text
PHASE-1 Foundation and cleanup
PHASE-2 Persistent cache, repo normalization, usage events, rate-limit, bot-protection, analysis lock
PHASE-3 OpenRouter migration and safe structured analysis schema
PHASE-4 GitHub knowledge hub and shortcuts from supplied encyclopedia
PHASE-5 Weekly Top 10 with stored snapshots and scoring
PHASE-6 AdSense, SEO, legal, robots, sitemap, ads.txt, launch UX
PHASE-7 Tests, hardening, launch review, final report
```

## Non-Negotiable Product Rules

- Continue the existing Next.js project; do not replace it with a new app.
- Use `OPENROUTER_API_KEY`, not direct `GEMINI_API_KEY`, for production analysis.
- Gemini is only the selected model behind OpenRouter.
- No user profiles, no subscriptions, no credit purchase, no paywall in MVP.
- No global daily LLM budget in MVP.
- Static `/github` knowledge pages and `/github/trending` must never call OpenRouter.
- Cache-hit for a `repo_key` must never call OpenRouter.
- Same `repo_key` under concurrent requests must trigger at most one OpenRouter call.
- No raw LLM HTML and no `dangerouslySetInnerHTML` for LLM-generated content.
- The website is intended to go live; launch, security, SEO, legal, robots, sitemap, ads.txt, and ad-placement constraints are part of the Definition of Done.

---

# What’s in it? — Live-Ready GitHub Repository Intelligence & Knowledge Hub — AI-Native PRD

Version: 1.1-live-ready  
Date: 2026-06-04  
Language: de-DE  
Primary agent target: Claude Code / Cursor / repository coding agent  
Source files:
- `docs/source/whats-in-it_projektzusammenfassung_aufbau.md`
- `docs/source/Git_GitHub_Systemarchitektur_Enzyklopaedie.md`

---

## 1. Executive Summary

```text
Purpose:
Build “What’s in it?” into a free, ad-financed GitHub Repository Intelligence & Knowledge Hub.

Target users:
German-speaking GitHub beginners from ~16 years old, self-taught developers, founders, students, and developers who want fast repository understanding.

Business objective:
Generate organic and recurring traffic through repository analysis pages, Git/GitHub knowledge pages, terminal workflow pages, and Weekly Top 10 repositories; monetize through clean publisher ads, not profiles, subscriptions, credits, or paywalls.

Implementation approach:
Preserve the current Next.js app foundation, remove old hardcoded academy/wiki routes, introduce a persistent analysis cache, migrate direct Gemini usage to OpenRouter with a Gemini model slug, create structured Git/GitHub knowledge data modules from the provided encyclopedia, and add Weekly Top 10 based on GitHub API snapshots.

Primary constraints:
No user profiles. No subscriptions. No paywall. No global daily budget in MVP. OpenRouter server-side only. No raw LLM HTML. Gemini/OpenRouter must run only on cache miss and never for static knowledge or trending.

Current readiness:
CONDITIONAL PASS. Product direction is clear; implementation requires database choice verification, migration planning, OpenRouter adapter, cache-first enforcement, security guardrails, and test coverage before public launch.
```

Top 3 risks:
1. `RISK-001`: Duplicate or abusive analysis calls can create OpenRouter costs if cache, rate-limit, bot protection, and repo locks are incomplete.
2. `RISK-002`: Rendering LLM-generated HTML can introduce XSS. `seoDeepDiveHtml` must be removed.
3. `RISK-003`: If the encyclopedia is pasted as one long page instead of structured data, the platform becomes thin, hard to navigate, and weak for SEO/AdSense review.

Top 3 missing items:
1. `MISSING-001`: Final database and migration tool are not confirmed.
2. `MISSING-002`: Exact package scripts and test tooling must be verified in `package.json`.
3. `MISSING-003`: Final OpenRouter model slug must be verified against the active OpenRouter model catalog before deployment.

---

## 2. Problem Statement

```text
Problem:
Most GitHub repositories are difficult for non-experts to understand quickly. Users often cannot tell what a repository does, whether it is trustworthy, how to install it, what commands to run, or whether it is active.

Who experiences it:
Beginners, students, founders, self-taught developers, non-technical decision-makers, and developers evaluating unfamiliar repositories.

Current pain:
Users must manually read README files, GitHub metadata, issues, commands, and project structure. Beginners also lack a practical Git/GitHub command reference organized by intent.

Cost of not solving:
The existing MVP remains a thin AI analyzer with repeated LLM cost risk, weak SEO depth, and limited AdSense-readiness.

Why now:
The existing app already has a repo-analysis foundation. The two supplied source files define the product direction and the knowledge corpus needed to turn it into a broader GitHub intelligence platform.
```

---

## 3. Goals and Non-Goals

### Goals

| ID | Goal | Metric / verification | Source |
|---|---|---|---|
| GOAL-001 | Allow public users to analyze any public GitHub repository without an account. | `/analyse/[owner]/[repo]` returns either cached analysis or a newly persisted analysis for valid public GitHub repos. | user-provided |
| GOAL-002 | Prevent duplicate LLM/OpenRouter costs for the same repository. | Same normalized `repo_key` returns cached analysis without OpenRouter call. | user-provided |
| GOAL-003 | Use OpenRouter, not direct Gemini API key, as the LLM provider. | Direct Gemini SDK/key removed from production analysis path; `OPENROUTER_API_KEY` used server-side. | user-provided |
| GOAL-004 | Build a structured Git/GitHub knowledge hub from the supplied encyclopedia. | `/github`, `/github/[slug]`, `/github/shortcuts`, `/github/commands`, `/github/actions`, `/github/cli` exist and render structured data. | user-provided |
| GOAL-005 | Add Weekly Top 10 repositories directly on the homepage. | Homepage renders stored weekly top 10 from database/cache, not live GitHub fetch per page view. | user-provided |
| GOAL-006 | Maintain AdSense-first UX and content quality. | Required legal/trust pages, `robots.txt`, `sitemap.xml`, `ads.txt`, and safe ad slots exist. | user-provided |
| GOAL-007 | Keep the platform free and profile-free in MVP. | No login, account, subscription, credits, or paywall added. | user-provided |

### Non-Goals

| ID | Non-goal | Rationale |
|---|---|---|
| NOGOAL-001 | No user accounts/profiles in MVP. | The business model is ad-financed public usage. |
| NOGOAL-002 | No subscriptions, credit purchases, or paywall in MVP. | User explicitly rejected this model. |
| NOGOAL-003 | No global daily budget in first implementation. | User explicitly requested “erstmal ohne Tagesbudget”. |
| NOGOAL-004 | No automatic LLM analysis for Trending/Weekly Top 10. | Trending must not create automatic OpenRouter/Gemini costs. |
| NOGOAL-005 | No raw markdown encyclopedia dump as a single page. | Knowledge must become structured, navigable, SEO-ready content. |
| NOGOAL-006 | No private GitHub repository analysis in MVP. | Avoid auth complexity and sensitive access. |
| NOGOAL-007 | No ads that imitate buttons, block content, or encourage clicks. | AdSense policy risk and poor UX. |

---

## 4. Stakeholders and Users

| Role | Type | Needs | Permissions | Success criteria |
|---|---|---|---|---|
| Public visitor | user | Understand a repo and Git/GitHub workflows without account. | Read public pages; submit public GitHub URL. | Can analyze or view cached analysis and copy commands. |
| Beginner user | user | Age-16-level explanations. | Same as visitor. | Understands what a repo does and which commands to run. |
| Developer user | user | Fast technical evaluation and command references. | Same as visitor. | Gets useful quality/risk/install summary. |
| Site owner | stakeholder/admin | Cost control, SEO traffic, AdSense-readiness. | Operational access outside app UI. | No duplicate LLM costs for same repo; high content quality. |
| Coding agent Claude/Cursor | system implementer | Agent-executable tasks, boundaries, tests, stop conditions. | May edit repository files within task scope. | Implements phases without guessing core behavior. |
| OpenRouter | external system | Receives server-side analysis requests. | API call only via server secret. | Returns strict JSON matching schema. |
| GitHub API | external system | Provides public repo metadata and README. | Public unauthenticated or token-authenticated read. | Metadata fetched safely and rate-limited. |
| AdSense/ads crawler | external system | Crawl content and verify policy-safe site. | Read public pages. | Not blocked by robots.txt where required. |

---

## 5. Definitions and Domain Glossary

| ID | Term | Definition | Notes |
|---|---|---|---|
| TERM-001 | Repo analysis | Structured explanation of one public GitHub repository. | Stored under normalized `repo_key`. |
| TERM-002 | repo_key | Canonical lowercase `owner/repo` identifier. | Example: `vercel/next.js`. |
| TERM-003 | Cache hit | Existing persisted analysis found for `repo_key`. | Must not call OpenRouter. |
| TERM-004 | Cache miss | No valid persisted analysis exists. | May call OpenRouter after safety checks. |
| TERM-005 | OpenRouter adapter | Server-side abstraction calling OpenRouter Chat Completions with a Gemini model slug. | Replaces direct Gemini key usage. |
| TERM-006 | Knowledge item | Structured Git/GitHub content entry rendered on `/github/[slug]`. | Generated from supplied encyclopedia. |
| TERM-007 | Command workflow | Practical “Ich will …” terminal workflow with copyable commands. | Example: project start, push, pull, aliases. |
| TERM-008 | Weekly Momentum Score | Ranking score based on weekly repo growth and quality signals. | No LLM usage. |
| TERM-009 | Analysis lock | Server-side lock preventing two simultaneous OpenRouter calls for same `repo_key`. | Required for concurrency cost control. |
| TERM-010 | No raw LLM HTML | LLM output cannot be rendered as HTML. | React renders typed fields only. |

---

## 6. Assumptions, MISSING, Open Questions, Blockers

### Assumptions

| ID | Assumption | Reason | Validation method |
|---|---|---|---|
| ASSUMPTION-001 | The existing app uses Next.js App Router, React, TypeScript, Tailwind, `/api/analyze`, `/api/health`, and `/analyse/[owner]/[repo]`. | Stated in supplied project summary. | Inspect repository. |
| ASSUMPTION-002 | OpenRouter model slug for MVP is `google/gemini-2.5-flash`. | User wants Gemini behind OpenRouter; this slug appears in OpenRouter model catalog. | Verify model availability before deployment. |
| ASSUMPTION-003 | A relational DB is acceptable for persistent cache and trending snapshots. | Tables are specified in the project summary. | Confirm existing DB/migration tooling. |
| ASSUMPTION-004 | Usage monitoring stores hashed IP/session/user-agent only, not profiles. | Needed for rate-limit and abuse protection without accounts. | Security review. |
| ASSUMPTION-005 | Analysis pages are indexable only after valid analysis content exists. | Supports SEO while avoiding thin pages. | Sitemap tests. |

### MISSING

| ID | Missing information | Why it matters | Required before |
|---|---|---|---|
| MISSING-001 | Final database provider and migration tool. | Claude must not invent migrations or ORM. | PHASE-2 |
| MISSING-002 | Exact current file tree. | Task file boundaries depend on actual repo structure. | Before edits |
| MISSING-003 | Exact package manager and scripts. | Validation commands need confirmation. | Before running tests |
| MISSING-004 | Final OpenRouter model slug and fallback model policy. | Model availability and structured-output support can change. | PHASE-3 |
| MISSING-005 | AdSense publisher ID. | Required for final `ads.txt` after approval. | PHASE-6 |
| MISSING-006 | Legal text owner/company details for Impressum/privacy/contact. | Required for production legal pages. | PHASE-6 |
| MISSING-007 | Consent Management Platform decision for EWR/UK/Switzerland. | Ads/cookies consent compliance. | PHASE-6 |
| MISSING-008 | Seed repositories for first Weekly Top 10. | Trending needs initial candidate set. | PHASE-5 |

### Open Questions

| ID | Question | Owner | Decision needed by |
|---|---|---|---|
| OPEN-001 | Which DB stack exists: Prisma, Drizzle, raw SQL, Supabase, Railway Postgres, other? | User/dev | PHASE-2 |
| OPEN-002 | Should cached analyses ever become stale automatically, or only manually refreshed later? | User/dev | PHASE-2/P5 |
| OPEN-003 | Should OpenRouter use only one Gemini model or allow a configured fallback list? | User/dev | PHASE-3 |
| OPEN-004 | Should language remain German-only for MVP? | User/dev | PHASE-4 |

### Blockers

| ID | Blocker | Impact | Resolution path |
|---|---|---|---|
| BLOCKER-001 | Unknown DB/migration stack blocks safe persistent cache implementation. | Agent may invent schemas or break deployment. | Inspect repo and ask/choose DB before migration. |
| BLOCKER-002 | Missing legal owner details block production-ready Impressum/privacy pages. | AdSense/legal readiness incomplete. | User provides details or placeholders remain non-production. |

---

## 7. Product Scope

### In scope

| ID | Scope item | Notes |
|---|---|---|
| SCOPE-001 | Public GitHub URL analysis. | Only public `github.com/owner/repo`. |
| SCOPE-002 | OpenRouter-based LLM analysis. | Gemini via OpenRouter. |
| SCOPE-003 | Persistent analysis cache. | Prevent duplicate LLM costs. |
| SCOPE-004 | Rate-limit, bot protection, analysis lock. | No global daily budget. |
| SCOPE-005 | Git/GitHub knowledge hub. | Structured static/data-driven content. |
| SCOPE-006 | Command workflows and shortcuts. | Copyable terminal flows. |
| SCOPE-007 | Weekly Top 10. | Snapshot/scoring, no LLM. |
| SCOPE-008 | AdSense-ready structure. | Trust pages, robots, sitemap, ads slots. |
| SCOPE-009 | Tests and agent handoff. | Required for safe Claude/Cursor execution. |

### Out of scope

| ID | Out-of-scope item | Rationale |
|---|---|---|
| OUT-001 | User profiles/accounts. | User explicitly rejected. |
| OUT-002 | Payment integration/subscription. | User explicitly rejected. |
| OUT-003 | Daily global LLM budget. | User requested not now. |
| OUT-004 | Private repo analysis. | Requires GitHub auth and data sensitivity. |
| OUT-005 | Browser-side OpenRouter calls. | Would expose API key. |
| OUT-006 | AI generation of knowledge pages at request time. | Static content must be free to render. |

---

## 8. User Journeys

```text
JOURNEY-001: Analyze a public GitHub repository
Actor: Public visitor
Goal: Understand a GitHub repository quickly.
Preconditions: Valid public GitHub URL is provided.
Main path:
  1. User enters GitHub URL on homepage.
  2. System normalizes to repo_key.
  3. System checks persistent cache.
  4. If hit, cached analysis is rendered.
  5. If miss, rate-limit, bot protection, and lock checks pass.
  6. System fetches GitHub metadata and README.
  7. System calls OpenRouter Gemini through server-side adapter.
  8. System validates strict JSON and persists analysis.
  9. Analysis page renders typed sections.
Alternative paths: Cache hit, analysis-in-progress, invalid URL.
Failure paths: Rate limit blocked, bot blocked, GitHub fetch failed, OpenRouter failed, JSON validation failed.
Data touched: analysis_cache, usage_events, analysis_locks.
Security implications: No secrets exposed; no raw HTML; only public GitHub data.
Acceptance link: AC-001, AC-002, AC-003, AC-004, AC-005.
```

```text
JOURNEY-002: Learn a Git/GitHub command workflow
Actor: Beginner user
Goal: Copy correct commands for a practical goal.
Preconditions: User opens /github/shortcuts or homepage preview.
Main path:
  1. User selects “Ich will ein Projekt auf GitHub hochladen”.
  2. System displays beginner explanation, commands, risks, common mistakes.
  3. User copies commands.
Alternative paths: User navigates to related commands.
Failure paths: Copy action unavailable; content missing.
Data touched: static data modules only.
Security implications: No LLM call, no data write.
Acceptance link: AC-009, AC-010.
```

```text
JOURNEY-003: Discover Weekly Top 10 repositories
Actor: Public visitor
Goal: See strong GitHub repositories this week.
Preconditions: Weekly top data exists.
Main path:
  1. User visits homepage.
  2. System renders stored Weekly Top 10.
  3. User clicks repo to view or trigger analysis.
Alternative paths: Empty state if no weekly data yet.
Failure paths: DB unavailable; fallback static seed list.
Data touched: weekly_top_repositories, repo_snapshots.
Security implications: No LLM call.
Acceptance link: AC-011, AC-012.
```

```text
JOURNEY-004: Search GitHub knowledge
Actor: Public visitor
Goal: Find a Git/GitHub concept.
Preconditions: /github data modules exist.
Main path:
  1. User enters query or selects category.
  2. System filters static knowledge items.
  3. User opens /github/[slug].
Alternative paths: No result suggests related categories.
Failure paths: Missing slug returns 404 with navigation.
Data touched: static data modules only.
Security implications: No LLM call.
Acceptance link: AC-013.
```

---

## 9. AI-ready User Stories

```text
STORY-001: Cache-first repository analysis
Actor: Public visitor
Intent: Analyze or view a GitHub repository.
Business value: Reduces repeated OpenRouter costs and creates reusable SEO pages.
Preconditions: Public repo URL is valid.
Trigger: User submits a GitHub URL.
Given/When/Then:
  - Given analysis_cache contains repo_key
    When the user requests analysis
    Then the cached analysis is returned and OpenRouter is not called.
  - Given analysis_cache has no repo_key
    When safety checks pass
    Then OpenRouter is called exactly once and result is persisted.
Input examples:
  - Input: https://github.com/vercel/next.js
    Expected output: /analyse/vercel/next.js renders analysis.
Technical constraints: Cache check must occur before any OpenRouter request.
NFR links: NFR-001, NFR-002, NFR-005.
Edge cases: URL casing, trailing slash, `.git`, simultaneous requests.
Failure modes: invalid_url, rate_limited, bot_blocked, github_fetch_failed, llm_failed, validation_failed.
Test ideas: TEST-001, TEST-002, TEST-003.
Dependencies: DATA-001, API-001, ARCH-002.
```

```text
STORY-002: OpenRouter Gemini analysis with strict JSON
Actor: System
Intent: Generate structured repository analysis without raw HTML.
Business value: Keeps analysis useful, parseable, safe, and renderable.
Preconditions: Cache miss and safety checks passed.
Trigger: Analysis service invokes LLM adapter.
Given/When/Then:
  - Given valid repo metadata and README excerpt
    When OpenRouter responds
    Then response matches AnalysisResult schema and is saved.
  - Given response does not match schema
    When validation runs
    Then analysis is rejected and no invalid analysis page is stored.
Input examples:
  - Input: GitHubRepo metadata + README text
    Expected output: AnalysisResult JSON with scores, concerns, installation, FAQ.
Technical constraints: Use OpenRouter server-side only; no direct Gemini key; no `dangerouslySetInnerHTML`.
NFR links: NFR-004, NFR-006.
Edge cases: model unavailable, invalid JSON, truncated README, missing README.
Failure modes: openrouter_error, schema_validation_error.
Test ideas: TEST-004, TEST-005.
Dependencies: API-003, SEC-001, ARCH-002.
```

```text
STORY-003: GitHub shortcuts and command workflows
Actor: Beginner user
Intent: Learn practical Git/GitHub workflows.
Business value: Creates evergreen SEO content and utility without LLM cost.
Preconditions: Structured command data exists.
Trigger: User opens /github/shortcuts.
Given/When/Then:
  - Given command workflow data exists
    When user opens a workflow
    Then the page shows goal, explanation, commands, risks, mistakes, and copy buttons.
Input examples:
  - Input: /github/shortcuts#push-pull
    Expected output: push/pull commands rendered with explanations.
Technical constraints: Content must be static/data-driven; no OpenRouter call.
NFR links: NFR-003, NFR-005.
Edge cases: copy unavailable, mobile view, missing slug.
Failure modes: not_found.
Test ideas: TEST-006, TEST-009.
Dependencies: DATA-006, DATA-007.
```

```text
STORY-004: Weekly Top 10 homepage module
Actor: Public visitor
Intent: Discover high-momentum GitHub repositories.
Business value: Recurring homepage content and SEO/ads traffic.
Preconditions: weekly_top_repositories contains rows.
Trigger: User visits homepage.
Given/When/Then:
  - Given weekly top data exists
    When homepage loads
    Then top 10 repository cards render without live GitHub fetch and without OpenRouter call.
Technical constraints: GitHub snapshots/scoring only; no LLM for trending.
NFR links: NFR-001, NFR-005.
Edge cases: no weekly data, stale data, GitHub API failure during job.
Failure modes: empty_trending_data, cron_auth_failed.
Test ideas: TEST-007, TEST-010.
Dependencies: DATA-004, DATA-005, API-004.
```

```text
STORY-005: AdSense-ready public site shell
Actor: Site owner
Intent: Prepare the site for publisher ads without manipulative UX.
Business value: Monetization without paywall.
Preconditions: Required content pages and policy-safe layout exist.
Trigger: Public launch/AdSense submission.
Given/When/Then:
  - Given legal/trust pages exist and content is substantial
    When crawlers access the site
    Then public content pages are crawlable and API routes are not indexed.
  - Given a page contains command copy buttons
    When ad slots render
    Then ads are not placed next to copy/download/CTA buttons.
Technical constraints: `AdSlot` must be separated from copy/download actions.
NFR links: NFR-003, NFR-006.
Edge cases: mobile layout, consent not granted.
Failure modes: missing_legal_page, blocked_ads_crawler, unsafe_ad_placement.
Test ideas: TEST-011.
Dependencies: DATA-009, API-006.
```

---

## 10. Functional Requirements

| ID | Requirement | Verification | Dependencies |
|---|---|---|---|
| FR-001 | The system shall normalize all valid GitHub URL variants to lowercase `owner/repo`. | AC-001, TEST-001 | DATA-001 |
| FR-002 | The system shall reject non-GitHub URLs and malformed owner/repo inputs. | AC-014, TEST-001 | SEC-004 |
| FR-003 | `/api/analyze` shall check persistent cache before any OpenRouter call. | AC-001, TEST-002 | DATA-002 |
| FR-004 | Cache hits shall update `access_count` and `last_accessed_at` without calling OpenRouter. | AC-001, TEST-002 | DATA-002 |
| FR-005 | Cache misses shall pass rate-limit and bot checks before fetching GitHub data or calling OpenRouter. | AC-003, AC-004, TEST-003 | DATA-003 |
| FR-006 | Simultaneous cache misses for same `repo_key` shall be protected by an analysis lock. | AC-002, TEST-008 | DATA-004 |
| FR-007 | The system shall replace direct Gemini API usage with an OpenRouter adapter. | AC-006, TEST-004 | API-003 |
| FR-008 | The OpenRouter adapter shall request strict structured JSON and validate the result server-side. | AC-005, TEST-005 | API-003 |
| FR-009 | The system shall remove `seoDeepDiveHtml` and prohibit raw LLM HTML rendering. | AC-007, TEST-005 | SEC-006 |
| FR-010 | The analysis page shall render AnalysisResult fields using React components, not `dangerouslySetInnerHTML`. | AC-007, TEST-009 | DATA-008 |
| FR-011 | The old `/lernen` route shall be removed or permanently redirected to `/github`. | AC-015, TEST-012 | PHASE-1 |
| FR-012 | The old `/wiki/[begriff]` route shall be removed or permanently redirected to `/github/[slug]` where mapping exists. | AC-015, TEST-012 | PHASE-1 |
| FR-013 | `/github` shall render the central knowledge hub. | AC-013, TEST-009 | DATA-006 |
| FR-014 | `/github/shortcuts` shall render intent-based command workflows. | AC-009, TEST-009 | DATA-007 |
| FR-015 | `/github/commands`, `/github/actions`, `/github/cli`, and `/github/[slug]` shall render structured GitHub knowledge content. | AC-010, TEST-009 | DATA-006 |
| FR-016 | Knowledge pages and shortcuts shall not call OpenRouter. | AC-016, TEST-006 | ARCH-006 |
| FR-017 | Weekly Top 10 shall render from stored weekly data on homepage. | AC-011, TEST-007 | DATA-005 |
| FR-018 | Trending jobs shall use GitHub API metadata/snapshots/scoring only and shall not call OpenRouter. | AC-012, TEST-010 | API-004 |
| FR-019 | Required trust/legal pages shall exist: `/about`, `/contact`, `/privacy`, `/terms`, `/impressum`. | AC-017, TEST-011 | MISSING-006 |
| FR-020 | Technical SEO files shall exist: `/robots.txt`, `/sitemap.xml`, `/ads.txt`. | AC-018, TEST-011 | API-006 |
| FR-021 | `AdSlot` shall prevent ad placement adjacent to copy/download/CTA buttons. | AC-019, TEST-011 | SEC-009 |
| FR-022 | Usage events shall be stored for cache hits, cache misses, OpenRouter calls, rate-limit blocks, bot blocks, lock collisions, and errors. | AC-020, TEST-003 | DATA-003 |

---

## 11. Non-Functional Requirements

| ID | Category | Requirement | Target | Verification |
|---|---|---|---|---|
| NFR-001 | performance | Homepage must not fetch live GitHub or call OpenRouter on normal page view. | Static/DB read only; no external API call in page render path. | TEST-007 |
| NFR-002 | reliability | Cache hit must work after server restart. | Persistent DB-backed cache. | TEST-002 |
| NFR-003 | accessibility | Pages must be usable on mobile and understandable for ~16-year-old beginners. | MISSING: exact accessibility score target; minimum keyboard/copy usability review. | TEST-009 |
| NFR-004 | maintainability | LLM, GitHub, persistence, rate-limit, bot protection, and UI rendering must be separated. | Clean module boundaries reviewed. | review |
| NFR-005 | sustainability | Static knowledge/trending must avoid LLM/inference calls. | Zero OpenRouter calls for `/github*` and trending jobs. | TEST-006, TEST-010 |
| NFR-006 | security | No raw LLM HTML and no exposed OpenRouter key. | Tests + code review. | TEST-005 |
| NFR-007 | cost control | No duplicate OpenRouter calls for same `repo_key` under cache hit or concurrent miss. | Max one LLM call for concurrent requests. | TEST-008 |
| NFR-008 | SEO | Indexable pages must have unique titles/descriptions and substantial content. | MISSING: minimum word count threshold; review checklist. | TEST-011 |

---

## 12. Data Model and Core Entities

`MISSING-001`: Final DB/ORM must be verified. The schemas below define required logical entities, fields, indexes, and constraints. Coding agent must adapt to the existing stack only after inspection.

```text
DATA-001: RepoKey
Purpose: Canonical repository identifier.
Fields:
  - owner: string, required, lowercase, GitHub owner regex, sensitive: no
  - repo: string, required, lowercase-preserving allowed but key lowercased, GitHub repo regex, sensitive: no
  - repo_key: string, required, unique, format owner/repo, sensitive: no
Relationships: analysis_cache.repo_key, repo_snapshots.repo_key, weekly_top_repositories.repo_key
Indexes: unique(repo_key)
Permissions: public read through pages; system write only.
Lifecycle states: valid, invalid.
Retention: permanent unless repo removed by admin process later.
Deletion/anonymization: not personal data.
Migration notes: implement as normalized fields where persisted.
Audit requirements: invalid URL attempts logged as usage event without raw full URL if suspicious.
Open questions: exact GitHub owner/repo regex to match existing implementation.
```

```text
DATA-002: analysis_cache
Purpose: Persist one validated analysis per repo_key to prevent duplicate OpenRouter costs.
Fields:
  - id: uuid/string primary key, required
  - repo_key: string, required, unique
  - owner: string, required
  - repo: string, required
  - github_url: string, required, canonical URL
  - analysis_json: JSON, required, validated AnalysisResult
  - repo_metadata_json: JSON, required, GitHub metadata subset
  - provider: string, required, default openrouter
  - model: string, required, example google/gemini-2.5-flash
  - analyzer_version: string, required
  - created_at: datetime, required
  - updated_at: datetime, required
  - last_accessed_at: datetime, nullable
  - access_count: integer, required, default 0
  - is_stale: boolean, required, default false
Relationships: weekly_top_repositories.analysis_cache_id optional
Indexes: unique(repo_key), index(updated_at), index(is_stale), index(access_count)
Permissions: public read through rendered page only; system write.
Lifecycle states: active, stale, invalidated.
Retention: permanent for SEO/cache unless future admin deletion.
Deletion/anonymization: no personal data; deletion may remove SEO page.
Migration notes: schema migration requires rollback before production.
Audit requirements: writes logged in usage_events.
Open questions: DB JSON field support.
```

```text
DATA-003: usage_events
Purpose: Monitor abuse/cost behavior without profiles.
Fields:
  - id: uuid/string primary key, required
  - event_type: enum(cache_hit, cache_miss, openrouter_call, blocked_rate_limit, bot_blocked, locked_repo_analysis, github_fetch_failed, llm_failed, validation_failed, error)
  - repo_key: string, nullable
  - ip_hash: string, nullable, HMAC/SHA hash with server salt
  - session_hash: string, nullable
  - user_agent_hash: string, nullable
  - provider: string, nullable
  - model: string, nullable
  - estimated_input_tokens: integer, nullable
  - estimated_output_tokens: integer, nullable
  - estimated_cost: decimal, nullable, monitoring only
  - cache_hit: boolean, required
  - status: string, required
  - created_at: datetime, required
Relationships: repo_key to analysis_cache logical relation
Indexes: index(created_at), index(event_type), index(ip_hash, created_at), index(repo_key, created_at)
Permissions: system write; admin/operator read outside public UI.
Lifecycle states: recorded, expired.
Retention: ASSUMPTION: 90 days for abuse monitoring; confirm privacy policy.
Deletion/anonymization: raw IP never stored; hashes can be deleted on retention schedule.
Migration notes: no daily_budget table in MVP.
Audit requirements: no secrets or raw IPs.
Open questions: retention duration.
```

```text
DATA-004: analysis_locks
Purpose: Prevent duplicate OpenRouter calls for same repo_key under concurrency.
Fields:
  - repo_key: string primary key
  - lock_id: string, required
  - status: enum(running, completed, failed)
  - created_at: datetime, required
  - expires_at: datetime, required
  - error_code: string, nullable
Relationships: repo_key to analysis_cache
Indexes: unique(repo_key), index(expires_at)
Permissions: system write only.
Lifecycle states: running, completed, expired, failed.
Retention: delete expired/completed locks after safe window.
Deletion/anonymization: no personal data.
Migration notes: can be DB table or distributed lock if stack supports it.
Audit requirements: lock collision usage event.
Open questions: lock timeout value; ASSUMPTION: 2–5 minutes.
```

```text
DATA-005: repo_snapshots
Purpose: Store GitHub repo metrics over time for Weekly Top 10 scoring.
Fields:
  - id: uuid/string primary key
  - repo_key: string, required
  - owner: string, required
  - repo: string, required
  - stars: integer, required
  - forks: integer, required
  - open_issues: integer, nullable
  - language: string, nullable
  - pushed_at: datetime, nullable
  - updated_at: datetime, nullable
  - created_at_github: datetime, nullable
  - license: string, nullable
  - topics_json: JSON array, nullable
  - archived: boolean, nullable
  - disabled: boolean, nullable
  - snapshot_date: date, required
  - created_at_record: datetime, required
Relationships: weekly_top_repositories uses snapshot deltas.
Indexes: unique(repo_key, snapshot_date), index(snapshot_date), index(language)
Permissions: public read through trending pages; system write.
Lifecycle states: recorded.
Retention: ASSUMPTION: 12 months; confirm storage policy.
Deletion/anonymization: no personal data.
Migration notes: GitHub API fields must match adapter output.
Audit requirements: job logs.
Open questions: seed candidate source.
```

```text
DATA-006: weekly_top_repositories
Purpose: Store weekly ranked repositories for homepage and /github/trending.
Fields:
  - id: uuid/string primary key
  - week_start: date, required
  - week_end: date, required
  - rank: integer, required 1-10
  - repo_key: string, required
  - owner: string, required
  - repo: string, required
  - github_url: string, required
  - description: string, nullable
  - language: string, nullable
  - stars: integer, required
  - forks: integer, required
  - stars_delta: integer, required
  - forks_delta: integer, required
  - weekly_score: number, required
  - reason: string, required
  - analysis_cache_id: string, nullable
  - created_at: datetime, required
Relationships: optional analysis_cache
Indexes: unique(week_start, rank), index(week_start), index(repo_key)
Permissions: public read, system write.
Lifecycle states: active week, historical week.
Retention: permanent for archive/SEO unless storage policy changes.
Deletion/anonymization: no personal data.
Migration notes: score formula version should be tracked in future.
Audit requirements: job execution logs.
Open questions: exact weekly schedule/timezone.
```

```text
DATA-007: GitHubKnowledgeItem
Purpose: Static/data-driven knowledge page content.
Fields:
  - slug: string, required, unique
  - title: string, required
  - category: enum(git-basics, git-commands, branching, undo, remote, github-cli, github-actions, github-api, security, repo-management, copilot, publishing)
  - age16Summary: string, required
  - expertExplanation: string, required
  - syntax: string, optional
  - copyCommand: string, optional
  - whenToUse: string[], required
  - risks: string[], required
  - commonMistakes: string[], recommended
  - relatedSlugs: string[], required
  - faq: {question, answer}[], recommended
Relationships: analysis.commandsUsed.linkSlug, relatedSlugs.
Indexes: static module; optional search index.
Permissions: public read; code-only edits.
Lifecycle states: draft, published.
Retention: permanent.
Deletion/anonymization: no personal data.
Migration notes: source from encyclopedia; do not fetch LLM at runtime.
Audit requirements: content review.
Open questions: exact number of first launch items.
```

```text
DATA-008: CommandWorkflow
Purpose: Practical terminal workflow cards.
Fields:
  - slug: string, required, unique
  - title: string, required
  - goal: string, required
  - difficulty: enum(easy, medium, advanced)
  - category: enum(project-start, repo-create, save-changes, push-pull, aliases, forks, undo, deployment)
  - shortExplanation: string, required
  - commands: array(label, code, copyable), required
  - whenToUse: string, required
  - commonMistakes: string[], required
  - riskLevel: enum(safe, careful, dangerous), required
  - relatedCommands: string[], required
Relationships: homepage preview, /github/shortcuts, analysis pages.
Indexes: static module.
Permissions: public read.
Lifecycle states: published.
Retention: permanent.
Deletion/anonymization: no personal data.
Migration notes: source from project summary and encyclopedia.
Audit requirements: dangerous commands reviewed.
Open questions: exact launch set.
```

```text
DATA-009: AnalysisResult
Purpose: Validated OpenRouter output schema.
Fields:
  - repoName: string
  - category: string
  - coreBenefit: string
  - beginnerSummary: string
  - professionalAssessment: string
  - useCases: string[]
  - notFor: string[]
  - qualityScore: object(total, activity, documentation, installationClarity, community, security, maintenance) each 0-100
  - concerns: array(level low/medium/high, title, explanation, whatToCheck)
  - installation: object(clone, npm, pnpm, yarn, pip, docker, manual nullable strings)
  - commandsUsed: array(command, explanation, linkSlug)
  - aiPrompts: array(intent, prompt)
  - repositoryFacts: object(stars, forks, license, language, lastUpdated, openIssues?, defaultBranch?)
  - faq: array(question, answer)
Relationships: analysis_cache.analysis_json.
Indexes: not required for MVP; optional generated SEO fields.
Permissions: public rendered read, system write.
Lifecycle states: valid, rejected.
Retention: permanent in cache.
Deletion/anonymization: no personal data.
Migration notes: replace old schema and remove seoDeepDiveHtml.
Audit requirements: schema validation failure logged.
Open questions: exact validator library.
```

---

## 13. API / Interface Requirements

```text
API-001: POST /api/analyze
Type: REST
Consumer: Homepage form, analysis route actions, internal UI.
Provider: Next.js API route/server action.
Authorization: Public endpoint with rate-limit and bot protection; no account.
Request schema:
  { url: string } OR { owner: string, repo: string }
Response schema success cache hit:
  { status: "ok", source: "cache", repo_key: string, analysis: AnalysisResult }
Response schema success new:
  { status: "ok", source: "new_analysis", repo_key: string, analysis: AnalysisResult }
Response schema in progress:
  { status: "analysis_in_progress", repo_key: string, retryAfterSeconds: number }
Error schema:
  { status: "error", code: string, message: string, repo_key?: string }
Validation: only github.com/owner/repo or owner/repo; reject arbitrary domains.
Rate limits: per IP/session; exact thresholds MISSING.
Idempotency: repo_key is idempotency key.
Side effects: may write analysis_cache, usage_events, analysis_locks.
Observability: structured logs without raw IP/secrets.
Test requirements: TEST-002, TEST-003, TEST-008.
```

```text
API-002: GitHubRepositoryPort
Type: function/interface
Consumer: analysis service, trending service.
Provider: GitHub adapter.
Authorization: Public GitHub API or optional server token; never browser token.
Request schema: { owner: string, repo: string }
Response schema: GitHubRepo metadata + README text/excerpt.
Error schema: not_found, rate_limited, unavailable, malformed_response.
Validation: owner/repo validated before call.
Rate limits: respect GitHub API response headers where available.
Idempotency: read-only.
Side effects: none.
Observability: log status/code only, no secrets.
Test requirements: TEST-004, TEST-010.
```

```text
API-003: OpenRouterAnalyzerPort
Type: function/interface
Consumer: analysis application service.
Provider: OpenRouter adapter.
Authorization: Server-side OPENROUTER_API_KEY only.
Request schema:
  { repo: GitHubRepo, readmeExcerpt: string, schemaVersion: string }
Response schema: AnalysisResult.
Error schema: openrouter_auth_failed, model_unavailable, timeout, invalid_json, schema_validation_failed.
Validation: strict JSON schema validation; no HTML fields.
Rate limits: protected upstream by /api/analyze checks; retry max MISSING.
Idempotency: should only be called after lock acquired for repo_key.
Side effects: external cost-incurring request.
Observability: log provider, model, usage tokens if returned; no prompts containing secrets.
Test requirements: TEST-004, TEST-005.
```

```text
API-004: GET /api/trending/weekly
Type: REST
Consumer: Homepage, /github/trending.
Provider: Next.js route/server function.
Authorization: Public read.
Request schema: optional week parameter.
Response schema: { week_start, week_end, items: WeeklyTopRepository[] }
Error schema: { status: "error", code: string, message: string }
Validation: week format if supplied.
Rate limits: standard public read cache.
Idempotency: read-only.
Side effects: none.
Observability: cache status.
Test requirements: TEST-007.
```

```text
API-005: POST /api/jobs/update-trending-snapshots
Type: REST internal job
Consumer: GitHub Actions cron or platform scheduler.
Provider: Next.js route.
Authorization: Bearer CRON_SECRET.
Request schema: optional { dryRun: boolean }
Response schema: { status: "ok", snapshotsCreated: number }
Error schema: unauthorized, github_error, persistence_error.
Validation: strict secret comparison; no query-string secrets.
Rate limits: internal only.
Idempotency: unique(repo_key, snapshot_date).
Side effects: writes repo_snapshots.
Observability: job log with correlation id.
Test requirements: TEST-010.
```

```text
API-006: POST /api/jobs/update-weekly-trending
Type: REST internal job
Consumer: GitHub Actions cron or platform scheduler.
Provider: Next.js route.
Authorization: Bearer CRON_SECRET.
Request schema: optional { weekStart?: string }
Response schema: { status: "ok", week_start, week_end, itemsWritten: 10 }
Error schema: unauthorized, insufficient_snapshots, persistence_error.
Validation: secret + week format.
Rate limits: internal only.
Idempotency: unique(week_start, rank).
Side effects: writes weekly_top_repositories.
Observability: job log with correlation id.
Test requirements: TEST-010.
```

```text
API-007: Static content interface
Type: UI/data contract
Consumer: /github* routes, homepage previews, analysis related links.
Provider: src/data/github-knowledge.ts, src/data/git-workflows.ts, src/data/terminal-shortcuts.ts.
Authorization: Public read.
Request schema: slug/category/search term.
Response schema: GitHubKnowledgeItem or CommandWorkflow.
Error schema: not_found.
Validation: slug uniqueness, relatedSlug existence.
Rate limits: not applicable.
Idempotency: read-only.
Side effects: none.
Observability: optional analytics, no personal profiling.
Test requirements: TEST-006, TEST-009.
```

---

## 14. Architecture Constraints

### Architecture summary

```text
Architecture style:
Clean Architecture / Ports and Adapters within existing Next.js structure.

Primary layers:
UI/routes -> application services -> domain validation/policies -> ports -> infrastructure adapters.

Dependency direction:
UI may call application services. Application services depend on interfaces. Infrastructure implements interfaces. Domain must not import UI, DB adapters, GitHub adapter, or OpenRouter adapter.

Module boundaries:
- repo-normalize: pure domain utility
- analysis-cache: persistence port/adapter
- rate-limit: policy + adapter
- bot-protection: policy
- openrouter-analyzer: external LLM adapter
- github: external GitHub adapter
- trending-score: pure scoring utility
- knowledge data: static source modules

Persistence boundary:
All DB writes go through repository/adapter modules. No DB queries in React components.

Integration boundary:
GitHub and OpenRouter are accessed only through ports/adapters. No external calls from UI components.

Configuration boundary:
Secrets loaded server-side only from env/config. No secret in client bundle.

Testing boundary:
Domain utilities tested without DB/network. Adapters tested with mocks/fakes unless integration env provided.
```

### Constraints

| ID | Constraint | Rationale | Verification |
|---|---|---|---|
| ARCH-001 | Domain logic must not depend on infrastructure adapters. | Preserves testability. | review + unit tests |
| ARCH-002 | OpenRouter and GitHub must be behind interfaces/ports. | Enables mocks, provider swap, retries. | review + tests |
| ARCH-003 | Validation, persistence, business logic, and presentation must be separate. | Prevents route/UI bloat. | review |
| ARCH-004 | Feature work must prefer vertical slices with bounded file changes. | Reduces agent drift. | review |
| ARCH-005 | No uncontrolled global mutable state for cache or rate-limit. | In-memory cache is insufficient for production. | tests/review |
| ARCH-006 | Static knowledge and trending must not import OpenRouter adapter. | Prevents accidental LLM costs. | dependency review + tests |
| ARCH-007 | Analysis cache lookup must happen before OpenRouter adapter can be called. | Cost-control invariant. | TEST-002 |
| ARCH-008 | No `dangerouslySetInnerHTML` for LLM-generated content. | XSS prevention. | grep/test/review |
| ARCH-009 | Migration scripts require human review before execution. | Prevents destructive data changes. | ROLLBACK-001 |
| ARCH-010 | Existing framework versions must not be changed unless required and reviewed. | Prevents broad accidental upgrades. | review |

---

## 15. Security, Privacy and Compliance

### Data classification

| Data type | Sensitivity | Storage | Retention | Logging allowed |
|---|---|---|---|---|
| Public GitHub metadata | public | DB/cache | permanent unless removed | yes |
| README excerpt | public | analysis cache / usage context optional | permanent in analysis result only if needed | yes, truncated |
| AnalysisResult | public | DB/cache | permanent | yes |
| OpenRouter API key | restricted secret | server env/secrets manager | until rotated | no |
| CRON_SECRET | restricted secret | server env/secrets manager | until rotated | no |
| HASH_SALT | restricted secret | server env/secrets manager | until rotated carefully | no |
| IP hash/session hash/user-agent hash | confidential pseudonymous | usage_events | ASSUMPTION: 90 days | no raw, hash only |
| Ads consent state | confidential preference | client/CMP as required | per CMP | no personal logs |

### Authorization matrix

| Actor | Resource | Create | Read | Update | Delete | Notes |
|---|---|---:|---:|---:|---:|---|
| Public visitor | Analysis page | via submit | yes | no | no | Creates only through validated `/api/analyze`. |
| Public visitor | Knowledge pages | no | yes | no | no | Static. |
| Public visitor | Trending pages | no | yes | no | no | Stored data. |
| Cron job | Snapshots/trending | yes | no public route write | yes | no | Requires CRON_SECRET. |
| System | analysis_cache | yes | yes | yes | no | Through service only. |
| Coding agent | Repo files | yes within task | yes | yes within task | only specified | Must follow task scope. |

### Security requirements

| ID | Requirement | Verification |
|---|---|---|
| SEC-001 | `OPENROUTER_API_KEY`, `CRON_SECRET`, and `HASH_SALT` must be server-only secrets. | review + build check |
| SEC-002 | Secrets, raw IPs, full headers, and raw user-agent strings must not be logged. | TEST-013 + review |
| SEC-003 | `/api/jobs/*` routes must require `Authorization: Bearer CRON_SECRET`. | TEST-010 |
| SEC-004 | Input GitHub URLs must be validated at the server trust boundary. | TEST-001 |
| SEC-005 | `/api/analyze` must reject arbitrary URLs and private repo auth requests. | TEST-001 |
| SEC-006 | LLM output must be strict JSON and never raw HTML. | TEST-005 |
| SEC-007 | `dangerouslySetInnerHTML` must not render OpenRouter/GitHub/README-derived content. | grep + review |
| SEC-008 | Rate-limit and bot protection must execute before OpenRouter call on cache miss. | TEST-003 |
| SEC-009 | Ads must not be adjacent to copy/download/action buttons. | TEST-011 + review |
| SEC-010 | Destructive DB migrations require backup/rollback and human review. | ROLLBACK-001 |
| SEC-011 | OpenRouter prompts must not include secrets or server env values. | review |
| SEC-012 | Usage monitoring must store hashes, not user profiles. | review |

### Abuse cases

| ID | Abuse case | Mitigation | Test |
|---|---|---|---|
| ABUSE-001 | Bot submits many unique repos to create LLM costs. | Rate-limit, bot protection, usage events. | TEST-003 |
| ABUSE-002 | Two users trigger same new repo simultaneously. | analysis_locks by repo_key. | TEST-008 |
| ABUSE-003 | User submits non-GitHub URL/SSRF target. | Strict GitHub URL validation. | TEST-001 |
| ABUSE-004 | LLM returns script/html injection. | Strict JSON schema, no raw HTML rendering. | TEST-005 |
| ABUSE-005 | Cron endpoint called by attacker. | Bearer CRON_SECRET; no query secret. | TEST-010 |
| ABUSE-006 | Ads placed to cause accidental clicks. | Ad policy constraints and layout tests. | TEST-011 |

---

## 16. Sustainability and GreenOps

| ID | Requirement | Rationale | Verification |
|---|---|---|---|
| SUS-001 | Cache hits must avoid OpenRouter calls. | Reduces cost and compute. | TEST-002 |
| SUS-002 | Static `/github*` pages must be data-driven and never generated at request time by LLM. | Eliminates repeated inference. | TEST-006 |
| SUS-003 | Trending jobs must use snapshots and score calculation only. | Avoids expensive LLM calls. | TEST-010 |
| SUS-004 | README input to OpenRouter must be capped/truncated or summarized deterministically before LLM call. | Controls token cost. | TEST-004 |
| SUS-005 | DB indexes must support repo_key lookups and weekly ranking reads. | Avoids inefficient queries. | migration review |
| SUS-006 | Rate-limit checks should be O(1) or indexed by hash/time window. | Avoids abuse and DB load. | review |
| SUS-007 | Agent context must reference source docs and PRD files rather than re-pasting everything into prompts. | Reduces token waste and agent drift. | CTX review |
| SUS-008 | OpenRouter model selection must be configurable without code changes. | Cost/performance tuning. | config review |

---

## 17. Context Engineering Artifacts

| ID | File | Purpose | Status |
|---|---|---|---|
| CTX-001 | `AGENTS.md` | Operating rules for Claude/Cursor. | generated |
| CTX-002 | `.cursorrules` | Cursor-compatible rules. | generated |
| CTX-003 | `llms.txt` | Agent navigation map. | generated |
| CTX-004 | `llms-full.txt` | Full context load order. | generated |
| CTX-005 | `docs/knowledge/knowledge-ingestion-map.md` | How to convert encyclopedia into structured data. | generated |
| CTX-006 | `docs/architecture/adr-0001-openrouter-llm-gateway.md` | Decision: OpenRouter instead of direct Gemini key. | generated |
| CTX-007 | `docs/architecture/adr-0002-static-knowledge-ingestion.md` | Decision: static/data-driven knowledge. | generated |
| CTX-008 | `docs/testing/test-strategy.md` | Test mapping and commands. | generated |
| CTX-009 | `docs/security/secrets-management.md` | Secret/env policy. | generated |
| CTX-010 | `CLAUDE_HANDOFF.md` | Pasteable Claude task instructions. | generated |

### How Claude must receive knowledge

```text
1. Add the two source files to stable repository paths under docs/source/.
2. Add the generated PRD under docs/prd/.
3. Add AGENTS.md, llms.txt, llms-full.txt, ADRs, test strategy, and secrets policy.
4. Claude must read in this order:
   a. AGENTS.md
   b. docs/prd/whats-in-it-openrouter-final.prd.md
   c. docs/knowledge/knowledge-ingestion-map.md
   d. docs/source/whats-in-it_projektzusammenfassung_aufbau.md
   e. docs/source/Git_GitHub_Systemarchitektur_Enzyklopaedie.md only when implementing PHASE-4 content
5. Claude must not paste the whole encyclopedia into runtime prompts.
6. Claude must transform the encyclopedia into structured static data modules:
   - src/data/github-knowledge.ts
   - src/data/git-workflows.ts
   - src/data/terminal-shortcuts.ts
7. Runtime pages must read structured data. OpenRouter must not be used for knowledge pages.
```

---

## 18. Implementation Phases

```text
PHASE-1: Foundation and Cleanup
Objective:
Remove old hardcoded learning/wiki structure and prepare repository context for agent-safe implementation.
Includes:
- Add PRD/context artifacts.
- Remove or redirect /lernen and /wiki/[begriff].
- Update navigation to /github structure.
- Identify existing DB/test/package setup.
Dependencies:
- Repository inspection.
Exit criteria:
- Old routes no longer conflict with new /github architecture.
- Validation commands identified or marked MISSING.
Validation commands:
- npm run lint (ASSUMPTION; verify package.json)
- npm run test (ASSUMPTION; verify package.json)
- npm run build (ASSUMPTION; verify package.json)
Human review:
Required before DB/migration work.
```

```text
PHASE-2: Persistent Cache, Rate Limit, Bot Protection, Analysis Lock
Objective:
Make analysis cost-controlled without daily budget.
Includes:
- repo_key normalization.
- analysis_cache persistence.
- usage_events.
- rate-limit.
- bot protection.
- analysis_locks.
- /api/analyze cache-first flow.
Dependencies:
- DB/migration choice resolved.
Exit criteria:
- Cache hit never calls OpenRouter.
- Concurrent same repo produces max one OpenRouter call.
- Rate-limited/bot-blocked requests do not call GitHub/OpenRouter.
Validation commands:
- npm run test -- repo-normalize cache rate-limit analyze (ASSUMPTION)
- npm run build
Human review:
Required before migration execution.
```

```text
PHASE-3: OpenRouter LLM Gateway and Safe Analysis Schema
Objective:
Replace direct Gemini key with OpenRouter while enforcing strict JSON and no raw HTML.
Includes:
- OpenRouterAnalyzerPort.
- Env config: OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL.
- Structured JSON schema.
- AnalysisResult validator.
- AnalysisCard UI migration.
- Remove seoDeepDiveHtml.
Dependencies:
- PHASE-2 cache-first path.
Exit criteria:
- Direct Gemini key path removed from production.
- Invalid JSON is rejected.
- No LLM HTML rendering remains.
Validation commands:
- npm run test -- openrouter analysis-schema analysis-card (ASSUMPTION)
- npm run lint
- npm run build
Human review:
Required before enabling production OpenRouter key.
```

```text
PHASE-4: GitHub Knowledge Hub and Shortcuts
Objective:
Convert provided encyclopedia into structured static knowledge modules and routes.
Includes:
- /github
- /github/[slug]
- /github/shortcuts
- /github/commands
- /github/actions
- /github/cli
- CommandBlock, CopyButton integration.
Dependencies:
- Source docs in docs/source.
Exit criteria:
- Initial launch set of knowledge pages exists.
- Static pages never call OpenRouter.
- Dangerous commands have warnings.
Validation commands:
- npm run test -- knowledge shortcuts command-block (ASSUMPTION)
- npm run build
Human review:
Content review required for dangerous commands.
```

```text
PHASE-5: Weekly Top 10
Objective:
Add snapshot-based Weekly Top 10 directly to homepage without LLM calls.
Includes:
- repo_snapshots.
- weekly_top_repositories.
- GitHub candidate fetch.
- scoring function.
- internal cron routes with CRON_SECRET.
- WeeklyTopRepos component.
- /github/trending.
Dependencies:
- DB/migration tooling.
- Seed list or existing candidate source.
Exit criteria:
- Homepage renders stored top 10.
- Jobs are protected.
- Trending code has no OpenRouter dependency.
Validation commands:
- npm run test -- trending trending-score jobs (ASSUMPTION)
- npm run build
Human review:
Review scoring formula and job auth.
```

```text
PHASE-6: AdSense and SEO Readiness
Objective:
Prepare public trust pages, SEO files, safe ad slots, and crawler behavior.
Includes:
- /about, /contact, /privacy, /terms, /impressum.
- robots.txt, sitemap.xml, ads.txt.
- AdSlot component.
- Consent strategy placeholder.
Dependencies:
- Legal details MISSING.
Exit criteria:
- Required pages exist with non-thin content or explicit MISSING placeholders.
- API routes excluded from indexing.
- Ads separated from CTAs/copy buttons.
Validation commands:
- npm run test -- seo ads legal-pages (ASSUMPTION)
- npm run build
Human review:
Legal/privacy review required before production.
```

```text
PHASE-7: Verification, Hardening, Launch Review
Objective:
Run complete quality gates before launch.
Includes:
- Unit, integration, e2e, security, performance/GreenOps checks.
- Rollback plan review.
- OpenRouter production key review.
- AdSense-readiness checklist.
Dependencies:
- PHASE-1 through PHASE-6 complete.
Exit criteria:
- All critical acceptance criteria pass.
- No unresolved BLOCKER.
- No direct Gemini secret path remains.
Validation commands:
- npm run lint
- npm run test
- npm run build
- MISSING: e2e command
Human review:
Required before public launch.
```

---

## 19. Atomic Task Breakdown

```text
TASK-1.1: Add PRD context artifacts
Objective: Add generated PRD/context files to repo.
Inputs: This PRD package.
Files/modules allowed: docs/prd/**, docs/architecture/**, docs/testing/**, docs/security/**, AGENTS.md, llms.txt, llms-full.txt, .cursorrules.
Files/modules prohibited: src/** runtime code.
Dependencies: none.
Implementation notes: Do not alter source docs content.
Acceptance criteria: CTX files exist and paths match llms.txt.
Tests to add/update: none.
Validation command: git status + file review.
Rollback note: Remove added docs only.
Human review checkpoint: yes.
```

```text
TASK-1.2: Remove old academy/wiki routes
Objective: Remove or redirect /lernen and /wiki/[begriff].
Inputs: Existing route tree.
Files/modules allowed: src/app/lernen/**, src/app/wiki/**, navigation components, redirect config.
Files/modules prohibited: analysis service, LLM adapter.
Dependencies: TASK-1.1.
Implementation notes: Prefer redirects to /github if existing URLs may be indexed.
Acceptance criteria: /lernen and /wiki/[begriff] no longer render old hardcoded content.
Tests to add/update: routing test.
Validation command: npm run test + npm run build (verify scripts).
Rollback note: Restore route files from git.
Human review checkpoint: no.
```

```text
TASK-1.3: Inspect DB/test/package stack
Objective: Determine actual persistence and validation tooling before implementing migrations.
Inputs: package.json, existing configs, deployment docs.
Files/modules allowed: read-only inspection; docs/prd implementation notes update.
Files/modules prohibited: migrations, src runtime edits.
Dependencies: TASK-1.1.
Implementation notes: Stop before inventing ORM.
Acceptance criteria: DB provider, ORM/migration tool, package manager, lint/test/build commands documented or marked MISSING.
Tests to add/update: none.
Validation command: no write command; inspection report.
Rollback note: n/a.
Human review checkpoint: yes.
```

```text
TASK-2.1: Implement repo_key normalization
Objective: Normalize GitHub URL variants to canonical owner/repo.
Inputs: FR-001, DATA-001.
Files/modules allowed: src/lib/repo-normalize.ts, tests.
Files/modules prohibited: UI route changes except import usage.
Dependencies: TASK-1.3.
Implementation notes: Reject arbitrary domains; handle trailing slash and .git.
Acceptance criteria: AC-014.
Tests to add/update: TEST-001.
Validation command: npm run test -- repo-normalize.
Rollback note: revert utility and tests.
Human review checkpoint: no.
```

```text
TASK-2.2: Add persistent analysis_cache adapter
Objective: Replace 24h in-memory cache with persistent cache interface/adapter.
Inputs: DATA-002, chosen DB stack.
Files/modules allowed: src/lib/analysis-cache.ts, db schema/migration files, tests.
Files/modules prohibited: OpenRouter adapter.
Dependencies: TASK-1.3, TASK-2.1.
Implementation notes: Unique repo_key required.
Acceptance criteria: AC-001.
Tests to add/update: TEST-002.
Validation command: npm run test -- cache.
Rollback note: revert migration; restore previous cache path only if safe.
Human review checkpoint: yes before migration.
```

```text
TASK-2.3: Add usage_events logging without raw personal data
Objective: Track cache/LLM/rate-limit events using hashes only.
Inputs: DATA-003, SEC-002.
Files/modules allowed: src/lib/usage-events.ts, db schema/migration files, tests.
Files/modules prohibited: UI components.
Dependencies: TASK-2.2.
Implementation notes: HMAC hash raw IP/session/user-agent with HASH_SALT; never store raw IP.
Acceptance criteria: AC-020.
Tests to add/update: TEST-013.
Validation command: npm run test -- usage-events.
Rollback note: disable usage logging while keeping analysis path.
Human review checkpoint: yes.
```

```text
TASK-2.4: Add rate-limit and bot protection before cache-miss analysis
Objective: Block abusive cache misses before GitHub/OpenRouter calls.
Inputs: FR-005, SEC-008.
Files/modules allowed: src/lib/rate-limit.ts, src/lib/bot-protection.ts, /api/analyze route/service tests.
Files/modules prohibited: OpenRouter adapter.
Dependencies: TASK-2.3.
Implementation notes: Exact thresholds MISSING; use conservative env-configurable defaults only if approved.
Acceptance criteria: AC-003, AC-004.
Tests to add/update: TEST-003.
Validation command: npm run test -- rate-limit bot-protection analyze.
Rollback note: feature-flag checks if necessary.
Human review checkpoint: yes.
```

```text
TASK-2.5: Add analysis lock per repo_key
Objective: Ensure simultaneous requests for same new repo cause max one OpenRouter call.
Inputs: DATA-004.
Files/modules allowed: src/lib/analysis-lock.ts, db schema/migration files, /api/analyze tests.
Files/modules prohibited: UI components.
Dependencies: TASK-2.2.
Implementation notes: Lock must expire to recover from failed calls.
Acceptance criteria: AC-002.
Tests to add/update: TEST-008.
Validation command: npm run test -- analysis-lock analyze.
Rollback note: remove lock code only if endpoint disabled.
Human review checkpoint: yes.
```

```text
TASK-3.1: Create OpenRouterAnalyzerPort and adapter
Objective: Replace direct Gemini calls with OpenRouter server-side adapter.
Inputs: API-003, ADR-0001.
Files/modules allowed: src/lib/openrouter.ts, src/lib/analyze.ts, env docs, tests.
Files/modules prohibited: client components exposing secrets.
Dependencies: PHASE-2 complete.
Implementation notes: Use OPENROUTER_API_KEY; model configurable via OPENROUTER_MODEL.
Acceptance criteria: AC-006.
Tests to add/update: TEST-004.
Validation command: npm run test -- openrouter analyze.
Rollback note: adapter behind interface; disable new analyses if provider fails.
Human review checkpoint: yes before production key.
```

```text
TASK-3.2: Define strict AnalysisResult JSON schema and validator
Objective: Validate OpenRouter responses and remove raw HTML.
Inputs: DATA-009.
Files/modules allowed: src/lib/analysis-schema.ts, src/lib/analyze.ts, tests.
Files/modules prohibited: UI layout unrelated files.
Dependencies: TASK-3.1.
Implementation notes: additionalProperties false where practical; reject missing required fields.
Acceptance criteria: AC-005, AC-007.
Tests to add/update: TEST-005.
Validation command: npm run test -- analysis-schema.
Rollback note: keep old schema only behind disabled code path if necessary.
Human review checkpoint: yes.
```

```text
TASK-3.3: Update Analysis UI to typed sections
Objective: Render new AnalysisResult without dangerouslySetInnerHTML.
Inputs: DATA-009.
Files/modules allowed: components/AnalysisCard.tsx, components/AnalysisQualityScore.tsx, components/ConcernCard.tsx, components/CommandBlock.tsx, tests.
Files/modules prohibited: OpenRouter adapter.
Dependencies: TASK-3.2.
Implementation notes: All LLM text rendered as text/list fields.
Acceptance criteria: AC-007, AC-008.
Tests to add/update: TEST-009.
Validation command: npm run test -- analysis-card.
Rollback note: revert UI components; do not restore raw HTML path.
Human review checkpoint: yes for XSS check.
```

```text
TASK-4.1: Create initial knowledge data modules
Objective: Transform source encyclopedia into structured static modules.
Inputs: docs/source/Git_GitHub_Systemarchitektur_Enzyklopaedie.md, DATA-007, DATA-008.
Files/modules allowed: src/data/github-knowledge.ts, src/data/git-workflows.ts, src/data/terminal-shortcuts.ts, docs/knowledge/**.
Files/modules prohibited: OpenRouter adapter, /api/analyze.
Dependencies: PHASE-1 complete.
Implementation notes: Do not embed entire raw markdown as one page; create curated launch set first.
Acceptance criteria: AC-009, AC-010, AC-013, AC-016.
Tests to add/update: TEST-006.
Validation command: npm run test -- knowledge.
Rollback note: remove generated data modules and routes.
Human review checkpoint: content review required.
```

```text
TASK-4.2: Build /github routes and command UI
Objective: Render hub, detail pages, shortcuts, command pages.
Inputs: DATA-007, DATA-008.
Files/modules allowed: src/app/github/**, components/CommandBlock.tsx, components/CopyButton.tsx, components/KnowledgeHubPreview.tsx, components/GitHubShortcutsPreview.tsx.
Files/modules prohibited: OpenRouter adapter, DB migrations.
Dependencies: TASK-4.1.
Implementation notes: Ensure mobile readable cards and risk labels.
Acceptance criteria: AC-009, AC-010, AC-013.
Tests to add/update: TEST-009.
Validation command: npm run test -- github-routes && npm run build.
Rollback note: revert new routes/components.
Human review checkpoint: no.
```

```text
TASK-5.1: Implement trending snapshot and score data model
Objective: Add repo_snapshots and weekly_top_repositories persistence.
Inputs: DATA-005, DATA-006.
Files/modules allowed: db schema/migrations, src/lib/trending-score.ts, tests.
Files/modules prohibited: OpenRouter adapter.
Dependencies: DB stack known.
Implementation notes: Store score inputs and reason.
Acceptance criteria: AC-011, AC-012.
Tests to add/update: TEST-007, TEST-010.
Validation command: npm run test -- trending-score.
Rollback note: revert migration after backup.
Human review checkpoint: yes before migration.
```

```text
TASK-5.2: Add protected trending job routes
Objective: Create cron endpoints protected by CRON_SECRET.
Inputs: API-005, API-006.
Files/modules allowed: src/app/api/jobs/update-trending-snapshots/**, src/app/api/jobs/update-weekly-trending/**, src/lib/trending.ts.
Files/modules prohibited: OpenRouter adapter.
Dependencies: TASK-5.1.
Implementation notes: No query-string secrets; no LLM imports.
Acceptance criteria: AC-012.
Tests to add/update: TEST-010.
Validation command: npm run test -- jobs.
Rollback note: disable routes.
Human review checkpoint: yes.
```

```text
TASK-5.3: Render Weekly Top 10 on homepage
Objective: Add stored weekly top repositories to homepage.
Inputs: weekly_top_repositories.
Files/modules allowed: components/WeeklyTopRepos.tsx, components/TopRepoCard.tsx, src/app/page.tsx, src/app/github/trending/**.
Files/modules prohibited: OpenRouter adapter, GitHub live fetch from homepage render.
Dependencies: TASK-5.2.
Implementation notes: Homepage reads stored data only.
Acceptance criteria: AC-011.
Tests to add/update: TEST-007.
Validation command: npm run test -- homepage trending && npm run build.
Rollback note: remove component from homepage.
Human review checkpoint: no.
```

```text
TASK-6.1: Add legal/trust pages and technical SEO files
Objective: Prepare AdSense-ready public site structure.
Inputs: MISSING-006 for final legal details.
Files/modules allowed: src/app/about/**, contact, privacy, terms, impressum, robots.txt, sitemap.xml, ads.txt, src/lib/sitemap.ts.
Files/modules prohibited: analysis service.
Dependencies: PHASE-4 routes stable.
Implementation notes: Use placeholders only if legal details missing; mark non-production.
Acceptance criteria: AC-017, AC-018.
Tests to add/update: TEST-011.
Validation command: npm run test -- seo legal && npm run build.
Rollback note: revert pages/files.
Human review checkpoint: legal review required.
```

```text
TASK-6.2: Add policy-safe AdSlot component
Objective: Prepare clean ad placements separated from CTAs and copy buttons.
Inputs: ad policy constraints.
Files/modules allowed: components/AdSlot.tsx, src/lib/ad-policy.ts, page layout files.
Files/modules prohibited: CopyButton internals unless needed for spacing tests.
Dependencies: TASK-6.1.
Implementation notes: No ad near copy/download/clone buttons.
Acceptance criteria: AC-019.
Tests to add/update: TEST-011.
Validation command: npm run test -- ads.
Rollback note: disable AdSlot rendering.
Human review checkpoint: yes before enabling ads.
```

```text
TASK-7.1: Run launch quality gate
Objective: Verify PRD acceptance, tests, security, and rollback readiness.
Inputs: all previous phases.
Files/modules allowed: docs/testing/test-report.md, docs/launch/quality-gate.md.
Files/modules prohibited: runtime feature changes unless defects are found and scoped.
Dependencies: PHASE-1 through PHASE-6.
Implementation notes: Do not mark done with failing tests or unresolved blockers.
Acceptance criteria: DOD-001 through DOD-010.
Tests to add/update: all.
Validation command: npm run lint && npm run test && npm run build && MISSING:e2e command.
Rollback note: release blocked until reviewed.
Human review checkpoint: yes.
```

---

## 20. Acceptance Criteria

| ID | Requirement/story | Given | When | Then | Verification |
|---|---|---|---|---|---|
| AC-001 | STORY-001 | analysis_cache contains repo_key | user requests same repo | cached analysis returned and OpenRouter not called | TEST-002 |
| AC-002 | STORY-001 | two requests for same new repo arrive concurrently | both pass validation | max one OpenRouter call is executed | TEST-008 |
| AC-003 | FR-005 | request exceeds rate limit | user submits new repo | request blocked before GitHub/OpenRouter | TEST-003 |
| AC-004 | FR-005 | bot protection flags request | request reaches /api/analyze | request blocked before GitHub/OpenRouter | TEST-003 |
| AC-005 | STORY-002 | cache miss is valid | OpenRouter responds | strict AnalysisResult JSON is validated and saved | TEST-005 |
| AC-006 | GOAL-003 | production analysis runs | LLM call is needed | OpenRouter adapter is used, not direct Gemini key | TEST-004 |
| AC-007 | FR-009 | OpenRouter returns analysis text | page renders | no raw LLM HTML or dangerouslySetInnerHTML is used | TEST-005 |
| AC-008 | FR-010 | analysis_json contains quality/concerns/install/FAQ | page renders | all sections display with typed components | TEST-009 |
| AC-009 | STORY-003 | user opens /github/shortcuts | page loads | intent-based workflows with copy buttons render | TEST-009 |
| AC-010 | FR-015 | user opens knowledge routes | page loads | structured explanations, examples, risks, related links render | TEST-009 |
| AC-011 | STORY-004 | weekly top data exists | homepage loads | Top 10 renders from stored data | TEST-007 |
| AC-012 | FR-018 | trending job runs | repo candidates are processed | no OpenRouter import/call occurs | TEST-010 |
| AC-013 | JOURNEY-004 | knowledge item slug exists | user opens /github/[slug] | detail page renders correct content | TEST-006 |
| AC-014 | FR-001/FR-002 | invalid URL or non-GitHub URL submitted | server validates | request rejected with safe error | TEST-001 |
| AC-015 | FR-011/FR-012 | user opens old /lernen or /wiki route | route resolves | old hardcoded content is gone or redirected | TEST-012 |
| AC-016 | FR-016 | /github pages are requested | page renders | zero OpenRouter calls | TEST-006 |
| AC-017 | FR-019 | site is prepared for public launch | trust URLs are opened | about/contact/privacy/terms/impressum exist | TEST-011 |
| AC-018 | FR-020 | crawlers request SEO files | files are opened | robots.txt, sitemap.xml, ads.txt respond | TEST-011 |
| AC-019 | FR-021 | page has copy/download buttons | ads render | ads are not adjacent to action buttons | TEST-011 |
| AC-020 | FR-022 | analysis event occurs | event is recorded | usage event stores hash-only monitoring data | TEST-013 |

---

## 21. Test Strategy

### Test matrix

| ID | Type | Scope | Requirement links | Tool/command | Required before |
|---|---|---|---|---|---|
| TEST-001 | unit | repo_key normalization and URL validation | FR-001, FR-002, SEC-004 | `npm run test -- repo-normalize` ASSUMPTION | PHASE-2 |
| TEST-002 | integration | cache hit/cache miss behavior | FR-003, FR-004, AC-001 | `npm run test -- cache analyze` ASSUMPTION | PHASE-2 |
| TEST-003 | integration/security | rate-limit and bot protection before external calls | FR-005, SEC-008 | `npm run test -- rate-limit bot-protection` ASSUMPTION | PHASE-2 |
| TEST-004 | contract | OpenRouter adapter request/response | API-003, FR-007 | `npm run test -- openrouter` ASSUMPTION | PHASE-3 |
| TEST-005 | unit/contract/security | AnalysisResult schema, invalid JSON, no HTML | FR-008, FR-009, SEC-006 | `npm run test -- analysis-schema` ASSUMPTION | PHASE-3 |
| TEST-006 | unit/integration | knowledge data routes without OpenRouter | FR-016, AC-016 | `npm run test -- knowledge` ASSUMPTION | PHASE-4 |
| TEST-007 | integration/e2e | homepage Weekly Top 10 stored data | FR-017 | `npm run test -- homepage trending` ASSUMPTION | PHASE-5 |
| TEST-008 | concurrency | analysis_locks max one OpenRouter call | FR-006, AC-002 | `npm run test -- analysis-lock` ASSUMPTION | PHASE-2 |
| TEST-009 | component/e2e | Analysis, shortcuts, knowledge UI | FR-010, FR-014, FR-015 | MISSING: component/e2e command | PHASE-4 |
| TEST-010 | integration/security | cron routes and trending jobs | API-005, API-006, FR-018 | `npm run test -- jobs trending` ASSUMPTION | PHASE-5 |
| TEST-011 | e2e/review | SEO/trust/ad-safe pages | FR-019, FR-020, FR-021 | MISSING: e2e command | PHASE-6 |
| TEST-012 | integration | old route removal/redirect | FR-011, FR-012 | MISSING: route test command | PHASE-1 |
| TEST-013 | security | no secret/raw IP logging | SEC-001, SEC-002, FR-022 | MISSING: log/security test command | PHASE-2 |

Completion rule: No task is complete until linked acceptance criteria and required tests pass or are explicitly blocked with a documented reason.

---

## 22. Observability and Monitoring

| ID | Signal | Purpose | Location | Alert threshold |
|---|---|---|---|---|
| OBS-001 | usage_event.cache_hit | Verify cache effectiveness. | usage_events | MISSING: baseline threshold |
| OBS-002 | usage_event.openrouter_call | Track cost-incurring calls. | usage_events | Spike over expected hourly rate |
| OBS-003 | usage_event.blocked_rate_limit | Detect abuse. | usage_events | MISSING |
| OBS-004 | usage_event.bot_blocked | Detect bots. | usage_events | MISSING |
| OBS-005 | OpenRouter usage tokens | Estimate cost. | adapter response if provided | MISSING |
| OBS-006 | analysis validation failure | Detect model/schema issues. | structured logs + usage_events | Any persistent increase |
| OBS-007 | trending job success/failure | Ensure weekly data freshness. | job logs | Missing weekly update |
| OBS-008 | sitemap page count | SEO health. | sitemap generation logs | MISSING |

Rules:
- Do not log `OPENROUTER_API_KEY`, `CRON_SECRET`, `HASH_SALT`, raw IPs, raw cookies, or raw user-agent strings.
- Include correlation IDs for `/api/analyze` and job routes.
- Log only repo_key, provider/model, status, durations, token counts if safe.

---

## 23. Risk Register

| ID | Risk | Category | Likelihood | Impact | Mitigation | Owner |
|---|---|---:|---:|---|---|
| RISK-001 | OpenRouter costs rise from many unique repo submissions because no daily budget exists. | cost/security | medium | high | Rate-limit, bot protection, cache, lock, monitoring. | dev/user |
| RISK-002 | Cache bug causes duplicate OpenRouter calls. | tech/cost | medium | high | Cache-first tests and lock tests. | dev |
| RISK-003 | Direct Gemini path remains accidentally. | tech/security | medium | medium | Search/removal test; OpenRouter adapter boundary. | dev |
| RISK-004 | LLM output breaks schema. | tech | medium | medium | Strict JSON schema and validation failure handling. | dev |
| RISK-005 | XSS from old `seoDeepDiveHtml`. | security | medium | high | Remove field and prohibit raw HTML. | dev |
| RISK-006 | Knowledge hub becomes thin or hard to navigate. | product/SEO | medium | medium | Structured data, detail templates, content review. | content/dev |
| RISK-007 | AdSense approval still denied despite preparation. | business | medium | medium | Policy-safe UX, trust pages, quality content; no guarantee. | user |
| RISK-008 | Cron route abused. | security | low | high | Bearer CRON_SECRET; no public write. | dev |
| RISK-009 | Agent changes too many unrelated files. | agent | medium | medium | Atomic tasks, allowed/prohibited files, human review. | Claude/user |
| RISK-010 | DB migration breaks deployment. | data | medium | high | Backup, migration review, rollback. | dev/user |
| RISK-011 | OpenRouter model slug changes/deprecates. | external | medium | medium | Env-configurable model and pre-deploy validation. | dev |

---

## 24. Rollback and Checkpoints

| ID | Checkpoint | Rollback strategy | Human review required |
|---|---|---|---|
| ROLLBACK-001 | Before DB migrations for cache/events/locks/trending | Backup DB; run migration in staging; keep revert migration where supported. | yes |
| ROLLBACK-002 | Before OpenRouter production activation | Keep analysis endpoint feature-flagged; disable new analyses while cached pages remain available. | yes |
| ROLLBACK-003 | Before removing old routes | Use redirects first; confirm no navigation break. | no |
| ROLLBACK-004 | Before replacing analysis schema | Preserve old cached data migration plan or compatibility parser. | yes |
| ROLLBACK-005 | Before enabling ad slots | Feature flag `ADS_ENABLED=false`; render placeholders only. | yes |
| ROLLBACK-006 | Before cron activation | Disable scheduler; job routes require CRON_SECRET. | yes |
| ROLLBACK-007 | Before public launch | Keep deployment rollback to previous stable commit. | yes |

---

## 25. Definition of Done

| ID | Done criterion | Verification |
|---|---|---|
| DOD-001 | All P0 acceptance criteria pass. | test report |
| DOD-002 | Direct Gemini API key path is removed from production analysis. | code review |
| DOD-003 | OpenRouter key is server-only and never exposed to client bundle. | security review |
| DOD-004 | Cache-hit path never calls OpenRouter. | TEST-002 |
| DOD-005 | Concurrent same repo causes max one OpenRouter call. | TEST-008 |
| DOD-006 | No raw LLM HTML rendering remains. | TEST-005 + grep |
| DOD-007 | `/github*` pages and trending jobs have no OpenRouter dependency. | TEST-006, TEST-010 |
| DOD-008 | Required SEO/legal files exist or missing legal details are marked. | TEST-011 |
| DOD-009 | Rollback plan reviewed for migrations and OpenRouter activation. | review |
| DOD-010 | No unresolved BLOCKER remains before production. | PRD review |

---

## 26. Agent Handoff Instructions

```text
You are implementing “What’s in it?” according to docs/prd/whats-in-it-openrouter-final.prd.md.
Treat the PRD as the single source of truth.

Active phase:
Execute all phases sequentially in one implementation run unless a defined BLOCKER is encountered. Do not stop after PHASE-1.

Project summary:
Build a free, no-account, no-paywall GitHub Repository Intelligence & Knowledge Hub.
Repository analysis uses GitHub metadata + README + OpenRouter Gemini model only on cache miss.
Static Git/GitHub knowledge and Weekly Top 10 must never call OpenRouter.

Allowed scope:
Only files listed in the active TASK.

Files/modules prohibited by default:
- unrelated UI redesigns
- package upgrades not required by task
- direct Gemini SDK/key usage
- client-side OpenRouter calls
- raw LLM HTML rendering
- user account/payment implementation
- global daily budget implementation

Architecture constraints:
- Keep domain/application/infrastructure/UI separate.
- External services behind ports/adapters.
- Cache lookup before OpenRouter.
- No OpenRouter import in static knowledge or trending modules.
- No business logic in React components.

Security constraints:
- Secrets server-side only.
- Never log OPENROUTER_API_KEY, CRON_SECRET, HASH_SALT, raw IP, raw user-agent.
- Validate GitHub URL server-side.
- No private repo support in MVP.
- No dangerouslySetInnerHTML for LLM output.

Sustainability constraints:
- Avoid repeated inference.
- Cache-first analysis.
- Static knowledge from data modules.
- Trending from snapshots/scoring only.
- Keep context references stable; do not paste the full encyclopedia into code comments/prompts.

Tests to run:
- npm run lint (verify exists)
- npm run test (verify exists)
- npm run build (verify exists)
- MISSING: e2e command

Expected outputs:
- Updated routes/components/services for the active phase.
- Tests linked to acceptance criteria.
- No unrelated file edits.
- Implementation notes for unresolved MISSING/OPEN questions.

Commit hints:
- phase-1-foundation-cleanup
- phase-2-cache-rate-limit-locks
- phase-3-openrouter-analysis-schema
- phase-4-github-knowledge-hub
- phase-5-weekly-top-repos
- phase-6-adsense-seo-readiness
- phase-7-launch-hardening

Rollback hints:
- Revert phase commits independently.
- Disable new analysis if OpenRouter fails.
- Keep cached analysis pages available where safe.
- Disable ads via feature flag before removing layout.

Stop and ask before:
- choosing DB provider or ORM
- running destructive migrations
- changing framework versions
- adding accounts/payments/paywalls
- adding global daily budget
- introducing direct Gemini key usage
- exposing API keys client-side
- changing privacy/legal content as final production text
- changing ad placement near copy/download/CTA buttons
- calling OpenRouter from /github or trending paths
```

---

## Final PRD Quality Checklist

- [x] Mandatory 26 sections exist.
- [x] Unknowns labeled as MISSING/ASSUMPTION/OPEN QUESTION/BLOCKER.
- [x] OpenRouter instead of direct Gemini specified.
- [x] No daily budget in MVP.
- [x] Data model explicit with indexes/permissions/lifecycle.
- [x] API/interface contracts explicit.
- [x] Architecture constraints actionable.
- [x] Security rules actionable.
- [x] Sustainability/GreenOps present.
- [x] Phases have exit criteria.
- [x] Atomic tasks are sequenced and bounded.
- [x] Acceptance criteria are verifiable.
- [x] Tests map to requirements.
- [x] Rollback and review checkpoints exist.
- [x] Agent handoff is pasteable.
