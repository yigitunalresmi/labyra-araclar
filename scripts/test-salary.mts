// Maaş hesap mantığı doğrulama testi (UI'dan bağımsız).
// Çalıştır: npx tsx scripts/test-salary.mts
import { hesaplaAy, hesaplaYil, nettenBrute } from "../src/lib/tools/salary.ts";

function yakin(a: number, b: number, tol = 1) {
  return Math.abs(a - b) <= tol;
}

let gecti = 0;
let kaldi = 0;
function kontrol(ad: string, gercek: number, beklenen: number, tol = 1) {
  const ok = yakin(gercek, beklenen, tol);
  console.log(
    `${ok ? "✓" : "✗"} ${ad}: ${gercek.toFixed(2)} (beklenen ~${beklenen})`,
  );
  ok ? gecti++ : kaldi++;
}

// 1) Araştırma worked example: 50.000 brüt, Ocak → net ~40.207,53
const h = hesaplaAy(50000, 1, 0);
kontrol("50.000 brüt Ocak net", h.net, 40207.53, 1);
kontrol("  SGK işçi (%14)", h.sgkIsci, 7000, 0.01);
kontrol("  işsizlik (%1)", h.issizlik, 500, 0.01);
kontrol("  ödenen GV", h.odenenGV, 2163.67, 1);
kontrol("  ödenen damga", h.odenenDamga, 128.8, 0.5);

// 2) Asgari ücret: 33.030 brüt Ocak → net ~28.075,50
const a = hesaplaAy(33030, 1, 0);
kontrol("33.030 brüt Ocak net (asgari)", a.net, 28075.5, 2);

// 3) Net → brüt tersine
kontrol("net 40.207,53 → brüt", nettenBrute(40207.53, 1, 0), 50000, 5);

// 4) Kümülatif etki: aynı brütte Aralık neti < Ocak neti
const yil = hesaplaYil(50000);
const ocak = yil[0].net;
const aralik = yil[11].net;
console.log(
  `${aralik < ocak ? "✓" : "✗"} kümülatif etki: Ocak ${ocak.toFixed(2)} > Aralık ${aralik.toFixed(2)}`,
);
aralik < ocak ? gecti++ : kaldi++;

// 5) SPEK tavanı: çok yüksek brütte SGK matrahı tavanla sınırlı
const yuksek = hesaplaAy(400000, 1, 0);
kontrol("400.000 brüt SGK işçi (tavan 297.270 × %14)", yuksek.sgkIsci, 41617.8, 1);

console.log(`\nSONUÇ: ${gecti} geçti, ${kaldi} kaldı`);
process.exit(kaldi > 0 ? 1 : 0);
