// 2026 yılı bordro ve finansal parametreleri.
// Yıl dönümünde yeni dosya (finans-2027.ts) eklenir; araç kodu değişmez.
// Kaynaklar: GVK Genel Tebliği No. 332 (RG 31.12.2025/33124), SGK Genelgesi 2026/2,
// 7566 sayılı Kanun (RG 19.12.2025), ÇSGB asgari ücret (25.12.2025).

export const FINANS_2026 = {
  yil: 2026,

  // Asgari ücret
  asgariBrut: 33030.0,
  asgariNet: 28075.5,
  asgariGvMatrah: 28075.5, // asgari ücretin gelir vergisi matrahı (SGK düşülmüş)

  // İşçi kesinti oranları
  sgkIsci: 0.14,
  issizlikIsci: 0.01,

  // İşveren oranları (teşviksiz)
  sgkIsveren: 0.2175,
  issizlikIsveren: 0.02,

  // SGK primine esas kazanç tavanı (2026'da 7,5 → 9 kat)
  spekTavan: 297270.0,

  // Damga vergisi
  damgaOrani: 0.00759, // binde 7,59
  damgaIstisna: 250.7, // aylık sabit istisna

  // Gelir vergisi tarifesi (ÜCRET gelirleri): [üst sınır, oran, alt sınıra kadarki kümülatif vergi]
  gvTarife: [
    [190000, 0.15, 0],
    [400000, 0.2, 28500],
    [1500000, 0.27, 70500],
    [5300000, 0.35, 367500],
    [Infinity, 0.4, 1697500],
  ] as [number, number, number][],

  // Finansal oranlar (hesaplayıcılar için)
  kdvOranlari: [0.01, 0.1, 0.2],
  gecikmeZammiAylik: 0.037, // %3,70 (13.11.2025'ten)
  yasalFaiz: 0.24, // yıllık
  ticariTemerrut3095: 0.4925, // TCMB avans bazlı
  ttk1530Faiz: 0.43, // mal/hizmet geç ödeme (RG 02.01.2026)
  ttk1530Asgari: 2020.0,
  tcmbAvans: 0.4925,
  tcmbReeskont: 0.4825,

  kaynak: "GVK Tebliğ 332 · SGK Genelgesi 2026/2 · 7566 s. Kanun",
} as const;
