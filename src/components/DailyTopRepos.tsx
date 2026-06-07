import Link from "next/link";
import { getDailyTop } from "@/lib/weekly-data";

// Vision PHASE-2 / FR-005/006 — Daily Top 5, 5 cards horizontal on desktop,
// directly under the analysis search. DB read only (NFR-001), no LLM.
export default async function DailyTopRepos() {
  const { items, isFallback } = await getDailyTop();

  if (items.length === 0) {
    return (
      <section className="text-left">
        <h2 className="text-xl font-bold text-slate-100 mb-3">Daily Top 5</h2>
        <p className="text-sm text-slate-500">Daily ranking is being prepared.</p>
      </section>
    );
  }

  return (
    <section className="text-left">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100">Daily Top 5</h2>
        {isFallback && <span className="text-xs text-slate-600">Beispiel-Auswahl</span>}
      </div>
      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.slice(0, 5).map((r) => (
          <li key={`${r.owner}-${r.repo}`}>
            <Link
              href={r.analyseHref}
              className="flex h-full flex-col rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 hover:border-slate-700/60 transition-colors"
            >
              <span className="text-xs font-bold text-slate-600 mb-1">#{r.rank}</span>
              <span className="text-sm font-medium text-slate-200 truncate">{r.repo}</span>
              <span className="text-xs text-slate-500 truncate">{r.owner}</span>
              <span className="mt-auto pt-2 text-xs text-slate-600">★ {r.stars.toLocaleString("de-DE")}{r.language ? ` · ${r.language}` : ""}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
