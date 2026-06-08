import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { getStores } from "@/lib/stores";
import { isoDate, updateTrendingSnapshots } from "@/lib/trending";

export const runtime = "nodejs";

// API-005: POST /api/jobs/update-trending-snapshots — Bearer CRON_SECRET.
export async function POST(req: NextRequest) {
  if (!isAuthorizedCron(req.headers.get("authorization"))) {
    return NextResponse.json({ status: "error", code: "unauthorized" }, { status: 401 });
  }
  let dryRun = false;
  try {
    const body = await req.json();
    dryRun = Boolean(body?.dryRun);
  } catch {
    // empty body is fine
  }
  try {
    const date = isoDate(new Date());
    const { snapshotsCreated } = await updateTrendingSnapshots(date, { stores: getStores() }, dryRun);
    return NextResponse.json({ status: "ok", snapshotsCreated });
  } catch (err) {
    return NextResponse.json(
      { status: "error", code: "github_error", message: err instanceof Error ? err.message : "job failed" },
      { status: 502 },
    );
  }
}
