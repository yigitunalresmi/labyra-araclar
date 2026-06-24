// Genel QR kod aracı — her tip için QR'a gömülecek ham metni üretir.
// QR çizimi tarayıcıda `qrcode` kütüphanesiyle yapılır (sunucu maliyeti yok).

export type QrType = "link" | "text" | "wifi" | "phone" | "email";

export type WifiEnc = "WPA" | "WEP" | "nopass";

// URL'de şema yoksa https:// varsayar (bare alan adı da çalışsın diye).
export function linkPayload(url: string): string {
  const u = url.trim();
  if (!u) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) ? u : `https://${u}`;
}

// WIFI: standardında ayraç olan karakterler ( \ ; , : " ) kaçışlanmalı.
function escapeWifi(s: string): string {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

export function wifiPayload(
  ssid: string,
  password: string,
  enc: WifiEnc,
): string {
  const s = escapeWifi(ssid.trim());
  if (!s) return "";
  if (enc === "nopass") return `WIFI:T:nopass;S:${s};;`;
  return `WIFI:T:${enc};S:${s};P:${escapeWifi(password)};;`;
}

export function phonePayload(phone: string): string {
  const p = phone.replace(/[^\d+]/g, "");
  return p ? `tel:${p}` : "";
}

export function emailPayload(email: string): string {
  const e = email.trim();
  return e ? `mailto:${e}` : "";
}
