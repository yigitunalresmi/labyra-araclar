"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  hesaplaAy,
  hesaplaYil,
  nettenBrute,
  type AyHesap,
} from "@/lib/tools/salary";
import { maasPdfIndir } from "@/lib/pdf/salaryPdf";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/analytics";

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const fmt = (n: number) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function SalaryCalculator({
  user,
}: {
  user: { email?: string } | null;
}) {
  const router = useRouter();
  const [yon, setYon] = useState<"brut" | "net">("brut");
  const [tutar, setTutar] = useState("50000");
  const [ay, setAy] = useState(1);
  const [detayli, setDetayli] = useState(false);
  const [sonuc, setSonuc] = useState<AyHesap | null>(null);
  const [tablo, setTablo] = useState<AyHesap[] | null>(null);
  const [pdfYukleniyor, setPdfYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [pdfHata, setPdfHata] = useState("");

  function hesapla() {
    if (!user) {
      router.push("/giris?return=/araclar/maas-hesaplama");
      return;
    }
    const t = parseFloat(tutar.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(t) || t <= 0) {
      setHata("Geçerli bir tutar gir (0'dan büyük).");
      setSonuc(null);
      return;
    }
    if (t > 100_000_000) {
      setHata("Tutar çok büyük görünüyor, lütfen kontrol et.");
      return;
    }
    setHata("");
    const brut = yon === "brut" ? t : nettenBrute(t, ay, 0);
    setSonuc(hesaplaAy(brut, ay, 0));
    setTablo(detayli ? hesaplaYil(brut) : null);
    track("tool_used", { tool: "salary", yon });
  }

  async function pdfIndir() {
    if (!sonuc) return;
    setPdfYukleniyor(true);
    setPdfHata("");
    try {
      await maasPdfIndir(sonuc, tablo);
    } catch (e) {
      console.error("Maaş PDF hatası:", e);
      setPdfHata("PDF oluşturulamadı, lütfen tekrar dene.");
    } finally {
      setPdfYukleniyor(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* FORM */}
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        {/* Yön */}
        <div className="mb-4 flex gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
          {(["brut", "net"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setYon(v)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                yon === v
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {v === "brut" ? "Brütten Nete" : "Netten Brüte"}
            </button>
          ))}
        </div>

        <Input
          id="tutar"
          label={yon === "brut" ? "Brüt ücret (₺)" : "Net ücret (₺)"}
          inputMode="decimal"
          value={tutar}
          onChange={(e) => setTutar(e.target.value)}
          placeholder="50000"
        />

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="ay" className="text-sm font-medium">
            Ay
          </label>
          <select
            id="ay"
            value={ay}
            onChange={(e) => setAy(Number(e.target.value))}
            className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]"
          >
            {AYLAR.map((a, i) => (
              <option key={a} value={i + 1}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={detayli}
            onChange={(e) => setDetayli(e.target.checked)}
            className="size-4 accent-[var(--color-gold-dark)]"
          />
          12 aylık tabloyu da göster (kümülatif etki)
        </label>

        <Button onClick={hesapla} size="lg" className="mt-5 w-full">
          {user ? "Hesapla" : "Ücretsiz giriş yap & hesapla"}
        </Button>
        {hata && (
          <p className="mt-2 text-sm text-[var(--color-danger)]">{hata}</p>
        )}
        {!user && (
          <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
            Sonucu görmek ve PDF almak için ücretsiz hesap gerekir.
          </p>
        )}
      </div>

      {/* SONUÇ */}
      {sonuc ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted)]">Net ücret</p>
          <p className="text-3xl font-medium text-[var(--color-gold-dark)]">
            {fmt(sonuc.net)} ₺
          </p>

          <div className="mt-4 space-y-1.5 text-sm">
            <Satir l="Brüt ücret" v={fmt(sonuc.brut)} />
            <Satir l="SGK işçi payı (%14)" v={"− " + fmt(sonuc.sgkIsci)} />
            <Satir l="İşsizlik sigortası (%1)" v={"− " + fmt(sonuc.issizlik)} />
            <Satir l="Gelir vergisi" v={"− " + fmt(sonuc.odenenGV)} />
            <Satir l="Damga vergisi" v={"− " + fmt(sonuc.odenenDamga)} />
            <div className="my-1 border-t border-[var(--color-border)]" />
            <Satir l="İşverene maliyet" v={fmt(sonuc.isverenMaliyet)} muted />
          </div>

          {tablo && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium">12 Aylık Net</p>
              <div className="overflow-hidden rounded-lg border border-[var(--color-border)] text-sm">
                {tablo.map((h, i) => (
                  <div
                    key={i}
                    className={`flex justify-between px-3 py-1.5 ${
                      i % 2 ? "bg-[var(--color-surface-2)]" : ""
                    }`}
                  >
                    <span className="text-[var(--color-muted)]">{AYLAR[i]}</span>
                    <span>{fmt(h.net)} ₺</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={pdfIndir}
            variant="secondary"
            className="mt-5 w-full"
            disabled={pdfYukleniyor}
          >
            {pdfYukleniyor ? "Hazırlanıyor…" : "PDF indir"}
          </Button>
          {pdfHata && (
            <p className="mt-2 text-xs text-[var(--color-danger)]">{pdfHata}</p>
          )}

          <div className="mt-4 rounded-lg bg-[var(--color-surface-2)] p-3 text-sm">
            <p className="text-[var(--color-text)]">
              Tüm ekibinin bordrosunu otomatik hesapla, e-bordro gönder.
            </p>
            <a
              href="https://labyra.co/urunler/labyra-erp"
              target="_blank"
              rel="noopener"
              className="font-medium text-[var(--color-gold-dark)] underline"
            >
              Labyra ERP Bordro →
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-muted)]">
          Tutarı gir, sonucu burada gör.
        </div>
      )}
    </div>
  );
}

function Satir({ l, v, muted }: { l: string; v: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-muted)]">{l}</span>
      <span className={muted ? "text-[var(--color-muted)]" : ""}>{v} ₺</span>
    </div>
  );
}
