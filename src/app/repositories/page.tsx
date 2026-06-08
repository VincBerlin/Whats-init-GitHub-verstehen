import type { Metadata } from "next";
import Link from "next/link";
import DailyTopRepos from "@/components/DailyTopRepos";
import WeeklyTopRepos from "@/components/WeeklyTopRepos";
import NicheFinds from "@/components/NicheFinds";

// PHASE-5 (homepage-tools-discovery, FR-013/AC-007) — repository discovery hub.
// Thin reuse of the existing stored-ranking components (Daily 3 / Weekly 10 / Niche 5)
// plus a plain ranking explanation. DB read only — no live GitHub, no OpenRouter/LLM
// (NFR-001, NG-007). /github/trending permanently redirects here (OPEN-001, next.config).
export const metadata: Metadata = {
  title: "Repositories entdecken — Daily, Weekly & Niche | What's in it",
  description:
    "Repository-Entdeckung ohne KI-Kosten: Daily Top 3, Weekly Top 10 und Niche Finds (Top 5). Bewertet aus GitHub-Metadaten und einer deterministischen, transparenten Bewertung — kein KI-Modell, keine Live-Abfragen beim Seitenaufruf.",
};

export const runtime = "nodejs";
export const revalidate = 3600;

export default function RepositoriesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-300">Start</Link> <span className="mx-1">/</span> Repositories
      </nav>

      <h1 className="text-3xl font-bold text-slate-100 mb-3">Repositories entdecken</h1>
      <p className="text-slate-400 mb-12 leading-relaxed max-w-2xl">
        Drei ehrliche Sichten auf lohnende GitHub-Repositories — alle aus GitHub-Metadaten und
        einer deterministischen Bewertung. Kein KI-Modell, keine Live-Abfragen beim Seitenaufruf.
      </p>

      <div className="space-y-16">
        <DailyTopRepos />
        <WeeklyTopRepos showMoreLink={false} />
        <NicheFinds showMoreLink={false} />
      </div>

      {/* AC-007: a plain explanation of how each list is ranked. */}
      <section className="mt-16 rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 text-left">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Wie wird hier bewertet?</h2>
        <dl className="space-y-4 text-sm text-slate-400">
          <div>
            <dt className="font-semibold text-slate-200">Daily Top 3</dt>
            <dd>Beliebtheit + Engagement (Stars/Forks). Sobald ein 24‑Stunden‑Vergleich vorliegt, fließt die echte Tagesbewegung ein. Liegt noch keine Bewegung vor, ist die Liste klar als Beispiel-Auswahl markiert — nie erfundene „heutige Bewegung“.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Weekly Top 10</dt>
            <dd>Stärkstes Wachstum der Woche, gemessen als Momentum aus Stars- und Forks-Zuwachs gegenüber der Vorwoche.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Interesting Growth Repositories (Niche Finds, Top 5)</dt>
            <dd>Hochwertige, funktionale Projekte im Wachstumsbereich statt der größten Stern-Giganten. Sehr große Repositories (über 50.000 Sterne) werden bewusst ausgeschlossen, damit kleinere lohnende Projekte sichtbar werden.</dd>
          </div>
        </dl>
        <p className="text-xs text-slate-600 mt-5">
          Alle Listen entstehen ohne KI und ohne Live-API beim Seitenaufruf. Daten stammen aus
          gespeicherten GitHub-Schnappschüssen; fehlen echte Daten, zeigen wir das ehrlich an.
        </p>
      </section>
    </div>
  );
}
