/**
 * Onay veren kullanıcıyı Resend tanıtım listesine (Audience) ekler → Broadcast'lerle
 * toplu tanıtım buradan gider. RESEND_API_KEY/RESEND_AUDIENCE_ID yoksa sessiz no-op.
 * Resend Broadcast'leri otomatik 'abonelikten çık' bağlantısı ekler ve ret edeni
 * audience'ta unsubscribed işaretler → sonraki gönderimlere dahil olmaz.
 */
export async function addToMarketingAudience(
  email: string,
  firstName?: string | null,
) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId || !email) return;

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name: (firstName ?? "").trim() || undefined,
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      console.error(
        "Resend audience ekleme başarısız:",
        res.status,
        await res.text(),
      );
    }
  } catch (e) {
    console.error("Resend audience ekleme hatası:", e);
  }
}
