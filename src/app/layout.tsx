import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { Analytics } from "@/components/shell/Analytics";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";

// latin-ext: Türkçe ş/ğ/ı/İ için ŞART. display swap: FOIT önler.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Labyra Araçlar — Ücretsiz işletme araçları",
  description: SITE_DESC,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "tr_TR",
    url: SITE_URL,
    title: "Labyra Araçlar — Ücretsiz işletme araçları",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "Labyra Araçlar — Ücretsiz işletme araçları",
    description: SITE_DESC,
  },
};

// Paint öncesi tema ayarı (FOUC önler). data-theme'i React yönetmiyor → suppressHydrationWarning.
const themeScript = `(function(){try{var t=localStorage.getItem('labyra-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
