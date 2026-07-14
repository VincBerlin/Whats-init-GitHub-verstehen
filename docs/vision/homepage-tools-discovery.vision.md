# Product Vision — homepage-tools-discovery

> The confirmed customer-value north star for the **Homepage Tools & Repository
> Discovery Correction Sprint**. This is the human-usefulness line that sits *above* the
> PRD's feature list and the Canvas's ten fields: it answers "would a real person be
> better off?", not "was it built?". A green test suite that does not move this line is
> not success.

**Feature:** `homepage-tools-discovery`
**Repo:** `/Users/vincentschnetzer/Documents/AI/Whatsinit/whats-in-it`
**Branch:** `feature/homepage-tools-discovery`
**Status:** user-confirmed *(explicit Vision GO given by user 2026-06-08)*
**Authored:** 2026-06-08
**Upstream Canvas (user-confirmed):** [`../canvas/homepage-tools-discovery.canvas.md`](../canvas/homepage-tools-discovery.canvas.md)
**PRD (source of truth):** [`../prd/homepage-tools-discovery.prd.md`](../prd/homepage-tools-discovery.prd.md) — `PRD-WII-HOME-TOOLS-DISCOVERY-001` v1.0
**Note:** No `docs/templates/product-vision.template.md` exists in this repo; this Vision is authored directly, mirroring the Canvas's ad-hoc structure (OPEN-002 default-accepted).

---

## North-Star Vision

> A first-time, German-speaking GitHub beginner lands on `whats-in-it`, **immediately
> sees three genuinely useful free tools** — analyze a repo, estimate AI/token cost,
> debug a Git/GitHub/Actions error — **uses one of them on the spot without an account,
> an upload, a signup, or any AI cost to themselves or the owner**, and trusts what they
> see because nothing is faked. When they want to explore further, one honest
> `/repositories` hub shows them real, non-vanity repository picks and explains *why*
> those repos were chosen.

The correction this sprint delivers is **honesty + immediacy + zero-cost utility**: the
homepage stops nudging beginners toward three hardcoded famous repos and instead puts
three working, local, zero-LLM tools and honest discovery in front of them. Value is
"a beginner got real help in their first 30 seconds", not "all FRs are checked off".

---

## Who benefits, and what changes for them

Primary persona is **USER-001, the beginner / non-coder** (OPEN-003 resolved: beginner
primary, developer USER-002 secondary; this governs every homepage-density / RISK-004
trade-off — when in doubt, optimize for the beginner).

| Persona | Before (today's deployed product) | After this sprint |
|---|---|---|
| **USER-001 Beginner (primary)** | Sees an example-repo line and a wall of discovery; must already know `/tools` exists; gets jargon-y or fake-feeling lists | Sees three labeled, usable tools on the homepage; can debug a real Git error in plain German with cause + safe fix; trusts the lists because samples are labeled as samples |
| **USER-002 Developer (secondary)** | Tools buried at `/tools`; niche list polluted by giants; 10 niche / 5 daily | Fast access to calculator + debugger; niche list excludes >50k giants and shows 5; daily shows 3; `/repositories` hub with ranking explanation |
| **USER-003 Founder / builder** | Calculator exists but no monthly view; placeholder prices | Gets per-model token cost on placeholder rates **with a visible disclaimer**; monthly projection is **DEFERRED** (see non-goals) — honest "directional, not your bill" |
| **STAKE-001 Site owner** | Trust/AdSense risk from fake rankings; tools invisible; risk of LLM spend creep | No fabricated rankings; zero marginal LLM/network cost on homepage/tools/discovery; AdSense stays gated |

**When would they use it?** The moment a beginner hits a confusing Git error, wonders
what an AI tool will cost, or wants to find a non-famous repo worth learning from —
without leaving the page or paying anything.

**Why would they care?** Free, private (input never leaves the browser), instant, and
honest. The differentiator is trust + zero cost, not feature count.

---

## Value statements (mapped to Canvas §4 value proposition)

Each is a customer-value promise, with the value check (`VCHK-*`) QA must prove is *real*,
not merely *functional*. A passing functional test that does not satisfy the VCHK intent
is a BLOCKER for this gate.

| ID | Value promise (customer-facing) | Value check (VCHK) — what QA must verify as real customer value |
|---|---|---|
| **VAL-001** | A beginner instantly understands the homepage offers three real, free tools — no example-repo distraction. | **VCHK-001:** Homepage has no example-repo line (AC-001) AND Analyze + Calculator + Debugger are visible *and usable on the homepage itself*, not just linked. A wired-in, end-to-end usable embed — not a dead card. |
| **VAL-002** | A user can paste a real Git/GitHub/Actions error and get a plain-language cause, a safe fix, and a risk warning before running anything destructive. | **VCHK-002:** ≥12 DBG patterns match real pasted errors with cause/fix/links; destructive fixes (`reset --hard`, `clean -fd`) carry a visible danger warning (SEC-006). Verified against real error strings, not a stub. |
| **VAL-003** | A founder gets a directionally useful, clearly-disclaimed AI cost estimate locally, never mistaking it for an official bill. | **VCHK-003:** Calculator shows tokens + per-model cost + a visible placeholder disclaimer (SEC-007); makes NO official-bill claim; monthly projection is absent this sprint (deferred, see NG-001). |
| **VAL-004** | Discovery is honest: small useful repos surface, giants don't dominate, and no list is presented as real movement it can't back up. | **VCHK-004:** Daily ≤3, Niche ≤5 with >50k giants hard-excluded (TERM-004, TEST-009); daily without a 24h delta is labeled sample/preparing (AC-010, BLOCKER-002). No fake "today's movement". |
| **VAL-005** | Everything stays free to run and private — no LLM/network call, no upload, no logged input. | **VCHK-005:** No OpenRouter/Gemini/LLM/network call from homepage/tools/discovery (AC-008, NFR-001/002/003); calculator/debugger input never uploaded or logged (SEC-001/002/003). |
| **VAL-006** | One honest hub (`/repositories`) lets a curious user explore and understand the ranking, reachable from nav. | **VCHK-006:** `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + a plain ranking explanation (AC-007); `/github/trending` redirects to it (OPEN-001 resolved); nav reaches Repositories/Calculator/Debugger (AC-009). |

---

## True-Line (provenance of the customer-value claim)

| Field | Value |
|---|---|
| **vision-link** | `docs/vision/homepage-tools-discovery.vision.md` (this file) |
| **value-check-id** | `VCHK-001` … `VCHK-006` (above), traced to `VAL-001`…`VAL-006` and the Canvas §4 value proposition |
| **true-line-status** | `confirmed` — user GO given 2026-06-08; re-judged at the Product-Owner Final Value Gate |

---

## Non-goals (what we deliberately do NOT promise this sprint)

- **NG-001 — Monthly cost projection is DEFERRED** (Phase 0.16 council #1, amends
  MISSING-001). A precise-looking monthly number on placeholder rates erodes trust more
  than it helps; the homepage calculator shows token count + per-model cost only. Code
  types (`monthlyRuns`/`includedCredits`/`monthlyProjection`) may exist but the
  projection is **not surfaced**. *(Note: this Vision overrides the older PRD AC-005
  "monthly projection" wording — the council deferral is the governing decision.)*
- **NG-002 — No chat/LLM debugger** (NOGOAL-001). Deterministic + local only.
- **NG-003 — No live AdSense** (NOGOAL-002, SEC-005). Ads stay gated.
- **NG-004 — No architecture rebuild** (NOGOAL-003, ARCH-001). Extend; `/repositories`
  is a thin reuse of existing `weekly-data` getters + a ranking explanation.
- **NG-005 — No private-repo / OAuth / enterprise** (NOGOAL-004).
- **NG-006 — No business KPI targets / engagement telemetry this sprint** (MISSING-003
  deferred). Success is binary DoD/AC + observability counters, not a conversion metric.
- **NG-007 — No change to the LLM cost boundary** (TERM-007, SUS-006) — hard stop.

---

## Success signal (how we know value was delivered)

**Binary, firm (from PRD DoD/AC — these define "value-real" for this sprint):**
- No example-repo line (AC-001); Analyze + Calculator + Debugger usable on homepage (AC-002).
- Daily ≤3 (AC-003); Niche ≤5 with >50k giants excluded (AC-004, TEST-009).
- Calculator shows tokens + cost + disclaimer, **no monthly projection** (VAL-003 / NG-001).
- Debugger matches ≥12 patterns with cause/fix/risk/links (AC-006, DoD-004).
- `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + ranking explanation (AC-007);
  `/github/trending` redirects (OPEN-001).
- No LLM/network call from homepage/tools/discovery (AC-008, NFR-001/002/003).
- Honest initial-state label when no 24h delta (AC-010, BLOCKER-002).
- `lint` / `test` / `build` / `test:e2e` green (DoD-011).

**Observability (firm):** discovery job reports **`dailyWritten: 3`** and
**`nicheWritten: 5`** (OBS-001), proving the selectors actually wrote the corrected counts.

**Business KPIs:** DEFERRED (MISSING-003) — not a gate this sprint; flagged, not blocking.

---

## What would make this useless despite passing tests (Gegenthese / Reality check)

The Product-Owner Final Value Gate must reject the increment — even if all tests are
green — if any of these is true:
- Tools render on the homepage but are **not actually wired** (dead cards / linked-only
  stubs) → VAL-001 unmet even with AC-002 "present".
- No-LLM guards pass against a **fake/mocked path** while the live homepage embed still
  reaches the network → VAL-005 violated in reality (`wired-in-prod?` failure).
- Discovery counts are correct in unit tests but the **rendered homepage / `/repositories`**
  still shows old counts or an unlabeled sample as "today's movement" → VAL-004 /
  BLOCKER-002 violated; per escalation-asymmetry, only the user may downgrade this.
- A monthly projection (or an "official bill" claim) leaks into the UI despite NG-001 /
  SEC-007 → trust-eroding; BLOCKER.
