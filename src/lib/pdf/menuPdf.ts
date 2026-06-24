import { formatMenuPrice, slugify, type MenuData } from "@/lib/tools/menu";

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return [26, 25, 22]; // koyu varsayılan
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

/**
 * Basılabilir A4 menü PDF'i üretir (masaya konulabilir).
 * Filigran: "Powered by Labyra" her sayfanın altında (ücretsiz tier çizgisi).
 * Türkçe için Roboto gömülür.
 */
export async function menuPdfIndir(menu: MenuData) {
  const { jsPDF } = await import("jspdf");
  const { ROBOTO_REGULAR_B64 } = await import("./roboto");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_B64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 56; // kenar boşluğu
  const CW = PW - M * 2; // içerik genişliği
  const FOOT = 48; // alt filigran için ayrılan alan
  const accent = hexToRgb(menu.business.color);
  const dark: [number, number, number] = [26, 25, 22];
  const gray: [number, number, number] = [122, 113, 104];

  let y = M + 8;

  function ensureSpace(need: number) {
    if (y + need > PH - FOOT) {
      doc.addPage();
      y = M + 8;
    }
  }

  // Başlık
  doc.setTextColor(...accent);
  doc.setFontSize(26);
  doc.text(menu.business.name || "Menü", PW / 2, y, { align: "center" });
  y += 22;

  const sub = [menu.business.note, menu.business.phone]
    .filter(Boolean)
    .join("  ·  ");
  if (sub) {
    doc.setTextColor(...gray);
    doc.setFontSize(10);
    doc.text(sub, PW / 2, y, { align: "center" });
    y += 16;
  }

  // Vurgu çizgisi
  doc.setDrawColor(...accent);
  doc.setLineWidth(1.5);
  doc.line(PW / 2 - 30, y, PW / 2 + 30, y);
  y += 26;

  for (const cat of menu.categories) {
    const visibleItems = cat.items.filter((it) => it.name.trim());
    if (!visibleItems.length && !cat.name.trim()) continue;

    ensureSpace(40);

    // Kategori adı + ince alt çizgi
    if (cat.name.trim()) {
      doc.setTextColor(...accent);
      doc.setFontSize(15);
      doc.text(cat.name.toLocaleUpperCase("tr-TR"), M, y);
      y += 8;
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.7);
      doc.line(M, y, M + CW, y);
      y += 18;
    }

    for (const it of visibleItems) {
      const priceText = formatMenuPrice(it.price);
      const hasDesc = !!(it.desc && it.desc.trim());
      ensureSpace(hasDesc ? 32 : 20);

      // Ürün adı (sol) — fiyat genişliği kadar pay bırak
      doc.setFontSize(12);
      const priceW = priceText ? doc.getTextWidth(priceText) + 12 : 0;
      doc.setTextColor(...dark);
      const nameLines = doc.splitTextToSize(it.name, CW - priceW);
      doc.text(nameLines[0], M, y);

      // Fiyat (sağ)
      if (priceText) {
        doc.setTextColor(...dark);
        doc.setFontSize(12);
        doc.text(priceText, M + CW, y, { align: "right" });
      }
      y += 15;

      // Açıklama (gri, küçük)
      if (hasDesc) {
        doc.setTextColor(...gray);
        doc.setFontSize(9.5);
        const descLines = doc.splitTextToSize(it.desc!.trim(), CW - 40);
        doc.text(descLines[0], M, y);
        y += 13;
      }
      y += 4;
    }
    y += 14;
  }

  // Her sayfaya filigran
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(...gray);
    doc.setFontSize(8.5);
    doc.text("Powered by Labyra · labyra.co", PW / 2, PH - 24, {
      align: "center",
    });
  }

  doc.save(`${slugify(menu.business.name || "menu")}-menu.pdf`);
}
