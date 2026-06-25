import { permanentRedirect } from "next/navigation";

// QR Menü aracı labyra.co'da tam ücretsiz servise taşındı.
// Eski araç URL'i kalıcı olarak yeni adrese yönlendirilir (eski QR/linkler korunur).
export default function QrMenuMovedPage() {
  permanentRedirect("https://labyra.co/hizmetler/qr-menu");
}
