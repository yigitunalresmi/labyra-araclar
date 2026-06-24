import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { ExamCalculator } from "@/components/tools/ExamCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "LGS, TYT, AYT Deneme Net ve Puan Hesaplama | Labyra Araçlar",
  description:
    "LGS, TYT ve AYT denemelerinde ders bazında net ve tahmini puan hesapla. Net kesin (doğru − yanlış/k), puan geçen yıl katsayılarına göre tahminî. Ücretsiz.",
};

const tool = TOOLS.find((t) => t.key === "exam")!;

export default async function DenemeNetPage() {
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
          / Deneme Net &amp; Puan
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          Deneme Net &amp; Puan Hesaplama
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          LGS, TYT ve AYT denemende ders bazında netini ve tahmini puanını
          hesapla. Doğru ve yanlış sayılarını gir, anında gör.
        </p>

        <div className="mt-8">
          <ExamCalculator user={user ? { email: user.email } : null} />
        </div>

        <section className="mt-12 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Net nasıl hesaplanır?
            </h2>
            <p>
              <strong>LGS</strong>&apos;de 3 yanlış 1 doğruyu, <strong>TYT/AYT</strong>
              &apos;de 4 yanlış 1 doğruyu götürür. Net = doğru − (yanlış ÷ bölen).
              Boş sorular neti etkilemez.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Puan neden &quot;tahmini&quot;?
            </h2>
            <p>
              LGS ve YKS puanı, o yıl sınava giren tüm öğrencilerin ortalama ve
              standart sapmasına göre hesaplanır; MEB/ÖSYM sabit bir katsayı
              yayınlamaz. Bu yüzden net kesin verilir, puan geçen yılın
              katsayılarıyla yaklaşık (tahmini) gösterilir.
            </p>
          </div>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır; resmî sonuç ÖSYM/MEB tarafından
            açıklanır.
          </p>
        </section>
      </main>
    </>
  );
}
