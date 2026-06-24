"use client";

import { useState } from "react";
import type { MenuData } from "@/lib/tools/menu";
import { Button } from "@/components/ui/Button";

/**
 * Menü verisinden tarayıcıda basılabilir PDF üretir.
 * Hem builder sonucunda hem de public /m/{slug} sayfasında kullanılır.
 */
export function MenuPdfButton({
  menu,
  className = "",
  variant = "secondary",
  label = "PDF indir",
}: {
  menu: MenuData;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function indir() {
    setBusy(true);
    try {
      const { menuPdfIndir } = await import("@/lib/pdf/menuPdf");
      await menuPdfIndir(menu);
    } catch (e) {
      console.error("Menü PDF hatası:", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant={variant}
      onClick={indir}
      disabled={busy}
      className={className}
    >
      {busy ? "Hazırlanıyor…" : label}
    </Button>
  );
}
