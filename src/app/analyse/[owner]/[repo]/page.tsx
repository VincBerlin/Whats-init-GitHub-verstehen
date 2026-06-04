import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { geminiAnalyzer } from "@/lib/analyze";
import { runAnalysis } from "@/lib/analysis-service";
import { extractClientContext } from "@/lib/request-context";
import { getStores } from "@/lib/stores";
import type { AnalysisResult, GitHubRepo } from "@/types/analysis";
import AnalysisCard from "@/components/AnalysisCard";
import Sidebar from "@/components/Sidebar";

export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} — Analyse`,
    description: `Was macht ${owner}/${repo}? Kategorisierung, Installation und KI-Befehle auf einen Blick.`,
    openGraph: {
      title: `${owner}/${repo} | What's in it?`,
      description: `Verstehe ${repo} in 30 Sekunden: Kategorie, Kern-Nutzen und fertige KI-Prompts.`,
    },
  };
}

export default async function AnalysePage({ params }: PageProps) {
  const { owner, repo } = await params;

  // Cache-first + guarded analysis (PHASE-2): a crawler/bot GET cannot trigger a
  // new (cost-incurring) analysis, but cached pages render for everyone (SEO).
  const client = extractClientContext(await headers());
  const result = await runAnalysis(
    { input: `${owner}/${repo}`, client },
    { stores: getStores(), analyzer: geminiAnalyzer },
  );

  if (result.status === "analysis_in_progress") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-100 mb-3">Analyse läuft …</h1>
        <p className="text-slate-400 mb-6">
          {owner}/{repo} wird gerade analysiert. Bitte lade die Seite in wenigen Sekunden neu.
        </p>
        <Link href={`/analyse/${owner}/${repo}`} className="text-blue-400 hover:text-blue-300 underline">
          Erneut laden
        </Link>
      </div>
    );
  }

  if (result.status === "error") {
    if (result.code === "github_not_found") notFound();
    throw new Error(result.message);
  }

  const analysis = result.analysis as AnalysisResult;
  const ghData = result.repoMetadata as GitHubRepo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
        <Link href="/" className="hover:text-slate-400 transition-colors">What&apos;s in it?</Link>
        <span>/</span>
        <a
          href={`https://github.com/${owner}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-400 transition-colors"
        >
          {owner}
        </a>
        <span>/</span>
        <span className="text-slate-400">{repo}</span>
      </nav>

      {/* 70/30 Grid */}
      <div className="flex gap-8 items-start">
        {/* Main content — 70% */}
        <div className="flex-1 min-w-0">
          <AnalysisCard
            data={analysis}
            owner={owner}
            repo={repo}
            stars={ghData.stargazers_count}
            avatarUrl={ghData.owner.avatar_url}
          />
        </div>

        {/* Sidebar — 30%, sticky */}
        <div className="hidden lg:block shrink-0 w-[300px] sticky top-20">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
