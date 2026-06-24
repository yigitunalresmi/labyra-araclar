import {
  LABEL_TEMPLATE as T,
  fiyatFormatla,
  type EtiketSatir,
} from "@/lib/tools/labelTemplate";

/**
 * Her satır için bir etiket sayfası (100×38mm) üretir.
 * Barkod JsBarcode ile canvas'a çizilip PNG olarak gömülür.
 * Türkçe ürün adları için Roboto gömülür (jsPDF helvetica Türkçe'yi bozar).
 */
export async function etiketPdfIndir(satirlar: EtiketSatir[]) {
  const { jsPDF } = await import("jspdf");
  const jsbarcodeMod = await import("jsbarcode");
  const JsBarcode = (jsbarcodeMod.default ??
    jsbarcodeMod) as typeof jsbarcodeMod.default;
  const { ROBOTO_REGULAR_B64 } = await import("./roboto");

  const W = T.width_mm;
  const H = T.height_mm;

  const doc = new jsPDF({ unit: "mm", format: [W, H], orientation: "landscape" });
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_B64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  satirlar.forEach((row, idx) => {
    if (idx > 0) doc.addPage([W, H], "landscape");

    for (const el of T.elements) {
      if (el.type === "text") {
        const deger =
          el.field === "price_text"
            ? fiyatFormatla(row.price)
            : String(row[el.field as keyof EtiketSatir] ?? "");
        doc.setFontSize(el.fontSize ?? 10);
        const x =
          el.textAlign === "center"
            ? el.x + el.width / 2
            : el.textAlign === "right"
              ? el.x + el.width
              : el.x;
        doc.text(deger, x, el.y + el.height / 2, {
          align: el.textAlign ?? "left",
          baseline: "middle",
          maxWidth: el.width,
        });
      } else if (el.type === "barcode") {
        const val = String(row.barcode ?? "").trim();
        if (!val) continue;
        const canvas = document.createElement("canvas");
        const ean13 = /^\d{13}$/.test(val);
        try {
          JsBarcode(canvas, val, {
            format: ean13 ? "EAN13" : "CODE128",
            height: 60,
            displayValue: el.showBarcodeText ?? true,
            fontSize: el.barcodeTextSize ?? 20,
            margin: 0,
            background: "#ffffff",
          });
        } catch {
          // Geçersiz EAN13 (checksum vb.) → CODE128'e düş
          JsBarcode(canvas, val, {
            format: "CODE128",
            height: 60,
            displayValue: el.showBarcodeText ?? true,
            fontSize: el.barcodeTextSize ?? 20,
            margin: 0,
            background: "#ffffff",
          });
        }
        const img = canvas.toDataURL("image/png");
        doc.addImage(img, "PNG", el.x, el.y, el.width, el.height);
      }
    }
  });

  doc.save(`etiketler-${satirlar.length}-adet.pdf`);
}
