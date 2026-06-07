import type { Metadata } from "next";
import Link from "next/link";
import { KNOWLEDGE_ITEMS } from "@/data/github-knowledge";
import KnowledgeList from "@/components/KnowledgeList";

export const metadata: Metadata = {
  title: "Git-Befehle — Erklärt mit Beispielen",
  description:
    "Die wichtigsten Git-Befehle auf Deutsch: clone, add, commit, branch, merge, rebase, push, pull, revert. Mit Syntax, Risiken und typischen Fehlern.",
};

const CATEGORIES = ["git-commands", "branching", "undo", "remote", "repo-management", "security"] as const;

export default function CommandsPage() {
  const items = KNOWLEDGE_ITEMS.filter((k) => (CATEGORIES as readonly string[]).includes(k.category));
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> Befehle
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">Git-Befehle</h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        Die wichtigsten Kommandos — jeweils einfach erklärt, mit Syntax, Risiken und Fehlern.
      </p>
      <KnowledgeList items={items} />
    </div>
  );
}
