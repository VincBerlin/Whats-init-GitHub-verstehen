import type { Metadata } from "next";
import Link from "next/link";
import { WORKFLOWS } from "@/data/git-workflows";
import { TERMINAL_SHORTCUTS } from "@/data/terminal-shortcuts";
import CommandBlock from "@/components/CommandBlock";

export const metadata: Metadata = {
  title: "Git Shortcuts & Workflows — Befehle zum Kopieren",
  description:
    "Fertige „Ich will …“-Workflows für Git und GitHub: Projekt hochladen, committen, push & pull, Branches, Merge-Konflikte lösen. Alle Befehle zum direkten Kopieren.",
};

const RISK_LABEL: Record<string, { text: string; cls: string }> = {
  safe: { text: "sicher", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  careful: { text: "mit Vorsicht", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  dangerous: { text: "riskant", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
};

export default function ShortcutsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> Shortcuts
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">Shortcuts &amp; Workflows</h1>
      <p className="text-slate-400 mb-12 leading-relaxed">
        Wähle dein Ziel — kopiere die Befehle Schritt für Schritt. Kein Account, keine KI-Kosten.
      </p>

      <div className="space-y-10">
        {WORKFLOWS.map((w) => {
          const risk = RISK_LABEL[w.riskLevel];
          return (
            <section key={w.slug} id={w.slug} className="scroll-mt-20">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-slate-100">{w.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${risk.cls}`}>{risk.text}</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{w.shortExplanation}</p>
              <div className="space-y-3">
                {w.commands.map((c, i) => (
                  <CommandBlock key={i} label={c.label} code={c.code} copyable={c.copyable} />
                ))}
              </div>
              {w.commonMistakes.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">Typische Fehler</p>
                  <ul className="space-y-1">
                    {w.commonMistakes.map((m, i) => (
                      <li key={i} className="text-sm text-amber-200/80">• {m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <hr className="border-slate-800/60 my-14" />

      <h2 className="text-2xl font-bold text-slate-100 mb-6">Nützliche Shortcuts</h2>
      <div className="space-y-3">
        {TERMINAL_SHORTCUTS.map((s) => (
          <div key={s.slug} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
            <div className="font-medium text-slate-200 text-sm mb-1">{s.title}</div>
            <p className="text-xs text-slate-500 mb-2">{s.description}</p>
            <CommandBlock code={s.command} label="Befehl" />
          </div>
        ))}
      </div>
    </div>
  );
}
