"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = localStorage.getItem("theme");
  return stored === "light" || stored === "dark" ? stored : "dark";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
    >
      {theme === "dark" ? (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5L5 11M11 5l1.5-1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.5 1C4.46 1 2 3.46 2 6.5S4.46 12 7.5 12a5.5 5.5 0 0 0 5.24-3.76.5.5 0 0 0-.67-.63A4.5 4.5 0 0 1 6.39 1.93a.5.5 0 0 0-.63-.67C5.27 1.09 4.78 1 7.5 1Z" />
        </svg>
      )}
    </button>
  );
}
