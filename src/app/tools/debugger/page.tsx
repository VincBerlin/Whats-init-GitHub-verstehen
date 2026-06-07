import type { Metadata } from "next";
import Link from "next/link";
import DebuggerTool from "@/components/DebuggerTool";

export const metadata: Metadata = {
  title: "Git & GitHub Actions Debugger — Fehler einfügen, Lösung erhalten",
  description:
    "Füge eine Git- oder GitHub-Actions-Fehlermeldung ein und erhalte sofort die wahrscheinliche Ursache und konkrete Lösungsschritte. Läuft lokal im Browser, ohne KI.",
};

export default function DebuggerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/tools" className="hover:text-slate-300">Tools</Link> <span className="mx-1">/</span> Debugger
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">Git &amp; Actions Debugger</h1>
      <p className="text-slate-400 mb-8 leading-relaxed">
        Füge eine Fehlermeldung aus Git oder einem GitHub-Actions-Lauf ein. Der Debugger erkennt
        bekannte Muster und zeigt dir Ursache und Lösungsschritte — komplett lokal, ohne Upload und ohne KI.
      </p>
      <DebuggerTool />
    </div>
  );
}
