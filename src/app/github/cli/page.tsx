import type { Metadata } from "next";
import Link from "next/link";
import { getKnowledgeByCategory } from "@/data/github-knowledge";
import KnowledgeList from "@/components/KnowledgeList";

export const metadata: Metadata = {
  title: "GitHub CLI (gh) — GitHub im Terminal",
  description:
    "Die GitHub CLI (gh) verständlich erklärt: Repos anlegen, Pull Requests öffnen, Issues und Workflows direkt aus dem Terminal verwalten.",
};

export default function CliPage() {
  const items = getKnowledgeByCategory("github-cli");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> GitHub CLI
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">GitHub CLI</h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        Mit dem Programm <code className="text-sky-300">gh</code> steuerst du GitHub direkt aus dem Terminal.
      </p>
      <KnowledgeList items={items} />
    </div>
  );
}
