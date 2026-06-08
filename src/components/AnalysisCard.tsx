"use client";

import Image from "next/image";
import Link from "next/link";
import { AnalysisResult } from "@/types/analysis";
import CopyButton from "./CopyButton";

const CATEGORY_COLORS: Record<string, string> = {
  Library: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Framework: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  CLI: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Agent: "bg-red-500/15 text-red-400 border-red-500/30",
  MCP: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Design System": "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Template: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  "Web App": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Toolkit: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const CONCERN_COLORS: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-300 border-slate-600/40",
  medium: "bg-amber-500/10 text-amber-200 border-amber-500/30",
  high: "bg-red-500/10 text-red-200 border-red-500/30",
};

function CodeBox({ label, command, sublabel }: { label: string; command: string; sublabel?: string }) {
  return (
    <div className="rounded-lg border border-slate-700/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-slate-700/60">
        <div>
          <span className="text-xs font-medium text-slate-300">{label}</span>
          {sublabel && <span className="ml-2 text-xs text-slate-500">{sublabel}</span>}
        </div>
        <CopyButton text={command} />
      </div>
      <pre className="px-4 py-3 text-sm text-sky-300 font-mono overflow-x-auto bg-slate-900/40">
        <code>{command}</code>
      </pre>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 70 ? "bg-emerald-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="text-slate-500">{v}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

interface AnalysisCardProps {
  data: AnalysisResult;
  owner: string;
  repo: string;
  avatarUrl: string;
}

export default function AnalysisCard({ data, owner, repo, avatarUrl }: AnalysisCardProps) {
  const categoryClass = CATEGORY_COLORS[data.category] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";
  const facts = data.repositoryFacts;
  const installEntries = (
    [
      ["npm", data.installation.npm],
      ["pnpm", data.installation.pnpm],
      ["yarn", data.installation.yarn],
      ["pip", data.installation.pip],
      ["docker", data.installation.docker],
      ["manuell", data.installation.manual],
      ["clone", data.installation.clone],
    ] as const
  ).filter(([, cmd]) => Boolean(cmd));

  return (
    <article className="space-y-10">
      {/* ── Header / Overview ── */}
      <section id="overview">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryClass}`}>
            {data.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {facts.stars.toLocaleString("de-DE")} Stars · {facts.forks.toLocaleString("de-DE")} Forks
          </span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <Image src={avatarUrl} alt={`${owner} Logo`} width={56} height={56} className="rounded-xl border border-slate-700/60 shrink-0" unoptimized />
          <h1 className="text-3xl font-bold text-slate-100">{data.repoName}</h1>
        </div>
        <p className="text-lg text-slate-300 leading-relaxed mb-4">{data.coreBenefit}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Einfach erklärt</p>
            <p className="text-sm text-slate-300 leading-relaxed">{data.beginnerSummary}</p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-2">Technische Einordnung</p>
            <p className="text-sm text-slate-300 leading-relaxed">{data.professionalAssessment}</p>
          </div>
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
          {facts.language && <div><dt className="inline">Sprache: </dt><dd className="inline text-slate-400">{facts.language}</dd></div>}
          {facts.license && <div><dt className="inline">Lizenz: </dt><dd className="inline text-slate-400">{facts.license}</dd></div>}
          {facts.openIssues != null && <div><dt className="inline">Offene Issues: </dt><dd className="inline text-slate-400">{facts.openIssues.toLocaleString("de-DE")}</dd></div>}
          {facts.lastUpdated && <div><dt className="inline">Aktualisiert: </dt><dd className="inline text-slate-400">{new Date(facts.lastUpdated).toLocaleDateString("de-DE")}</dd></div>}
        </dl>

        <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
          </svg>
          {owner}/{repo} auf GitHub
        </a>
      </section>

      {/* ── Quality Score ── */}
      <section id="quality">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-100">Qualität</h2>
          <span className="text-sm text-slate-500">Gesamt {data.qualityScore.total}/100</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreBar label="Aktivität" value={data.qualityScore.activity} />
          <ScoreBar label="Dokumentation" value={data.qualityScore.documentation} />
          <ScoreBar label="Installation" value={data.qualityScore.installationClarity} />
          <ScoreBar label="Community" value={data.qualityScore.community} />
          <ScoreBar label="Sicherheit" value={data.qualityScore.security} />
          <ScoreBar label="Wartung" value={data.qualityScore.maintenance} />
        </div>
      </section>

      {/* ── Use cases / Not for ── */}
      {(data.useCases.length > 0 || data.notFor.length > 0) && (
        <section id="usecases" className="grid gap-6 sm:grid-cols-2">
          {data.useCases.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-emerald-400 mb-3">Gut geeignet für</h2>
              <ul className="space-y-2">
                {data.useCases.map((u, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300"><span className="text-emerald-500">+</span>{u}</li>
                ))}
              </ul>
            </div>
          )}
          {data.notFor.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-slate-400 mb-3">Weniger geeignet für</h2>
              <ul className="space-y-2">
                {data.notFor.map((u, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-400"><span className="text-slate-600">−</span>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ── Concerns ── */}
      {data.concerns.length > 0 && (
        <section id="concerns">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Worauf du achten solltest</h2>
          <div className="space-y-3">
            {data.concerns.map((c, i) => (
              <div key={i} className={`rounded-lg border p-4 ${CONCERN_COLORS[c.level] ?? CONCERN_COLORS.low}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide">{c.level}</span>
                  <span className="text-sm font-medium">{c.title}</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed mb-1">{c.explanation}</p>
                <p className="text-xs opacity-70">Prüfen: {c.whatToCheck}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Installation ── */}
      {installEntries.length > 0 && (
        <section id="installation">
          <h2 className="text-xl font-semibold text-slate-100 mb-1">Installation</h2>
          <p className="text-sm text-slate-500 mb-4">Befehle zum direkten Kopieren</p>
          <div className="space-y-3">
            {installEntries.map(([label, cmd]) => (
              <CodeBox key={label} label={label} command={cmd as string} />
            ))}
          </div>
        </section>
      )}

      {/* ── Commands used ── */}
      {data.commandsUsed.length > 0 && (
        <section id="commands">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Wichtige Befehle</h2>
          <div className="space-y-3">
            {data.commandsUsed.map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <code className="text-sm text-sky-300 font-mono">{c.command}</code>
                  <CopyButton text={c.command} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{c.explanation}</p>
                {c.linkSlug && (
                  <Link href={`/github/${c.linkSlug}`} className="text-xs text-blue-400 hover:text-blue-300 underline mt-1 inline-block">
                    Mehr erfahren
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── AI Prompts ── */}
      {data.aiPrompts.length > 0 && (
        <section id="ai-prompts">
          <h2 className="text-xl font-semibold text-slate-100 mb-1">KI-Befehle</h2>
          <p className="text-sm text-slate-500 mb-4">Direkt in Claude oder Cursor eingeben</p>
          <div className="grid gap-3">
            {data.aiPrompts.map((p, i) => (
              <div key={i} className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-violet-300 uppercase tracking-wide">{p.intent}</span>
                  <CopyButton text={p.prompt} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{p.prompt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {data.faq.length > 0 && (
        <section id="faq">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Häufige Fragen</h2>
          <div className="space-y-3">
            {data.faq.map((f, i) => (
              <details key={i} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
                <summary className="text-sm font-medium text-slate-200 cursor-pointer">{f.question}</summary>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
