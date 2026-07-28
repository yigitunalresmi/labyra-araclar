"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { YKS_2025 } from "@/lib/params/yks-2025";
import {
  dersNet,
  lgsHesapla,
  tytHesapla,
  aytHesapla,
  type Cevaplar,
} from "@/lib/tools/exam";
import { finansPdfIndir } from "@/lib/pdf/financePdf";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type User = { email?: string } | null;
type Sinav = "lgs" | "tyt" | "ayt";

const fmt1 = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPuan = (n: number) =>
  n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });

type Sonuc =
  | { tip: "lgs"; toplamNet: number; puan: number; detay: { ad: string; net: number }[] }
  | { tip: "tyt"; toplamNet: number; puan: number; detay: { ad: string; net: number }[] }
  | { tip: "ayt"; toplamNet: number; sayilanNet: number; detay: { ad: string; net: number }[] };

export function ExamCalculator({ user }: { user: User }) {
  const router = useRouter();
  const [sinav, setSinav] = useState<Sinav>("tyt");
  const [cevaplar, setCevaplar] = useState<Cevaplar>({});
  const [aytTur, setAytTur] = useState<"say" | "ea" | "soz">("say");
  const [sonuc, setSonuc] = useState<Sonuc | null>(null);
  const [hata, setHata] = useState("");
  const [pdfYukleniyor, setPdfYukleniyor] = useState(false);
  const [pdfHata, setPdfHata] = useState("");

  const cfg = YKS_2025[sinav];

  function setCevap(key: string, alan: "d" | "y", val: number) {
    setCevaplar((p) => ({
      ...p,
      [key]: { ...(p[key] ?? { d: 0, y: 0 }), [alan]: val },
    }));
  }

  function degisSinav(s: Sinav) {
    setSinav(s);
    setCevaplar({});
    setSonuc(null);
    setHata("");
  }

  function hesapla() {
    const toplamGiris = cfg.dersler.reduce((s, d) => {
      const c = cevaplar[d.key] ?? { d: 0, y: 0 };
      return s + (c.d || 0) + (c.y || 0);
    }, 0);
    if (toplamGiris === 0) {
      setHata("En az bir ders için doğru/yanlış sayısı gir.");
      setSonuc(null);
      return;
    }
    const tasan = cfg.dersler.find((d) => {
      const c = cevaplar[d.key] ?? { d: 0, y: 0 };
      return (c.d || 0) + (c.y || 0) > d.soru;
    });
    if (tasan) {
      setHata(
        `${tasan.ad}: doğru + yanlış toplamı ${tasan.soru} soruyu aşamaz.`,
      );
      setSonuc(null);
      return;
    }
    setHata("");
    if (sinav === "lgs") setSonuc({ tip: "lgs", ...lgsHesapla(cevaplar) });
    else if (sinav === "tyt") setSonuc({ tip: "tyt", ...tytHesapla(cevaplar) });
    else setSonuc({ tip: "ayt", ...aytHesapla(cevaplar, aytTur) });
    track("tool_used", { tool: "exam", sinav });
  }

  async function pdf() {
    if (!sonuc) return;
    setPdfYukleniyor(true);
    setPdfHata("");
    try {
      const satirlar: [string, string][] = sonuc.detay.map((d) => [
        d.ad,
        fmt1(d.net) + " net",
      ]);
      if (sonuc.tip === "ayt") {
        satirlar.push(["Toplam net", fmt1(sonuc.toplamNet)]);
        satirlar.push([
          `Sayılan net (${aytTur.toUpperCase()})`,
          fmt1(sonuc.sayilanNet),
        ]);
      } else {
        satirlar.push(["Toplam net", fmt1(sonuc.toplamNet)]);
        satirlar.push(["Tahmini puan", fmtPuan(sonuc.puan)]);
      }
      await finansPdfIndir(
        `${cfg.ad} Deneme Sonucu`,
        satirlar,
        "Net kesindir; puan tahminîdir (geçen yıl katsayıları).",
      );
    } catch (e) {
      console.error("Deneme PDF hatası:", e);
      setPdfHata("PDF oluşturulamadı, tekrar dene.");
    } finally {
      setPdfYukleniyor(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        {/* Sınav türü */}
        <div className="mb-4 flex gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
          {(["lgs", "tyt", "ayt"] as const).map((s) => (
            <button
              key={s}
              onClick={() => degisSinav(s)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                sinav === s
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {YKS_2025[s].ad}
            </button>
          ))}
        </div>

        {sinav === "ayt" && (
          <div className="mb-4">
            <label className="text-sm font-medium">Puan türü</label>
            <select
              value={aytTur}
              onChange={(e) => setAytTur(e.target.value as typeof aytTur)}
              className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none focus:border-[var(--color-gold)]"
            >
              <option value="say">Sayısal (SAY)</option>
              <option value="ea">Eşit Ağırlık (EA)</option>
              <option value="soz">Sözel (SÖZ)</option>
            </select>
          </div>
        )}

        {/* Başlık satırı */}
        <div className="mb-1 flex items-center gap-2 px-1 text-xs text-[var(--color-muted)]">
          <span className="flex-1">Ders</span>
          <span className="w-16 text-center">Doğru</span>
          <span className="w-16 text-center">Yanlış</span>
          <span className="w-12 text-right">Net</span>
        </div>

        <div className="space-y-1.5">
          {cfg.dersler.map((d) => {
            const c = cevaplar[d.key] ?? { d: 0, y: 0 };
            const net = dersNet(c.d, c.y, cfg.yanlisBolen);
            return (
              <div key={d.key} className="flex items-center gap-2">
                <span className="flex-1 text-sm">
                  {d.ad}
                  <span className="text-[var(--color-muted)]"> /{d.soru}</span>
                </span>
                <input
                  type="number"
                  min={0}
                  max={d.soru}
                  value={c.d || ""}
                  onChange={(e) => setCevap(d.key, "d", Number(e.target.value))}
                  className="h-9 w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-center text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <input
                  type="number"
                  min={0}
                  max={d.soru}
                  value={c.y || ""}
                  onChange={(e) => setCevap(d.key, "y", Number(e.target.value))}
                  className="h-9 w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-center text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <span className="w-12 text-right text-sm font-medium">
                  {fmt1(net)}
                </span>
              </div>
            );
          })}
        </div>

        <Button onClick={hesapla} size="lg" className="mt-5 w-full">
          Hesapla
        </Button>
        {hata && (
          <p className="mt-3 text-sm text-[var(--color-danger)]">{hata}</p>
        )}
      </div>

      {/* Sonuç */}
      {sonuc ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {sonuc.tip === "ayt" ? (
            <>
              <p className="text-sm text-[var(--color-muted)]">
                Sayılan net ({aytTur.toUpperCase()})
              </p>
              <p className="text-3xl font-medium text-[var(--color-gold-dark)]">
                {fmt1(sonuc.sayilanNet)}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Toplam net: {fmt1(sonuc.toplamNet)}
              </p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                AYT yerleştirme puanı TYT + OBP ile ve ÖSYM katsayılarıyla
                hesaplanır; burada netini takip et.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--color-muted)]">Tahmini puan</p>
              <p className="text-3xl font-medium text-[var(--color-gold-dark)]">
                {fmtPuan(sonuc.puan)}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Toplam net: {fmt1(sonuc.toplamNet)}
              </p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Net kesindir; puan geçen yıl katsayılarına göre tahminîdir.
              </p>
            </>
          )}

          <div className="mt-4 space-y-1 text-sm">
            {sonuc.detay.map((d) => (
              <div key={d.ad} className="flex justify-between">
                <span className="text-[var(--color-muted)]">{d.ad}</span>
                <span>{fmt1(d.net)} net</span>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={pdf}
            disabled={pdfYukleniyor}
          >
            {pdfYukleniyor ? "Hazırlanıyor…" : "PDF indir"}
          </Button>
          {pdfHata && (
            <p className="mt-2 text-xs text-[var(--color-danger)]">{pdfHata}</p>
          )}

          <div className="mt-4 rounded-lg bg-[var(--color-surface-2)] p-3 text-sm">
            <p className="text-[var(--color-text)]">
              Öğrencilerinin deneme netlerini otomatik takip et, gelişim grafiği
              gör.
            </p>
            <a
              href="https://labyra.co/urunler/labyra-akademi"
              target="_blank"
              rel="noopener"
              className="font-medium text-[var(--color-gold-dark)] underline"
            >
              Labyra Akademi →
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-muted)]">
          Doğru/yanlış sayılarını gir, sonucu burada gör.
        </div>
      )}
    </div>
  );
}
