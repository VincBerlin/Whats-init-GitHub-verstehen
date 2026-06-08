import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_ARTICLES, BLOG_CATEGORY_LABELS, type BlogCategory } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — Git & GitHub Tutorials und Troubleshooting",
  description:
    "Tiefe, verständliche Artikel zu Git und GitHub: Merge-Konflikte lösen, SSH-Fehler beheben, Änderungen rückgängig machen, Projekte veröffentlichen und GitHub Actions.",
};

export default function BlogHub() {
  const categories = Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[];
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Blog</h1>
      <p className="text-lg text-slate-400 mb-12 max-w-2xl leading-relaxed">
        Tiefe, deutschsprachige Tutorials und Troubleshooting rund um Git und GitHub —
        praxisnah, akkurat und mit Befehlen zum Kopieren.
      </p>

      <div className="space-y-10">
        {categories.map((cat) => {
          const items = BLOG_ARTICLES.filter((a) => a.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">{BLOG_CATEGORY_LABELS[cat]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="block rounded-xl border border-slate-800/60 bg-slate-900/60 p-5 hover:border-slate-700/60 transition-colors">
                    <div className="font-semibold text-slate-100 mb-2">{a.title}</div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-2">{a.description}</p>
                    <span className="text-xs text-slate-600">{a.readingMinutes} Min. Lesezeit</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
