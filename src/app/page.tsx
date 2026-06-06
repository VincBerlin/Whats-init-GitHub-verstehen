import { redirect } from "next/navigation";
import DailyTopRepos from "@/components/DailyTopRepos";
import WeeklyTopRepos from "@/components/WeeklyTopRepos";
import NicheFinds from "@/components/NicheFinds";
import { parseRepoInput } from "@/lib/repo-normalize";

// ISR: revalidate hourly so the Weekly Top 10 reflects DB updates without a
// live GitHub fetch or LLM call on each view (NFR-001).
export const revalidate = 3600;

// FR-001/FR-002: a GitHub URL or owner/repo → analysis; anything else → knowledge search.
async function handleSubmit(formData: FormData) {
  "use server";
  const raw = ((formData.get("url") as string) ?? "").trim();
  if (!raw) return; // empty: input is `required`, browser blocks submit
  const parsed = parseRepoInput(raw);
  if (parsed.ok) redirect(`/analyse/${parsed.value.owner}/${parsed.value.repo}`);
  redirect(`/github/search?q=${encodeURIComponent(raw)}`);
}

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      {/* Hero */}
      <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        KI-gestützte Repository-Analyse
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-5 tracking-tight">
        Verstehe GitHub-Repositories{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
          schneller
        </span>
      </h1>

      <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
        Was es ist, wofür du es brauchst und wie du es einsetzt — in Sekunden.
        Erkenne Risiken früh und nutze Open-Source-Projekte sicherer.
      </p>

      {/* Search form */}
      <form action={handleSubmit} className="flex gap-3 max-w-xl mx-auto mb-6">
        <input
          name="url"
          type="text"
          placeholder="Repository (owner/repo) oder Begriff (z. B. git push)"
          className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all"
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          Analysieren →
        </button>
      </form>

      <p className="text-xs text-slate-600">
        Beispiele:{" "}
        {["vercel/next.js", "shadcn-ui/ui", "badlogic/pi-mono"].map((r) => (
          <a key={r} href={`/analyse/${r}`} className="text-slate-500 hover:text-blue-400 transition-colors mx-1.5 underline underline-offset-2">
            {r}
          </a>
        ))}
      </p>

      {/* Discovery (Daily → Weekly → Niche) — stored data, no live GitHub / no LLM */}
      <div className="mt-20 space-y-16">
        <DailyTopRepos />
        <WeeklyTopRepos />
        <NicheFinds />
      </div>
    </div>
  );
}
