// PHASE-6 / SEC-009, FR-021 — ad placement policy. Ads may only appear in
// designated zones that are spatially separated from copy/download/CTA buttons,
// and never imitate buttons or block content.
export const ALLOWED_AD_PLACEMENTS = ["sidebar", "content-break", "footer"] as const;
export type AdPlacement = (typeof ALLOWED_AD_PLACEMENTS)[number];

// Zones explicitly forbidden because they sit next to action buttons.
export const FORBIDDEN_AD_PLACEMENTS = ["inline-with-copy", "next-to-cta", "next-to-download"] as const;

export function isAllowedPlacement(placement: string): placement is AdPlacement {
  return (ALLOWED_AD_PLACEMENTS as readonly string[]).includes(placement);
}

export function adsenseClient(): string | undefined {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || process.env.ADSENSE_PUBLISHER_ID || undefined;
}

/** Ads render only when explicitly enabled AND a publisher id exists (ROLLBACK-005). */
export function adsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === "true" && Boolean(adsenseClient());
}
