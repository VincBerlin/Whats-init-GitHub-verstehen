import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Git & GitHub Wissen — Befehle, Workflows & Shortcuts",
  description:
    "Strukturiertes Git- und GitHub-Wissen auf Deutsch: praktische Befehle, Terminal-Workflows und Shortcuts — verständlich erklärt, mit Kopier-Buttons.",
};

// PHASE-1: Hub-Grundgerüst. Die strukturierten Wissensinhalte und
// Unterseiten (/github/shortcuts, /github/commands, /github/cli,
// /github/actions, /github/[slug]) werden in PHASE-4 aus den Datenmodulen
// gefüllt. Diese Seite ruft niemals OpenRouter auf (NFR-005, FR-016).

const SECTIONS = [
  {
    href: "/github/shortcuts",
    title: "Shortcuts & Workflows",
    desc: "„Ich will …“ — fertige Terminal-Abläufe zum Kopieren: Projekt starten, pushen, pullen, Aliase.",
  },
  {
    href: "/github/commands",
    title: "Git-Befehle",
    desc: "Die wichtigsten Git-Kommandos mit Erklärung, Syntax, Risiken und typischen Fehlern.",
  },
  {
    href: "/github/cli",
    title: "GitHub CLI",
    desc: "Mit der gh-CLI direkt aus dem Terminal arbeiten: Repos, Pull Requests, Issues.",
  },
  {
    href: "/github/actions",
    title: "GitHub Actions",
    desc: "Automatisierung mit Workflows: CI/CD, Tests und Deployments verstehen.",
  },
];

export default function GitHubHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
        Git &amp; GitHub verstehen
      </h1>
      <p className="text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed">
        Praktisches Git- und GitHub-Wissen auf Deutsch — von den ersten Schritten
        bis zu fortgeschrittenen Workflows. Alle Befehle zum direkten Kopieren,
        verständlich erklärt.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 hover:border-slate-700/60 transition-colors"
          >
            <div className="font-semibold text-slate-100 mb-2">{s.title}</div>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
