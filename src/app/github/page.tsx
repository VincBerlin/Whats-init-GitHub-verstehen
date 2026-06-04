import type { Metadata } from "next";
import Link from "next/link";
import { KNOWLEDGE_ITEMS } from "@/data/github-knowledge";
import { WORKFLOWS } from "@/data/git-workflows";

export const metadata: Metadata = {
  title: "Git & GitHub Wissen — Befehle, Workflows & Shortcuts",
  description:
    "Strukturiertes Git- und GitHub-Wissen auf Deutsch: praktische Befehle, Terminal-Workflows und Shortcuts — verständlich erklärt, mit Kopier-Buttons. Keine KI-Kosten, reine Inhalte.",
};

// Static, data-driven hub. Never calls OpenRouter (FR-016, NFR-005).
const SECTIONS = [
  { href: "/github/shortcuts", title: "Shortcuts & Workflows", desc: "„Ich will …“ — fertige Terminal-Abläufe zum Kopieren." },
  { href: "/github/commands", title: "Git-Befehle", desc: "Die wichtigsten Kommandos mit Erklärung, Risiken und Fehlern." },
  { href: "/github/cli", title: "GitHub CLI", desc: "Mit der gh-CLI direkt aus dem Terminal arbeiten." },
  { href: "/github/actions", title: "GitHub Actions", desc: "Automatisierung: CI/CD, Tests und Deployments verstehen." },
];

export default function GitHubHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Git &amp; GitHub verstehen</h1>
      <p className="text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed">
        Praktisches Git- und GitHub-Wissen auf Deutsch — von den ersten Schritten bis zu
        fortgeschrittenen Workflows. Alle Befehle zum direkten Kopieren, verständlich erklärt.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 hover:border-slate-700/60 transition-colors">
            <div className="font-semibold text-slate-100 mb-2">{s.title}</div>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-slate-100 mb-4">Beliebte Workflows</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
        {WORKFLOWS.map((w) => (
          <li key={w.slug}>
            <Link href={`/github/shortcuts#${w.slug}`} className="block rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-slate-700/60 transition-colors">
              <span className="text-sm font-medium text-slate-200">{w.title}</span>
              <p className="text-xs text-slate-500 mt-1">{w.goal}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-slate-100 mb-4">Alle Themen</h2>
      <div className="flex flex-wrap gap-2">
        {KNOWLEDGE_ITEMS.map((k) => (
          <Link key={k.slug} href={`/github/${k.slug}`} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700/60 hover:text-slate-100 transition-all">
            {k.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
