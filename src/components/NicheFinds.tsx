import Link from "next/link";
import { getNiche } from "@/lib/weekly-data";

// Vision PHASE-2 / FR-008, AC-007/AC-017 — "Interesting Growth Repositories".
// Quality-ranked (not star-dominant). Honest empty state, never fake data.
export default async function NicheFinds() {
  const { items } = await getNiche();

  return (
    <section className="text-left">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100">Interesting Growth Repositories</h2>
        <Link href="/github/trending" className="text-xs text-blue-400 hover:text-blue-300">Mehr Discovery →</Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Interesting repository discoveries are being prepared.</p>
      ) : (
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((r) => (
            <li key={`${r.owner}-${r.repo}`}>
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
      )}
    </section>
  );
}
