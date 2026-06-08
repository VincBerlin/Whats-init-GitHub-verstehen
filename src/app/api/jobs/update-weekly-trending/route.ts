import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { getStores } from "@/lib/stores";
import { isoDate, updateWeeklyTrending, weekBounds } from "@/lib/trending";

export const runtime = "nodejs";

// API-006: POST /api/jobs/update-weekly-trending — Bearer CRON_SECRET.
export async function POST(req: NextRequest) {
  if (!isAuthorizedCron(req.headers.get("authorization"))) {
    return NextResponse.json({ status: "error", code: "unauthorized" }, { status: 401 });
  }
  try {
    const now = new Date();
    const date = isoDate(now);
    const { weekStart, weekEnd } = weekBounds(now);
    const { itemsWritten } = await updateWeeklyTrending(weekStart, weekEnd, date, { stores: getStores() });
    return NextResponse.json({ status: "ok", week_start: weekStart, week_end: weekEnd, itemsWritten });
  } catch (err) {
    return NextResponse.json(
      { status: "error", code: "persistence_error", message: err instanceof Error ? err.message : "job failed" },
      { status: 500 },
    );
  }
}
