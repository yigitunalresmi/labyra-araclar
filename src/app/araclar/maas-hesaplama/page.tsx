import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { SalaryCalculator } from "@/components/tools/SalaryCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Brüt-Net Maaş Hesaplama 2026 | Labyra Araçlar",
  description:
    "2026 vergi dilimleri, asgari ücret istisnası ve %9 SGK tavanıyla brütten nete (ve netten brüte) maaş hesaplama. İşverene maliyet ve 12 aylık net tablosu — ücretsiz.",
};

const tool = TOOLS.find((t) => t.key === "salary")!;

export default async function MaasHesaplamaPage() {
  const user = await getOptionalUser();
  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <TopBar userEmail={user?.email ?? null} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-text)]">
            Araçlar
          </Link>{" "}
          / Brüt-Net Maaş Hesaplama
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          Brüt-Net Maaş Hesaplama 2026
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Güncel 2026 parametreleriyle brütten nete ve netten brüte maaş
          hesapla; SGK, işsizlik, gelir ve damga vergisi dökümünü, işverene
          toplam maliyeti ve kümülatif vergi etkisini gör.
        </p>

        <div className="mt-8">
          <SalaryCalculator user={user ? { email: user.email } : null} />
        </div>

        {/* SEO + bilgi içeriği (herkese açık) */}
        <section className="mt-14 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Brütten nete maaş nasıl hesaplanır?
            </h2>
            <p>
              Brüt ücretten önce <strong>%14 SGK</strong> ve{" "}
              <strong>%1 işsizlik</strong> işçi payı düşülür. Kalan tutar gelir
              vergisi matrahını oluşturur; vergi, yıl başından beri biriken
              kümülatif matraha göre artan oranlı tarifeyle (%15 → %40)
              hesaplanır. Asgari ücrete isabet eden kısım gelir ve damga
              vergisinden istisnadır.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              2026 parametreleri
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>Brüt asgari ücret: 33.030 ₺ (net 28.075,50 ₺)</li>
              <li>SGK tavanı: 297.270 ₺ (asgari ücretin 9 katı)</li>
              <li>Gelir vergisi dilimleri: %15 / %20 / %27 / %35 / %40</li>
              <li>Damga vergisi: binde 7,59</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Neden aynı maaşın neti yıl içinde düşer?
            </h2>
            <p>
              Gelir vergisi kümülatif matraha bağlı olduğu için, yıl ilerledikçe
              matrah üst dilime geçer ve aynı brüt ücrette net maaş azalır.
              &quot;12 aylık tablo&quot; seçeneği bu etkiyi gösterir.
            </p>
          </div>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır; resmî/bağlayıcı değildir.
          </p>
        </section>
      </main>
    </>
  );
}
