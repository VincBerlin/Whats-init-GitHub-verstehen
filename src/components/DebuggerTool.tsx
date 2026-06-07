"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { matchErrors } from "@/lib/error-matcher";

type Filter = "all" | "git" | "actions";

// PHASE-6 — combined Git & Actions debugger. 100% client-side, deterministic,
// no network or LLM call. Paste an error, get likely causes + fixes.
export default function DebuggerTool() {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const matches = useMemo(
    () => matchErrors(input, filter === "all" ? undefined : filter),
    [input, filter],
  );

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(["all", "git", "actions"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              filter === f
                ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                : "border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            {f === "all" ? "Alle" : f === "git" ? "Git" : "Actions"}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Fehlermeldung hier einfügen, z. B. 'git@github.com: Permission denied (publickey)' …"
        rows={6}
        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500/60"
      />
      <p className="text-xs text-slate-600 mt-2">
        Läuft vollständig in deinem Browser — nichts wird hochgeladen, keine KI, keine Kosten.
      </p>

      <div className="mt-6 space-y-4">
        {input.trim() && matches.length === 0 && (
          <p className="text-sm text-slate-500">
            Kein bekanntes Muster erkannt. Schau im{" "}
            <Link href="/github" className="text-blue-400 hover:text-blue-300">Wissens-Hub</Link> oder{" "}
            <Link href="/blog" className="text-blue-400 hover:text-blue-300">Blog</Link> nach.
          </p>
        )}

        {matches.map(({ pattern }) => (
          <div key={pattern.id} className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-full border ${pattern.tool === "git" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-violet-500/15 text-violet-400 border-violet-500/30"}`}>
                {pattern.tool === "git" ? "Git" : "Actions"}
              </span>
              <h3 className="text-sm font-semibold text-slate-100">{pattern.title}</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">{pattern.cause}</p>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">So behebst du es</p>
            <ol className="space-y-1 mb-3">
              {pattern.fix.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300"><span className="text-slate-600">{i + 1}.</span>{step}</li>
              ))}
            </ol>
            {pattern.related && pattern.related.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pattern.related.map((r) => (
                  <Link key={r.href} href={r.href} className="text-xs text-blue-400 hover:text-blue-300 underline">{r.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
