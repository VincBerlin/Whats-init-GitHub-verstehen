import type { Metadata } from "next";
import Link from "next/link";
import TokenCalculator from "@/components/TokenCalculator";

export const metadata: Metadata = {
  title: "AI-Credit / Token-Rechner — Kosten lokal schätzen",
  description:
    "Schätze Token-Anzahl und ungefähre Kosten für KI-Eingaben (Gemini, GPT, Claude). Läuft komplett lokal im Browser, ohne Upload und ohne KI-Aufruf.",
};

export default function CalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/tools" className="hover:text-slate-300">Tools</Link> <span className="mx-1">/</span> AI-Credit-Rechner
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">AI-Credit / Token-Rechner</h1>
      <p className="text-slate-400 mb-8 leading-relaxed">
        Füge Text ein oder lade lokal eine Datei, um die Token-Anzahl und die ungefähren Kosten
        verschiedener KI-Modelle zu schätzen. Nichts wird hochgeladen, es entsteht kein KI-Aufruf.
      </p>
      <TokenCalculator />
    </div>
  );
}
