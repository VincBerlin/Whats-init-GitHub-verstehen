"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n";

const subscribe = () => () => {};

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const m = document.cookie.match(/(?:^|;\s*)wii_lang=([^;]+)/);
  return isLocale(m?.[1]) ? (m![1] as Locale) : DEFAULT_LOCALE;
}

// PHASE-6 — language toggle (DE/EN). Cookie-driven; refreshes so server chrome /
// homepage re-render in the chosen language. Mirrors ThemeToggle's hydration-safe
// pattern (no setState in effect).
export default function LanguageToggle() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [locale, setLocale] = useState<Locale>(readCookieLocale);

  if (!isHydrated) return <div className="w-8 h-7" aria-hidden />;

  const toggle = () => {
    const next: Locale = locale === "de" ? "en" : "de";
    setLocale(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      aria-label={locale === "de" ? "Switch to English" : "Zu Deutsch wechseln"}
      className="text-xs font-medium px-2 py-1 rounded-md border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
    >
      {locale === "de" ? "EN" : "DE"}
    </button>
  );
}
