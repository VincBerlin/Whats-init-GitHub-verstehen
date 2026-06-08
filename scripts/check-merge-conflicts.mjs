import { execSync } from "node:child_process";

const markerPattern = "^(<<<<<<<|=======|>>>>>>>)";

try {
  const output = execSync(`rg -n --hidden --glob '!.git' --glob '!node_modules' \"${markerPattern}\" .`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  if (output) {
    console.error("❌ Merge-Konflikt-Markierungen gefunden. Bitte auflösen, bevor gebaut wird:\n");
    console.error(output);
    process.exit(1);
  }
} catch (error) {
  // rg returns exit code 1 when no matches are found.
  if (error?.status === 1) {
    process.exit(0);
  }

  console.error("❌ Fehler beim Prüfen auf Merge-Konflikt-Markierungen:");
  console.error(error?.stderr?.toString?.() || error?.message || String(error));
  process.exit(2);
}
