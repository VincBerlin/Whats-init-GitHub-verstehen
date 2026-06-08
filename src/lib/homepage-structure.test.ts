import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// PHASE-1 (homepage-tools-discovery) — structural guards for the homepage correction.
// FR-001/AC-001: the hardcoded example-repo line is gone.
// FR-002/AC-002/VCHK-001: the three free local zero-LLM tools are embedded (usable),
// not merely linked — Analyze form + TokenCalculator + DebuggerTool present on the page.
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

describe("homepage structure (FR-001/FR-002)", () => {
  const page = read("src/app/page.tsx");
  const tools = read("src/components/home/HomepageTools.tsx");

  it("FR-001: no hardcoded example-repo line", () => {
    expect(page).not.toMatch(/vercel\/next\.js/);
    expect(page).not.toMatch(/shadcn-ui\/ui/);
    expect(page).not.toMatch(/badlogic\/pi-mono/);
  });

  it("FR-002: homepage embeds the three tools", () => {
    expect(page).toMatch(/HomepageTools/);
    expect(page).toMatch(/action=\{handleSubmit\}/); // Analyze form still present
    expect(tools).toMatch(/TokenCalculator/);
    expect(tools).toMatch(/DebuggerTool/);
  });

  it("VCHK-001: tools are rendered components, not just links", () => {
    expect(tools).toMatch(/<TokenCalculator\s*\/>/);
    expect(tools).toMatch(/<DebuggerTool\s*\/>/);
  });
});
