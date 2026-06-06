import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { KNOWLEDGE_ITEMS, getKnowledgeItem } from "./github-knowledge";
import { WORKFLOWS } from "./git-workflows";
import { TERMINAL_SHORTCUTS } from "./terminal-shortcuts";

// TEST-006 (FR-016, AC-013, AC-016)
describe("knowledge data integrity", () => {
  it("has unique knowledge slugs", () => {
    const slugs = KNOWLEDGE_ITEMS.map((k) => k.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique workflow slugs", () => {
    const slugs = WORKFLOWS.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique terminal-shortcut slugs", () => {
    const slugs = TERMINAL_SHORTCUTS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves every knowledge relatedSlug to an existing item", () => {
    for (const item of KNOWLEDGE_ITEMS) {
      for (const rel of item.relatedSlugs) {
        expect(getKnowledgeItem(rel), `${item.slug} → missing related '${rel}'`).toBeTruthy();
      }
    }
  });

  it("resolves every workflow relatedCommand to an existing workflow", () => {
    const wf = new Set(WORKFLOWS.map((w) => w.slug));
    for (const w of WORKFLOWS) {
      for (const rel of w.relatedCommands) {
        expect(wf.has(rel), `${w.slug} → missing related '${rel}'`).toBe(true);
      }
    }
  });

  it("has substantial content (not thin) on every item", () => {
    for (const item of KNOWLEDGE_ITEMS) {
      expect(item.age16Summary.length, item.slug).toBeGreaterThan(40);
      expect(item.expertExplanation.length, item.slug).toBeGreaterThan(80);
      expect(item.whenToUse.length, item.slug).toBeGreaterThan(0);
    }
  });
});

// FR-016 / ARCH-006: static knowledge must never import the OpenRouter adapter.
describe("no LLM dependency in knowledge surface", () => {
  function scan(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) out.push(...scan(p));
      else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) out.push(p);
    }
    return out;
  }

  // Discovery (Daily/Weekly/Niche), knowledge data and the /github + jobs surface
  // must never import the OpenRouter adapter (FR-018, NOGOAL-001).
  const importRe = /(?:import[^;]*from\s*['"][^'"]*openrouter|require\(\s*['"][^'"]*openrouter)/i;

  it("contains no openrouter import in data/github/discovery surface", () => {
    const files = [
      ...scan(join(process.cwd(), "src/data")),
      ...scan(join(process.cwd(), "src/app/github")),
      ...scan(join(process.cwd(), "src/lib/discovery")),
      ...scan(join(process.cwd(), "src/app/api/jobs")),
    ];
    for (const f of files) {
      const content = readFileSync(f, "utf8");
      expect(importRe.test(content), `${f} must not import openrouter`).toBe(false);
    }
  });

  it("trending + weekly-data + knowledge-search do not import openrouter", () => {
    for (const f of ["src/lib/trending.ts", "src/lib/weekly-data.ts", "src/lib/knowledge-search.ts"]) {
      const content = readFileSync(join(process.cwd(), f), "utf8");
      expect(importRe.test(content), `${f} must not import openrouter`).toBe(false);
    }
  });
});
