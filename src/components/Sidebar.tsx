"use client";

import { useEffect, useState } from "react";
import AdSlot from "./AdSlot";

const TOC_ITEMS = [
  { id: "overview",     label: "Übersicht" },
  { id: "quality",      label: "Qualität" },
  { id: "usecases",     label: "Einsatz" },
  { id: "concerns",     label: "Hinweise" },
  { id: "installation", label: "Installation" },
  { id: "commands",     label: "Befehle" },
  { id: "ai-prompts",   label: "KI-Befehle" },
  { id: "faq",          label: "FAQ" },
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

      {/* Ad slot — sidebar zone, separated from copy/CTA buttons (FR-021) */}
      <AdSlot placement="sidebar" width={300} height={600} />
    </aside>
  );
}
