"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/auth/actions";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T } from "@/lib/i18n/translations";

export function TopBar({ userEmail }: { userEmail: string | null }) {
  const { t } = useLanguage();
  const [acik, setAcik] = useState(false);

  // Hem masaüstü satır-içi hem mobil açılır menüde aynı linkler.
  const links = userEmail ? (
    <>
      <Link href="/panel">
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          {t(T.common.dashboard)}
        </Button>
      </Link>
      <Link href="/hesap">
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          {t(T.common.account)}
        </Button>
      </Link>
      <form action={signOutAction} className="w-full sm:w-auto">
        <Button variant="ghost" size="sm" type="submit" className="w-full sm:w-auto">
          {t(T.common.signOut)}
        </Button>
      </form>
    </>
  ) : (
    <>
      <Link href="/giris">
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          {t(T.common.signIn)}
        </Button>
      </Link>
      <Link href="/kayit">
        <Button size="sm" className="w-full sm:w-auto">
          {t(T.common.signUp)}
        </Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <LangToggle />
          <ThemeToggle />

          {/* Masaüstü: satır içi linkler */}
          <nav className="hidden items-center gap-1 sm:flex">{links}</nav>

          {/* Mobil: açılır menü */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setAcik((v) => !v)}
              aria-label={acik ? t(T.a11y.closeMenu) : t(T.a11y.openMenu)}
              aria-expanded={acik}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                {acik ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>

            {acik && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setAcik(false)}
                  aria-hidden
                />
                <div
                  className="absolute right-0 top-full z-20 mt-2 flex w-44 flex-col gap-1 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-lg"
                  onClick={() => setAcik(false)}
                >
                  {links}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
