// Kanonik site URL'i çözer — SEO/OG mutlak URL ister. Yalnız sunucu tarafında kullan
// (VERCEL_PROJECT_PRODUCTION_URL client'a açılmaz). İstemci için window.location.origin kullan.
// Öncelik: açık NEXT_PUBLIC_SITE_URL > Vercel prod domaini > localhost.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    explicit &&
    /^https?:\/\//.test(explicit) &&
    !explicit.includes("localhost")
  ) {
    return explicit.replace(/\/+$/, "");
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3010";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Labyra Araçlar";
export const SITE_DESC =
  "İşletmen için ücretsiz araçlar: barkodlu etiket PDF, brüt-net maaş ve KDV hesaplayıcı, deneme net & puan, QR menü. Ücretsiz hesap aç, hemen kullan.";
