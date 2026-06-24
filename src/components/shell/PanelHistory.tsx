"use client";

import Link from "next/link";
import type { MenuData } from "@/lib/tools/menu";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T, type Translation } from "@/lib/i18n/translations";

export type UsageRow = {
  tool_key: string;
  count: number;
  last_used_at: string | null;
};
export type MenuRow = { slug: string; data: MenuData } | null;

// Kota tüketen araçların kullanıcı-dostu etiketleri (hesaplayıcılar kota tüketmez → burada yok)
const QUOTA_TOOLS: Record<
  string,
  { name: Translation; limit: number; href: string }
> = {
  qr_menu: {
    name: { tr: "QR Menü", en: "QR Menu" },
    limit: 1,
    href: "/araclar/qr-menu",
  },
  label_csv: {
    name: { tr: "Etiket PDF", en: "Label PDF" },
    limit: 1,
    href: "/araclar/etiket-pdf",
  },
};

export function PanelHistory({
  menu,
  usage,
}: {
  menu: MenuRow;
  usage: UsageRow[];
}) {
  const { t } = useLanguage();
  const tracked = usage.filter((u) => QUOTA_TOOLS[u.tool_key] && u.count > 0);
  if (!menu && tracked.length === 0) return null;

  const businessName = menu?.data?.business?.name?.trim() || "Menüm";

  return (
    <section className="mb-12 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {t(T.panel.produced)}
      </h2>

      {menu && (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-medium text-[var(--color-gold-dark)]">
                {t(QUOTA_TOOLS.qr_menu.name)}
              </span>
              <h3 className="mt-1 truncate font-medium text-[var(--color-text)]">
                {businessName}
              </h3>
              <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">
                /m/{menu.slug}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/m/${menu.slug}`}
                target="_blank"
                rel="noopener"
                className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]"
              >
                {t(T.panel.viewMenu)}
              </Link>
              <Link
                href="/araclar/qr-menu"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-gold-dark)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                {t(T.panel.edit)}
              </Link>
            </div>
          </div>
        </div>
      )}

      {tracked.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tracked.map((u) => {
            const meta = QUOTA_TOOLS[u.tool_key];
            return (
              <Link
                key={u.tool_key}
                href={meta.href}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)]"
              >
                {t(meta.name)}:{" "}
                <span className="font-medium text-[var(--color-text)]">
                  {Math.min(u.count, meta.limit)}/{meta.limit}
                </span>{" "}
                {t(T.panel.used)}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
