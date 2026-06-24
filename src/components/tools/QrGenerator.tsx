"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  linkPayload,
  wifiPayload,
  phonePayload,
  emailPayload,
  type QrType,
  type WifiEnc,
} from "@/lib/tools/qrcode";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/analytics";

type User = { email?: string } | null;

const RETURN = "/araclar/qr-kod";

const TABS: { key: QrType; ad: string }[] = [
  { key: "link", ad: "Link" },
  { key: "text", ad: "Metin" },
  { key: "wifi", ad: "WiFi" },
  { key: "phone", ad: "Telefon" },
  { key: "email", ad: "E-posta" },
];

const selectClass =
  "h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]";

export function QrGenerator({ user }: { user: User }) {
  const router = useRouter();
  const [tip, setTip] = useState<QrType>("link");
  const [url, setUrl] = useState("");
  const [metin, setMetin] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiSifre, setWifiSifre] = useState("");
  const [wifiTip, setWifiTip] = useState<WifiEnc>("WPA");
  const [tel, setTel] = useState("");
  const [eposta, setEposta] = useState("");

  const [hata, setHata] = useState("");
  const [uretiliyor, setUretiliyor] = useState(false);
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");

  function payloadVeKontrol(): { payload: string; eksik: string } {
    switch (tip) {
      case "link":
        return { payload: linkPayload(url), eksik: "Bir bağlantı (URL) gir." };
      case "text":
        return { payload: metin.trim(), eksik: "QR'a yazılacak metni gir." };
      case "wifi":
        return {
          payload: wifiPayload(ssid, wifiSifre, wifiTip),
          eksik: "Ağ adını (SSID) gir.",
        };
      case "phone":
        return { payload: phonePayload(tel), eksik: "Telefon numarası gir." };
      case "email":
        return { payload: emailPayload(eposta), eksik: "E-posta adresi gir." };
    }
  }

  async function uret() {
    if (!user) {
      router.push(`/giris?return=${RETURN}`);
      return;
    }
    const { payload, eksik } = payloadVeKontrol();
    if (!payload) {
      setHata(eksik);
      setPng("");
      setSvg("");
      return;
    }
    setHata("");
    setUretiliyor(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const renk = { dark: "#1a1916", light: "#ffffff" };
      const pngUrl = await QRCode.toDataURL(payload, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: "M",
        color: renk,
      });
      const svgStr = await QRCode.toString(payload, {
        type: "svg",
        width: 512,
        margin: 2,
        errorCorrectionLevel: "M",
        color: renk,
      });
      setPng(pngUrl);
      setSvg(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`,
      );
      track("tool_used", { tool: "qr_code", type: tip });
    } catch (e) {
      console.error("QR üretilemedi:", e);
      setHata("QR oluşturulamadı, lütfen tekrar dene.");
    } finally {
      setUretiliyor(false);
    }
  }

  function indir(href: string, uzanti: string) {
    if (!href) return;
    const a = document.createElement("a");
    a.href = href;
    a.download = `qr-kod.${uzanti}`;
    a.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* FORM */}
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTip(t.key);
                setHata("");
              }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tip === t.key
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {t.ad}
            </button>
          ))}
        </div>

        {tip === "link" && (
          <Input
            id="qrurl"
            label="Bağlantı (URL)"
            inputMode="url"
            placeholder="labyra.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {tip === "text" && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="qrmetin"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Metin
            </label>
            <textarea
              id="qrmetin"
              rows={3}
              value={metin}
              onChange={(e) => setMetin(e.target.value)}
              placeholder="QR koduna gömülecek metin"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-gold)]"
            />
          </div>
        )}

        {tip === "wifi" && (
          <div className="space-y-3">
            <Input
              id="qrssid"
              label="Ağ adı (SSID)"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="KöşeKafe_WiFi"
            />
            <Input
              id="qrwifipass"
              label="Şifre"
              value={wifiSifre}
              onChange={(e) => setWifiSifre(e.target.value)}
              placeholder="••••••••"
              disabled={wifiTip === "nopass"}
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="qrwifitip"
                className="text-sm font-medium text-[var(--color-text)]"
              >
                Güvenlik
              </label>
              <select
                id="qrwifitip"
                value={wifiTip}
                onChange={(e) => setWifiTip(e.target.value as WifiEnc)}
                className={selectClass}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Şifresiz</option>
              </select>
            </div>
          </div>
        )}

        {tip === "phone" && (
          <Input
            id="qrtel"
            label="Telefon numarası"
            inputMode="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="0536 000 00 00"
          />
        )}

        {tip === "email" && (
          <Input
            id="qreposta"
            label="E-posta adresi"
            type="email"
            inputMode="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            placeholder="info@labyra.co"
          />
        )}

        <Button
          onClick={uret}
          size="lg"
          className="mt-5 w-full"
          disabled={uretiliyor}
        >
          {uretiliyor
            ? "Oluşturuluyor…"
            : user
              ? "QR Kod Oluştur"
              : "Ücretsiz giriş yap & oluştur"}
        </Button>
        {hata && (
          <p className="mt-2 text-sm text-[var(--color-danger)]">{hata}</p>
        )}
        {!user && (
          <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
            QR kodu oluşturmak ve indirmek için ücretsiz hesap gerekir.
          </p>
        )}
      </div>

      {/* SONUÇ */}
      {png ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={png} alt="Oluşturulan QR kod" width={200} height={200} />
            </div>
            <div className="flex w-full gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => indir(png, "png")}
              >
                PNG indir
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => indir(svg, "svg")}
              >
                SVG indir
              </Button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg bg-[var(--color-surface-2)] p-3 text-sm">
              <p className="text-[var(--color-text)]">
                Kafe/restoran için kalıcı, güncellenebilir dijital menü mü lazım?
              </p>
              <a
                href="https://labyra.co/hizmetler/qr-menu"
                target="_blank"
                rel="noopener"
                className="font-medium text-[var(--color-gold-dark)] underline"
              >
                Labyra QR Menü →
              </a>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-2)] p-3 text-sm">
              <p className="text-[var(--color-text)]">
                QR&apos;ı WhatsApp, randevu ya da kampanyaya bağlamak ister
                misin?
              </p>
              <a
                href="https://labyra.co/hizmetler/otomasyon"
                target="_blank"
                rel="noopener"
                className="font-medium text-[var(--color-gold-dark)] underline"
              >
                Labyra Otomasyon →
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] p-5 text-center text-sm text-[var(--color-muted)]">
          Bilgileri gir, QR kodun burada görünsün.
        </div>
      )}
    </div>
  );
}
