import type { Metadata } from "next";
import Link from "next/link";
import WeeklyTopRepos from "@/components/WeeklyTopRepos";

export const metadata: Metadata = {
  title: "Weekly Top 10 — GitHub Repositories der Woche",
  description:
    "Die 10 GitHub-Repositories mit dem stärksten Wachstum dieser Woche — bewertet nach Momentum (Stars/Forks), ganz ohne KI. Direkt analysieren.",
};

export const runtime = "nodejs";
export const revalidate = 3600;

export default function TrendingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/github" className="hover:text-slate-300">Git &amp; GitHub</Link> <span className="mx-1">/</span> Weekly Top 10
      </nav>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">Weekly Top 10</h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        Repositories mit dem stärksten Wachstum dieser Woche, bewertet nach einem
        Momentum-Score aus Stars- und Forks-Zuwachs. Keine KI, keine Live-Abfragen beim Seitenaufruf.
      </p>
      <WeeklyTopRepos heading={false} />
    </div>
  );
}
