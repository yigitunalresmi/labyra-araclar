import { FINANS_2026 as P } from "@/lib/params/finans-2026";

/** Artan oranlı gelir vergisi: kümülatif matrah için ödenecek toplam vergi. */
export function gelirVergisi(kumulatifMatrah: number): number {
  let alt = 0;
  for (const [ust, oran, tabanVergi] of P.gvTarife) {
    if (kumulatifMatrah <= ust) {
      return tabanVergi + (kumulatifMatrah - alt) * oran;
    }
    alt = ust;
  }
  return 0; // ulaşılmaz (son dilim Infinity)
}

export type AyHesap = {
  ay: number;
  brut: number;
  sgkIsci: number;
  issizlik: number;
  gvMatrah: number;
  brutGV: number;
  gvIstisna: number;
  odenenGV: number;
  odenenDamga: number;
  net: number;
  kumulatif: number;
  isverenMaliyet: number;
};

/** Bir ay için brütten nete hesap (kümülatif matrah takipli). */
export function hesaplaAy(
  brut: number,
  ay: number,
  oncekiKumulatif: number,
): AyHesap {
  const sgkBase = Math.min(brut, P.spekTavan);
  const sgkIsci = sgkBase * P.sgkIsci;
  const issizlik = sgkBase * P.issizlikIsci;
  const gvMatrah = brut - sgkIsci - issizlik;
  const kumulatif = oncekiKumulatif + gvMatrah;

  const brutGV = gelirVergisi(kumulatif) - gelirVergisi(oncekiKumulatif);
  // Asgari ücret gelir vergisi istisnası (asgari ücretin kendi kümülatif matrahından türetilir)
  const gvIstisna =
    gelirVergisi(ay * P.asgariGvMatrah) -
    gelirVergisi((ay - 1) * P.asgariGvMatrah);
  const odenenGV = Math.max(0, brutGV - gvIstisna);

  const odenenDamga = Math.max(0, brut * P.damgaOrani - P.damgaIstisna);

  const net = brut - sgkIsci - issizlik - odenenGV - odenenDamga;
  const isverenMaliyet =
    brut + sgkBase * P.sgkIsveren + sgkBase * P.issizlikIsveren;

  return {
    ay,
    brut,
    sgkIsci,
    issizlik,
    gvMatrah,
    brutGV,
    gvIstisna,
    odenenGV,
    odenenDamga,
    net,
    kumulatif,
    isverenMaliyet,
  };
}

/** 12 aylık tablo (brüt sabit; net kümülatif etkiyle yıl içinde düşer). */
export function hesaplaYil(brut: number): AyHesap[] {
  const tablo: AyHesap[] = [];
  let kum = 0;
  for (let ay = 1; ay <= 12; ay++) {
    const h = hesaplaAy(brut, ay, kum);
    tablo.push(h);
    kum = h.kumulatif;
  }
  return tablo;
}

/** Net → brüt (ikili arama). Belirtilen ay ve önceki kümülatif matrah için. */
export function nettenBrute(
  net: number,
  ay: number,
  oncekiKumulatif: number,
): number {
  let lo = net;
  let hi = net * 2.5 + 10000;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const h = hesaplaAy(mid, ay, oncekiKumulatif);
    if (h.net < net) lo = mid;
    else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 100) / 100;
}
