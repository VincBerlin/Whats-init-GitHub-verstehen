import { adsEnabled, adsenseClient, isAllowedPlacement, type AdPlacement } from "@/lib/ad-policy";

interface AdSlotProps {
  placement: AdPlacement;
  width?: number;
  height?: number;
  slotId?: string;
}

// PHASE-6 — policy-safe ad container. Only renders in allowed, separated zones
// (FR-021/SEC-009). Until ads are enabled (NEXT_PUBLIC_ADS_ENABLED + publisher
// id), it shows a neutral, clearly-labelled placeholder — never a fake button.
export default function AdSlot({ placement, width = 300, height = 250, slotId }: AdSlotProps) {
  if (!isAllowedPlacement(placement)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ad-policy] blocked disallowed ad placement: ${placement}`);
    }
    return null;
  }

  // Margin enforces separation from adjacent content/buttons.
  const wrapper = "my-6 mx-auto";

  if (adsEnabled()) {
    const client = adsenseClient();
    return (
      <div className={wrapper} style={{ maxWidth: "100%" }} aria-label="Werbeanzeige">
        {/* Label required for transparency / AdSense policy (FR-019) */}
        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1 text-center">Anzeige</div>
        {/* min-height reserves space to avoid layout shift (NFR-006/CLS) */}
        <ins
          className="adsbygoogle"
          style={{ display: "block", width, minHeight: height }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // PHASE-8: ads disabled → in production render NOTHING (no empty ad frames for
  // AdSense review / users). Only in development show a labelled placeholder so
  // developers can see where slots will appear.
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className={`${wrapper} rounded-xl border border-dashed border-slate-700/40 bg-slate-800/10 overflow-hidden`}
      style={{ width, height, maxWidth: "100%" }}
      aria-hidden="true"
    >
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-700">
        <span className="text-xs opacity-40">Werbeplatz (nur Dev sichtbar): {placement}</span>
      </div>
    </div>
  );
}
