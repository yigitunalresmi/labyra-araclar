import { ImageResponse } from "next/og";
import { ROBOTO_REGULAR_B64 } from "@/lib/pdf/roboto";

export const alt = "Labyra Araçlar — Ücretsiz işletme araçları";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// PDF'lerle paylaşılan gömülü Roboto → Türkçe glifler garanti (ağ çağrısı yok)
const robotoData = Buffer.from(ROBOTO_REGULAR_B64, "base64");

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(900px 500px at 78% -8%, rgba(241,180,52,0.18), transparent)",
          fontFamily: "Roboto",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "999px",
              border: "3px solid #f1b434",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#f1b434",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "30px",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#e8e4df" }}>Labyra</span>
            <span style={{ color: "#9a958d" }}>Araçlar</span>
          </div>
        </div>

        {/* Başlık */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "76px",
              lineHeight: 1.05,
              color: "#f5efe3",
              maxWidth: "900px",
            }}
          >
            İşletmen için ücretsiz araçlar
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              color: "#f1b434",
              display: "flex",
            }}
          >
            Etiket PDF · Maaş · KDV · Deneme Net · QR Menü
          </div>
        </div>

        {/* Alt */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            color: "#9a958d",
          }}
        >
          <span>Ücretsiz hesap aç, hemen kullan</span>
          <span style={{ color: "#f1b434" }}>labyra.co</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Roboto", data: robotoData, style: "normal", weight: 400 }],
    },
  );
}
