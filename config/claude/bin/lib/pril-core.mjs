// PRIL core — pure, dependency-free logic for the Plumbline gate scripts.
// Kept side-effect-free so it is unit-testable (src/lib/pril-core.test.ts).
// Exit-code convention used by the CLI wrappers: 0 = pass, 2 = artifact missing,
// 3 = check failed.

// Reality-ledger floor: a value/boundary requirement must be proven at a real
// boundary, not by a fake. unit-fake / integration-fake are below the floor.
export const EVIDENCE_FLOOR = ["real-boundary-smoke", "production-verified"];

// Laundering markers that must never appear in an evidence_ref/note — they mean
// the "evidence" is not real (escalation-asymmetry / no-laundering).
export const FORBIDDEN_TOKENS = ["placeholder", "unverified", "fake-only", "mock-only"];

/** Extract the value of a plain `Status: <x>` line (case-insensitive key). */
export function parseCanvasStatus(text) {
  const m = text.match(/^\s*Status:\s*(\S+)\s*$/im);
  return m ? m[1].toLowerCase() : null;
}

/** Convert a scope glob (supporting ** and *) to an anchored RegExp. */
export function globToRegex(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++; // consume second *
        if (glob[i + 1] === "/") {
          i++; // consume slash → **/  matches any dirs including none
          re += "(?:.*/)?";
        } else {
          re += ".*";
        }
      } else {
        re += "[^/]*";
      }
    } else if (".+?^${}()|[]\\".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp("^" + re + "$");
}

/** True if `file` matches any glob in the list. */
export function matchesAny(file, globs) {
  return globs.some((g) => globToRegex(g).test(file));
}

/**
 * Check changed files against a scope definition.
 * @returns {string[]} out-of-scope file messages (empty = pass).
 */
export function checkScope(changed, scope) {
  const allowed = scope.allowed_globs ?? [];
  const deletions = scope.allowed_deletions ?? [];
  const problems = [];
  for (const f of changed) {
    if (matchesAny(f, allowed) || matchesAny(f, deletions)) continue;
    problems.push(f);
  }
  return problems;
}

/**
 * Validate reality-ledger entries against the floor + forbidden tokens, and
 * ensure every required requirement id has a qualifying entry.
 * @returns {string[]} problem messages (empty = pass).
 */
export function checkReality(entries, required = []) {
  const problems = [];
  for (const e of entries) {
    const id = e.requirement_id ?? "(no id)";
    const blob = `${e.evidence_ref ?? ""} ${e.note ?? ""}`.toLowerCase();
    for (const t of FORBIDDEN_TOKENS) {
      if (blob.includes(t)) problems.push(`${id}: forbidden token '${t}' in evidence`);
    }
    if (!EVIDENCE_FLOOR.includes(e.evidence_class)) {
      problems.push(`${id}: evidence_class '${e.evidence_class}' below floor (${EVIDENCE_FLOOR.join("|")})`);
    }
    if (e.wired_in_prod !== true) {
      problems.push(`${id}: wired_in_prod is not true`);
    }
  }
  for (const r of required) {
    if (!entries.some((e) => e.requirement_id === r)) {
      problems.push(`required ${r}: no ledger entry`);
    }
  }
  return problems;
}

/** Parse a JSONL string into an array of objects (skips blank lines). */
export function parseJsonl(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

/** Redact secrets/PII from a string before it could be logged. */
export function redact(text) {
  return text
    .replace(/\b(sk|pk)-[A-Za-z0-9_-]{10,}/g, "$1-[REDACTED_KEY]")
    .replace(/\bgh[posru]_[A-Za-z0-9]{16,}/g, "[REDACTED_GH_TOKEN]")
    .replace(/\bBearer\s+[A-Za-z0-9._-]{8,}/gi, "Bearer [REDACTED]")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[REDACTED_EMAIL]")
    .replace(/\b([A-Za-z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD))\s*=\s*\S+/gi, "$1=[REDACTED]");
}
