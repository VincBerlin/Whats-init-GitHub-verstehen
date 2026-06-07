import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_ARTICLES, BLOG_CATEGORY_LABELS, getBlogArticle } from "@/data/blog";
import AuthorityArticle from "@/components/AuthorityArticle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = getBlogArticle(slug);
  if (!a) return { title: "Nicht gefunden" };
  return { title: a.title, description: a.description };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-10 text-xs text-slate-500">
        {BLOG_CATEGORY_LABELS[article.category]} · {article.readingMinutes} Min. Lesezeit
      </div>
      <AuthorityArticle page={article} />
    </div>
  );
}
