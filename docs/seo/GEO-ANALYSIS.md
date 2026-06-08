# GEO / AI-Search Analysis — What's in it?

Date: 2026-06-06 · Method: **source-based audit of the repo** (no live crawl — production
domain was not provided). Live-platform checks are marked _pending domain_.

## 1. GEO Readiness Score: ~58/100 (source-based)

| Criterion | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 72 | Definition-first ("X ist …"), self-contained `age16Summary`, FAQ Q&A. Passages a bit short of the 134–167-word sweet spot. |
| Structural readability | 20% | 75 | Clean H1→H2, lists, `<details>` FAQ, breadcrumbs. Few comparison tables. |
| Multi-modal | 15% | 25 | Almost no images/video/diagrams on content pages. Biggest gap. |
| Authority & brand | 20% | 30 | No author byline, no published/updated dates, new brand → no Wikipedia/Reddit/YouTube presence. |
| Technical accessibility | 20% | 78 | SSR/SSG (no JS needed to read), robots allows AI crawlers, `llms.txt` now served, sitemap present. No JSON-LD. |

Weighted ≈ **58/100**. Ceiling is high once schema + dates + multi-modal land.

## 2. Platform breakdown (pending live domain)
- **Google AI Overviews**: depends on traditional ranking — brand is new, so low initially. SSR + passage structure are in your favor. _Verify with live `site:` + query checks._
- **ChatGPT / Perplexity**: rely on Wikipedia/Reddit presence — currently none → low. Brand-mention building is the lever (see §5).
- _Real visibility can only be measured live; provide the domain to run query checks._

## 3. AI crawler access
`src/app/robots.ts` → `allow: "/"`, `disallow: ["/api/"]`, sitemap declared.
**Result: all AI crawlers allowed** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, ChatGPT-User are not blocked). `/api/` correctly excluded. ✅
- Optional: add explicit per-crawler allow rules for clarity (no functional change).

## 4. llms.txt
- **Was broken**: file lived in repo root (not served by Next) → `/llms.txt` returned 404 in production.
- **Fixed**: moved to `public/llms.txt` (now served at `/llms.txt`) and reformatted to the
  llms.txt standard with key pages + descriptions. ✅
- Action for you: replace `whatsinit.app` in `public/llms.txt` if the real domain differs.

## 5. Brand mention analysis (pending — external)
Brand mentions correlate ~3× stronger with AI citation than backlinks. Currently none.
Highest-leverage, lowest-cost: a few high-quality Reddit/YouTube/Dev.to mentions of the tool,
and (longer term) a Wikipedia-worthy footprint. Not a code change — owner action.

## 6. Passage-level citability
Knowledge pages already lead with a definition and a beginner summary — good. To hit the
134–167-word citation sweet spot, lengthen the lead `expertExplanation` blocks slightly with
one concrete fact/number each (content edit in `src/data/github-knowledge.ts`).

## 7. Server-side rendering
✅ All content pages are SSR/SSG (Next App Router). AI crawlers (which do not run JS) receive
full HTML. The analyse page is dynamic SSR; knowledge/legal pages are prerendered.

## 8. Top 5 highest-impact changes
1. **(DONE) Serve `/llms.txt`** — moved to `public/`.
2. **Add JSON-LD schema** (recommendation, not yet applied — see §9): `Organization` +
   `WebSite` on the layout, `Article` + `BreadcrumbList` on `/github/[slug]`, `FAQPage` where FAQs exist.
3. **Add published/updated dates** (and an author/Organization byline) to knowledge pages.
4. **Add at least one diagram/image** per major knowledge page (multi-modal: +156% selection).
5. **Build 3–5 brand mentions** (Reddit/YouTube/Dev.to) — biggest AI-citation lever.

## 9. Schema recommendations (ready to implement on request)
Not applied automatically (standing rule: no new features). Suggested, safe additions:
- `Organization` + `WebSite` JSON-LD in `src/app/layout.tsx`.
- `TechArticle` + `BreadcrumbList` JSON-LD in `src/app/github/[slug]/page.tsx`.
- `FAQPage` JSON-LD on pages whose data has `faq`.
- `ItemList` JSON-LD on `/github/trending` for the Weekly Top 10.
All are static, server-rendered `<script type="application/ld+json">` blocks — no user data, no XSS surface (typed/escaped JSON).

## 10. Content reformatting suggestions
- Add a one-line **bolded direct answer** at the very top of each `/github/[slug]` page
  (first 40–60 words) — already close via `age16Summary`; ensure it reads as a standalone answer.
- Add 1–2 **comparison tables** (e.g. `merge` vs `rebase`, `revert` vs `reset`) — strong AI-citation format.
- Add a short **"Quellen/Stand"** line with the last-updated date.

## Quick wins already in place
SSR ✅ · robots allows AI crawlers ✅ · llms.txt served ✅ · definition-first content ✅ · FAQ Q&A ✅ · sitemap ✅

## Note on honesty
This audit is **source-based**. Items in §2 and §5 require the live domain to measure. Provide
the production URL to run real AI-visibility checks (and, if available, DataForSEO GEO tools).
