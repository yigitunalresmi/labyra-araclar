"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Verilen URL için QR kod (PNG data URL) üretir, gösterir ve indirilebilir yapar.
 * qrcode kütüphanesi tarayıcıda çalışır → sunucu maliyeti yok.
 */
export function MenuQrCode({
  url,
  fileName = "qr-menu",
}: {
  url: string;
  fileName?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const png = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#1a1916", light: "#ffffff" },
        });
        if (alive) setDataUrl(png);
      } catch (e) {
        console.error("QR üretilemedi:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [url]);

  function indir() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileName}.png`;
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR kod" width={176} height={176} />
        ) : (
          <div className="size-44 animate-pulse rounded bg-[var(--color-surface-2)]" />
        )}
      </div>
      <Button variant="secondary" size="sm" onClick={indir} disabled={!dataUrl}>
        QR kodu indir (PNG)
      </Button>
    </div>
  );
}
