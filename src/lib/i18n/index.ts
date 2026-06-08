// PHASE-6 (Vision) — i18n architecture (DE primary, EN prepared). Per OPEN-001
// MVP: cookie-based locale + dictionary for chrome/hero; full /de//en content
// routing is a later sprint. No broken canonical routes.
export type Locale = "de" | "en";
export const LOCALES: Locale[] = ["de", "en"];
export const DEFAULT_LOCALE: Locale = "de";
export const LOCALE_COOKIE = "wii_lang";

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "de" || v === "en";
}

export interface Dictionary {
  nav: { git: string; shortcuts: string; discover: string; about: string };
  hero: { badge: string; title: string; accent: string; subtitle: string };
  search: { placeholder: string; button: string };
  langName: string;
}

const de: Dictionary = {
  nav: { git: "Git & GitHub", shortcuts: "Shortcuts", discover: "Discover", about: "Über uns" },
  hero: {
    badge: "KI-gestützte Repository-Analyse",
    title: "Verstehe GitHub-Repositories",
    accent: "schneller",
    subtitle:
      "Was es ist, wofür du es brauchst und wie du es einsetzt — in Sekunden. Erkenne Risiken früh und nutze Open-Source-Projekte sicherer.",
  },
  search: { placeholder: "Repository (owner/repo) oder Begriff (z. B. git push)", button: "Los →" },
  langName: "DE",
};

const en: Dictionary = {
  nav: { git: "Git & GitHub", shortcuts: "Shortcuts", discover: "Discover", about: "About" },
  hero: {
    badge: "AI-powered repository analysis",
    title: "Understand GitHub repositories",
    accent: "faster",
    subtitle:
      "What it is, what you need it for and how to use it — in seconds. Spot risks early and use open-source projects more safely.",
  },
  search: { placeholder: "Repository (owner/repo) or term (e.g. git push)", button: "Go →" },
  langName: "EN",
};

const DICTS: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? de;
}
