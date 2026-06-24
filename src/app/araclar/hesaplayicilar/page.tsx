import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { FinanceCalculator } from "@/components/tools/FinanceCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "KDV, Kâr Marjı, Vade Farkı ve Faiz Hesaplama 2026 | Labyra Araçlar",
  description:
    "KDV dahil/hariç, kâr marjı, vade farkı ve gecikme/temerrüt faizi hesaplama. 2026 güncel oranlarıyla (gecikme zammı %3,70, TCMB avans %49,25). Ücretsiz.",
};

const tool = TOOLS.find((t) => t.key === "finance")!;

export default async function HesaplayicilarPage() {
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
          / Finansal Hesaplayıcılar
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          Finansal Hesaplayıcılar
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          KDV, kâr marjı, vade farkı ve gecikme/temerrüt faizini 2026 güncel
          oranlarıyla hesapla.
        </p>

        <div className="mt-8">
          <FinanceCalculator user={user ? { email: user.email } : null} />
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-[var(--color-surface-2)] p-4 text-sm">
          <p className="text-[var(--color-text)]">
            Faturada KDV, vade farkı ve cari faizleri otomatik işlemek ister
            misin?
          </p>
          <a
            href="https://labyra.co/urunler/labyra-erp"
            target="_blank"
            rel="noopener"
            className="font-medium text-[var(--color-gold-dark)] underline"
          >
            Labyra ERP →
          </a>
        </div>

        {/* SEO içeriği */}
        <section className="mt-12 space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              2026 KDV oranları
            </h2>
            <p>
              Genel oran <strong>%20</strong>; indirimli oranlar{" "}
              <strong>%10</strong> (yeme-içme, konaklama, eğitim, sağlık) ve{" "}
              <strong>%1</strong> (temel gıda, kitap). KDV dahil tutardan matrah:
              tutar ÷ (1 + oran).
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Gecikme ve temerrüt faizi oranları (2026)
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>Gecikme zammı / faizi: aylık %3,70 (her başlayan ay tam)</li>
              <li>Yasal faiz: yıllık %24</li>
              <li>Ticari temerrüt (3095): yıllık ~%49,25 (TCMB avans)</li>
              <li>TTK 1530 geç ödeme: yıllık %43 + asgari 2.020 ₺</li>
            </ul>
          </div>
          <p className="text-xs">
            Bu araçlar bilgilendirme amaçlıdır; resmî/bağlayıcı değildir. Oranlar
            yıl içinde değişebilir.
          </p>
        </section>
      </main>
    </>
  );
}
