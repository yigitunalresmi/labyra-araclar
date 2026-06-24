import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MenuView } from "@/components/tools/MenuView";
import { MenuPdfButton } from "@/components/tools/MenuPdfButton";
import type { MenuData } from "@/lib/tools/menu";

// slug → menü (generateMetadata + page arasında tek sorgu için cache)
const getMenu = cache(async (slug: string): Promise<MenuData | null> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("menus")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();
    return (data?.data as MenuData) ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const menu = await getMenu(slug);
  if (!menu) return { title: "Menü bulunamadı" };
  const name = menu.business.name || "Menü";
  return {
    title: `${name} — Menü`,
    description: `${name} dijital menüsü. Labyra ile oluşturuldu.`,
    robots: { index: false }, // müşteri menüsü arama motoruna gerek yok
  };
}

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = await getMenu(slug);
  if (!menu) notFound();

  return (
    <main className="min-h-screen bg-neutral-100 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
          <MenuView menu={menu} />
        </div>
        <div className="mt-4 flex justify-center">
          <MenuPdfButton
            menu={menu}
            variant="secondary"
            label="Menüyü PDF indir"
          />
        </div>
      </div>
    </main>
  );
}
