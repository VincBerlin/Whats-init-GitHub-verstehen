import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools — kostenlose Git/GitHub-Helfer (lokal, ohne KI)",
  description:
    "Praktische, kostenlose Werkzeuge rund um Git und GitHub: ein Fehler-Debugger und ein AI-Credit/Token-Rechner. Alles läuft lokal im Browser, ohne Upload und ohne KI-Kosten.",
};

const TOOLS = [
  { href: "/tools/debugger", title: "Git & Actions Debugger", desc: "Fehlermeldung einfügen, Ursache und Lösungsschritte erhalten. Lokal, ohne KI." },
  { href: "/tools/ai-credit-calculator", title: "AI-Credit / Token-Rechner", desc: "Token-Anzahl und ungefähre Kosten für KI-Eingaben schätzen — lokal, ohne Upload." },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Tools</h1>
      <p className="text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed">
        Kostenlose Helfer rund um Git und GitHub. Alle Tools laufen vollständig in deinem Browser —
        nichts wird hochgeladen, es entstehen keine KI-Kosten.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 hover:border-slate-700/60 transition-colors">
            <div className="font-semibold text-slate-100 mb-2">{t.title}</div>
            <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
