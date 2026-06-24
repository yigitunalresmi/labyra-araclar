import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Her istekte Supabase oturumunu yeniler ve korumalı yolları korur.
 * Next.js 16'da `middleware` -> `proxy` olarak yeniden adlandırıldı; bu yardımcı
 * src/proxy.ts tarafından çağrılır.
 *
 * Soft-gate: araç sayfaları (landing) herkese açıktır (SEO). Yalnızca kişisel
 * alanlar (/panel, /hesap) giriş ister. Araçların KULLANIMI (hesapla/üret) ise
 * ilgili server action içinde ayrıca doğrulanır.
 */

// Giriş gerektiren yol önekleri (araç landing'leri DEĞİL).
const PROTECTED_PREFIXES = ["/panel", "/hesap"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ÖNEMLİ: createServerClient ile getUser arasına kod koymayın (oturum yenileme bozulur).
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    // Supabase erişilemiyorsa (ör. env henüz yokken) site ayakta kalsın; guard atlanır.
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("return", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
