import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { getStores } from "@/lib/stores";
import { isoDate, updateDailyDiscovery } from "@/lib/trending";

export const runtime = "nodejs";

// API-003: POST /api/jobs/update-daily-discovery — Bearer CRON_SECRET.
// GitHub API + Postgres only; never OpenRouter (FR-018).
export async function POST(req: NextRequest) {
  if (!isAuthorizedCron(req.headers.get("authorization"))) {
    return NextResponse.json({ status: "error", code: "unauthorized" }, { status: 401 });
  }
  try {
    const day = isoDate(new Date());
    const result = await updateDailyDiscovery(day, { stores: getStores() });
    return NextResponse.json({ status: "ok", day, ...result });
  } catch (err) {
    return NextResponse.json(
      { status: "error", code: "github_error", message: err instanceof Error ? err.message : "job failed" },
      { status: 502 },
    );
  }
}
