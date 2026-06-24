// QR Menü veri modeli + yardımcılar.
// menus.data jsonb şekli: { business, categories, locale }

export type MenuItem = {
  name: string;
  desc?: string;
  price: string; // ham metin; gösterimde formatMenuPrice ile ₺ eklenir
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type MenuBusiness = {
  name: string;
  color: string; // vurgu rengi (hex)
  phone?: string;
  note?: string; // adres / çalışma saati gibi kısa not
};

export type MenuData = {
  business: MenuBusiness;
  categories: MenuCategory[];
  locale: string;
};

// Marka altın tonu (token --color-gold ile uyumlu) varsayılan vurgu
export const DEFAULT_MENU_COLOR = "#c4a882";

// Builder'da sunulan hazır vurgu renkleri
export const MENU_COLORS = [
  "#c4a882", // altın (marka)
  "#b4452f", // kiremit
  "#2f6f4e", // yeşil
  "#27548a", // mavi
  "#7a4ca0", // mor
  "#1a1916", // antrasit
] as const;

export function emptyMenu(): MenuData {
  return {
    business: { name: "", color: DEFAULT_MENU_COLOR, phone: "", note: "" },
    categories: [{ name: "", items: [{ name: "", desc: "", price: "" }] }],
    locale: "tr",
  };
}

// Boş builder'ı doldurmak için örnek menü (kullanıcı "Örnek doldur" derse)
export function demoMenu(): MenuData {
  return {
    business: {
      name: "KÖZ Kahve",
      color: DEFAULT_MENU_COLOR,
      phone: "0536 000 00 00",
      note: "Her gün 08:00 – 23:00",
    },
    categories: [
      {
        name: "Sıcak İçecekler",
        items: [
          { name: "Türk Kahvesi", desc: "Tek / duble", price: "45" },
          { name: "Filtre Kahve", desc: "Günün çekirdeği", price: "60" },
          { name: "Latte", desc: "", price: "70" },
        ],
      },
      {
        name: "Tatlılar",
        items: [
          { name: "San Sebastian", desc: "Dilim", price: "120" },
          { name: "Cheesecake", desc: "Frambuazlı", price: "110" },
        ],
      },
    ],
    locale: "tr",
  };
}

/**
 * Fiyatı gösterime hazırlar: düz sayıysa tr-TR biçimi + ₺ ekler,
 * "45 TL" / "Servis" gibi serbest metni olduğu gibi bırakır.
 */
export function formatMenuPrice(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  const num = s.replace(/\s/g, "").replace(/₺|tl/gi, "");
  if (/^\d{1,3}(\.\d{3})*(,\d+)?$/.test(num) || /^\d+([.,]\d+)?$/.test(num)) {
    const n = parseFloat(num.replace(/\./g, "").replace(",", "."));
    if (Number.isFinite(n)) {
      const formatted = n.toLocaleString("tr-TR", {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
      });
      return formatted + " ₺";
    }
  }
  return s;
}

// İşletme adından URL-güvenli slug (Türkçe karakterler sadeleştirilir)
export function slugify(input: string): string {
  const base = (input || "menu")
    .trim()
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "menu";
}

export function randomSuffix(len = 5): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // karışması kolay 0/o/1/l/i çıkarıldı
  let s = "";
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

// Benzersizliği garanti etmek için ad-slug + kısa rastgele son ek
export function makeSlug(name: string): string {
  return `${slugify(name)}-${randomSuffix()}`;
}

// Yayınlanabilirlik: en az işletme adı + bir ürün adı dolu olmalı
export function isMenuPublishable(m: MenuData): boolean {
  if (!m.business.name.trim()) return false;
  return m.categories.some((c) =>
    c.items.some((it) => it.name.trim().length > 0),
  );
}

// Kaydetmeden önce boş satır/kategorileri temizler
export function cleanMenu(m: MenuData): MenuData {
  const categories = m.categories
    .map((c) => ({
      name: c.name.trim(),
      items: c.items
        .filter((it) => it.name.trim().length > 0)
        .map((it) => ({
          name: it.name.trim(),
          desc: (it.desc ?? "").trim() || undefined,
          price: it.price.trim(),
        })),
    }))
    .filter((c) => c.items.length > 0 || c.name.length > 0);
  return {
    business: {
      name: m.business.name.trim(),
      color: m.business.color || DEFAULT_MENU_COLOR,
      phone: (m.business.phone ?? "").trim() || undefined,
      note: (m.business.note ?? "").trim() || undefined,
    },
    categories,
    locale: m.locale || "tr",
  };
}
