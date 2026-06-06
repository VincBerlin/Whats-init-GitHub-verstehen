# AdSense Readiness Checklist (PHASE-7 / CTX-006)

## Implemented (code)
- [x] Policy-safe `AdSlot` component: allowed zones only (sidebar, content-break, footer),
      blocks placements near copy/clone/download/primary-CTA (FR-020/SEC-006).
- [x] "Anzeige" label on active ads (FR-019).
- [x] CLS reservation via `minHeight` per slot (NFR-006).
- [x] Ads OFF by default — render only when `NEXT_PUBLIC_ADS_ENABLED=true` AND a publisher id is set (ROLLBACK-004).
- [x] `ads.txt` route (placeholder until `ADSENSE_PUBLISHER_ID` is set).
- [x] `robots.txt` allows content crawl, disallows `/api/`; `sitemap.xml` consistent with content.
- [x] Legal/trust pages exist: /about /contact /privacy /terms /impressum.
- [x] No fake rankings presented as real (honest fallbacks, `is_fallback` label).
- [x] Substantial static content (22 knowledge topics, categorized) — not thin/placeholder.

## Must be done by the operator before applying (BLOCKER / MISSING)
- [ ] Replace `[PLATZHALTER]` in /impressum, /privacy, /contact with real owner details + legal review (BLOCKER-001, MISSING-001/002).
- [ ] Choose + integrate a Consent Management Platform for EWR/UK/CH (MISSING-003, SEC-005).
- [ ] Obtain AdSense publisher id → set `ADSENSE_PUBLISHER_ID` + `NEXT_PUBLIC_ADSENSE_CLIENT` (MISSING-004).
- [ ] Run PageSpeed / Core Web Vitals and fix regressions (MISSING-007).
- [ ] First daily-discovery + weekly jobs run so homepage shows real (non-seed) rankings.

## Activation sequence
1. Fill legal + CMP, deploy, get AdSense approval.
2. Set publisher id env vars; load the AdSense script (add `<Script>` for adsbygoogle in layout — deferred until id exists).
3. Set `NEXT_PUBLIC_ADS_ENABLED=true`. Verify ads render only in allowed zones with labels + no CLS.
4. Confirm no ad sits next to copy/clone/CTA controls (FR-020).
