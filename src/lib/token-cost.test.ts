import { describe, it, expect } from "vitest";
import { costFor, estimateAll, formatUsd, PRICING } from "./token-cost";

// PHASE-7 (Master Plan) — cost formula (pure)
describe("token cost", () => {
  it("computes cost per million tokens linearly", () => {
    expect(costFor(1_000_000, 2.5)).toBeCloseTo(2.5, 6);
    expect(costFor(500_000, 2)).toBeCloseTo(1, 6);
  });

  it("returns 0 for non-positive input", () => {
    expect(costFor(0, 5)).toBe(0);
    expect(costFor(100, 0)).toBe(0);
    expect(costFor(-10, 5)).toBe(0);
  });

  it("estimates input+output total for every model", () => {
    const r = estimateAll(10_000, 2_000);
    expect(r.length).toBe(PRICING.length);
    for (const e of r) {
      expect(e.totalCost).toBeCloseTo(e.inputCost + e.outputCost, 9);
      expect(e.inputCost).toBeGreaterThan(0);
    }
  });

  it("formats small USD amounts readably", () => {
    expect(formatUsd(0)).toBe("$0");
    expect(formatUsd(0.000123)).toMatch(/^\$0\.000/);
    expect(formatUsd(0.5)).toBe("$0.5000");
  });
});
