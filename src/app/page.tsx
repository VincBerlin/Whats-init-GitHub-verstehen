import { redirect } from "next/navigation";

async function handleSubmit(formData: FormData) {
  "use server";
  const url = formData.get("url") as string;
  const match = url?.match(/github\.com\/([^/]+)\/([^/?\s#]+)/);
  if (match) redirect(`/analyse/${match[1]}/${match[2]}`);
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
          placeholder="https://github.com/owner/repo"
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

      {/* Feature pills */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {[
          { icon: "⚡", title: "Sofort-Analyse", desc: "Kategorie, Nutzen und Risiken auf einen Blick." },
          { icon: "🤖", title: "KI-Befehle", desc: "Fertige Prompts für Claude & Cursor zur Integration." },
          { icon: "📚", title: "Git & GitHub", desc: "Befehle, Workflows und Shortcuts zum Kopieren." },
        ].map((f) => (
          <div key={f.title} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/60 transition-colors">
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="font-semibold text-slate-200 text-sm mb-1">{f.title}</div>
            <div className="text-slate-500 text-xs leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
