"use client";

import { useMemo, useState } from "react";
import { encode } from "gpt-tokenizer";
import { estimateAll, formatUsd, PRICING_SOURCE_NOTE } from "@/lib/token-cost";

// PHASE-7 — AI-credit / token cost calculator. 100% client-side: text is
// tokenized in the browser, files are read locally via FileReader and never
// uploaded. No network, no LLM (SCOPE-006).
export default function TokenCalculator() {
  const [text, setText] = useState("");
  const [outputTokens, setOutputTokens] = useState(500);

  const inputTokens = useMemo(() => {
    if (!text) return 0;
    try {
      return encode(text).length;
    } catch {
      return 0;
    }
  }, [text]);

  const estimates = useMemo(() => estimateAll(inputTokens, outputTokens), [inputTokens, outputTokens]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(typeof reader.result === "string" ? reader.result : "");
    reader.readAsText(file); // local only — never uploaded
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text oder Prompt hier einfügen …"
        rows={8}
        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
      />

      <div className="flex flex-wrap items-center gap-4 mt-3">
        <label className="text-xs text-slate-400">
          Datei (lokal, kein Upload):{" "}
          <input type="file" accept=".txt,.md,.json,.ts,.js,.py,text/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-xs text-slate-500" />
        </label>
        <label className="text-xs text-slate-400 flex items-center gap-2">
          Erwartete Antwort-Tokens:
          <input
            type="number"
            min={0}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value) || 0))}
            className="w-24 bg-slate-900 border border-slate-700/60 rounded-md px-2 py-1 text-slate-200"
          />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-900/50 p-5">
        <div className="text-sm text-slate-300 mb-4">
          Eingabe: <span className="font-semibold text-slate-100">{inputTokens.toLocaleString("de-DE")}</span> Tokens
          {" · "}Antwort (geschätzt): <span className="font-semibold text-slate-100">{outputTokens.toLocaleString("de-DE")}</span> Tokens
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800/60">
                <th className="py-2 pr-4">Modell</th>
                <th className="py-2 pr-4">Eingabe</th>
                <th className="py-2 pr-4">Antwort</th>
                <th className="py-2">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e) => (
                <tr key={e.model.id} className="border-b border-slate-800/40">
                  <td className="py-2 pr-4 text-slate-200">{e.model.label}</td>
                  <td className="py-2 pr-4 text-slate-400">{formatUsd(e.inputCost)}</td>
                  <td className="py-2 pr-4 text-slate-400">{formatUsd(e.outputCost)}</td>
                  <td className="py-2 text-slate-100 font-medium">{formatUsd(e.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90">
        <strong>Hinweis:</strong> Die Token-Zählung nutzt einen OpenAI-kompatiblen Tokenizer; andere
        Modelle (z. B. Gemini) können leicht abweichen. {PRICING_SOURCE_NOTE} Alle Berechnungen
        laufen lokal in deinem Browser — es wird nichts hochgeladen.
      </div>
    </div>
  );
}
