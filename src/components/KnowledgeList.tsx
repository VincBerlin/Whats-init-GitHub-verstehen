import Link from "next/link";
import type { GitHubKnowledgeItem } from "@/types/knowledge";

// PHASE-4 — renders knowledge items as cards linking to their detail page.
export default function KnowledgeList({ items }: { items: GitHubKnowledgeItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((k) => (
        <Link key={k.slug} href={`/github/${k.slug}`} className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-5 hover:border-slate-700/60 transition-colors">
          <div className="font-semibold text-slate-100 mb-2">{k.title}</div>
          <p className="text-sm text-slate-500 leading-relaxed">{k.age16Summary}</p>
        </Link>
      ))}
    </div>
  );
}
