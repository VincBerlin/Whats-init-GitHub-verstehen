import type { Metadata } from "next";
import { WHAT_IS_GITHUB_PAGE } from "@/data/authority";
import AuthorityArticle from "@/components/AuthorityArticle";

export const metadata: Metadata = {
  title: WHAT_IS_GITHUB_PAGE.title,
  description: WHAT_IS_GITHUB_PAGE.description,
};

export default function Page() {
  return <AuthorityArticle page={WHAT_IS_GITHUB_PAGE} />;
}
