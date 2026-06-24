"use client";

import Link from "next/link";
import { TOOLS, type Tool } from "@/lib/tools";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

export function ToolsShowcase() {
  const { t } = useLanguage();

  function icerik(tool: Tool) {
    return (
      <>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-gold-dark)]">
            {tool.funnel}
          </span>
          {tool.status === "soon" ? (
            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
              {t(T.toolCard.soon)}
            </span>
          ) : (
            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs text-[var(--color-gold-dark)]">
              {t(T.toolCard.use)}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-medium text-[var(--color-text)]">
          {t(tool.name)}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{t(tool.desc)}</p>
      </>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) =>
        tool.status === "active" ? (
          <Link
            key={tool.key}
            href={`/araclar/${tool.slug}`}
            className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold)]"
          >
            {icerik(tool)}
          </Link>
        ) : (
          <div
            key={tool.key}
            className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 opacity-75"
          >
            {icerik(tool)}
          </div>
        ),
      )}
    </div>
  );
}
