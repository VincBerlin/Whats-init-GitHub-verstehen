import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import HeaderSearch from "@/components/HeaderSearch";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
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
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-100 hover:text-white transition-colors shrink-0">
              <span className="text-blue-400 text-lg">⬡</span>
              <span>What&apos;s in it?</span>
            </Link>
            <HeaderSearch />
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/lernen" className="hidden sm:inline hover:text-slate-200 transition-colors">Academy</Link>
              <Link href="/wiki/mcp" className="hidden sm:inline hover:text-slate-200 transition-colors">Lexikon</Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-slate-800/60 mt-24 py-8 text-center text-slate-600 text-sm">
          <p>What&apos;s in it? — GitHub verstehen, schneller als je zuvor.</p>
        </footer>
      </body>
    </html>
  );
}
