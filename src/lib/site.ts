// PHASE-6 — single source of truth for the public base URL.
export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://whatsinit.app").replace(/\/$/, "");
}
