// 2025 LGS/YKS sınav yapıları ve puan katsayıları.
// Net hesabı KESİN ve resmîdir. Puan İSTATİSTİKSELDİR (her yıl ÖSYM/MEB standardizasyonu);
// burada geçmiş yıl türetilmiş katsayılarla "tahmini" hesaplanır. Yıl dönümünde güncellenir.
// Kaynaklar: ÖSYM 2025-YKS kılavuzu, MEB EBA LGS 2025; TYT katsayıları türetilmiş yaklaşık.

export const YKS_2025 = {
  lgs: {
    ad: "LGS",
    yanlisBolen: 3, // 3 yanlış 1 doğruyu götürür
    maxAgirlikliNet: 510, // (20+20+20)×4 + (10+10+10)×1
    dersler: [
      { key: "turkce", ad: "Türkçe", soru: 20, katsayi: 4 },
      { key: "matematik", ad: "Matematik", soru: 20, katsayi: 4 },
      { key: "fen", ad: "Fen Bilimleri", soru: 20, katsayi: 4 },
      { key: "inkilap", ad: "T.C. İnkılap Tarihi", soru: 10, katsayi: 1 },
      { key: "din", ad: "Din Kültürü", soru: 10, katsayi: 1 },
      { key: "ingilizce", ad: "Yabancı Dil", soru: 10, katsayi: 1 },
    ],
  },
  tyt: {
    ad: "TYT",
    yanlisBolen: 4,
    taban: 100,
    // Geçmiş yıl türetilmiş katsayılar (yaklaşık) — tahmini puan için
    dersler: [
      { key: "turkce", ad: "Türkçe", soru: 40, katsayi: 2.83 },
      { key: "sosyal", ad: "Sosyal Bilimler", soru: 20, katsayi: 2.99 },
      { key: "matematik", ad: "Temel Matematik", soru: 40, katsayi: 3.28 },
      { key: "fen", ad: "Fen Bilimleri", soru: 20, katsayi: 2.53 },
    ],
  },
  ayt: {
    ad: "AYT",
    yanlisBolen: 4,
    dersler: [
      { key: "matematik", ad: "Matematik", soru: 40 },
      { key: "fizik", ad: "Fizik", soru: 14 },
      { key: "kimya", ad: "Kimya", soru: 13 },
      { key: "biyoloji", ad: "Biyoloji", soru: 13 },
      { key: "edebiyat", ad: "Türk Dili ve Edebiyatı", soru: 24 },
      { key: "tarih1", ad: "Tarih-1", soru: 10 },
      { key: "cografya1", ad: "Coğrafya-1", soru: 6 },
      { key: "tarih2", ad: "Tarih-2", soru: 11 },
      { key: "cografya2", ad: "Coğrafya-2", soru: 11 },
      { key: "felsefe", ad: "Felsefe Grubu", soru: 12 },
      { key: "din", ad: "Din Kültürü", soru: 6 },
    ],
    // Puan türüne göre sayılan testler
    puanTuru: {
      say: ["matematik", "fizik", "kimya", "biyoloji"],
      ea: ["matematik", "edebiyat", "tarih1", "cografya1"],
      soz: ["edebiyat", "tarih1", "cografya1", "tarih2", "cografya2", "felsefe", "din"],
    } as Record<"say" | "ea" | "soz", string[]>,
  },
} as const;
