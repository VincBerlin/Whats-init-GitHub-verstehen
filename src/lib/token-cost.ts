// PHASE-7 (Master Plan) — token cost estimation. Pure functions, no network.
// IMPORTANT: prices are PLACEHOLDER example values (MISSING-005). They must be
// verified against the providers' current pricing before being shown as fact.

export interface ModelPricing {
  id: string;
  label: string;
  inputPerMillion: number; // USD per 1,000,000 input tokens
  outputPerMillion: number; // USD per 1,000,000 output tokens
}

// Example rates only — verify before relying on them.
export const PRICING: ModelPricing[] = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", inputPerMillion: 0.3, outputPerMillion: 2.5 },
  { id: "gpt-4o-mini", label: "GPT-4o mini", inputPerMillion: 0.15, outputPerMillion: 0.6 },
  { id: "gpt-4o", label: "GPT-4o", inputPerMillion: 2.5, outputPerMillion: 10 },
  { id: "claude-haiku", label: "Claude Haiku", inputPerMillion: 0.8, outputPerMillion: 4 },
];

export const PRICING_SOURCE_NOTE =
  "Beispielwerte (Stand 2026-06) — Preise ändern sich; vor Nutzung beim Anbieter prüfen.";

/** Cost in USD for a token count at a per-million rate. Pure. */
export function costFor(tokens: number, perMillion: number): number {
  if (tokens <= 0 || perMillion <= 0) return 0;
  return (tokens / 1_000_000) * perMillion;
}

export interface CostEstimate {
  model: ModelPricing;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export function estimateAll(inputTokens: number, outputTokens: number): CostEstimate[] {
  return PRICING.map((model) => {
    const inputCost = costFor(inputTokens, model.inputPerMillion);
    const outputCost = costFor(outputTokens, model.outputPerMillion);
    return { model, inputCost, outputCost, totalCost: inputCost + outputCost };
  });
}

/** Format a small USD amount with enough precision to be meaningful. */
export function formatUsd(value: number): string {
  if (value === 0) return "$0";
  if (value < 0.01) return `$${value.toFixed(5)}`;
  return `$${value.toFixed(4)}`;
}
