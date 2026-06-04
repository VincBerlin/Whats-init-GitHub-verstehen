import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      // PHASE-1 (FR-011/FR-012): old hardcoded academy/wiki routes are
      // permanently redirected to the new /github knowledge hub.
      { source: "/lernen", destination: "/github", permanent: true },
      { source: "/wiki", destination: "/github", permanent: true },
      { source: "/wiki/:slug*", destination: "/github", permanent: true },
    ];
  },
};

export default nextConfig;
