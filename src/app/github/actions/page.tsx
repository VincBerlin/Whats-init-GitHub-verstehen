import type { Metadata } from "next";
import Link from "next/link";
import { getKnowledgeByCategory } from "@/data/github-knowledge";
import KnowledgeList from "@/components/KnowledgeList";

export const metadata: Metadata = {
  title: "GitHub Actions — Automatisierung & CI/CD",
  description:
    "GitHub Actions verständlich erklärt: Workflows, Trigger, Jobs und Steps. Tests automatisch laufen lassen, bauen und deployen — mit Sicherheitshinweisen zu Secrets.",
};

export default function ActionsPage() {
  const items = getKnowledgeByCategory("github-actions");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> GitHub Actions
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">GitHub Actions</h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        Automatisiere Tests, Builds und Deployments — ausgelöst durch Ereignisse in deinem Repository.
      </p>
      <KnowledgeList items={items} />
    </div>
  );
}
