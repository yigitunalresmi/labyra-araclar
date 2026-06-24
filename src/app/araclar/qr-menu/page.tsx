import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/shell/TopBar";
import { MenuBuilder } from "@/components/tools/MenuBuilder";
import type { MenuData } from "@/lib/tools/menu";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

const tool = TOOLS.find((t) => t.key === "qr-menu")!;

export const metadata: Metadata = {
  title: "Ücretsiz QR Menü Oluşturucu — Mobil Menü + QR Kod | Labyra Araçlar",
  description:
    "İşletmenin menüsünü gir, dakikalar içinde mobil uyumlu menü sayfası ve QR kod al. Masaya koy, müşterin telefonuyla okusun. PDF olarak da indir. Ücretsiz.",
};

export default async function QrMenuPage() {
  const user = await getOptionalUser();

  // Kullanıcının mevcut menüsü varsa düzenleme moduyla yükle (yeni kota harcamaz)
  let initial: { slug: string; menu: MenuData } | null = null;
  if (user) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("menus")
        .select("slug, data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.slug) {
        initial = { slug: data.slug, menu: data.data as MenuData };
      }
    } catch {
      // sessizce yoksay — builder boş başlar
    }
  }

  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <TopBar userEmail={user?.email ?? null} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-text)]">
            Araçlar
          </Link>{" "}
          / QR Menü Oluşturucu
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          QR Menü Oluşturucu
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Menünü gir, mobil uyumlu bir menü sayfası ve QR kod al. Masaya koy,
          müşterin telefonuyla okusun — istersen PDF olarak da indir.
        </p>

        <div className="mt-8">
          <MenuBuilder
            user={user ? { id: user.id, email: user.email } : null}
            initial={initial}
          />
        </div>

        <section className="mt-14 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Nasıl çalışır?
            </h2>
            <p>
              İşletme adını ve menünü (kategori + ürün + fiyat) gir. Sağdaki
              canlı önizlemede menünün mobilde nasıl göründüğünü anında gör.
              &quot;Menüyü yayınla&quot; dediğinde sana özel bir{" "}
              <strong>menü sayfası</strong> ve <strong>QR kod</strong> üretilir.
              QR&apos;ı masaya/poster&apos;a koy; müşteri telefonuyla okuyup
              menüye ulaşır.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Ücretsiz sınır
            </h2>
            <p>
              Ücretsiz sürümde <strong>bir menü</strong> oluşturursun ve
              dilediğin kadar güncellersin (menü sayfasında küçük bir
              &quot;Powered by Labyra&quot; ibaresi olur). Markana özel alan
              adı, görüntülenme analitiği, çoklu menü ve şube desteği için
              Labyra QR Menü hizmetine geçebilirsin.
            </p>
          </div>
          <p className="text-xs">
            Menü bilgileri işletme tarafından girilir; fiyat ve içerik
            doğruluğu işletmenin sorumluluğundadır.
          </p>
        </section>
      </main>
    </>
  );
}
