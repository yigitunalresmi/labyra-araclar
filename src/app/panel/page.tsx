import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/shell/TopBar";
import { ToolsShowcase } from "@/components/shell/ToolsShowcase";
import {
  PanelHistory,
  type MenuRow,
  type UsageRow,
} from "@/components/shell/PanelHistory";
import { PanelIntro } from "@/components/shell/PanelIntro";

export default async function PanelPage() {
  const user = await getOptionalUser();
  if (!user) redirect("/giris");

  // Geçmiş: yayınlanan menü + kota tüketen araçların kullanımı
  let menu: MenuRow = null;
  let usage: UsageRow[] = [];
  try {
    const supabase = await createClient();
    const [menuRes, usageRes] = await Promise.all([
      supabase
        .from("menus")
        .select("slug, data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("tool_usage")
        .select("tool_key, count, last_used_at")
        .eq("user_id", user.id),
    ]);
    menu = (menuRes.data as MenuRow) ?? null;
    usage = (usageRes.data as UsageRow[]) ?? [];
  } catch {
    // sessizce yoksay — geçmiş gizlenir, araçlar yine görünür
  }

  return (
    <>
      <TopBar userEmail={user.email ?? null} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <PanelIntro />

        <div className="mt-8">
          <PanelHistory menu={menu} usage={usage} />
          <ToolsShowcase />
        </div>
      </main>
    </>
  );
}
