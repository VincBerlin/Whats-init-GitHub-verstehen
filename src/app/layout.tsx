import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import HeaderSearch from "@/components/HeaderSearch";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  // PHASE-9: absolute base so canonical/OG/sitemap URLs resolve correctly.
  // Full /de//en routes + hreflang are deferred until localized content exists (RISK-009);
  // the cookie-based language toggle does NOT create duplicate indexable URLs.
  metadataBase: new URL(siteUrl()),
  title: { default: "What's in it? — GitHub Repositories verstehen", template: "%s | What's in it?" },
  description: "Verstehe GitHub-Repositories schneller: Was es ist, wofür du es brauchst und wie du es einsetzt.",
  keywords: ["github", "repository", "analyse", "open source", "developer tools"],
  openGraph: {
    title: "What's in it? — GitHub Repositories verstehen",
    description: "Verstehe GitHub-Repositories schnell, erkenne Risiken früh und nutze Projekte sicherer.",
    type: "website",
  },
};

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(t);
    document.documentElement.classList.remove(t === 'dark' ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script>
      </head>
      <body className="min-h-screen antialiased">
        <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-100 hover:text-white transition-colors">
              <span className="text-blue-400 text-lg">⬡</span>
              <span>What&apos;s in it?</span>
            </Link>
            <HeaderSearch />
            <div className="flex items-center gap-3 sm:gap-6 text-sm text-slate-400">
              <Link href="/lernen" className="inline-flex hover:text-slate-200 transition-colors">Academy</Link>
              <div className="relative group">
                <Link href="/wiki/mcp" className="inline-flex hover:text-slate-200 transition-colors">
                  Lexikon
                </Link>
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-slate-700/60 bg-slate-900 shadow-xl p-2 hidden group-hover:block">
                  <p className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500">Wiki</p>
                  <Link href="/wiki/mcp" className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-slate-800">MCP</Link>
                  <Link href="/wiki/claude-desktop" className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-slate-800">Claude Desktop</Link>
                  <Link href="/wiki/npm" className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-slate-800">npm</Link>
                  <Link href="/wiki/agent" className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-slate-800">Autonomer Agent</Link>
                </div>
              </div>
              {/* Phase-5 (FR-012/AC-009): discovery hub reachable from the header. */}
              <Link href="/repositories" className="inline-flex hover:text-slate-200 transition-colors">Repositories</Link>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-slate-800/60 mt-24 py-8 text-center text-slate-600 text-sm">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4 text-slate-500">
            <Link href="/github" className="hover:text-slate-300 transition-colors">Git &amp; GitHub</Link>
            <Link href="/repositories" className="hover:text-slate-300 transition-colors">Repositories</Link>
            <Link href="/tools/ai-credit-calculator" className="hover:text-slate-300 transition-colors">Rechner</Link>
            <Link href="/tools/debugger" className="hover:text-slate-300 transition-colors">Debugger</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">Über uns</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Kontakt</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Datenschutz</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Nutzungsbedingungen</Link>
            <Link href="/impressum" className="hover:text-slate-300 transition-colors">Impressum</Link>
          </nav>
          <p>What&apos;s in it? — GitHub verstehen, schneller als je zuvor.</p>
        </footer>
      </body>
    </html>
  );
}
