import { yeniPdf } from "./pdfBase";

/** Genel finansal sonuç PDF'i: başlık + etiket/değer satırları (son satır vurgulu). */
export async function finansPdfIndir(
  baslik: string,
  satirlar: [string, string][],
  not?: string,
) {
  const doc = await yeniPdf();
  let y = 56;

  doc.setFontSize(18);
  doc.text(baslik, 40, y);
  y += 14;
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text("bilgilendirme amaçlıdır, resmî/bağlayıcı değildir", 40, y + 6);
  doc.setTextColor(20);
  y += 34;

  satirlar.forEach(([l, v], i) => {
    const vurgu = i === satirlar.length - 1;
    if (vurgu) {
      doc.setDrawColor(210);
      doc.line(40, y - 14, 380, y - 14);
    }
    doc.setFontSize(vurgu ? 14 : 11);
    doc.text(l, 40, y);
    doc.text(v, 380, y, { align: "right" });
    y += vurgu ? 24 : 19;
  });

  if (not) {
    y += 14;
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(not, 40, y, { maxWidth: 340 });
  }

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Labyra Araçlar · app.labyra.co", 40, 812);

  const dosya = baslik
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]+/gi, "-")
    .replace(/^-|-$/g, "");
  doc.save(`${dosya}.pdf`);
}
