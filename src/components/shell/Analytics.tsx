"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const KEY = "labyra-analytics-consent";
type Consent = "granted" | "denied";

/**
 * GA4 + KVKK çerez onayı. gtag YALNIZ kullanıcı onay verdiyse yüklenir
 * (çerezsiz ziyaretçi izlenmez). NEXT_PUBLIC_GA_ID yoksa hiçbir şey render edilmez.
 */
export function Analytics() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem(KEY);
      if (v === "granted" || v === "denied") setConsent(v);
    } catch {
      /* yoksay */
    }
  }, []);

  function choose(v: Consent) {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* yoksay */
    }
    setConsent(v);
  }

  if (!GA_ID || !mounted) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              {t(T.cookie.message)}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {t(T.cookie.decline)}
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-lg bg-[var(--color-cta)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-cta-hover)]"
              >
                {t(T.cookie.accept)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
