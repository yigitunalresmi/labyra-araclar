import type { AyHesap } from "@/lib/tools/salary";
import { FINANS_2026 } from "@/lib/params/finans-2026";

const fmt = (n: number) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

/** Maaş hesabını Türkçe (Roboto gömülü) PDF olarak indirir. */
export async function maasPdfIndir(
  hesap: AyHesap,
  tablo?: AyHesap[] | null,
) {
  const { jsPDF } = await import("jspdf");
  const { ROBOTO_REGULAR_B64 } = await import("./roboto");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_B64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  const ayAdi = AYLAR[hesap.ay - 1];
  let y = 56;

  doc.setFontSize(18);
  doc.text("Brüt-Net Maaş Hesabı", 40, y);
  y += 18;
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text(`${ayAdi} 2026 · bilgilendirme amaçlıdır, resmî/bağlayıcı değildir`, 40, y);
  doc.setTextColor(20);

  y += 32;
  const satir = (label: string, val: string, vurgu = false) => {
    doc.setFontSize(vurgu ? 14 : 11);
    doc.text(label, 40, y);
    doc.text(val + " TL", 380, y, { align: "right" });
    y += vurgu ? 24 : 19;
  };

  satir("Brüt ücret", fmt(hesap.brut));
  satir("SGK işçi payı (%14)", "− " + fmt(hesap.sgkIsci));
  satir("İşsizlik sigortası (%1)", "− " + fmt(hesap.issizlik));
  satir("Gelir vergisi", "− " + fmt(hesap.odenenGV));
  satir("Damga vergisi", "− " + fmt(hesap.odenenDamga));
  y += 4;
  doc.setDrawColor(210);
  doc.line(40, y, 380, y);
  y += 22;
  satir("Net ücret", fmt(hesap.net), true);
  y += 8;
  satir("İşverene toplam maliyet", fmt(hesap.isverenMaliyet));

  if (tablo && tablo.length) {
    y += 28;
    doc.setFontSize(13);
    doc.text("12 Aylık Net (aynı brüt ücrette)", 40, y);
    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(130);
    y += 12;
    doc.text("Net, kümülatif vergi matrahı nedeniyle yıl içinde düşer.", 40, y);
    doc.setTextColor(20);
    y += 18;
    tablo.forEach((h, i) => {
      doc.setFontSize(10);
      doc.text(AYLAR[i], 40, y);
      doc.text(fmt(h.net) + " TL", 240, y, { align: "right" });
      y += 16;
      if (y > 790) {
        doc.addPage();
        y = 56;
      }
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Labyra Araçlar · app.labyra.co · Kaynak: ${FINANS_2026.kaynak}`,
    40,
    812,
  );

  doc.save(`maas-hesabi-${ayAdi.toLowerCase()}-2026.pdf`);
}
