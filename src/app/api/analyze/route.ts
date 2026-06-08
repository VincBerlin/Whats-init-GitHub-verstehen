import { NextRequest, NextResponse } from "next/server";
import { openRouterAnalyzer } from "@/lib/openrouter";
import { runAnalysis } from "@/lib/analysis-service";
import { extractClientContext } from "@/lib/request-context";
import { getStores } from "@/lib/stores";

// Node runtime: uses pg + node:crypto (not edge-compatible).
export const runtime = "nodejs";

// API-001: POST /api/analyze — cache-first, rate-limited, bot-protected,
// single-call-under-concurrency analysis. Accepts { url } or { owner, repo }.
const HTTP_STATUS: Record<string, number> = {
  not_github: 400,
  malformed: 400,
  empty_input: 400,
  bot_blocked: 403,
  rate_limited: 429,
  github_not_found: 404,
  github_fetch_failed: 502,
  validation_failed: 502,
  llm_failed: 502,
  error: 500,
};

export async function POST(req: NextRequest) {
  let body: { url?: string; owner?: string; repo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", code: "malformed", message: "Ungültiger Request-Body." },
      { status: 400 },
    );
  }

  const input = body.url ?? (body.owner && body.repo ? `${body.owner}/${body.repo}` : "");
  const client = extractClientContext(req.headers);

  const result = await runAnalysis(
    { input, client },
    { stores: getStores(), analyzer: openRouterAnalyzer },
  );

  if (result.status === "analysis_in_progress") {
    return NextResponse.json(result, { status: 202 });
  }
  if (result.status === "error") {
    return NextResponse.json(result, { status: HTTP_STATUS[result.code] ?? 500 });
  }
  return NextResponse.json(result, { status: 200 });
}
