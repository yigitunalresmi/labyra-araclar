import type { Metadata } from "next";
import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { QrGenerator } from "@/components/tools/QrGenerator";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

const tool = TOOLS.find((t) => t.key === "qr-code")!;

export const metadata: Metadata = {
  title: "Ücretsiz QR Kod Oluşturucu — Link, WiFi, Telefon, vCard | Labyra Araçlar",
  description:
    "Bağlantı, WiFi, telefon, e-posta ve metin için saniyeler içinde QR kod oluştur. PNG ve SVG olarak indir. Ücretsiz ve sınırsız.",
};

export default async function QrKodPage() {
  const user = await getOptionalUser();

  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <TopBar userEmail={user?.email ?? null} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-text)]">
            Araçlar
          </Link>{" "}
          / QR Kod Oluşturucu
        </nav>

        <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
          QR Kod Oluşturucu
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Bağlantı, WiFi, telefon, e-posta ya da metin için saniyeler içinde QR
          kod üret; PNG veya SVG olarak indir. Baskıda kalite kaybı olmaması için
          tabela/poster gibi büyük çıktılarda SVG&apos;yi tercih et.
        </p>

        <div className="mt-8">
          <QrGenerator user={user ? { email: user.email } : null} />
        </div>

        <section className="mt-14 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              QR kod nedir, nasıl kullanılır?
            </h2>
            <p>
              QR kod, telefon kamerasıyla okutulduğunda bir bağlantıya, WiFi
              ağına ya da kayıtlı bilgiye anında ulaştıran kare bir koddur.
              Oluşturduğun kodu masaya, vitrine, kartvizite veya ürün ambalajına
              basabilirsin.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              WiFi QR kodu
            </h2>
            <p>
              Ağ adını, şifreni ve güvenlik türünü gir; müşterilerin şifre yazmak
              zorunda kalmadan kodu okutarak ağa bağlansın. Kafe, otel ve ofisler
              için pratiktir.
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-base font-medium text-[var(--color-text)]">
              Ücretsiz mi?
            </h2>
            <p>
              Evet. Ücretsiz hesabınla dilediğin kadar QR kod oluşturup PNG/SVG
              olarak indirebilirsin. İşletmen için güncellenebilir dijital menü
              ya da QR&apos;ı WhatsApp/randevu akışına bağlama gibi kalıcı
              çözümler için Labyra hizmetlerine göz atabilirsin.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
