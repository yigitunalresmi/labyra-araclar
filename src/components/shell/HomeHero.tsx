"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

// Ana sayfa hero (server sayfada i18n yapılamadığı için client bileşeni).
export function HomeHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useLanguage();
  return (
    <section className="text-center">
      <h1 className="text-3xl font-medium tracking-tight text-[var(--color-text)] sm:text-4xl">
        {t(T.home.heroTitle)}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
        {t(T.home.heroSubtitle)}
      </p>
      {!isLoggedIn && (
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/kayit">
            <Button size="lg">{t(T.home.ctaStart)}</Button>
          </Link>
          <Link href="/giris">
            <Button variant="secondary" size="lg">
              {t(T.common.signIn)}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
