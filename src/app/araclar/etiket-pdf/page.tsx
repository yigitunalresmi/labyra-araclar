import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { LabelMaker } from "@/components/tools/LabelMaker";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "CSV'den Barkodlu Etiket PDF Oluşturma | Labyra Araçlar",
  description:
    "Hazır CSV şablonunu indir, ürün adı/fiyat/barkod ile doldur, yükle ve barkodlu etiketleri PDF olarak al. 100×38mm, EAN-13/Code128. Ücretsiz.",
};

const tool = TOOLS.find((t) => t.key === "label")!;

export default async function EtiketPdfPage() {
  const user = await getOptionalUser();
  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <TopBar userEmail={user?.email ?? null} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-text)]">
            Araçlar
          </Link>{" "}
          / CSV&apos;den Etiket PDF
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          CSV&apos;den Etiket PDF
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Hazır şablonu indir, ürünlerini gir, yükle — barkodlu fiyat
          etiketlerini (100×38mm) tek tıkla PDF olarak al.
        </p>

        <div className="mt-8">
          <LabelMaker user={user ? { email: user.email } : null} />
        </div>

        <section className="mt-12 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Nasıl çalışır?
            </h2>
            <p>
              CSV şablonunda üç kolon vardır: <strong>product_name</strong> (ürün
              adı), <strong>price</strong> (fiyat, düz sayı; örn. 1299) ve{" "}
              <strong>barcode</strong> (barkod numarası). 13 haneli sayılar
              EAN-13, diğerleri Code128 olarak basılır. Her ürün için ayrı bir
              100×38mm etiket sayfası üretilir.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Ücretsiz sınır
            </h2>
            <p>
              Ücretsiz sürümde tek seferde en fazla <strong>200 ürün</strong> ve{" "}
              <strong>bir kez</strong> PDF üretimi yapılır. Sürekli ve sınırsız
              etiket baskısı, ürün kartı ve ZPL çıktısı için Labyra Label.
            </p>
          </div>
          <p className="text-xs">Etiketler bilgilendirme amaçlı oluşturulur.</p>
        </section>
      </main>
    </>
  );
}
