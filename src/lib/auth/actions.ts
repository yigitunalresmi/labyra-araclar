"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/welcome";
import { addToMarketingAudience } from "@/lib/email/audience";
import { MARKETING_CONSENT_VERSION } from "@/lib/legal/marketingConsent";
import { safeNext } from "@/lib/auth/safeNext";

export type AuthState = { error?: string; message?: string };

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const returnTo = safeNext(String(formData.get("returnTo") || ""));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "invalidCredentials" };
  redirect(returnTo);
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  // Tanıtım e-postası onayı (işaretliyse checkbox "on" gönderir) — isteğe bağlı
  const marketingOptIn = formData.get("marketing_opt_in") === "on";
  const returnTo = safeNext(String(formData.get("returnTo") || ""));

  if (password.length < 6) {
    return { error: "weakPassword" };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Onay ispatı (tarih + metin sürümü) auth metadata'da saklanır → İYS dışa aktarımı için
      data: {
        full_name: fullName,
        marketing_opt_in: marketingOptIn,
        marketing_consent_at: marketingOptIn ? new Date().toISOString() : null,
        marketing_consent_version: marketingOptIn
          ? MARKETING_CONSENT_VERSION
          : null,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (data.session) {
    // profiles.marketing_opt_in'i de güncelle (sorgulanabilir liste için)
    if (marketingOptIn && data.user) {
      await supabase
        .from("profiles")
        .update({ marketing_opt_in: true })
        .eq("id", data.user.id);
    }
    // Yanıttan sonra çalışır, kaydı bloklamaz (env yoksa no-op):
    after(() => {
      sendWelcomeEmail(email, fullName);
      if (marketingOptIn) addToMarketingAudience(email, fullName);
    });
    redirect(returnTo);
  }
  return { message: "confirmEmail" };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/giris");
}
