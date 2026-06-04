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
        <ins
          className="adsbygoogle"
          style={{ display: "block", width, height }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`${wrapper} rounded-xl border border-slate-700/40 bg-slate-800/20 overflow-hidden`}
      style={{ width, height, maxWidth: "100%" }}
      aria-label="Werbeplatz (inaktiv)"
    >
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-700">
        <svg className="w-8 h-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="3" width="20" height="18" rx="2" strokeWidth="1.5" />
          <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.5" />
        </svg>
        <span className="text-xs opacity-40">Werbeplatz</span>
      </div>
    </div>
  );
}
