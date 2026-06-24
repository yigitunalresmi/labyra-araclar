"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signInAction, signUpAction, type AuthState } from "@/lib/auth/actions";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { translations as T, type Translation } from "@/lib/i18n/translations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MarketingConsent } from "@/components/auth/MarketingConsent";

export function AuthForm({
  mode,
  returnTo = "/panel",
}: {
  mode: "signin" | "signup";
  returnTo?: string;
}) {
  const { t } = useLanguage();
  const action = mode === "signin" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  // Server action kod döndürür ("invalidCredentials" gibi); burada çevrilir.
  // Eşleşme yoksa (Supabase ham mesajı) olduğu gibi gösterilir.
  function authText(code: string): string {
    const errs = T.authErrors as Record<string, Translation>;
    const msgs = T.authMessages as Record<string, Translation>;
    if (errs[code]) return t(errs[code]);
    if (msgs[code]) return t(msgs[code]);
    return code;
  }

  async function handleGoogle() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Button variant="secondary" size="lg" onClick={handleGoogle} type="button">
        <GoogleIcon />
        {t(T.auth.googleContinue)}
      </Button>

      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        {t(T.auth.orEmail)}
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="returnTo" value={returnTo} />
        {mode === "signup" && (
          <Input
            id="fullName"
            name="fullName"
            label={t(T.common.fullName)}
            autoComplete="name"
            required
          />
        )}
        <Input
          id="email"
          name="email"
          type="email"
          label={t(T.common.email)}
          autoComplete="email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label={t(T.common.password)}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
        />

        {mode === "signup" && <MarketingConsent />}

        {state.error && (
          <p className="text-sm text-[var(--color-danger)]">
            {authText(state.error)}
          </p>
        )}
        {state.message && (
          <p className="text-sm text-[var(--color-success)]">
            {authText(state.message)}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          {pending
            ? t(T.common.loading)
            : mode === "signin"
              ? t(T.common.signIn)
              : t(T.common.signUp)}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        {mode === "signin" ? (
          <>
            {t(T.auth.noAccount)}{" "}
            <Link href="/kayit" className="text-[var(--color-gold-dark)] underline">
              {t(T.common.signUp)}
            </Link>
          </>
        ) : (
          <>
            {t(T.auth.haveAccount)}{" "}
            <Link href="/giris" className="text-[var(--color-gold-dark)] underline">
              {t(T.common.signIn)}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
