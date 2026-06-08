# Product Canvas — homepage-tools-discovery

> Upstream value-alignment artifact for the **Homepage Tools & Repository Discovery
> Correction Sprint**. This is a *correction* sprint on an already-deployed product, not a
> greenfield build. Fields are grounded in the **real current repo state** (branch
> `feature/homepage-tools-discovery`), verified by reading source, not assumed.

**Feature:** `homepage-tools-discovery`
**Repo:** `/Users/vincentschnetzer/Documents/AI/Whatsinit/whats-in-it`
**Branch:** `feature/homepage-tools-discovery`
**Status:** user-confirmed
**Confirmed by user:** yes (2026-06-08, re-confirmed after Phase 0.16 council amendment; projection deferred)
**PRD source of truth:** [`docs/prd/homepage-tools-discovery.prd.md`](../prd/homepage-tools-discovery.prd.md)
**Authored:** 2026-06-08
**Note:** No `docs/templates/product-canvas.template.md` exists in this repo; the ten
mandatory fields are authored directly. (See OPEN-002.)

## User decisions (2026-06-08) — pending explicit Canvas confirmation
Recorded from the brainstorming gate; resolve the previously-open blockers/questions:
- **MISSING-001 → resolved (amended by council 0.16):** Calculator ships **placeholder rates + visible disclaimer** (no official-bill claim, SEC-007). On the homepage it shows **token count + per-model cost only**. The **monthly projection is DEFERRED** until real verified prices exist (council #1: a precise-looking projection on fake rates erodes trust). `monthlyRuns`/`includedCredits`/`monthlyProjection` types may exist in code but the projection is NOT surfaced this sprint.

## Phase 0.16 council outcome (2026-06-08)
Thin challenge council ran (Challenger/Advisor/Critic). User-adopted points:
- Defer monthly projection on placeholder prices (amends MISSING-001 above).
- Build per PRD literally otherwise (full tools, DATA-004 debugger fields, DBG-001..012 ≥12 patterns) — NOT a minimal embed.
- `/repositories` = thin reuse of existing `weekly-data` getters + ranking explanation; `/github/trending` redirects.
Council points noted but NOT adopted as scope changes (tracked as risks): discovery-needs-traffic (Critic #1), debugger coverage ceiling (Critic #3), homepage crowding (RISK-004 — mitigate with compact/responsive layout), no engagement telemetry (MISSING-003, deferred). Repo-hygiene: delete stray `src/app/layout 2.tsx` during Phase 1.
- **OPEN-001 → resolved:** `/repositories` is the canonical discovery hub; `/github/trending` **permanently redirects** to it.
- **OPEN-004 → resolved:** Tools are **embedded on the homepage AND** the standalone `/tools/ai-credit-calculator` + `/tools/debugger` routes are **kept** (shared components, no duplicate impl).
- **OPEN-005 → resolved:** Niche discovery **hard-excludes repos >50k stars** (TERM-004); a test enforces it; `nicheQualityScore`/selector threshold aligned to 50k.
- **OPEN-003 → default (confirm):** Primary persona = USER-001 (beginner); USER-002 (developer) secondary — governs homepage-density trade-offs.
- **MISSING-003 → default (confirm):** No business KPIs this sprint; success = the binary DoD/AC + `dailyWritten:3`/`nicheWritten:5` (OBS-001). KPIs deferred, flagged, not blocking Phase 1.
- **OPEN-002 → default (confirm):** Ad-hoc 10-field Canvas structure accepted (no template in repo).
- **BLOCKER-001 / BLOCKER-002 → remain firm** through development (no client secrets; no fake rankings presented as real).

---

## Allowed change scope

The PRD's atomic task table (§19), architecture constraints (§14), and recommended module
boundaries permit changes **only** to the following repo-relative paths. Anything outside
this list is out of scope and requires a new requirement / user decision.

- `src/app/page.tsx` — homepage (remove example line, restructure, embed tool entry points)
- `src/components/home/*` — new homepage section components (does **not** exist yet)
- `src/components/tools/*` — calculator/debugger UI wrappers (does **not** exist yet)
- `src/components/DailyTopRepos.tsx` — Daily Top: 5 → 3
- `src/components/NicheFinds.tsx` — Niche: 10 → 5
- `src/lib/discovery/*` — `scoring.ts` (+ `scoring.test.ts`) niche/daily ranking logic
- `src/lib/token-cost.ts` — token estimation, model profiles, monthly projection
- `src/components/TokenCalculator.tsx` — calculator UI (add monthlyRuns/includedCredits/projection)
- `src/lib/debugger/*` **or** `src/lib/error-matcher.ts` — debugger matching engine
  (today the engine is `src/lib/error-matcher.ts`; PRD §14 suggests `src/lib/debugger/`)
- `src/data/error-patterns.ts` — debug pattern DB (extend to the DBG-001..012 set)
- `src/app/repositories/*` — new discovery hub route (does **not** exist yet)
- `nav in src/app/layout.tsx` — header/footer nav links
- tests (`*.test.ts`, e2e specs)
- docs (`docs/**`)

Also touched in practice (read-only or supporting, within spirit of scope):
- `src/lib/weekly-data.ts` — `getDailyTop`/`getNiche` read limits (currently slice 5 / no cap)
- `src/lib/trending.ts` — discovery job `rankBy(..., topN)` for niche=10 → 5, plus `dailyWritten`/`nicheWritten` observability
- `src/app/tools/*` — existing standalone tool routes (`/tools`, `/tools/ai-credit-calculator`, `/tools/debugger`)

---

## 1. Problem

The deployed `whats-in-it` product diverges from its master vision in eight concrete,
verifiable ways. The homepage and discovery layer under-communicate the product's value and
contain elements that risk user trust and AdSense readiness.

Verified current state (this is a correction sprint — most of these are *partial*, not absent):

| PRD ask | Real current state (verified) | Classification |
|---|---|---|
| FR-001: remove example repo line | **Still present** in `src/app/page.tsx` L61–68 (`vercel/next.js`, `shadcn-ui/ui`, `badlogic/pi-mono`) | NOT done |
| FR-002: homepage shows Analyze + Calculator + Debugger | Homepage has Analyze form + Daily/Weekly/Niche only. Calculator & Debugger live on a **separate `/tools` route**, not embedded on homepage | PARTIAL (tools exist, not on homepage) |
| FR-003: Daily Top max 3 | `DailyTopRepos.tsx` hardcodes "Daily Top 5", `.slice(0,5)`, `lg:grid-cols-5`; `weekly-data.getDailyTop` slices 5; job `trending.ts` `rankBy(..., 5)` | NOT done (is 5) |
| FR-004/AC-010: honest initial-state label | Partial: `isFallback` → "Beispiel-Auswahl" badge + "is being prepared" empty state exist; not yet a 24h-delta-gated label | PARTIAL |
| FR-005: Niche max 5 | `NicheFinds.tsx` renders **all** items (no slice cap); job writes 10 (`trending.ts:180` `topN=10`) | NOT done (is 10) |
| FR-006/TEST-009: niche excludes/penalizes >50k giants | `nicheQualityScore` **penalizes** (band=12 for >20k stars) but does **not exclude** giants; test only asserts a small repo *can* outrank a giant, not >50k exclusion | PARTIAL (penalize yes, exclude no) |
| FR-007/008, DATA-002/003: calculator local + monthly projection + monthlyRuns + includedCredits | Calculator is real & client-side (`gpt-tokenizer`, FileReader, no upload). **Missing:** `monthlyRuns`, `includedCredits` inputs, `monthlyProjection` output, per-model `disclaimer` field | PARTIAL |
| FR-009/010, DATA-004, DBG-001..012: debugger patterns | Real client-side matcher; **13 patterns** but only `git`/`actions` tools. Missing DBG: exit code 127, exit code 137, repository not found, large file detected, npm command not found, next build failed, railway deploy failed. `ErrorPattern` lacks DATA-004 fields (`category`, `severity`, `technicalCause`, `fixCommands` vs `fix`, `riskWarning`) | PARTIAL |
| FR-011/AC-007: `/repositories` hub | **Does not exist** (`src/app/repositories/` absent); `/github/trending` exists | NOT done |
| FR-012/AC-009: nav for Repositories/Calculator/Debugger | Nav has `/tools` + `/github/trending` ("Discover"). No `/repositories`, no direct Calculator/Debugger links | PARTIAL |

---

## 2. Target user / customer

Per PRD §4. No new persona is introduced by this sprint.

- **USER-001 — Beginner / non-coder:** wants to understand GitHub and fix common Git
  problems without jargon (German-language UI).
- **USER-002 — Developer:** wants to quickly analyze repos, debug terminal/CI errors, and
  find useful (non-mega) repos.
- **USER-003 — Founder / builder:** wants to estimate AI/tooling costs and evaluate
  open-source dependencies before committing.
- **USER-004 — DevOps / CI user:** wants to diagnose GitHub Actions failures and pipeline
  cost risk.
- **STAKE-001 — Site owner:** low operating cost, SEO growth, AdSense readiness, **no
  uncontrolled LLM spend**.
- **STAKE-002 — Coding agent / Claude:** needs precise scope, file constraints, tests,
  rollback and stop conditions.

`OPEN QUESTION` — Primary persona ranking: the PRD lists four user types with equal weight.
For value/UX trade-offs (e.g. homepage density, RISK-004), which persona is primary —
beginner (USER-001) or developer (USER-002)? → OPEN-003.

---

## 3. Current workaround

What users / the owner do **today**, in the real deployed product, because the corrected
behavior does not yet exist:

- **Tools discovery:** Calculator and Debugger already work but are buried at `/tools`
  (and `/tools/ai-credit-calculator`, `/tools/debugger`), reachable only via the nav
  "Tools" link. A homepage visitor does not see them; the homepage advertises only repo
  analysis + discovery lists. Workaround = user must already know the `/tools` page exists.
- **Repository discovery:** there is **no `/repositories` hub**. Discovery is split across
  the homepage sections and `/github/trending` (Weekly Top 10). Users navigate piecemeal.
- **Example repos:** the homepage still nudges users toward three hardcoded famous repos
  (`vercel/next.js`, `shadcn-ui/ui`, `badlogic/pi-mono`) as the implicit "what to do here",
  rather than surfacing the real tools.
- **Cost estimation:** founders estimate AI costs externally (provider pricing pages /
  spreadsheets); the in-app calculator exists but uses **placeholder prices** and has no
  monthly projection, so it cannot replace that workaround yet.
- **Niche discovery quality:** the niche list already de-emphasizes raw stars (growth-band
  scoring), but giants are only penalized, not excluded, and the list shows 10 not 5 — so
  it does not yet fully match the "useful smaller repos, not famous repos" intent.

This Canvas reflects a **correction** of partially-built features, not a greenfield build.

---

## 4. Value proposition

After this correction sprint, the homepage immediately communicates and lets users *act on*
three free, local, zero-LLM-cost utilities, plus honest repository discovery:

1. **Analyze** a public GitHub repository (existing flow, unchanged — LLM only on cache miss).
2. **Estimate AI/token cost** locally in the browser (no upload, no LLM), now with a
   **monthly projection** and credit/run inputs so a founder can judge real monthly spend.
3. **Debug** Git / GitHub / Actions errors locally and deterministically, with cause, fix,
   risk warnings, and links — covering the DBG-001..012 error set.
4. **Discover** repositories honestly: Daily Top **3**, Weekly Top 10, Niche Top **5** with
   transparent, non-star-dominant ranking and no fake "today's movement" claims.

Differentiators that already partially hold and must be preserved:
- **Zero marginal LLM/network cost** for homepage, tools, and discovery (only `/api/analyze`
  cache-miss may call OpenRouter).
- **Privacy:** calculator/debugger input never leaves the browser, never logged.
- **Trust / honesty:** no fabricated rankings; initial samples are labeled as samples.

`ASSUMPTION (unconfirmed)` — Embedding the tools on the homepage (vs keeping `/tools`)
increases perceived value and usage. Not validated; success metric depends on OPEN-001/004.

---

## 5. Success signal

How we know the sprint delivered value. These map to PRD DoD/AC but are stated as
observable signals. **All numeric thresholds below are `OPEN QUESTION`** — the PRD defines
binary pass/fail (DoD) and observability counters (OBS-001 `dailyWritten:3`,
`nicheWritten:5`), but **no business KPIs / targets**.

Binary (verifiable, from PRD — these are firm):
- Homepage has no example-repo line (AC-001).
- Homepage exposes usable Analyze + Calculator + Debugger (AC-002).
- Daily renders ≤3 (AC-003); Niche renders ≤5, giants excluded/penalized (AC-004).
- Calculator shows tokens + cost + **monthly projection** + disclaimer (AC-005).
- Debugger matches ≥12 patterns with cause/fix/risk/links (AC-006, DoD-004).
- `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + ranking explanation (AC-007).
- No LLM/network call from homepage/tools/discovery (AC-008, NFR-001/002/003).
- `lint`, `test`, `build`, `test:e2e` green (DoD-011); discovery job reports
  `dailyWritten:3`, `nicheWritten:5` (OBS-001).

Business signals (`MISSING` targets — must be set by user before "success" can be judged):
- Tool engagement: calculator/debugger usage rate after homepage embed — `MISSING` target → MISSING-003.
- Discovery engagement: click-through on Daily/Niche cards or `/repositories` — `MISSING` target.
- SEO/AdSense readiness signal — `MISSING` (and AdSense stays disabled, NOGOAL-002/SEC-005).

---

## 6. Core use case

The single most important end-to-end flow this sprint must make true (composite of
JOURNEY-002/003/004/006):

> A first-time German-speaking visitor lands on the homepage and, **without leaving it and
> without any account, upload, or AI cost**, can (a) see and use the Repository Analyzer,
> the Token Calculator, and the Git/GitHub/Actions Debugger as the three primary tools, and
> (b) scan an honest Daily Top 3 and Niche Top 5; from there a single nav/link reaches the
> `/repositories` hub showing Daily 3 / Weekly 10 / Niche 5 with a transparent explanation
> of how repos are ranked.

Concrete acceptance for the core use case:
- Paste `Permission denied (publickey)` → debugger returns matched cause + fix steps + links
  (already works; must remain after refactor).
- Paste a prompt → calculator returns token count + per-model cost + **monthly projection**
  (projection is the new part).
- Daily section never claims real 24h movement unless a delta exists (AC-010).

---

## 7. Non-goals

From PRD §3 (NOGOAL-001..004) and §7 "Out of Scope" — explicitly **not** in this sprint:

- No chat-based / LLM-backed AI debugger (NOGOAL-001). Debugger stays deterministic + local.
- No live AdSense activation; ads remain gated behind env/legal/CMP (NOGOAL-002, SEC-005).
- No replacement of the Railway/Postgres architecture (NOGOAL-003); extend, do not rebuild
  (ARCH-001).
- No private-repo / OAuth / enterprise-audit analysis (NOGOAL-004).
- No full 30-article SEO rollout; no CMP implementation (unless already started); no paid
  B2B audit features.
- No change to the LLM cost boundary — LLM remains allowed **only** on `/api/analyze` cache
  miss (TERM-007, SUS-006). Any change here is a hard stop (see §8).
- No destructive DB migration; only non-destructive ranking fields if needed (ROLLBACK,
  §24 "Human Review required").

---

## 8. Risks / contradictions

### Product / trust risks
- **BLOCKER-002 (carried from PRD):** Daily/Niche rankings must **not** be presented as real
  when no 24h delta / sufficient snapshot exists. Halts trust + AdSense readiness if
  violated. Current code has honest fallbacks but the 3-card daily + 24h-gated label is not
  yet complete (FR-004/AC-010). → Must be satisfied; cannot be assumption-laundered.
- **MISSING-001 (carried, product-critical):** Final official Copilot/GitHub-AI credit
  pricing is unknown. `src/lib/token-cost.ts` ships **placeholder** rates with a disclaimer.
  Until real values exist, the calculator must stay placeholder + visible disclaimer; it may
  **not** claim to reproduce official bills (SEC-007). → blocks "accurate cost" value claim.
- **RISK-002 (High):** debugger may suggest destructive commands (`reset --hard`,
  `clean -fd`). DATA-004's `severity`/`riskWarning` fields are **not yet present** in
  `error-patterns.ts`; must be added (SEC-006) before such patterns ship.
- **RISK-004 (Medium):** homepage could become crowded once 3 tools + 3 discovery sections
  are embedded; trade-off depends on primary persona (OPEN-003).

### Contradictions to resolve (do not silently pick a side)
- **OPEN-001 (PRD) — nav:** does `/repositories` **replace** `/github/trending` in nav, or
  do both remain? PRD default = create `/repositories`, keep `/github/trending` as
  redirect/legacy. Current nav links `/github/trending` ("Discover"). Needs a decision.
- **OPEN-004 — tools location contradiction:** Tools already exist as standalone routes
  (`/tools`, `/tools/ai-credit-calculator`, `/tools/debugger`) AND the PRD wants them
  **embedded on the homepage** (FR-002) and reachable via nav (FR-012). Do the standalone
  `/tools` pages **stay, get replaced, or both**? PRD does not say. → OPEN QUESTION.
- **FR-006 wording ("excludes/penalizes") vs current "penalizes only":** TEST-009 requires
  >50k giants be *excluded or penalized*. Code penalizes (band=12 >20k) but does not
  exclude, and the band threshold is 20k not the TERM-004 50k "Giant Repo" definition.
  Need user/PO to confirm: hard-exclude >50k, or penalize-is-enough? → OPEN-005.

### Verification status of external/foreign-artifact claims
- **token pricing values:** external provider pricing — `ungeprüft` (placeholders only).
  Stays placeholder + disclaimer until verified; **not** downgraded to "documented risk"
  as a working premise (MISSING-001 governs).
- **`gpt-tokenizer` library behavior** (tokenization for non-OpenAI models): in-repo
  dependency, used in `TokenCalculator.tsx`; the UI already discloses non-OpenAI models may
  differ — `belegt` for OpenAI-family, `ableitbar`/disclosed-approx for others.

### Carried-over PRD items (not re-litigated here, tracked)
- ASSUMPTION-001/002/003, MISSING-002 (affiliate tools), BLOCKER-001 (no client-side
  secrets), OPEN-001 — all remain as recorded in PRD §6. BLOCKER-001 is firm and aligns with
  ARCH-004/SEC-004; no contradiction.

---

## 9. Evidence needed

Before the Canvas can move to `user-confirmed` and before development closes, the following
evidence / decisions are required (none may be silently assumed):

- **MISSING-001:** Real Copilot/GitHub-AI + model token pricing, OR explicit user approval
  that the calculator ships **placeholder + disclaimer only** for this sprint.
- **OPEN-001:** Nav decision — `/repositories` replaces vs coexists with `/github/trending`.
- **OPEN-004:** Fate of standalone `/tools` routes once tools are embedded on the homepage.
- **OPEN-005:** Niche giants — hard-exclude >50k (TERM-004) vs penalize-only; align
  `nicheQualityScore` band threshold (currently 20k) with the decision and update TEST-009.
- **OPEN-003:** Primary persona for homepage density / UX trade-offs (RISK-004).
- **MISSING-003:** Business success targets (tool engagement, discovery CTR) — needed to
  judge "value delivered" beyond binary DoD.
- **Verification:** confirm Daily 3 + Niche 5 + giant rule with a unit/e2e run (TEST-007/008/009);
  confirm no-LLM guards still pass for the embedded-on-homepage tools (TEST-011, NFR-001/002/003).
- **OPEN-002:** No `docs/templates/product-canvas.template.md` exists — confirm this ad-hoc
  10-field structure is acceptable or supply a template.

---

## 10. Traceability links

- **PRD (source of truth):** [`docs/prd/homepage-tools-discovery.prd.md`](../prd/homepage-tools-discovery.prd.md)
  — `PRD-WII-HOME-TOOLS-DISCOVERY-001` v1.0.
- **Master product spec referenced by PRD/CLAUDE.md:** `docs/prd/whats-in-it-live-ready-full.prd.md`.
- **AGENTS.md** (agent rules referenced by PRD §17 CTX-001).
- **Product Vision (to be created by product-owner):** `docs/vision/homepage-tools-discovery.vision.md` — `MISSING` (not yet created).
- **Traceability matrix `canvas-link`:** this file — `docs/canvas/homepage-tools-discovery.canvas.md`.

Requirement → real artifact map (for the spec-auditor / planner / tester):

| PRD REQ | Acceptance | Current artifact(s) | Gap |
|---|---|---|---|
| FR-001 | AC-001 | `src/app/page.tsx` L61–68 | remove example line |
| FR-002 | AC-002 | `src/app/page.tsx`, `src/app/tools/*`, (new) `src/components/home/*`, `src/components/tools/*` | embed tools on homepage |
| FR-003 | AC-003 | `src/components/DailyTopRepos.tsx`, `src/lib/weekly-data.ts`, `src/lib/trending.ts` | 5 → 3 |
| FR-004 | AC-010 | `DailyTopRepos.tsx`, `weekly-data.ts` (`isFallback`) | 24h-delta-gated label |
| FR-005 | AC-004 | `src/components/NicheFinds.tsx`, `trending.ts:180` | 10 → 5 |
| FR-006 | AC-004, TEST-009 | `src/lib/discovery/scoring.ts` (`nicheQualityScore`), `scoring.test.ts` | exclude vs penalize >50k (OPEN-005) |
| FR-007/008, DATA-002/003 | AC-005 | `src/components/TokenCalculator.tsx`, `src/lib/token-cost.ts` | add monthlyRuns/includedCredits/monthlyProjection/disclaimer |
| FR-009/010, DATA-004, DBG-001..012 | AC-006 | `src/components/DebuggerTool.tsx`, `src/lib/error-matcher.ts`, `src/data/error-patterns.ts` | +7 patterns; DATA-004 fields (category/severity/technicalCause/fixCommands/riskWarning) |
| FR-011 | AC-007 | (new) `src/app/repositories/*` | create route |
| FR-012/013 | AC-009 | `src/app/layout.tsx` nav, `/github/trending` | add links; trending redirect (OPEN-001) |
| NFR-001/002/003 | AC-008 | `src/lib/tools-guard.test.ts`, no-LLM guards | extend to homepage-embedded tools |

---

### Open items blocking `user-confirmed`

| ID | Type | Item |
|---|---|---|
| MISSING-001 | MISSING | Final Copilot/AI token pricing OR approval to ship placeholder + disclaimer. |
| MISSING-003 | MISSING | Business success targets (tool engagement, discovery CTR). |
| OPEN-001 | OPEN QUESTION | `/repositories` replaces `/github/trending` in nav, or both? |
| OPEN-003 | OPEN QUESTION | Primary persona for homepage density trade-offs. |
| OPEN-004 | OPEN QUESTION | Keep, replace, or both for standalone `/tools` routes once embedded on homepage. |
| OPEN-005 | OPEN QUESTION | Niche giants: hard-exclude >50k (TERM-004) vs penalize-only; align scoring threshold. |
| OPEN-002 | OPEN QUESTION | No canvas template exists — confirm ad-hoc 10-field structure. |
| BLOCKER-002 | BLOCKER | No fake daily/niche rankings as real (carried; must hold, cannot be assumption-laundered). |
| BLOCKER-001 | BLOCKER | No private API keys in client-side calculator/debugger (carried; aligned with ARCH-004/SEC-004). |
