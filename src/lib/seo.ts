import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TOOLS, type Tool } from "@/lib/tools";

const ORG = {
  "@type": "Organization",
  name: "Labyra",
  url: "https://labyra.co",
};

// Ana sayfa: site + organizasyon + araç listesi (sitelinks'e yardımcı)
export function homeJsonLd() {
  return [
    { "@context": "https://schema.org", ...ORG },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "tr-TR",
      publisher: ORG,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Labyra ücretsiz araçları",
      itemListElement: TOOLS.filter((t) => t.status === "active").map(
        (t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name.tr,
          url: `${SITE_URL}/araclar/${t.slug}`,
        }),
      ),
    },
  ];
}

// Araç sayfası: ücretsiz web uygulaması + ekmek kırıntısı
export function toolJsonLd(tool: Tool) {
  const url = `${SITE_URL}/araclar/${tool.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name.tr,
      description: tool.desc.tr,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url,
      inLanguage: "tr-TR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      provider: ORG,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Araçlar", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: tool.name.tr, item: url },
      ],
    },
  ];
}
