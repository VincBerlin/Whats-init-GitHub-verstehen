import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// PHASE-6 / FR-020 — public content crawlable; API routes excluded from indexing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
