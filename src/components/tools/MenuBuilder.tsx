"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MENU_COLORS,
  cleanMenu,
  demoMenu,
  emptyMenu,
  isMenuPublishable,
  makeSlug,
  type MenuCategory,
  type MenuData,
  type MenuItem,
} from "@/lib/tools/menu";
import { MenuView } from "@/components/tools/MenuView";
import { MenuQrCode } from "@/components/tools/MenuQrCode";
import { MenuPdfButton } from "@/components/tools/MenuPdfButton";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type User = { id: string; email?: string } | null;
const RETURN = "/araclar/qr-menu";

export function MenuBuilder({
  user,
  initial,
}: {
  user: User;
  initial: { slug: string; menu: MenuData } | null;
}) {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuData>(initial?.menu ?? emptyMenu());
  const [slug, setSlug] = useState<string | null>(initial?.slug ?? null);
  const [durum, setDurum] = useState<"idle" | "kaydediliyor">("idle");
  const [not, setNot] = useState<{ tip: "ok" | "hata" | "kilit"; mesaj: string } | null>(
    null,
  );
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const menuUrl = slug ? `${origin}/m/${slug}` : "";
  const yayinlanabilir = useMemo(() => isMenuPublishable(menu), [menu]);

  // ---- immutable güncelleyiciler ----
  function patchBusiness(patch: Partial<MenuData["business"]>) {
    setMenu((m) => ({ ...m, business: { ...m.business, ...patch } }));
  }
  function setCat(ci: number, patch: Partial<MenuCategory>) {
    setMenu((m) => {
      const categories = m.categories.map((c, i) =>
        i === ci ? { ...c, ...patch } : c,
      );
      return { ...m, categories };
    });
  }
  function setItem(ci: number, ii: number, patch: Partial<MenuItem>) {
    setMenu((m) => {
      const categories = m.categories.map((c, i) => {
        if (i !== ci) return c;
        const items = c.items.map((it, j) =>
          j === ii ? { ...it, ...patch } : it,
        );
        return { ...c, items };
      });
      return { ...m, categories };
    });
  }
  function addItem(ci: number) {
    setMenu((m) => {
      const categories = m.categories.map((c, i) =>
        i === ci
          ? { ...c, items: [...c.items, { name: "", desc: "", price: "" }] }
          : c,
      );
      return { ...m, categories };
    });
  }
  function removeItem(ci: number, ii: number) {
    setMenu((m) => {
      const categories = m.categories.map((c, i) => {
        if (i !== ci) return c;
        const items = c.items.filter((_, j) => j !== ii);
        return { ...c, items: items.length ? items : [{ name: "", desc: "", price: "" }] };
      });
      return { ...m, categories };
    });
  }
  function addCategory() {
    setMenu((m) => ({
      ...m,
      categories: [
        ...m.categories,
        { name: "", items: [{ name: "", desc: "", price: "" }] },
      ],
    }));
  }
  function removeCategory(ci: number) {
    setMenu((m) => {
      const categories = m.categories.filter((_, i) => i !== ci);
      return {
        ...m,
        categories: categories.length
          ? categories
          : [{ name: "", items: [{ name: "", desc: "", price: "" }] }],
      };
    });
  }

  // ---- yayınla (ilk kez) ----
  async function yayinla() {
    if (!user) {
      router.push(`/giris?return=${RETURN}`);
      return;
    }
    const cleaned = cleanMenu(menu);
    if (!isMenuPublishable(cleaned)) {
      setNot({ tip: "hata", mesaj: "En az işletme adı ve bir ürün gerekli." });
      return;
    }
    setDurum("kaydediliyor");
    setNot(null);
    try {
      const supabase = createClient();
      // Kota: tek menü (atomik; aynı anda iki sekme yarışını da engeller)
      const { data: ok, error: qErr } = await supabase.rpc("consume_quota", {
        p_tool: "qr_menu",
        p_limit: 1,
      });
      if (qErr) throw qErr;
      if (!ok) {
        setNot({
          tip: "kilit",
          mesaj: "Ücretsiz sürümde tek menü oluşturabilirsin.",
        });
        setDurum("idle");
        return;
      }
      // Benzersiz slug ile ekle; çakışırsa yeni son ekle birkaç kez dene
      let newSlug = makeSlug(cleaned.business.name);
      let eklendi = false;
      for (let deneme = 0; deneme < 5; deneme++) {
        const { error } = await supabase.from("menus").insert({
          user_id: user.id,
          slug: newSlug,
          data: cleaned,
          watermarked: true,
        });
        if (!error) {
          eklendi = true;
          break;
        }
        if (error.code === "23505") {
          newSlug = makeSlug(cleaned.business.name);
          continue;
        }
        throw error;
      }
      if (!eklendi) throw new Error("Menü kaydedilemedi (slug).");
      setMenu(cleaned);
      setSlug(newSlug);
      setNot({ tip: "ok", mesaj: "Menün yayında 🎉" });
      track("tool_used", { tool: "qr_menu" });
      track("menu_published");
    } catch (e) {
      console.error("QR menü yayın hatası:", e);
      setNot({
        tip: "hata",
        mesaj:
          "Yayınlanamadı: " +
          (e instanceof Error ? e.message : "bilinmeyen hata"),
      });
    } finally {
      setDurum("idle");
    }
  }

  // ---- güncelle (mevcut menü) ----
  async function guncelle() {
    if (!slug) return;
    const cleaned = cleanMenu(menu);
    if (!isMenuPublishable(cleaned)) {
      setNot({ tip: "hata", mesaj: "En az işletme adı ve bir ürün gerekli." });
      return;
    }
    setDurum("kaydediliyor");
    setNot(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("menus")
        .update({ data: cleaned })
        .eq("slug", slug);
      if (error) throw error;
      setMenu(cleaned);
      setNot({ tip: "ok", mesaj: "Menü güncellendi ✓" });
    } catch (e) {
      console.error("QR menü güncelleme hatası:", e);
      setNot({
        tip: "hata",
        mesaj:
          "Güncellenemedi: " +
          (e instanceof Error ? e.message : "bilinmeyen hata"),
      });
    } finally {
      setDurum("idle");
    }
  }

  async function kopyala() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setNot({ tip: "ok", mesaj: "Bağlantı kopyalandı ✓" });
    } catch {
      setNot({ tip: "hata", mesaj: "Kopyalanamadı." });
    }
  }

  const inputBase =
    "h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-gold)]";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,360px)]">
      {/* ============ EDİTÖR ============ */}
      <div className="space-y-6">
        {/* İşletme */}
        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              İşletme bilgisi
            </h2>
            {!slug && (
              <button
                type="button"
                onClick={() => setMenu(demoMenu())}
                className="text-xs font-medium text-[var(--color-gold-dark)] hover:underline"
              >
                Örnek doldur
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                İşletme adı *
              </label>
              <input
                className={inputBase}
                value={menu.business.name}
                onChange={(e) => patchBusiness({ name: e.target.value })}
                placeholder="örn. KÖZ Kahve"
                maxLength={60}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                  Telefon (opsiyonel)
                </label>
                <input
                  className={inputBase}
                  value={menu.business.phone ?? ""}
                  onChange={(e) => patchBusiness({ phone: e.target.value })}
                  placeholder="0536 000 00 00"
                  maxLength={30}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                  Not (saat / adres)
                </label>
                <input
                  className={inputBase}
                  value={menu.business.note ?? ""}
                  onChange={(e) => patchBusiness({ note: e.target.value })}
                  placeholder="Her gün 08:00 – 23:00"
                  maxLength={60}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                Vurgu rengi
              </label>
              <div className="flex flex-wrap gap-2">
                {MENU_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`renk ${c}`}
                    onClick={() => patchBusiness({ color: c })}
                    className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      menu.business.color === c
                        ? "border-[var(--color-text)]"
                        : "border-transparent"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kategoriler */}
        <div className="space-y-4">
          {menu.categories.map((cat, ci) => (
            <section
              key={ci}
              className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <input
                  className={`${inputBase} font-medium`}
                  value={cat.name}
                  onChange={(e) => setCat(ci, { name: e.target.value })}
                  placeholder={`Kategori adı (örn. Sıcak İçecekler)`}
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={() => removeCategory(ci)}
                  className="shrink-0 rounded-lg px-2 py-2 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger)]"
                  title="Kategoriyi sil"
                >
                  Sil
                </button>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((it, ii) => (
                  <div
                    key={ii}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5"
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1">
                        <input
                          className={inputBase}
                          value={it.name}
                          onChange={(e) =>
                            setItem(ci, ii, { name: e.target.value })
                          }
                          placeholder="Ürün adı"
                          maxLength={60}
                        />
                      </div>
                      <div className="w-24 shrink-0">
                        <input
                          className={`${inputBase} text-right`}
                          value={it.price}
                          onChange={(e) =>
                            setItem(ci, ii, { price: e.target.value })
                          }
                          placeholder="Fiyat"
                          maxLength={12}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(ci, ii)}
                        className="shrink-0 rounded-lg px-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)]"
                        title="Ürünü sil"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      className={`${inputBase} mt-2`}
                      value={it.desc ?? ""}
                      onChange={(e) => setItem(ci, ii, { desc: e.target.value })}
                      placeholder="Açıklama (opsiyonel)"
                      maxLength={90}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addItem(ci)}
                className="mt-3 text-sm font-medium text-[var(--color-gold-dark)] hover:underline"
              >
                + Ürün ekle
              </button>
            </section>
          ))}

          <Button variant="secondary" onClick={addCategory} className="w-full">
            + Kategori ekle
          </Button>
        </div>

        {/* Durum mesajı */}
        {not && (
          <p
            className={`text-sm ${
              not.tip === "hata"
                ? "text-[var(--color-danger)]"
                : not.tip === "kilit"
                  ? "text-[var(--color-gold-dark)]"
                  : "text-[var(--color-muted)]"
            }`}
          >
            {not.mesaj}
          </p>
        )}

        {/* Yayınla / Güncelle */}
        <Button
          size="lg"
          className="w-full"
          onClick={slug ? guncelle : yayinla}
          disabled={durum === "kaydediliyor" || (!yayinlanabilir && !slug)}
        >
          {durum === "kaydediliyor"
            ? "Kaydediliyor…"
            : !user
              ? "Giriş yap & yayınla"
              : slug
                ? "Menüyü güncelle"
                : "Menüyü yayınla"}
        </Button>
      </div>

      {/* ============ ÖNİZLEME / SONUÇ ============ */}
      <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        {/* Telefon çerçevesi içinde canlı önizleme */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Canlı önizleme
          </p>
          <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[2rem] border-[6px] border-[var(--color-text)] bg-white shadow-lg">
            <div className="max-h-[520px] overflow-y-auto">
              <MenuView menu={menu} />
            </div>
          </div>
        </div>

        {/* Yayınlandıysa QR + bağlantı + PDF + funnel */}
        {slug && (
          <div className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Menün yayında
            </p>

            {menuUrl && <MenuQrCode url={menuUrl} fileName={`${slug}-qr`} />}

            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
              <a
                href={`/m/${slug}`}
                target="_blank"
                rel="noopener"
                className="min-w-0 flex-1 truncate text-sm text-[var(--color-gold-dark)] hover:underline"
              >
                {origin.replace(/^https?:\/\//, "")}/m/{slug}
              </a>
              <button
                type="button"
                onClick={kopyala}
                className="shrink-0 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Kopyala
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MenuPdfButton menu={menu} className="w-full" />
              <a href={`/m/${slug}`} target="_blank" rel="noopener">
                <Button variant="secondary" className="w-full">
                  Sayfayı aç
                </Button>
              </a>
            </div>

            <div className="rounded-lg bg-[var(--color-surface-2)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
              Markana özel alan adı, sınırsız güncelleme, görüntülenme analitiği
              ve çoklu menü için{" "}
              <a
                href="https://labyra.co"
                target="_blank"
                rel="noopener"
                className="font-medium text-[var(--color-gold-dark)] underline"
              >
                QR Menü hizmeti
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
