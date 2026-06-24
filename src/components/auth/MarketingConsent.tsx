"use client";

import { useEffect, useState } from "react";
import {
  MARKETING_CONSENT_LABEL,
  MARKETING_CONSENT_SECTIONS,
  MARKETING_CONSENT_VERSION,
} from "@/lib/legal/marketingConsent";

/**
 * Kayıt formunda ticari elektronik ileti (tanıtım e-postası) onayı.
 * Checkbox İŞARETSİZ + İSTEĞE BAĞLI (yasal: zorunlu olamaz). name="marketing_opt_in"
 * → FormData ile signUpAction'a gider. "İzin metnini oku" uzun metni modalda açar.
 */
export function MarketingConsent() {
  const [acik, setAcik] = useState(false);
  const [checked, setChecked] = useState(false);

  // Modal açıkken ESC ile kapanır.
  useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAcik(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [acik]);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          name="marketing_opt_in"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-gold)]"
        />
        <span className="text-sm leading-snug text-[var(--color-muted)]">
          {MARKETING_CONSENT_LABEL}{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setAcik(true);
            }}
            className="font-medium text-[var(--color-gold-dark)] underline"
          >
            İzin metnini oku
          </button>
        </span>
      </label>

      {acik && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAcik(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Ticari Elektronik İleti — Açık Rıza ve Aydınlatma Metni
              </h2>
              <button
                type="button"
                onClick={() => setAcik(false)}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 py-4">
              {MARKETING_CONSENT_SECTIONS.map((s, i) => (
                <div key={i}>
                  <h3 className="mb-1 text-sm font-medium text-[var(--color-text)]">
                    {i + 1}. {s.baslik}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {s.icerik}
                  </p>
                </div>
              ))}
              <p className="pt-1 text-xs text-[var(--color-muted)]">
                Metin sürümü: {MARKETING_CONSENT_VERSION}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--color-border)] px-5 py-3">
              <button
                type="button"
                onClick={() => setAcik(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  setChecked(true);
                  setAcik(false);
                }}
                className="rounded-lg bg-[var(--color-cta)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-cta-hover)]"
              >
                Okudum, onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
