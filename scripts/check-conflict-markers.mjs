import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
]);

const CONFLICT_MARKER_RE = /^(<<<<<<<|=======|>>>>>>>)( .*)?$/m;

let found = false;

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");

  if (CONFLICT_MARKER_RE.test(text)) {
    console.error(`Conflict marker found in ${path.relative(ROOT, filePath)}`);
    found = true;
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    if (!entry.isFile()) continue;

    scanFile(fullPath);
  }
}

walk(ROOT);

if (found) {
  process.exit(1);
}
