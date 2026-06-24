import { YKS_2025 } from "@/lib/params/yks-2025";

export type Cevap = { d: number; y: number };
export type Cevaplar = Record<string, Cevap>;
export type DersSonuc = { key: string; ad: string; net: number };

/** Net = doğru − yanlış/bölen (0'ın altına düşmez). */
export function dersNet(dogru: number, yanlis: number, bolen: number): number {
  return Math.max(0, dogru - yanlis / bolen);
}

export function lgsHesapla(cevaplar: Cevaplar) {
  const { dersler, yanlisBolen, maxAgirlikliNet } = YKS_2025.lgs;
  const detay: DersSonuc[] = [];
  let agirlikli = 0;
  let toplamNet = 0;
  for (const d of dersler) {
    const c = cevaplar[d.key] ?? { d: 0, y: 0 };
    const net = dersNet(c.d, c.y, yanlisBolen);
    detay.push({ key: d.key, ad: d.ad, net });
    agirlikli += net * d.katsayi;
    toplamNet += net;
  }
  // 100–500 ölçeğine yaklaşık dönüşüm (tahmini)
  const puan = 100 + (agirlikli / maxAgirlikliNet) * 400;
  return { detay, toplamNet, puan };
}

export function tytHesapla(cevaplar: Cevaplar) {
  const { dersler, yanlisBolen, taban } = YKS_2025.tyt;
  const detay: DersSonuc[] = [];
  let katsayili = 0;
  let toplamNet = 0;
  for (const d of dersler) {
    const c = cevaplar[d.key] ?? { d: 0, y: 0 };
    const net = dersNet(c.d, c.y, yanlisBolen);
    detay.push({ key: d.key, ad: d.ad, net });
    katsayili += net * d.katsayi;
    toplamNet += net;
  }
  return { detay, toplamNet, puan: taban + katsayili };
}

export function aytHesapla(cevaplar: Cevaplar, puanTuru: "say" | "ea" | "soz") {
  const { dersler, yanlisBolen } = YKS_2025.ayt;
  const sayilan = YKS_2025.ayt.puanTuru[puanTuru];
  const detay: DersSonuc[] = [];
  let toplamNet = 0;
  let sayilanNet = 0;
  for (const d of dersler) {
    const c = cevaplar[d.key] ?? { d: 0, y: 0 };
    const net = dersNet(c.d, c.y, yanlisBolen);
    detay.push({ key: d.key, ad: d.ad, net });
    toplamNet += net;
    if (sayilan.includes(d.key)) sayilanNet += net;
  }
  return { detay, toplamNet, sayilanNet };
}
