"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TOC_ITEMS = [
  { id: "overview",       label: "Übersicht" },
  { id: "recommendation", label: "Empfehlung" },
  { id: "installation",   label: "Installation" },
  { id: "ai-prompts",     label: "KI-Befehle" },
  { id: "deep-dive",      label: "Deep Dive" },
  { id: "related-topics", label: "Verwandte Begriffe" },
];

export default function Sidebar() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ids = TOC_ITEMS.map((i) => i.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          setVisibleIds((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
            return next;
          });
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const active = TOC_ITEMS.find((item) => visibleIds.has(item.id))?.id ?? "overview";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="space-y-6">
      {/* TOC */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Inhalt
        </p>
        <nav className="space-y-1">
          {TOC_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-all ${
                active === item.id
                  ? "bg-blue-500/15 text-blue-400 font-medium"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Learn & Wiki shortcuts */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Mehr entdecken
        </p>
        <div className="space-y-2">
          <Link
            href="/wiki/mcp"
            className="block text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all"
          >
            Lexikon öffnen
          </Link>
          <Link
            href="/lernen"
            className="block text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-all"
          >
            Zur Academy
          </Link>
        </div>
      </div>

      {/* Ad Slot 300×600 */}
      <div
        className="rounded-xl border border-slate-700/40 bg-slate-800/20 overflow-hidden"
        style={{ width: "300px", height: "600px", maxWidth: "100%" }}
        aria-label="Werbeanzeige"
      >
        {/* Replace with real AdSense slot in production */}
        {/* <ins className="adsbygoogle" ... /> */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-700">
          <svg className="w-8 h-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="2" y="3" width="20" height="18" rx="2" strokeWidth="1.5" />
            <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.5" />
          </svg>
          <span className="text-xs opacity-40">Ad 300×600</span>
        </div>
      </div>
    </aside>
  );
}
