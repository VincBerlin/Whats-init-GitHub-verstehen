import type { Metadata } from "next";
import { WHATS_IN_IT_PAGE } from "@/data/authority";
import AuthorityArticle from "@/components/AuthorityArticle";

export const metadata: Metadata = {
  title: WHATS_IN_IT_PAGE.title,
  description: WHATS_IN_IT_PAGE.description,
};

export default function Page() {
  return <AuthorityArticle page={WHATS_IN_IT_PAGE} />;
}
