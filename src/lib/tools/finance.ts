import { FINANS_2026 as P } from "@/lib/params/finans-2026";

// ── KDV ──────────────────────────────────────────────
export function kdvHesapla(tutar: number, oran: number, dahilMi: boolean) {
  if (dahilMi) {
    const matrah = tutar / (1 + oran);
    return { matrah, kdv: tutar - matrah, toplam: tutar };
  }
  const kdv = tutar * oran;
  return { matrah: tutar, kdv, toplam: tutar + kdv };
}

// ── Kâr marjı ────────────────────────────────────────
// Ya satış fiyatı ya da marj yüzdesi (satış üzerinden) verilir.
export function marjHesapla(
  maliyet: number,
  opts: { marjYuzde?: number; satis?: number },
) {
  let satis: number;
  if (opts.satis != null) {
    satis = opts.satis;
  } else {
    const m = (opts.marjYuzde ?? 0) / 100;
    satis = m >= 1 ? Infinity : maliyet / (1 - m);
  }
  const kar = satis - maliyet;
  return {
    maliyet,
    satis,
    kar,
    marjYuzde: satis > 0 ? (kar / satis) * 100 : 0, // satış üzerinden
    markupYuzde: maliyet > 0 ? (kar / maliyet) * 100 : 0, // maliyet üzerinden
  };
}

// ── Vade farkı (basit faiz) ──────────────────────────
export function vadeFarki(
  anapara: number,
  yillikOran: number,
  gun: number,
  kdvOran = 0,
) {
  const fark = anapara * yillikOran * (gun / 365);
  const kdv = fark * kdvOran;
  return { fark, kdv, toplam: fark + kdv };
}

// ── Gecikme zammı / faizi (aylık; her başlayan ay tam sayılır) ──
export function gecikmeZammi(tutar: number, gun: number) {
  const ay = Math.max(1, Math.ceil(gun / 30));
  const faiz = tutar * P.gecikmeZammiAylik * ay;
  return { ay, oranAylik: P.gecikmeZammiAylik, faiz, toplam: tutar + faiz };
}

// ── Ticari temerrüt faizi (yıllık basit faiz) ────────
export function temerrutFaizi(
  tutar: number,
  gun: number,
  tip: "yasal" | "ticari3095" | "ttk1530",
) {
  const oran =
    tip === "yasal"
      ? P.yasalFaiz
      : tip === "ticari3095"
        ? P.ticariTemerrut3095
        : P.ttk1530Faiz;
  let faiz = tutar * oran * (gun / 365);
  if (tip === "ttk1530") faiz = Math.max(faiz, P.ttk1530Asgari);
  return { oran, faiz, toplam: tutar + faiz };
}
