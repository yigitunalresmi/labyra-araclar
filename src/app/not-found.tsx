"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-[var(--color-gold-dark)]">404</p>
      <h1 className="mt-2 text-2xl font-medium text-[var(--color-text)]">
        {t(T.notFound.title)}
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">{t(T.notFound.desc)}</p>
      <Link href="/" className="mt-6">
        <Button>{t(T.notFound.back)}</Button>
      </Link>
    </main>
  );
}
