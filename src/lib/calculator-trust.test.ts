import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PRICING_SOURCE_NOTE } from "./token-cost";

// PHASE-2 (homepage-tools-discovery) — trust/honesty guards for the calculator.
// VCHK-003: tokens + per-model cost + a visible placeholder disclaimer, NO official-bill
// claim, and (NG-001) NO monthly projection surfaced this sprint.
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

// CONTRACT: any new pricing/cost UI surface MUST be added here. The list is kept
// explicit (not globbed) on purpose: unrelated files legitimately contain "monatlich"
// (sitemap changeFrequency, blog FAQ), which a broad glob would false-positive on.
const SURFACES = [
  "src/components/TokenCalculator.tsx",
  "src/lib/token-cost.ts",
  "src/components/home/HomepageTools.tsx",
  "src/app/tools/ai-credit-calculator/page.tsx",
];

// NG-001: any phrasing that implies a recurring/period projection (monthly/annual).
const PROJECTION_RE = /\bmonat|per\s*month|\bpro\s*(monat|jahr)\b|\/\s*mo\b|hochrechnung|monthly|projektion|projection/i;
// SEC-007: any phrasing that claims an exact/official provider bill.
const OFFICIAL_BILL_RE = /offizielle\s+rechnung|official\s+bill|verbindliche?r?\s+preis|(tats[aä]chliche|genaue|exakte|echte)\s+(kosten|rechnung|preis)/i;

describe("calculator trust (VCHK-003 / SEC-007 / NG-001)", () => {
  it("SEC-007: pricing note marks values as examples to verify (not a bill)", () => {
    expect(PRICING_SOURCE_NOTE).toMatch(/Beispiel/i);
    expect(PRICING_SOURCE_NOTE).toMatch(/prüf/i); // "prüfen" — verify before relying
  });

  it("VCHK-003: the disclaimer + privacy note are interpolated into the rendered JSX (not just imported)", () => {
    const calc = read("src/components/TokenCalculator.tsx");
    // Must be rendered via JSX interpolation — an import-only match would pass
    // vacuously even if the disclaimer block were deleted (boundary proof is the e2e).
    expect(calc).toMatch(/\{PRICING_SOURCE_NOTE\}/);
    expect(calc).toMatch(/laufen lokal|nichts hochgeladen/i); // disclaimer privacy line, not the upload label
  });

  it("NG-001: no monthly/period projection is surfaced in any calculator surface", () => {
    for (const f of SURFACES) {
      expect(PROJECTION_RE.test(read(f)), `${f} must not surface a monthly/period projection`).toBe(false);
    }
  });

  it("SEC-007: no surface claims an official / exact provider bill", () => {
    for (const f of SURFACES) {
      expect(OFFICIAL_BILL_RE.test(read(f)), `${f} must not claim an official bill`).toBe(false);
    }
  });

  it("the broadened guards actually trip on representative regressions (anti-vacuous)", () => {
    // Prove the regexes catch real phrasings, so a green run means something.
    for (const leak of ["Monatskosten", "Kosten pro Monat", "per month", "Hochrechnung", "ca. 5 $/mo"]) {
      expect(PROJECTION_RE.test(leak), `PROJECTION_RE should catch "${leak}"`).toBe(true);
    }
    for (const claim of ["deine tatsächliche Rechnung", "exakte Kosten", "verbindlicher Preis", "official bill"]) {
      expect(OFFICIAL_BILL_RE.test(claim), `OFFICIAL_BILL_RE should catch "${claim}"`).toBe(true);
    }
  });
});
