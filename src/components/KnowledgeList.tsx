import Link from "next/link";
import type { GitHubKnowledgeItem } from "@/types/knowledge";
import { enrich, RISK_BADGE } from "@/lib/knowledge-taxonomy";

// PHASE-4 — knowledge cards with risk badges (FR-015) linking to detail pages.
export default function KnowledgeList({ items }: { items: GitHubKnowledgeItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((k) => {
        const badge = RISK_BADGE[enrich(k).riskLevel];
        return (
          <Link key={k.slug} href={`/github/${k.slug}`} className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-5 hover:border-slate-700/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-slate-100">{k.title}</span>
              {badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${badge.cls}`}>{badge.text}</span>
              )}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{k.age16Summary}</p>
          </Link>
        );
      })}
    </div>
  );
}
