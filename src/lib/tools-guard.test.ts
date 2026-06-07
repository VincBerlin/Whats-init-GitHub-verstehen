import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// PHASE-10 (Master Plan) — the client tools must be fully local: no network
// (fetch/XMLHttpRequest) and no OpenRouter/LLM (SCOPE-005/006, NFR-008).
const TOOL_FILES = [
  "src/components/DebuggerTool.tsx",
  "src/components/TokenCalculator.tsx",
  "src/lib/error-matcher.ts",
  "src/lib/token-cost.ts",
  "src/data/error-patterns.ts",
  "src/app/tools/page.tsx",
  "src/app/tools/debugger/page.tsx",
  "src/app/tools/ai-credit-calculator/page.tsx",
];

describe("tools are local-only (no network, no LLM)", () => {
  for (const f of TOOL_FILES) {
    it(`${f} has no fetch / openrouter / XHR`, () => {
      const content = readFileSync(join(process.cwd(), f), "utf8");
      expect(/\bfetch\s*\(/.test(content), `${f} must not call fetch`).toBe(false);
      expect(/openrouter/i.test(content), `${f} must not reference openrouter`).toBe(false);
      expect(/XMLHttpRequest/.test(content), `${f} must not use XHR`).toBe(false);
    });
  }
});
