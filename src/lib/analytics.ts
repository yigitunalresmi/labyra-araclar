// GA4 olay yardımcısı. gtag yalnız çerez onayı verildiyse yüklenir (Analytics.tsx);
// onay yoksa gtag tanımsız → track() sessizce no-op olur.
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
  };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params ?? {});
  }
}
