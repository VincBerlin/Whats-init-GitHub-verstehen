# Contradictions — homepage-tools-discovery

> Recorded by the Plumbline Watcher. A contradiction may be resolved ONLY by explicit
> user action (extend/re-confirm scope, update+re-approve PRD/Vision, remove/move the
> change, change the implementation, or abandon). It may NEVER be self-downgraded to a
> "known limitation" (escalation-asymmetry / no-laundering).

## CONTRA-001 — out-of-scope edit: `src/data/authority.ts` (PHASE-4, iteration 4/7)

- **Status:** RESOLVED 2026-06-08 — resolution #1 (extend + re-confirm scope), explicit user GO
  via AskUserQuestion ("Extend scope, keep the fix"). `src/data/authority.ts` added to the
  Canvas "Allowed change scope" and `docs/scope/homepage-tools-discovery.scope.json`
  `allowed_globs`; scope-check re-run → exit 0. FAQ honesty fix kept.
- **Gate:** PRIL `plumbline-scope-check homepage-tools-discovery` → **FAIL (exit 3)**.
- **Failing output:** `scope-check: FAIL — out of scope:  src/data/authority.ts`.
- **True-line-status:** contradiction (scope-governance, NOT value-drift).

### What happened
The PHASE-4 increment edits `src/data/authority.ts` (the public German FAQ/authority page)
to align its copy with the corrected discovery: "Daily Top 3", "Niche Finds, Top 5", and
"schließen sehr große Stern-Giganten (über 50.000 Sterne) bewusst aus". The **content is
value-true** — it keeps the user-facing FAQ honest and directly supports VAL-004 / VCHK-004
and BLOCKER-002. The problem is purely governance: `src/data/authority.ts` is **not** in
the user-confirmed Allowed change scope (Canvas "Allowed change scope" section) nor in
`docs/scope/homepage-tools-discovery.scope.json` `allowed_globs`. The confirmed scope lists
`src/data/error-patterns.ts` but not `src/data/authority.ts`, and there is no `src/data/**`
glob.

### Why this threatens customer value
It does not erode the value claim directly; it erodes the **scope contract**. The Allowed
change scope is a user-confirmed boundary. Silently editing files outside it — even with
correct, value-true content — is exactly the kind of drift the scope guard exists to catch.
Accepting it without user reconfirmation would normalize out-of-scope edits and weaken the
gate for future increments where the out-of-scope file is NOT benign.

### Required user decision (only the user may resolve)
Choose one (each is an Allowed resolution):
1. **Extend + re-confirm scope** — add `src/data/authority.ts` (or `src/data/**`) to the
   Canvas "Allowed change scope" AND to `docs/scope/homepage-tools-discovery.scope.json`
   `allowed_globs`, with explicit user confirmation. Then re-run scope-check (must exit 0).
2. **Move the change** — relocate the FAQ-copy update into an already in-scope artifact, or
   defer the authority-page copy to a separate, properly-scoped task.
3. **Remove** the `src/data/authority.ts` change from this increment.

### Forbidden shortcut
Do NOT self-downgrade this scope-check FAIL to a "warning" or "known limitation" to let the
increment pass. The Watcher cannot reclassify a PRIL failure; only the user can.

### Not-at-issue (verified true & wired this iteration)
- VAL-004 / VCHK-004: niche >50k giants HARD-EXCLUDED via `nicheEligible` filter at the
  selector boundary (`nichePool = disc.filter(nicheEligible)` before `rankBy`); daily keeps
  giants but caps at 3 — verified in `scoring.test.ts` + `trending.test.ts` (TEST-009).
- BLOCKER-002: 24h-delta-gated honesty (`isFallback` / no fabricated "today's movement");
  rendered label "Beispiel-Auswahl (noch keine 24‑h‑Bewegung)" in `DailyTopRepos.tsx`.
- OBS-001: `dailyWritten:3` / `nicheWritten:5` proven (with an 80–90k giant excluded).
- NG-007 / VAL-005: `trending.ts`, `scoring.ts`, and the `weekly-data` display path import
  no OpenRouter/LLM/network — boundary unchanged.
- PRIL context-check PASS; reality-check PASS (14 entries at floor, required REQs covered);
  redact clean on the evidence ledger + traceability.

## CONTRA-002 — out-of-scope edits: `next.config.ts`, `src/app/sitemap.ts`, `src/components/WeeklyTopRepos.tsx`, `src/data/knowledge.test.ts` (PHASE-5, iteration 5/7)

- **Status:** RESOLVED 2026-06-08 — resolution #1 (extend + re-confirm scope), explicit user GO
  via AskUserQuestion ("Extend scope, keep the fix"). Added `next.config.ts`, `src/app/sitemap.ts`,
  `src/components/WeeklyTopRepos.tsx` to the Canvas allowed-scope + scope.json `allowed_globs`, and
  broadened the test glob `src/lib/**/*.test.ts` → `src/**/*.test.ts` (matches the Canvas's
  "tests (*.test.ts)" intent, covers `src/data/knowledge.test.ts`). scope-check re-run → exit 0.
- **Gate:** PRIL `plumbline-scope-check homepage-tools-discovery` → **FAIL (exit 3)**.
- **Failing output:**
  `scope-check: FAIL — out of scope:`
  `  next.config.ts`
  `  src/app/sitemap.ts`
  `  src/components/WeeklyTopRepos.tsx`
  `  src/data/knowledge.test.ts`
- **True-line-status:** contradiction (scope-governance, NOT value-drift).

### What happened
PHASE-5 implements VAL-006 / FR-011/012/013 (the `/repositories` hub + `/github/trending`
redirect). Four edited files are **value-true and load-bearing** for that goal but are **not**
in the user-confirmed Allowed change scope (`docs/scope/homepage-tools-discovery.scope.json`
`allowed_globs`, mirroring the Canvas "Allowed change scope"):
- `next.config.ts` — adds the `/github/trending → /repositories` permanent redirect (this IS
  OPEN-001 / FR-013, the core of the increment).
- `src/app/sitemap.ts` — repoints the dead `/github/trending` entry to `/repositories`
  (prevents a broken sitemap URL).
- `src/components/WeeklyTopRepos.tsx` — repoints the internal "Alle ansehen" link to
  `/repositories`.
- `src/data/knowledge.test.ts` — extends the no-OpenRouter guard to the `/repositories`
  surface (this STRENGTHENS NG-007 / VAL-005 verification).
The scope.json test glob is `src/lib/**/*.test.ts`, which does not match
`src/data/knowledge.test.ts`; and there is no glob for `next.config.ts`, `src/app/sitemap.ts`,
or `src/components/WeeklyTopRepos.tsx` (only `DailyTopRepos.tsx` / `NicheFinds.tsx` are listed).
The prior CONTRA-001 user GO extended scope to `src/data/authority.ts` ONLY; it did not
authorize these four files.

### Why this threatens customer value
It does not erode the VAL-006 value claim (the hub is honest, wired, no-LLM, thin-reuse —
all verified). It erodes the **scope contract**: the Allowed change scope is a user-confirmed
boundary. Accepting four out-of-scope edits — even benign, value-true ones — without
reconfirmation normalizes scope drift and weakens the guard for a future increment where an
out-of-scope file is NOT benign. This is the exact escalation CONTRA-001 established.

### Required user decision (only the user may resolve)
Choose one (each is an Allowed resolution):
1. **Extend + re-confirm scope** — add `next.config.ts`, `src/app/sitemap.ts`,
   `src/components/WeeklyTopRepos.tsx`, and a test glob covering `src/data/**/*.test.ts`
   (or the specific file) to the Canvas "Allowed change scope" AND
   `docs/scope/homepage-tools-discovery.scope.json` `allowed_globs`, with explicit GO. Then
   re-run scope-check (must exit 0). (Recommended — the redirect/sitemap/link edits are
   intrinsic to OPEN-001/FR-013 and the test edit strengthens VAL-005.)
2. **Move the change** — relocate any edit into an already in-scope artifact (not feasible
   for `next.config.ts` redirect and the sitemap — they are the right files).
3. **Remove** the out-of-scope changes from this increment (would break FR-013: no redirect).

### Forbidden shortcut
Do NOT self-downgrade this scope-check FAIL to a "warning" / "known limitation" to let the
increment pass. The Watcher cannot reclassify a PRIL failure; only the user can.

### Not-at-issue (verified true & wired this iteration)
- VAL-006 / VCHK-006: `/repositories` renders Daily 3 / Weekly 10 / Niche 5 + plain ranking
  explanation ("Wie wird hier bewertet?", incl. >50k giant-exclusion copy); `/github/trending`
  permanently redirects; nav reaches Repositories/Calculator/Debugger — verified by
  redirects.test.ts + e2e (redirect follow + hub render) at real-boundary-smoke.
- NG-004 (no rebuild): hub is a 63-line thin composition of existing
  DailyTopRepos/WeeklyTopRepos/NicheFinds + static explanation; no architecture change.
- NG-007 / VAL-005 (no LLM): `/repositories` surface imports no OpenRouter (grep + extended
  knowledge.test.ts guard); `weekly-data` page-view path is DB-read-only.
- PRIL context-check PASS; reality-check PASS (18 entries at floor; FR-011/012/013 covered);
  redact clean on evidence ledger + traceability. vitest 191 pass re-verified by Watcher.
