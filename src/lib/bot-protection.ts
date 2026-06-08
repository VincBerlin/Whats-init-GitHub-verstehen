// PHASE-2 / TASK-2.4 — bot heuristics for the WRITE action (/api/analyze).
// Search/ads crawlers read public pages freely; they have no reason to POST a
// new analysis, so blocking obvious automation here protects OpenRouter cost
// (ABUSE-001) without harming SEO/AdSense crawling of content pages.

const BOT_UA_RE =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|scrapy|libwww|java\/|go-http-client|okhttp|headless|phantomjs|axios\/)/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  const ua = (userAgent ?? "").trim();
  if (ua.length === 0) return true; // no UA on a write action → treat as bot
  if (ua.length < 8) return true;
  return BOT_UA_RE.test(ua);
}
