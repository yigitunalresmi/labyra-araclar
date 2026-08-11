import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `/araclar` altında yalnız tekil araç sayfaları var, dizinin kendisi yok → 404 dönüyordu.
  // Araç listesi zaten kök sayfada; ikinci bir liste sayfası açmak yerine kalıcı olarak
  // oraya yönlendiriyoruz (kopya içerik olmasın). Tekil araçlar tam eşleşme olmadığı için
  // etkilenmez: /araclar/maas-hesaplama vb. çalışmaya devam eder.
  async redirects() {
    return [{ source: "/araclar", destination: "/", permanent: true }];
  },
};

export default nextConfig;
