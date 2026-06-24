import type { Translation } from "@/lib/i18n/translations";

export type Tool = {
  key: string;
  slug: string;
  name: Translation;
  desc: Translation;
  funnel: string;
  status: "soon" | "active";
};

// Tüm ücretsiz araçların merkezi tanımı. Ana sayfa, panel ve araç sayfaları kullanır.
export const TOOLS: Tool[] = [
  {
    key: "salary",
    slug: "maas-hesaplama",
    name: { tr: "Brüt-Net Maaş Hesaplama", en: "Gross-Net Salary" },
    desc: {
      tr: "2026 parametreleriyle net maaş ve işverene maliyet.",
      en: "Net salary and employer cost with 2026 parameters.",
    },
    funnel: "Labyra ERP",
    status: "active",
  },
  {
    key: "finance",
    slug: "hesaplayicilar",
    name: { tr: "KDV & Faiz Hesaplayıcı", en: "VAT & Interest Calculator" },
    desc: {
      tr: "KDV, kâr marjı, vade farkı ve gecikme faizi.",
      en: "VAT, profit margin, term difference and late interest.",
    },
    funnel: "Labyra ERP",
    status: "active",
  },
  {
    key: "exam",
    slug: "deneme-net",
    name: { tr: "Deneme Net & Puan", en: "Mock Exam Net & Score" },
    desc: {
      tr: "LGS/TYT/AYT için net ve tahmini puan.",
      en: "Net and estimated score for LGS/TYT/AYT.",
    },
    funnel: "Labyra Akademi",
    status: "active",
  },
  {
    key: "label",
    slug: "etiket-pdf",
    name: { tr: "CSV'den Etiket PDF", en: "CSV to Label PDF" },
    desc: {
      tr: "CSV yükle, barkodlu etiketleri PDF olarak al.",
      en: "Upload a CSV, get barcoded labels as PDF.",
    },
    funnel: "Labyra Label",
    status: "active",
  },
  {
    key: "qr-menu",
    slug: "qr-menu",
    name: { tr: "QR Menü Oluşturucu", en: "QR Menu Builder" },
    desc: {
      tr: "Menünü gir, mobil menü sayfası ve QR al.",
      en: "Enter your menu, get a mobile page and QR.",
    },
    funnel: "QR Menü",
    status: "active",
  },
  {
    key: "qr-code",
    slug: "qr-kod",
    name: { tr: "QR Kod Oluşturucu", en: "QR Code Generator" },
    desc: {
      tr: "Link, WiFi, telefon ve metin için QR kod üret.",
      en: "Generate QR codes for links, WiFi, phone and text.",
    },
    funnel: "QR Menü",
    status: "active",
  },
];
