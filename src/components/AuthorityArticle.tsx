import Link from "next/link";
import type { AuthorityPage } from "@/data/authority";
import { siteUrl } from "@/lib/site";

// PHASE-1 (Master Plan) — renders a structured authority article as static HTML
// with Article + FAQPage JSON-LD for SEO/GEO. All content is typed text (no raw
// HTML), so no XSS surface.
export default function AuthorityArticle({ page }: { page: AuthorityPage }) {
  const url = `${siteUrl()}/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.description,
        inLanguage: "de",
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "What's in it?" },
        publisher: { "@type": "Organization", name: "What's in it?" },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-5">{page.title}</h1>
      <p className="text-lg text-slate-300 leading-relaxed mb-10">{page.intro}</p>

      <div className="space-y-10">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold text-slate-100 mb-3">{s.heading}</h2>
            <div className="space-y-3">
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">{p}</p>
              ))}
            </div>
            {s.list && (
              <ul className="mt-3 space-y-2">
                {s.list.map((li, i) => (
                  <li key={i} className="flex gap-2 text-slate-300"><span className="text-blue-400">•</span>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Häufige Fragen</h2>
        <div className="space-y-3">
          {page.faq.map((f, i) => (
            <details key={i} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
              <summary className="text-sm font-medium text-slate-200 cursor-pointer">{f.question}</summary>
              <p className="text-sm text-slate-400 leading-relaxed mt-2">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {page.related.length > 0 && (
        <nav className="mt-12 pt-6 border-t border-slate-800/60">
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">Weiterlesen</p>
          <div className="flex flex-wrap gap-2">
            {page.related.map((r) => (
              <Link key={r.href} href={r.href} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700/60 hover:text-slate-100 transition-all">
                {r.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </article>
  );
}
