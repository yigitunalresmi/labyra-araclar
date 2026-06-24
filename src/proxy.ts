import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16: `middleware` yerine `proxy`. Yalnızca Node.js runtime (edge yok).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Şunlar dışındaki tüm yolları eşle:
     * - _next/static, _next/image (statik dosyalar)
     * - favicon.ico, sitemap.xml, robots.txt
     * - resim dosyaları (svg/png/jpg/jpeg/gif/webp/avif)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
