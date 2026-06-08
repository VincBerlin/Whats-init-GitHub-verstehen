import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KNOWLEDGE_ITEMS, getKnowledgeItem } from "@/data/github-knowledge";
import { enrich, RISK_BADGE } from "@/lib/knowledge-taxonomy";
import CommandBlock from "@/components/CommandBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static generation: all knowledge pages are prerendered, never LLM-generated.
export function generateStaticParams() {
  return KNOWLEDGE_ITEMS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getKnowledgeItem(slug);
  if (!item) return { title: "Nicht gefunden" };
  return {
    title: item.title,
    description: item.age16Summary.slice(0, 155),
  };
}

export default async function KnowledgeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getKnowledgeItem(slug);
  if (!item) notFound();

  const related = item.relatedSlugs.map(getKnowledgeItem).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> {item.title}
      </nav>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-slate-100">{item.title}</h1>
        {(() => {
          const badge = RISK_BADGE[enrich(item).riskLevel];
          return badge ? <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.cls}`}>{badge.text}</span> : null;
        })()}
      </div>

      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-5 mb-8">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Einfach erklärt</p>
        <p className="text-slate-200 leading-relaxed">{item.age16Summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">Im Detail</h2>
        <p className="text-slate-300 leading-relaxed">{item.expertExplanation}</p>
      </section>

      {item.syntax && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Syntax</h2>
          <CommandBlock code={item.syntax} label="Syntax" copyable={Boolean(item.copyCommand)} />
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <section>
          <h2 className="text-base font-semibold text-emerald-400 mb-3">Wann nutzen?</h2>
          <ul className="space-y-2">
            {item.whenToUse.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300"><span className="text-emerald-500">+</span>{w}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-amber-400 mb-3">Risiken</h2>
          <ul className="space-y-2">
            {item.risks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400"><span className="text-amber-500">!</span>{r}</li>
            ))}
          </ul>
        </section>
      </div>

      {item.commonMistakes && item.commonMistakes.length > 0 && (
        <section className="mb-8 rounded-lg border border-slate-800/60 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-3">Typische Fehler</h2>
          <ul className="space-y-2">
            {item.commonMistakes.map((m, i) => (
              <li key={i} className="text-sm text-slate-400">• {m}</li>
            ))}
          </ul>
        </section>
      )}

      {item.faq && item.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Häufige Fragen</h2>
          <div className="space-y-3">
            {item.faq.map((f, i) => (
              <details key={i} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
                <summary className="text-sm font-medium text-slate-200 cursor-pointer">{f.question}</summary>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="pt-6 border-t border-slate-800/60">
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">Verwandte Themen</p>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/github/${r.slug}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-700/60 hover:text-slate-200 transition-all">
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
