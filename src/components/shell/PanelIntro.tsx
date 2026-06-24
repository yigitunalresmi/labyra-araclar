"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

// Panel başlığı (server sayfada i18n yapılamadığı için küçük client bileşeni).
export function PanelIntro() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="text-2xl font-medium text-[var(--color-text)]">
        {t(T.panel.title)}
      </h1>
      <p className="mt-1 text-[var(--color-muted)]">{t(T.panel.subtitle)}</p>
    </>
  );
}
