import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { ToolsShowcase } from "@/components/shell/ToolsShowcase";
import { HomeHero } from "@/components/shell/HomeHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeJsonLd } from "@/lib/seo";

export default async function Home() {
  const user = await getOptionalUser();
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <TopBar userEmail={user?.email ?? null} />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <HomeHero isLoggedIn={!!user} />
        <section className="mt-14">
          <ToolsShowcase />
        </section>
      </main>
    </>
  );
}
