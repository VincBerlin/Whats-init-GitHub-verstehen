// PHASE-6 — single source of truth for the public base URL.
// Robust: tolerate SITE_URL set without a scheme (e.g. a bare Railway host),
// so `new URL(siteUrl())` (metadataBase) never throws at build time.
export function siteUrl(): string {
  const raw = (process.env.SITE_URL ?? "https://whatsinit.app").trim().replace(/\/+$/, "");
  if (!raw) return "https://whatsinit.app";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}
