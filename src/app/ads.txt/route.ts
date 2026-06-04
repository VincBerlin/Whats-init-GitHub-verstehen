// PHASE-6 / FR-020 — ads.txt. Publisher ID is MISSING-005 until AdSense approval;
// set ADSENSE_PUBLISHER_ID (e.g. pub-XXXXXXXXXXXXXXXX) to emit the real entry.
export const runtime = "nodejs";
export const dynamic = "force-static";

export function GET(): Response {
  const pubId = process.env.ADSENSE_PUBLISHER_ID;
  const body = pubId
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : "# PLATZHALTER — noch keine AdSense-Publisher-ID hinterlegt (MISSING-005).\n# Nach AdSense-Freigabe ADSENSE_PUBLISHER_ID setzen, dann erscheint hier der echte Eintrag.\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
