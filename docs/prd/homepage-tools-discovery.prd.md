# PRD: What’s in it — Homepage Tools & Repository Discovery Correction Sprint

## Status & confirmation

- **Status:** user-confirmed
- **Confirmed by user:** yes (2026-06-08)
- **Product Canvas (upstream, user-confirmed):** [`../canvas/homepage-tools-discovery.canvas.md`](../canvas/homepage-tools-discovery.canvas.md)
- **Phase 0.16 council-adopted deltas to the PRD body below** (the body is otherwise built literally; these supersede on conflict):
  - **Monthly projection DEFERRED.** `token-cost` may keep `monthlyRuns`/`includedCredits`/`monthlyProjection` types in code, but the monthly projection is **NOT surfaced** this sprint (placeholder prices + visible disclaimer would make a precise-looking projection erode trust). On the homepage the calculator shows **token count + per-model cost only**. Amends FR-008 / DATA-003 / AC-005: a precise monthly-spend projection is not a pass criterion this sprint; tokens + cost + disclaimer are.
  - **`/repositories` = thin reuse + `/github/trending` redirect.** Build `/repositories` by reusing existing `weekly-data` getters + a ranking explanation (not a new data layer); `/github/trending` **permanently redirects** to `/repositories`. Resolves OPEN-001/FR-013 to: redirect (not coexist).
  - **Niche hard-exclude >50k stars.** Resolves FR-006/OPEN-005 to **hard-exclude** (not penalize-only) repos >50,000 stars (TERM-004); a test enforces it (TEST-009); `nicheQualityScore`/selector threshold aligned to 50k.
- **Other Phase 0.16 outcomes:** OPEN-004 → keep standalone `/tools/*` routes AND embed tools on homepage (shared components, no duplicate impl); OPEN-003 → primary persona USER-001 (beginner), USER-002 secondary; MISSING-003 → no business KPIs this sprint (success = binary DoD/AC + OBS-001 `dailyWritten:3`/`nicheWritten:5`); BLOCKER-001/002 remain firm. Build per PRD literally otherwise (full tools, DATA-004 debugger fields, DBG-001..012 ≥12 patterns).

---

**Document ID:** PRD-WII-HOME-TOOLS-DISCOVERY-001  
**Version:** 1.0  
**Status:** Ready for Claude / Coding-Agent Execution  
**Target project:** Existing deployed Next.js/Railway/Postgres project `whats-in-it`  
**Target branch:** `wiki-update` unless a dedicated feature branch is created  
**Primary goal:** Bring the live homepage and repository discovery layer into alignment with the master vision: repository analysis, functional AI-credit/token calculator, functional Git/GitHub/Actions debugger, Daily Top 3, Weekly Top 10, Niche Discovery Top 5, and a dedicated repository discovery page.

---

## 1. Executive Summary

What’s in it currently has a functional deployment, repository analysis infrastructure, Postgres persistence, daily discovery job, GitHub knowledge area, and initial discovery sections. However, the current product still diverges from the strategic vision in several critical ways:

1. The homepage contains a non-essential example repository line under the analysis bar.
2. Daily repositories currently render as Top 5; the target is Daily Top 3.
3. Daily repositories do not visibly rotate yet and may still behave like initial/seed discovery rather than real 24-hour movement.
4. Niche/Interesting Growth repositories currently show 10 items and are still too influenced by star count or large mainstream repositories.
5. The AI-credit/token calculator is currently a dummy or incomplete tool.
6. The GitHub/Git/Actions debugger is currently a dummy or incomplete tool.
7. The calculator and debugger are not prominent enough; they must be integrated directly on the homepage.
8. There is no dedicated `/repositories` page consolidating Daily Top 3, Weekly Top 10, and Niche Discovery Top 5 with transparent ranking logic.

This PRD defines a focused implementation sprint to convert those dummy or partially implemented elements into functional, policy-safe, low-cost, user-facing product features.

---

## 2. Problem Statement

### PROBLEM-001 — Homepage does not yet express the full product value
The homepage should immediately communicate three core utilities:

- Analyze a GitHub repository.
- Estimate AI/Copilot/token-related costs locally.
- Debug Git, GitHub, and GitHub Actions errors locally.

Current state still centers mostly on repository analysis and discovery. Calculator and debugger are not functioning as real tools or are not prominent enough.

### PROBLEM-002 — Discovery does not yet match the intended ranking philosophy
Daily rankings should show the strongest daily movement. Niche Discovery should surface useful, high-quality repositories with growth potential, not giant repos that are already famous.

### PROBLEM-003 — Discovery page architecture is incomplete
A separate repository discovery page is required so the homepage can stay focused while `/repositories` becomes the full repository discovery hub.

### PROBLEM-004 — Cost-control requirements must be preserved
The master architecture requires that discovery, calculator, debugger, homepage, and knowledge content do **not** call OpenRouter/Gemini/Claude/LLM services. LLM usage remains allowed only for `/api/analyze` on cache miss.

---

## 3. Goals and Non-Goals

| ID | Type | Statement | Success Criteria |
|---|---|---|---|
| GOAL-001 | Goal | Remove the useless example repository line below the analysis input. | No visible example line under the homepage analysis bar. |
| GOAL-002 | Goal | Restructure homepage around three functional tools: repository analysis, token calculator, debugger. | Above-the-fold or early homepage shows all three tool entry points. |
| GOAL-003 | Goal | Change Daily Top 5 to Daily Top 3. | Homepage and `/repositories` render max 3 daily cards. |
| GOAL-004 | Goal | Ensure Daily Top 3 is not falsely presented as real daily movement until 24h delta exists. | Initial snapshot state is clearly labeled as preparation/sample. |
| GOAL-005 | Goal | Change Niche Discovery from 10 to 5 and enforce non-star-dominant ranking. | Homepage and `/repositories` render max 5 niche items; giant repos penalized/excluded. |
| GOAL-006 | Goal | Build functional AI-credit/token calculator. | User inputs text/code/workflow and receives token + cost estimate without network/LLM call. |
| GOAL-007 | Goal | Build functional Git/GitHub/Actions debugger. | User pastes error/log and receives matched issue, cause, fix, risk, links. |
| GOAL-008 | Goal | Create `/repositories` discovery hub. | Page shows Daily Top 3, Weekly Top 10, Niche Top 5, ranking explanation. |
| GOAL-009 | Goal | Preserve zero-cost runtime for discovery/tools. | Tests prove no OpenRouter/Gemini/LLM/network calls in calculator/debugger/discovery pageview. |
| NOGOAL-001 | Non-Goal | Build a chat-based AI debugger. | Not implemented in this sprint. |
| NOGOAL-002 | Non-Goal | Activate AdSense live. | Ads remain gated behind existing env/legal/CMP requirements. |
| NOGOAL-003 | Non-Goal | Replace Railway/Postgres architecture. | Existing deployment remains. |
| NOGOAL-004 | Non-Goal | Build private repo analysis or enterprise audit. | Out of scope. |

---

## 4. Stakeholders and Users

| ID | Role | Needs |
|---|---|---|
| USER-001 | Beginner / non-coder | Understand GitHub and fix common Git problems without jargon. |
| USER-002 | Developer | Quickly analyze repos, debug terminal/CI errors, find useful repos. |
| USER-003 | Founder / builder | Estimate AI/tooling costs and evaluate open-source dependencies. |
| USER-004 | DevOps / CI user | Diagnose GitHub Actions failures and pipeline cost risks. |
| STAKE-001 | Site owner | Low operating costs, SEO growth, AdSense readiness, no uncontrolled LLM spend. |
| STAKE-002 | Coding agent / Claude | Needs precise scope, file constraints, tests, rollback and stop conditions. |

---

## 5. Glossary

| ID | Term | Definition |
|---|---|---|
| TERM-001 | Daily Top 3 | Three repositories selected from daily discovery ranking, updated once per day by cron. |
| TERM-002 | Weekly Top 10 | Ten repositories selected from weekly ranking logic once enough snapshot history exists. |
| TERM-003 | Niche Discovery Top 5 | Five smaller or mid-size useful repos selected by quality/potential, not by total stars. |
| TERM-004 | Giant Repo | Repository with >50,000 stars or an extremely established mainstream status. |
| TERM-005 | Token Calculator | Client-side tool estimating token/cost usage from text/code/workflow input. |
| TERM-006 | GitHub Debugger | Client-side deterministic pattern matcher for Git/GitHub/GitHub Actions errors. |
| TERM-007 | LLM Cost Boundary | Rule that no LLM is called except `/api/analyze` on analysis cache miss. |
| TERM-008 | Initial Discovery Sample | First-run repository list before real 24h delta exists. Must not be labeled as true daily ranking. |

---

## 6. Assumptions, MISSING, Open Questions, Blockers

| ID | Type | Item | Impact |
|---|---|---|---|
| ASSUMPTION-001 | Assumption | Existing Next.js app uses App Router and has components for homepage/discovery. | Use existing architecture; do not rebuild. |
| ASSUMPTION-002 | Assumption | Existing `weekly_top_repositories`/ranking storage supports `period_type` after migration 0002. | Reuse existing DB layer. |
| ASSUMPTION-003 | Assumption | Calculator can use heuristic token estimation initially if tokenizer lib would increase bundle risk. | MVP can ship without exact tokenizer. |
| MISSING-001 | MISSING | Final official Copilot/GitHub AI credit pricing values. | Calculator must use editable static config and show disclaimer. |
| MISSING-002 | MISSING | Final list of sponsored/affiliate tools. | Debugger must not include undisclosed affiliate links. |
| OPEN-001 | Open Question | Should `/repositories` replace `/github/trending` in navigation or both remain? | Default: create `/repositories`; keep `/github/trending` redirect or legacy link. |
| BLOCKER-001 | Blocker | Do not embed private API keys in client-side calculator/debugger. | Blocks any browser-based Gemini/OpenRouter fallback. |
| BLOCKER-002 | Blocker | Do not present fake daily/niche rankings as real. | Blocks public trust and AdSense readiness. |

---

## 7. Scope

### In Scope

- Homepage restructuring.
- Remove example repository line under analysis input.
- Daily Top 3 instead of Daily Top 5.
- Niche Discovery Top 5 instead of 10.
- Non-star-dominant niche scoring rules.
- Functional client-side token calculator.
- Functional client-side Git/GitHub/Actions debugger.
- `/repositories` discovery page.
- Tests, no-LLM guards, build validation.

### Out of Scope

- AdSense live activation.
- CMP implementation unless already started.
- Full 30-article SEO rollout.
- Paid B2B audit features.
- Private repository OAuth analysis.
- Chat-based AI debugging.

---

## 8. User Journeys

| ID | Journey | Steps | Expected Outcome |
|---|---|---|---|
| JOURNEY-001 | Analyze repository | User enters `owner/repo` or GitHub URL → clicks analyze → analysis route opens. | Repo analysis works as before. |
| JOURNEY-002 | Estimate token cost | User pastes workflow/prompt/code → selects cost profile → clicks calculate. | Local token/cost estimate shown. |
| JOURNEY-003 | Debug Git error | User pastes `Permission denied (publickey)` log → debugger matches pattern. | Cause, fix, explanation, risk and links shown. |
| JOURNEY-004 | Browse Daily Top 3 | User opens homepage → sees three horizontal daily repo cards. | Max 3 cards, honest initial-state label if no 24h delta. |
| JOURNEY-005 | Browse Niche Discovery | User opens homepage or `/repositories` → sees 5 niche cards. | No giant repo domination; quality-focused reasons. |
| JOURNEY-006 | Open repository discovery hub | User clicks Repositories → `/repositories`. | Daily, Weekly, Niche sections plus ranking explanation. |

---

## 9. AI-Ready User Stories

| ID | Story | Acceptance Link |
|---|---|---|
| STORY-001 | As a user, I want the homepage to show real tools instead of placeholder examples, so I know what the platform does. | AC-001, AC-002 |
| STORY-002 | As a user, I want Daily Top 3 shown horizontally, so I can scan today’s most relevant repos quickly. | AC-003 |
| STORY-003 | As a user, I want Niche Finds to show useful smaller repos, not just famous repos. | AC-004 |
| STORY-004 | As a user, I want to estimate token/cost impact without uploading files to a server. | AC-005 |
| STORY-005 | As a user, I want to paste a Git/GitHub/Actions error and get a deterministic fix explanation. | AC-006 |
| STORY-006 | As a user, I want a dedicated repository discovery page. | AC-007 |
| STORY-007 | As the owner, I want no LLM costs from discovery/tools/homepage. | AC-008 |

---

## 10. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---:|---|
| FR-001 | Remove homepage example repo sentence/chips under analysis input. | P0 | Remove `vercel/next.js`, `shadcn-ui/ui`, `badlogic/pi-mono` example line. |
| FR-002 | Homepage must show three primary tool cards/sections: Analyze, Token Calculator, GitHub Debugger. | P0 | These must be functional, not dead cards. |
| FR-003 | Daily Top section must render max 3 cards. | P0 | Desktop horizontal grid of 3. |
| FR-004 | Daily Top must use real daily ranking only if 24h delta/sufficient snapshot exists. | P0 | Otherwise show honest initial/preparing label. |
| FR-005 | Niche Discovery must render max 5 cards. | P0 | Exclude/penalize giant repos. |
| FR-006 | Niche scoring must not be dominated by total stars/forks. | P0 | Stars only supporting metadata. |
| FR-007 | Token Calculator must calculate locally from text/code input. | P0 | No server upload, no API call. |
| FR-008 | Token Calculator must show tokens, estimated cost, monthly projection, disclaimer. | P0 | Use static configurable rates. |
| FR-009 | Debugger must match common Git/GitHub/Actions errors via local pattern DB. | P0 | No chat/LLM requirement. |
| FR-010 | Debugger output must include cause, technical explanation, fix, risk warning, related links. | P0 | Copy-paste fix allowed. |
| FR-011 | Create `/repositories` page. | P0 | Daily Top 3, Weekly Top 10, Niche Top 5, ranking logic. |
| FR-012 | Update nav to include Repositories, Token Calculator, GitHub Debugger where space permits. | P1 | Mobile menu acceptable. |
| FR-013 | Keep `/github/trending` working or redirect to `/repositories`. | P1 | Avoid broken links. |

---

## 11. Non-Functional Requirements

| ID | Requirement | Metric / Test |
|---|---|---|
| NFR-001 | No LLM/network call from token calculator. | Unit/e2e spy or code-level guard. |
| NFR-002 | No LLM/network call from debugger. | Unit/e2e spy or code-level guard. |
| NFR-003 | Homepage pageview must not call GitHub API or OpenRouter. | Existing no-LLM guard extended; server logs or test mocks. |
| NFR-004 | Mobile layout must remain readable. | e2e viewport smoke. |
| NFR-005 | Light/Dark mode must preserve contrast. | Visual/manual plus class/token tests where available. |
| NFR-006 | Build must remain green. | `npm run build`. |
| NFR-007 | No false ranking claims. | Tests for initial sample labels. |
| NFR-008 | Tools must work without external credentials. | Calculator/debugger no env vars. |

---

## 12. Data Model / Core Entities

### DATA-001 RepositoryRanking

```ts
type RepositoryRanking = {
  repoKey: string
  owner: string
  repo: string
  name: string
  description: string | null
  language: string | null
  topics: string[]
  stars: number
  forks: number
  score: number
  rank: number
  periodType: "daily" | "weekly" | "niche"
  dataSource: "github_api" | "seed" | "curated" | "fallback"
  isFallback: boolean
  calculatedAt: string
  reason: string
}
```

### DATA-002 TokenCalculatorInput

```ts
type TokenCalculatorInput = {
  inputText: string
  expectedOutputTokens?: number
  modelProfileId: string
  monthlyRuns?: number
  includedCredits?: number
}
```

### DATA-003 TokenCalculatorResult

```ts
type TokenCalculatorResult = {
  estimatedInputTokens: number
  estimatedOutputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  monthlyProjection: number
  disclaimer: string
}
```

### DATA-004 DebugPattern

```ts
type DebugPattern = {
  id: string
  title: string
  matchers: string[]
  category: "git" | "github" | "actions" | "deployment" | "node" | "auth"
  severity: "info" | "warning" | "danger"
  simpleCause: string
  technicalCause: string
  fixCommands: string[]
  explanation: string
  relatedLinks: { label: string; href: string }[]
  riskWarning?: string
}
```

### Required Debug Patterns for MVP

| ID | Pattern |
|---|---|
| DBG-001 | permission denied publickey |
| DBG-002 | exit code 127 |
| DBG-003 | exit code 137 |
| DBG-004 | merge conflict |
| DBG-005 | detached HEAD |
| DBG-006 | non-fast-forward push rejected |
| DBG-007 | repository not found |
| DBG-008 | authentication failed |
| DBG-009 | large file detected |
| DBG-010 | npm command not found |
| DBG-011 | next build failed |
| DBG-012 | railway deploy failed |

---

## 13. API / Interface Requirements

| ID | Interface | Requirement |
|---|---|---|
| API-001 | `GET /repositories` | Render Daily Top 3, Weekly Top 10, Niche Top 5 from stored rankings. |
| API-002 | `POST /api/jobs/update-daily-discovery` | Continue daily ranking generation; adapt daily limit to 3, niche limit to 5. |
| API-003 | Token Calculator component | Client-only calculation; no API endpoint required. |
| API-004 | Debugger component | Client-only deterministic matching; no API endpoint required. |
| API-005 | Existing `/api/analyze` | Unchanged; LLM allowed only on cache miss. |

---

## 14. Architecture Constraints

| ID | Constraint |
|---|---|
| ARCH-001 | Do not rebuild the app. Extend existing Next.js project. |
| ARCH-002 | Keep domain/application/infrastructure boundaries. Business scoring logic belongs in domain/lib, not UI components. |
| ARCH-003 | Calculator and debugger must be deterministic client-side modules. |
| ARCH-004 | Do not place API keys, OpenRouter keys, GitHub tokens, or private secrets in browser code. |
| ARCH-005 | Discovery pageviews must read persisted DB rankings only. |
| ARCH-006 | No global uncontrolled state for calculator/debugger. |
| ARCH-007 | Use existing theme system and design language. |
| ARCH-008 | Keep existing successful migration/deploy setup. |

Recommended module boundaries:

```txt
src/lib/discovery/        ranking filters, niche scoring, daily selectors
src/lib/token-cost/       token estimation and model profiles
src/lib/debugger/         patterns, matching engine, result formatting
src/components/home/      homepage sections only
src/components/tools/     calculator/debugger UI wrappers
src/app/repositories/     repository discovery hub route
```

---

## 15. Security, Privacy, Compliance

| ID | Requirement |
|---|---|
| SEC-001 | Calculator must not upload pasted text/files to server. |
| SEC-002 | Debugger must not upload pasted logs to server. |
| SEC-003 | Do not log user-entered calculator/debugger content. |
| SEC-004 | Do not embed private API keys in frontend. |
| SEC-005 | AdSense remains disabled until legal/CMP/Publisher ID are final. |
| SEC-006 | Debugger fixes that can delete data (`reset --hard`, `clean -fd`) must show danger warnings. |
| SEC-007 | No claim that calculator outputs official GitHub bills. |

---

## 16. Sustainability / GreenOps / Cost Controls

| ID | Rule |
|---|---|
| SUS-001 | Daily/Weekly/Niche discovery runs once daily only. |
| SUS-002 | Homepage and `/repositories` do not call GitHub API at pageview. |
| SUS-003 | Calculator/debugger run locally and do not invoke LLMs. |
| SUS-004 | Keep bundle size monitored; if tokenizer library is heavy, use heuristic estimator for MVP. |
| SUS-005 | Reuse cached/persisted rankings. |
| SUS-006 | LLM cost boundary: only `/api/analyze` cache miss may call OpenRouter. |

---

## 17. Context Engineering Artifacts

### CTX-001 AGENTS.md update recommendation

```md
## Homepage Tools & Discovery Rules
- Do not use OpenRouter/Gemini/LLM for homepage, calculator, debugger, or discovery.
- Daily Top renders max 3 cards.
- Niche Discovery renders max 5 cards.
- Niche scoring must not be dominated by total stars.
- Calculator and debugger are client-side only.
- Do not embed secrets in browser code.
```

### CTX-002 llms.txt update recommendation

```txt
What’s in it provides repository analysis, GitHub knowledge, repository discovery, a local token-cost calculator, and a deterministic Git/GitHub/Actions debugger. Discovery and tools do not call LLMs. LLM use is restricted to repository analysis cache misses.
```

---

## 18. Implementation Phases

| ID | Phase | Objective | Exit Criteria |
|---|---|---|---|
| PHASE-1 | Homepage Cleanup | Remove example line; restructure homepage tool order. | Example line gone; Analyze/Calculator/Debugger visible. |
| PHASE-2 | Calculator | Build functional local token calculator. | Calculator returns token/cost estimates with tests. |
| PHASE-3 | Debugger | Build local deterministic debugger. | At least 12 patterns matched with fixes. |
| PHASE-4 | Discovery Correction | Daily Top 3 and Niche Top 5 with improved scoring. | Max counts enforced; niche not star-dominant. |
| PHASE-5 | `/repositories` Page | Create repository discovery hub. | Route renders Daily/Weekly/Niche + ranking explanation. |
| PHASE-6 | Tests & Guards | Extend no-LLM, UI, e2e tests. | Lint/test/build/e2e green. |
| PHASE-7 | Deploy Readiness | Prepare deploy notes and rollback. | Migration status checked; no new env required. |

---

## 19. Atomic Task Breakdown

| ID | Task | Allowed Files/Modules | Forbidden | ACs | Tests |
|---|---|---|---|---|---|
| TASK-001 | Remove homepage example repo line. | homepage components | API routes | AC-001 | TEST-001 |
| TASK-002 | Add homepage section layout: Analyze, Calculator, Debugger. | homepage/components/tools | LLM API | AC-002 | TEST-002 |
| TASK-003 | Implement token estimator module. | `src/lib/token-cost/*` | server API, env secrets | AC-005 | TEST-005 |
| TASK-004 | Implement calculator UI. | `src/components/tools/*` | file upload to server | AC-005 | TEST-006 |
| TASK-005 | Implement debug pattern DB. | `src/lib/debugger/*` | LLM fallback | AC-006 | TEST-007 |
| TASK-006 | Implement debugger UI. | `src/components/tools/*` | server log upload | AC-006 | TEST-008 |
| TASK-007 | Update Daily Top to max 3. | discovery selectors/components | DB destructive changes | AC-003 | TEST-009 |
| TASK-008 | Update Niche Top to max 5 and score. | discovery scoring | star-dominant sort | AC-004 | TEST-010 |
| TASK-009 | Create `/repositories` page. | `src/app/repositories/*` | breaking `/github/trending` | AC-007 | TEST-011 |
| TASK-010 | Update navigation. | nav/header components | remove legal links | AC-009 | TEST-012 |
| TASK-011 | Extend no-LLM guards. | tests/lib | disabling analyze LLM | AC-008 | TEST-013 |
| TASK-012 | Run validation and report. | docs/launch optional | new features | DOD | All |

---

## 20. Acceptance Criteria

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | Homepage loads | User views hero area | No example repo sentence/chips are visible under analysis input. |
| AC-002 | Homepage loads | User scrolls first viewport/early page | Analyze, Token Calculator, and Debugger are visible and usable. |
| AC-003 | Daily rankings exist | Homepage or `/repositories` renders | No more than 3 Daily cards appear. |
| AC-004 | Niche rankings exist | Homepage or `/repositories` renders | No more than 5 Niche cards appear; giant repos excluded/penalized. |
| AC-005 | User enters text in calculator | User clicks calculate | Token count, cost estimate and disclaimer display. **(Monthly projection DEFERRED — see Status block §0 / Vision NG-001; not a pass criterion this sprint.)** |
| AC-006 | User pastes known Git/Actions error | User clicks analyze/debug | Matched error, cause, fix, risk and related links display. |
| AC-007 | User opens `/repositories` | Page loads | Daily Top 3, Weekly Top 10, Niche Top 5 and ranking explanation render. |
| AC-008 | User uses calculator/debugger/discovery | Feature runs | No OpenRouter/Gemini/Claude/LLM call occurs. |
| AC-009 | Header renders | User views nav | Repositories, Calculator and Debugger are reachable. |
| AC-010 | No 24h delta exists | Daily section renders | Section is labeled as preparing/initial sample, not true daily ranking. |

---

## 21. Test Strategy

| ID | Test | Type | Command |
|---|---|---|---|
| TEST-001 | Homepage no example repo line. | Unit/e2e | `npm run test` / `npm run test:e2e` |
| TEST-002 | Homepage renders three tools. | e2e | `npm run test:e2e` |
| TEST-003 | Calculator no network call. | Unit | `npm run test` |
| TEST-004 | Calculator estimates tokens/cost. | Unit | `npm run test` |
| TEST-005 | Debugger matches 12 patterns. | Unit | `npm run test` |
| TEST-006 | Debugger renders fix/risk/links. | Component/e2e | `npm run test:e2e` |
| TEST-007 | Daily max 3. | Unit/e2e | `npm run test` |
| TEST-008 | Niche max 5. | Unit/e2e | `npm run test` |
| TEST-009 | Niche excludes/penalizes >50k star giant repos. | Unit | `npm run test` |
| TEST-010 | `/repositories` renders all sections. | e2e | `npm run test:e2e` |
| TEST-011 | No LLM call for homepage/tools/discovery. | Unit/e2e guard | `npm run test` |
| TEST-012 | Build remains green. | Build | `npm run build` |

Required validation commands:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

---

## 22. Observability / Monitoring

| ID | Signal | Requirement |
|---|---|---|
| OBS-001 | Discovery job response | Report `dailyWritten: 3`, `nicheWritten: 5` after update. |
| OBS-002 | Tool usage | Do not log raw pasted content. Optional aggregate counters only. |
| OBS-003 | Error rate | Calculator/debugger should not produce server errors because they are client-side. |
| OBS-004 | OpenRouter usage | Must not increase from tool/discovery usage. |

---

## 23. Risk Register

| ID | Risk | Severity | Mitigation |
|---|---|---:|---|
| RISK-001 | Calculator produces inaccurate estimates. | Medium | Show disclaimer; use configurable model profiles. |
| RISK-002 | Debugger gives dangerous command. | High | Risk badge and warnings for destructive commands. |
| RISK-003 | Niche scoring still dominated by popularity. | High | Unit test giant repo penalty and low star dominance. |
| RISK-004 | Homepage becomes too crowded. | Medium | Use concise cards/accordions; mobile responsive sections. |
| RISK-005 | Hidden network calls create cost. | High | No-LLM/no-network tests. |
| RISK-006 | Existing discovery DB query breaks. | High | Preserve old routes; add tests and rollback. |

---

## 24. Rollback and Checkpoints

| ID | Checkpoint | Rollback |
|---|---|---|
| ROLLBACK-001 | Before homepage restructuring | Revert homepage component commit. |
| ROLLBACK-002 | After calculator/debugger modules | Disable sections via feature flag or remove imports. |
| ROLLBACK-003 | After discovery selector changes | Restore Daily 5/Niche 10 selectors from prior commit if required. |
| ROLLBACK-004 | After `/repositories` route | Remove route or hide nav link; keep `/github/trending`. |
| ROLLBACK-005 | Before deploy | Ensure `git status` clean and tests green. |

Human Review required for:

- Any destructive Git command suggested by debugger.
- Any change to LLM cost boundary.
- Any change to AdSense/ads live activation.
- Any DB migration beyond non-destructive ranking fields.

---

## 25. Definition of Done

| ID | DoD Item |
|---|---|
| DOD-001 | Homepage example repo line removed. |
| DOD-002 | Homepage includes functional Analyze, Calculator, Debugger sections. |
| DOD-003 | Token calculator works locally and displays estimates. |
| DOD-004 | Debugger matches at least 12 common errors. |
| DOD-005 | Daily Top renders max 3. |
| DOD-006 | Niche Discovery renders max 5. |
| DOD-007 | Niche score is not star-dominant. |
| DOD-008 | `/repositories` exists and renders Daily/Weekly/Niche. |
| DOD-009 | No LLM calls from homepage, discovery, calculator, debugger. |
| DOD-010 | Navigation links to calculator/debugger/repositories. |
| DOD-011 | Lint/test/build/e2e green. |
| DOD-012 | Deploy notes include discovery re-run and smoke tests. |

---

## 26. Agent Handoff

```text
You are working on the existing What’s in it Next.js project. Do not build a new app.

Objective:
Bring the homepage and repository discovery layer into alignment with the master vision.

Required changes:
1. Remove the example repository line/chips below the homepage analysis input.
2. Restructure homepage so it prominently includes:
   - Repository Analyzer
   - AI-Credit / Token Calculator
   - GitHub / Git / Actions Debugger
   - Daily Top 3 horizontal
   - Weekly Top 10 preview
   - Niche Discovery Top 5 preview
3. Replace Daily Top 5 with Daily Top 3.
4. Replace Niche Discovery 10 with Niche Discovery Top 5.
5. Fix Niche scoring so total stars do not dominate.
6. Exclude or strongly penalize giant repos >50k stars for niche discovery unless explicitly curated.
7. Build functional client-side token calculator.
8. Build functional client-side debugger using deterministic local pattern matching.
9. Create `/repositories` page with Daily Top 3, Weekly Top 10, Niche Top 5 and ranking explanation.
10. Extend tests and no-LLM guards.

Hard constraints:
- No OpenRouter/Gemini/Claude/LLM calls for homepage, calculator, debugger, discovery or `/repositories`.
- LLM remains allowed only in `/api/analyze` on cache miss.
- Do not upload calculator/debugger input to server.
- Do not embed secrets in browser code.
- No fake ranking labels.
- Do not activate AdSense.

Validation:
Run:
- npm run lint
- npm run test
- npm run build
- npm run test:e2e

Stop and ask if:
- You need to change LLM boundary.
- You need a destructive DB migration.
- You cannot determine existing ranking schema.
- You would need to expose secrets client-side.
```

---

## Quality Gate

| Dimension | Target |
|---|---:|
| Clarity | 5/5 |
| Agent Executability | 5/5 |
| Architecture Quality | 5/5 |
| Cost Safety | 5/5 |
| Security/Privacy | 5/5 |
| Testability | 5/5 |
| Sustainability | 5/5 |

**Final status:** Ready for implementation by Claude/coding agent.
