"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchTerms, type SearchTerm } from "@/lib/search-terms";

export default function HeaderSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTerms(value), [value]);

  const onValueChange = (nextValue: string) => {
    setValue(nextValue);
    setActiveIdx(0);
  };

  const go = (term: SearchTerm) => {
    router.push(term.url);
    setValue("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const showDropdown = open && value.trim().length > 0;

  return (
    <div ref={wrapperRef} className="hidden md:block relative flex-1 max-w-sm mx-6">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        type="text"
        placeholder="Academy & Lexikon durchsuchen…"
        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-slate-700/60 bg-slate-900 shadow-xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((term, i) => (
                <li key={term.url}>
                  <button
                    onClick={() => go(term)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`w-full text-left px-3 py-2.5 border-b border-slate-800/60 last:border-0 transition-colors ${
                      i === activeIdx ? "bg-slate-800/80" : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        term.category === "Lexikon"
                          ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      }`}>
                        {term.category}
                      </span>
                      <span className="text-sm font-medium text-slate-100">{term.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 pl-0.5">{term.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-4 text-sm text-slate-500 text-center">
              Kein Treffer für &ldquo;{value}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
