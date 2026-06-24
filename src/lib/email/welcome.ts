import { SITE_URL } from "@/lib/site";

const RESEND_API = "https://api.resend.com/emails";

/**
 * Kayıt sonrası hoş geldin e-postası (Resend).
 * RESEND_API_KEY veya RESEND_FROM yoksa sessizce no-op → yapılandırılana kadar
 * kayıt akışını etkilemez. Hata fırlatmaz (kaydı bloklamaz).
 */
export async function sendWelcomeEmail(to: string, name?: string | null) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM; // örn. "Labyra Araçlar <merhaba@labyra.co>"
  if (!key || !from || !to) return;

  const ad = (name ?? "").trim().split(/\s+/)[0] || "Merhaba";

  const html = `<!doctype html>
<html lang="tr"><body style="margin:0;background:#f5efe3;font-family:Helvetica,Arial,sans-serif;color:#1a1916">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="font-size:18px;font-weight:600">Labyra <span style="color:#8b7355">Araçlar</span></div>
    <div style="margin-top:24px;background:#fdfaf4;border:1px solid #e2d8c8;border-radius:16px;padding:28px">
      <h1 style="margin:0 0 8px;font-size:22px">Hoş geldin ${ad} 👋</h1>
      <p style="margin:0 0 16px;line-height:1.6;color:#5b554d">
        Labyra Araçlar hesabın hazır. İşletmen için ücretsiz araçların hepsi tek yerde:
      </p>
      <ul style="margin:0 0 20px;padding-left:18px;line-height:1.9;color:#1a1916">
        <li>Barkodlu etiket PDF</li>
        <li>Brüt-net maaş & KDV hesaplayıcı</li>
        <li>LGS/TYT/AYT deneme net & puan</li>
        <li>QR menü oluşturucu</li>
      </ul>
      <a href="${SITE_URL}/panel" style="display:inline-block;background:#1a1916;color:#f5efe3;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">
        Araçlara git →
      </a>
    </div>
    <p style="margin:20px 4px 0;font-size:12px;color:#9a958d">
      Bu e-postayı Labyra Araçlar'a kaydolduğun için aldın. — labyra.co
    </p>
  </div>
</body></html>`;

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Labyra Araçlar'a hoş geldin 👋",
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend hoş geldin başarısız:", res.status, await res.text());
    }
  } catch (e) {
    console.error("Resend hoş geldin hatası:", e);
  }
}
