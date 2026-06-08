# Traceability Matrix — homepage-tools-discovery

**Feature:** `homepage-tools-discovery`
**PRD (source of truth):** [`prd/homepage-tools-discovery.prd.md`](prd/homepage-tools-discovery.prd.md) — `PRD-WII-HOME-TOOLS-DISCOVERY-001` v1.0, **user-confirmed** (2026-06-08)
**Canvas (upstream, user-confirmed):** [`canvas/homepage-tools-discovery.canvas.md`](canvas/homepage-tools-discovery.canvas.md)
**Branch:** `feature/homepage-tools-discovery`
**As of:** 2026-06-08 (pre-build for this sprint)

## Legend

- **evidence-class** (current, honest): `unit-fake` = no/placeholder test or test against fake data; `integration-fake` = wired components tested against fakes/mocks; `real-boundary-smoke` = exercised against the real boundary (DB/route/build) in a smoke test; `production-verified` = verified in the deployed product.
- **wired-in-prod?** = is the corrected behavior live on `feature/homepage-tools-discovery` / deployed? (yes/no)
- **canvas-risk-status:** `aligned` | `value-risk` | `non-goal-violation` | `risk-introduced` | `blocked`
- **Council deltas applied (see PRD Status block):** monthly projection DEFERRED; `/repositories` = thin reuse + `/github/trending` redirect; niche hard-exclude >50k stars.

## Functional Requirements

| REQ | acceptance (AC) | task | test | evidence-class | wired-in-prod? | canvas-link | canvas-problem | canvas-target-user | canvas-value-claim | canvas-success-signal | canvas-risk-status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FR-001 — remove homepage example repo line (`vercel/next.js`, `shadcn-ui/ui`, `badlogic/pi-mono`) | AC-001 | TASK-001 | TEST-001 (homepage-structure.test.ts) | production-verified | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P1): example line removed from page.tsx; source guard asserts absence; build prerenders / | USER-001 (primary) | Homepage immediately communicates the real free tools, not placeholder examples | Binary: homepage has no example-repo line (AC-001) | aligned |
| FR-002 — homepage shows Analyze + Token Calculator + Debugger as primary, functional tools | AC-002 | TASK-002 | TEST-002 (e2e homepage-embed) | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P1): HomepageTools embeds real TokenCalculator+DebuggerTool; e2e types into both on / and asserts reactive output (VCHK-001) | USER-001 (primary), USER-002 | Three free, local, zero-LLM-cost utilities usable without leaving the homepage | Binary: homepage exposes usable Analyze + Calculator + Debugger (AC-002) | value-risk (embed-raises-usage is ASSUMPTION, unconfirmed; RISK-004 crowding — tracked, not blocking) |
| FR-003 — Daily Top renders max 3 cards | AC-003 | TASK-007 | trending.test.ts + e2e | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P4): DailyTopRepos slice(0,3)+sm:grid-cols-3; getDailyTop slice(0,3); job rankBy(...,3); OBS-001 dailyWritten:3; e2e asserts 'Daily Top 3' heading | USER-002 (developer), USER-001 | Honest, scannable discovery: Daily Top 3 | Binary: Daily renders ≤3 (AC-003); OBS-001 `dailyWritten:3` | aligned |
| FR-004 — Daily uses real daily ranking only if 24h delta exists; else honest preparing/sample label | AC-010 | TASK-007 | trending.test.ts (is_fallback) | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P4): is_fallback true w/o 24h history, false with delta; DailyTopRepos shows 'Beispiel-Auswahl (noch keine 24-h-Bewegung)'; never claims real movement without a delta | USER-001 (primary) | Trust/honesty: no fabricated "today's movement"; initial samples labeled as samples | Binary: Daily never claims real 24h movement unless a delta exists (AC-010) | aligned (BLOCKER-002 satisfied — honest sample label, no laundered ranking) |
| FR-005 — Niche Discovery renders max 5 cards | AC-004 | TASK-008 | trending.test.ts (nicheWritten) | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P4): job rankBy(...,5); NicheFinds slice(0,5); getNiche slice(0,5); OBS-001 nicheWritten:5 | USER-002 (developer), USER-003 | Honest discovery: Niche Top 5 of useful smaller repos | Binary: Niche renders ≤5 (AC-004); OBS-001 `nicheWritten:5` | aligned |
| FR-006 — Niche scoring not star-dominant; hard-exclude giants >50k stars (council delta) | AC-004, TEST-009 | TASK-008 | scoring.test.ts + trending.test.ts (TEST-009) | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P4): nicheEligible() filters >50k (NICHE_MAX_STARS=50000) at the selector boundary BEFORE ranking; trending filters nichePool; test proves an 80-90k giant never appears in niche | USER-002 (developer), USER-003 | "Useful smaller repos, not famous repos" — transparent, non-star-dominant ranking | Binary: giants >50k excluded; small repo can outrank (TEST-009) | aligned (council OPEN-005 → hard-exclude FILTER at 50k) |
| FR-007 — Token Calculator computes locally from text/code input (no upload, no API) | AC-005 | TASK-003, TASK-004 | token-cost.test.ts + calculator-trust.test.ts + e2e embed | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P2): client-side gpt-tokenizer + cost formula; e2e types on / → token count reacts; VCHK-003 disclaimer visible; NG-001 no projection / SEC-007 no official-bill guarded | USER-003 (founder), USER-002 | Estimate AI/token cost locally in the browser, zero LLM, no upload (privacy) | Binary: no LLM/network call from calculator (AC-008, NFR-001); tokens shown (AC-005) | aligned |
| FR-008 — Calculator shows tokens, cost, [monthly projection DEFERRED], disclaimer | AC-005 (projection part DEFERRED) | TASK-003, TASK-004 | calculator-trust.test.ts + e2e disclaimer | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P2): tokens + per-model cost + visible 'Beispielwerte' disclaimer on / and /tools/ai-credit-calculator; NG-001 no projection surfaced; SEC-007 no official-bill claim (guarded) | USER-003 (founder) | Local cost estimate a founder can act on — tokens + per-model cost + visible disclaimer (projection NOT surfaced this sprint) | Binary: calculator shows tokens + cost + disclaimer (AC-005, council-amended); projection NOT a pass criterion | aligned (MISSING-001 example rates disclaimed; SEC-007 no official-bill claim; projection deferred per NG-001) |
| FR-009 — Debugger matches Git/GitHub/Actions errors via local pattern DB (DBG-001..012, ≥12) | AC-006 | TASK-005 | error-matcher.test.ts (DATA-004 + DBG coverage) + e2e | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P3): 20 DATA-004 patterns; all DBG-001..012 covered (added 127/137/repo-not-found/large-file/npm-not-found/next-build/railway); SEC-006 danger warnings; e2e match on / and /tools/debugger | USER-001 (primary, non-coder), USER-004 (devops) | Debug Git/GitHub/Actions errors locally and deterministically (no LLM, no chat) | Binary: debugger matches ≥12 patterns (AC-006, DoD-004); no LLM (AC-008, NFR-002) | aligned (NOGOAL-001: stays deterministic + local) |
| FR-010 — Debugger output includes cause, technical explanation, fix, risk warning, related links | AC-006 | TASK-005, TASK-006 | error-matcher.test.ts (DATA-004 fields) + e2e | real-boundary-smoke | yes | [canvas](canvas/homepage-tools-discovery.canvas.md) | DONE (P3): every pattern carries simpleCause/technicalCause/fixCommands/riskWarning/relatedLinks; UI renders beginner-first cause + danger box; e2e verifies on /tools/debugger | USER-001 (primary), USER-004 | Cause + fix + risk warnings + links so a beginner can act safely | Binary: matched error returns cause/fix/risk/links (AC-006) | aligned (RISK-002 mitigated — SEC-006 danger+riskWarning shipped & verified: data guard in error-matcher.test.ts + 2 e2e danger-box assertions) |
| FR-011 — Create `/repositories` discovery hub (Daily 3, Weekly 10, Niche 5 + ranking explanation) | AC-007 | TASK-009 | TEST-010 | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | `/repositories` does not exist (`src/app/repositories/` absent) | USER-002 (developer), USER-003 | One canonical, honest discovery hub with transparent ranking explanation | Binary: `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + explanation (AC-007) | aligned (council: thin reuse of `weekly-data` getters) |
| FR-012 — Update nav to reach Repositories, Calculator, Debugger | AC-009 | TASK-010 | TEST-012 (nav/e2e) | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | Nav has `/tools` + `/github/trending` ("Discover"); no `/repositories`, no direct Calculator/Debugger links | USER-001 (primary), USER-002 | Users can find the tools and the discovery hub from any page | Binary: Repositories, Calculator, Debugger reachable from nav (AC-009) | aligned |
| FR-013 — `/github/trending` redirects to `/repositories` (council delta) | AC-009 (no broken links) | TASK-009, TASK-010 | TEST-010 (+ redirect smoke) | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | `/github/trending` exists (Weekly Top 10); no `/repositories` to redirect to yet | USER-002 (developer) | No broken links; single canonical discovery hub | Binary: `/github/trending` permanently redirects to `/repositories`; no broken links | aligned (council resolved OPEN-001 → redirect, not coexist) |

## Non-Functional Requirements

| REQ | acceptance (AC) | task | test | evidence-class | wired-in-prod? | canvas-link | canvas-risk-status |
|---|---|---|---|---|---|---|---|
| NFR-001 — No LLM/network call from token calculator | AC-008 | TASK-011 | TEST-011 | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned (SUS-003/SUS-006 cost boundary) |
| NFR-002 — No LLM/network call from debugger | AC-008 | TASK-011 | TEST-011 | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned (SUS-003/SUS-006 cost boundary) |
| NFR-003 — Homepage pageview must not call GitHub API or OpenRouter | AC-008 | TASK-011 | TEST-011 (existing no-LLM guard extended) | integration-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned (must extend guard to homepage-embedded tools; SUS-002) |
| NFR-004 — Mobile layout remains readable | (NFR-004) | TASK-002 | e2e viewport smoke | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | risk-introduced (RISK-004 homepage crowding; mitigate compact/responsive) |
| NFR-005 — Light/Dark mode preserves contrast | (NFR-005) | TASK-002 | visual/class-token test | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned (ARCH-007 reuse theme system) |
| NFR-006 — Build remains green | DOD-011 | TASK-012 | TEST-012 (`npm run build`) | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned |
| NFR-007 — No false ranking claims | AC-010 | TASK-007 | TEST for initial sample labels | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | blocked (BLOCKER-002 — no fake rankings as real; cannot be assumption-laundered) |
| NFR-008 — Tools work without external credentials | AC-008 | TASK-003..006 | TEST-011 (no env vars) | unit-fake | no | [canvas](canvas/homepage-tools-discovery.canvas.md) | aligned (BLOCKER-001/ARCH-004/SEC-004 — no client secrets) |

## Canvas field provenance (FR rows)

All six canvas fields per FR row are sourced from the **user-confirmed** canvas:
- **canvas-problem** ← Canvas §1 (verified divergence table) and §3 (current workaround).
- **canvas-target-user** ← Canvas §2 + OPEN-003 default (USER-001 primary / USER-002 secondary).
- **canvas-value-claim** ← Canvas §4 (value proposition).
- **canvas-success-signal** ← Canvas §5 (binary, firm signals) + PRD §20 AC and OBS-001.
- **canvas-risk-status** ← Canvas §8 (risks/contradictions, BLOCKER-001/002, RISK-002/004, MISSING-001, ASSUMPTION on embed).
- **canvas-link** ← Canvas §10 traceability.

## Open / blocking items carried from canvas (must hold through build)

| ID | Type | Affects | Status |
|---|---|---|---|
| BLOCKER-001 | BLOCKER | NFR-008, FR-007/009 | No client-side secrets — firm. |
| BLOCKER-002 | BLOCKER | FR-004, NFR-007 | No fake daily/niche rankings as real — firm; cannot be assumption-laundered. |
| MISSING-001 | MISSING/value-risk | FR-008 | Real Copilot/AI token pricing unknown → placeholder + disclaimer; projection DEFERRED (council). |
| MISSING-003 | MISSING | success metrics | No business KPIs this sprint (council default); success = binary DoD/AC + OBS-001. |
| ASSUMPTION (embed→usage) | ASSUMPTION | FR-002 | Embedding tools raises usage — unconfirmed; tracked, not blocking. |
