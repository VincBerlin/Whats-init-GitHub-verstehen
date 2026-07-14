import Link from "next/link";
import { getWeeklyTop } from "@/lib/weekly-data";

// PHASE-5 — async server component. Reads stored Weekly Top 10 (or seed fallback).
// No live GitHub fetch, no OpenRouter (NFR-001, FR-017, NOGOAL-004).
export default async function WeeklyTopRepos({ heading = true, showMoreLink = true }: { heading?: boolean; showMoreLink?: boolean }) {
  const { items, isFallback } = await getWeeklyTop();
  if (items.length === 0) return null;

  return (
    <section className="text-left">
      {heading && (
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-100">Weekly Top 10</h2>
          {/* Suppressed on /repositories (the hub itself) to avoid a self-link. */}
          {showMoreLink && <Link href="/repositories" className="text-xs text-blue-400 hover:text-blue-300">Alle ansehen →</Link>}
        </div>
      )}
      {isFallback && (
        <p className="text-xs text-slate-600 mb-4">
          Beispiel-Auswahl — die wöchentliche Rangliste wird nach dem ersten Cron-Lauf live befüllt.
        </p>
      )}
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((r) => (
          <li key={`${r.rank}-${r.owner}-${r.repo}`}>
            <Link href={r.analyseHref} className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 hover:border-slate-700/60 transition-colors">
              <span className="text-sm font-bold text-slate-600 w-6 shrink-0">{r.rank}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">{r.owner}/{r.repo}</div>
                {r.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{r.description}</p>}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                  <span>★ {r.stars.toLocaleString("de-DE")}</span>
                  {r.language && <span>{r.language}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1">{r.reason}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
