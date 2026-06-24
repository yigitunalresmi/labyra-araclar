// Sabit etiket tasarımı (Labyra Label "original version" formatı). 100×38mm.
// Üç alan: ürün adı (üst), fiyat (orta, büyük), barkod (alt).

export type LabelElement = {
  type: "text" | "barcode";
  field: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  textAlign?: "left" | "center" | "right";
  showBarcodeText?: boolean;
  barcodeTextSize?: number;
};

export const LABEL_TEMPLATE = {
  width_mm: 100,
  height_mm: 38,
  elements: [
    {
      type: "text",
      field: "product_name",
      x: 2,
      y: 1,
      width: 96,
      height: 10,
      fontSize: 11,
      fontWeight: "bold",
      textAlign: "center",
    },
    {
      type: "text",
      field: "price_text",
      x: 25,
      y: 14,
      width: 55,
      height: 9,
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
    },
    {
      type: "barcode",
      field: "barcode",
      x: 25,
      y: 24,
      width: 55,
      height: 12,
      showBarcodeText: true,
      barcodeTextSize: 24,
    },
  ] as LabelElement[],
  settings: { price_decimals: 0, price_thousands_sep: true },
};

// Müşterinin dolduracağı CSV kolonları
export const CSV_HEADER = ["product_name", "price", "barcode"] as const;

export type EtiketSatir = {
  product_name: string;
  price: string;
  barcode: string;
};

/** Ham fiyatı tasarım ayarlarına göre biçimlendirir: 1299 → "1.299 ₺" */
export function fiyatFormatla(price: string | number): string {
  const n =
    typeof price === "number"
      ? price
      : parseFloat(String(price).replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n)) return String(price ?? "");
  const s = n.toLocaleString("tr-TR", {
    minimumFractionDigits: LABEL_TEMPLATE.settings.price_decimals,
    maximumFractionDigits: LABEL_TEMPLATE.settings.price_decimals,
  });
  return s + " ₺";
}

// İndirilecek hazır CSV şablonu (başlık + örnek satırlar)
export const ORNEK_CSV = `product_name,price,barcode
Klasik Beyaz Tişört,299,8690000000017
Kot Pantolon Slim Fit,899,8690000000024
Spor Ayakkabı,1499,8690000000031`;
