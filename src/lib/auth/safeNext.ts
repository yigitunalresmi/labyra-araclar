// Giriş/kayıt sonrası dönüş yolunu güvenli kılar (açık yönlendirme koruması).
// Yalnız site-içi mutlak yol kabul edilir; tam URL ("https://…") veya
// protokol-bağımsız ("//host") değerler reddedilip panele düşülür.
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return "/panel";
  const v = raw.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return "/panel";
}
