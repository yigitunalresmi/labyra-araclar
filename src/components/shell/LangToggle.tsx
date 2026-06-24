"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

export function LangToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      aria-label={t(T.a11y.changeLang)}
      className="flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
    >
      {lang === "tr" ? "EN" : "TR"}
    </button>
  );
}
