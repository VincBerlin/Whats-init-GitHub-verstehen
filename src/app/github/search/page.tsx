import type { Metadata } from "next";
import Link from "next/link";
import { searchKnowledge } from "@/lib/knowledge-search";
import KnowledgeList from "@/components/KnowledgeList";

export const metadata: Metadata = {
  title: "Suche — Git & GitHub Wissen",
  description: "Durchsuche Git- und GitHub-Befehle, Workflows und Konzepte.",
  robots: { index: false }, // search result pages: not indexable
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function GitHubSearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const { knowledge, workflows } = searchKnowledge(query);
  const hasResults = knowledge.length > 0 || workflows.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> Suche
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-2">
        {query ? <>Suche: <span className="text-blue-400">{query}</span></> : "Git & GitHub durchsuchen"}
      </h1>

      {!query && (
        <p className="text-slate-400 mt-4">Gib oben einen Befehl oder Begriff ein, z. B. „git push“, „branch“ oder „ssh“.</p>
      )}

      {query && !hasResults && (
        <div className="mt-6">
          <p className="text-slate-400 mb-6">
            Kein Treffer für „{query}“. Stöbere stattdessen in den Kategorien:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/github/commands" className="px-4 py-2 rounded-lg border border-slate-800/60 bg-slate-900/60 text-slate-200 hover:border-slate-700/60">Git-Befehle</Link>
            <Link href="/github/shortcuts" className="px-4 py-2 rounded-lg border border-slate-800/60 bg-slate-900/60 text-slate-200 hover:border-slate-700/60">Shortcuts &amp; Workflows</Link>
            <Link href="/github/cli" className="px-4 py-2 rounded-lg border border-slate-800/60 bg-slate-900/60 text-slate-200 hover:border-slate-700/60">GitHub CLI</Link>
            <Link href="/github/actions" className="px-4 py-2 rounded-lg border border-slate-800/60 bg-slate-900/60 text-slate-200 hover:border-slate-700/60">GitHub Actions</Link>
          </div>
        </div>
      )}

      {workflows.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Workflows</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workflows.map((w) => (
              <li key={w.slug}>
                <Link href={`/github/shortcuts#${w.slug}`} className="block rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-slate-700/60">
                  <span className="text-sm font-medium text-slate-200">{w.title}</span>
                  <p className="text-xs text-slate-500 mt-1">{w.goal}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {knowledge.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Themen</h2>
          <KnowledgeList items={knowledge} />
        </section>
      )}
    </div>
  );
}
