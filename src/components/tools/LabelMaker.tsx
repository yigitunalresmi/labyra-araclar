"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";
import {
  ORNEK_CSV,
  fiyatFormatla,
  type EtiketSatir,
} from "@/lib/tools/labelTemplate";
import { etiketPdfIndir } from "@/lib/pdf/labelPdf";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type User = { email?: string } | null;

export function LabelMaker({ user }: { user: User }) {
  const router = useRouter();
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [satirlar, setSatirlar] = useState<EtiketSatir[]>([]);
  const [not, setNot] = useState("");
  const [durum, setDurum] = useState<"idle" | "uretiliyor" | "kilit">("idle");

  function sablonIndir() {
    const blob = new Blob(["﻿" + ORNEK_CSV], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etiket-sablonu.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function dosyaSec() {
    dosyaRef.current?.click();
  }

  function dosyaYukle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data.filter((r) => r.product_name || r.barcode);
        if (rows.length === 0) {
          setNot("CSV boş ya da kolon başlıkları eşleşmiyor (product_name, price, barcode).");
          setSatirlar([]);
          return;
        }
        setNot(
          rows.length > 200
            ? `${rows.length} satır bulundu — ücretsiz sürümde ilk 200 alınır.`
            : `${rows.length} ürün hazır.`,
        );
        setSatirlar(
          rows.slice(0, 200).map((r) => ({
            product_name: r.product_name ?? "",
            price: r.price ?? "",
            barcode: r.barcode ?? "",
          })),
        );
        setDurum("idle");
      },
      error: () => setNot("CSV okunamadı."),
    });
    e.target.value = "";
  }

  async function uret() {
    if (!satirlar.length) return;
    setDurum("uretiliyor");
    try {
      // Önce PDF'i üret; başarılı olursa kotayı tüket (PDF hata verirse hak yanmasın)
      await etiketPdfIndir(satirlar);
      const supabase = createClient();
      const { error } = await supabase.rpc("consume_quota", {
        p_tool: "label_csv",
        p_limit: 1,
      });
      if (error) console.error("Kota güncellenemedi:", error.message);
      track("tool_used", { tool: "label_csv", count: satirlar.length });
      setDurum("kilit");
    } catch (e) {
      console.error("Etiket PDF hatası:", e);
      setNot(
        "PDF oluşturulamadı: " +
          (e instanceof Error ? e.message : "bilinmeyen hata"),
      );
      setDurum("idle");
    }
  }

  return (
    <div className="space-y-5">
      {/* Adımlar */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Adim no="1" baslik="Şablonu indir">
          <Button variant="secondary" size="sm" onClick={sablonIndir} className="w-full">
            CSV şablonu indir
          </Button>
        </Adim>
        <Adim no="2" baslik="Doldur">
          <p className="text-xs text-[var(--color-muted)]">
            Excel/Sheets&apos;te aç, ürün adı · fiyat · barkod kolonlarını doldur,
            CSV olarak kaydet.
          </p>
        </Adim>
        <Adim no="3" baslik="Yükle">
          <Button variant="secondary" size="sm" onClick={dosyaSec} className="w-full">
            {user ? "CSV yükle" : "Giriş yap & yükle"}
          </Button>
          <input
            ref={dosyaRef}
            type="file"
            accept=".csv,text/csv"
            onChange={dosyaYukle}
            className="hidden"
          />
        </Adim>
      </div>

      {not && <p className="text-sm text-[var(--color-muted)]">{not}</p>}

      {/* Önizleme */}
      {satirlar.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="mb-2 text-sm font-medium">
            Önizleme ({satirlar.length} etiket)
          </p>
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] text-sm">
            <div className="flex bg-[var(--color-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)]">
              <span className="flex-1">Ürün</span>
              <span className="w-24 text-right">Fiyat</span>
              <span className="w-36 text-right">Barkod</span>
            </div>
            {satirlar.slice(0, 8).map((r, i) => (
              <div key={i} className="flex px-3 py-1.5">
                <span className="flex-1 truncate">{r.product_name}</span>
                <span className="w-24 text-right">{fiyatFormatla(r.price)}</span>
                <span className="w-36 truncate text-right text-[var(--color-muted)]">
                  {r.barcode}
                </span>
              </div>
            ))}
            {satirlar.length > 8 && (
              <div className="px-3 py-1.5 text-center text-xs text-[var(--color-muted)]">
                … ve {satirlar.length - 8} ürün daha
              </div>
            )}
          </div>

          {durum === "kilit" ? (
            <div className="mt-4 rounded-lg bg-[var(--color-surface-2)] p-4 text-sm">
              <p className="font-medium text-[var(--color-text)]">
                Ücretsiz etiket hakkını kullandın 🎉
              </p>
              <p className="mt-1 text-[var(--color-muted)]">
                Sınırsız etiket, ürün kartı, toplu baskı ve ZPL için Labyra Label.
              </p>
              <a
                href="https://labyra.co/urunler/labyra-label"
                target="_blank"
                rel="noopener"
                className="mt-1 inline-block font-medium text-[var(--color-gold-dark)] underline"
              >
                Labyra Label →
              </a>
            </div>
          ) : (
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={uret}
              disabled={durum === "uretiliyor"}
            >
              {durum === "uretiliyor"
                ? "Hazırlanıyor…"
                : `${satirlar.length} etiketi PDF olarak üret (tek seferlik)`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Adim({
  no,
  baslik,
  children,
}: {
  no: string;
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-medium text-[#16281A]">
          {no}
        </span>
        <span className="text-sm font-medium">{baslik}</span>
      </div>
      {children}
    </div>
  );
}
