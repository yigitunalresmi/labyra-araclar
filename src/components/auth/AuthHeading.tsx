"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

export function AuthHeading({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useLanguage();
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-[var(--color-text)]">
        {mode === "signin" ? t(T.auth.signInTitle) : t(T.auth.signUpTitle)}
      </h1>
      {mode === "signup" && (
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {t(T.common.free)} · {t(T.common.requiresAccount)}
        </p>
      )}
    </div>
  );
}
