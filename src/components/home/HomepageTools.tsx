import Link from "next/link";
import TokenCalculator from "@/components/TokenCalculator";
import DebuggerTool from "@/components/DebuggerTool";

// PHASE-1 (homepage-tools-discovery) — make the three free, local, zero-LLM tools
// prominent and USABLE on the homepage itself (FR-002, VCHK-001), not just linked.
// Analyze is the hero form above; Calculator + Debugger are embedded here.
const ENTRY = [
  { icon: "🔍", title: "Repository analysieren", desc: "GitHub-URL oben eingeben — Kategorie, Nutzen, Installation, Risiken.", href: "#analyze" },
  { icon: "🧮", title: "Token-/Kosten-Rechner", desc: "Tokens und ungefähre KI-Kosten lokal schätzen.", href: "#rechner" },
  { icon: "🛠️", title: "Git & Actions Debugger", desc: "Fehlermeldung einfügen, Ursache + Fix erhalten.", href: "#debugger" },
];

export default function HomepageTools() {
  return (
    <section className="mt-16 text-left">
      <h2 className="text-xl font-bold text-slate-100 text-center mb-2">Drei kostenlose Werkzeuge</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Lokal im Browser, ohne Konto, ohne Upload, ohne KI-Kosten.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {ENTRY.map((t) => (
          <a key={t.title} href={t.href} className="block rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 hover:border-slate-700/60 transition-colors">
            <div className="text-xl mb-2">{t.icon}</div>
            <div className="font-semibold text-slate-200 text-sm mb-1">{t.title}</div>
            <div className="text-slate-500 text-xs leading-relaxed">{t.desc}</div>
          </a>
        ))}
      </div>

      <div id="rechner" className="scroll-mt-20 mb-12">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-100">Token-/Kosten-Rechner</h3>
          <Link href="/tools/ai-credit-calculator" className="text-xs text-blue-400 hover:text-blue-300">Eigene Seite →</Link>
        </div>
        <TokenCalculator />
      </div>

      <div id="debugger" className="scroll-mt-20">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-100">Git &amp; Actions Debugger</h3>
          <Link href="/tools/debugger" className="text-xs text-blue-400 hover:text-blue-300">Eigene Seite →</Link>
        </div>
        <DebuggerTool />
      </div>
    </section>
  );
}
