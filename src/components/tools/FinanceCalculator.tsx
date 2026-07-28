"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  kdvHesapla,
  marjHesapla,
  vadeFarki,
  gecikmeZammi,
  temerrutFaizi,
} from "@/lib/tools/finance";
import { FINANS_2026 as P } from "@/lib/params/finans-2026";
import { finansPdfIndir } from "@/lib/pdf/financePdf";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/analytics";

const fmt = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
const parse = (s: string) =>
  parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;

type User = { email?: string } | null;
type Tab = "kdv" | "marj" | "vade" | "faiz";

const TABS: { key: Tab; ad: string }[] = [
  { key: "kdv", ad: "KDV" },
  { key: "marj", ad: "Kâr Marjı" },
  { key: "vade", ad: "Vade Farkı" },
  { key: "faiz", ad: "Faiz" },
];

export function FinanceCalculator({ user }: { user: User }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("kdv");

  const gate = (fn: () => void) => {
    fn();
    track("tool_used", { tool: "finance", tab });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-muted)]"
            }`}
          >
            {t.ad}
          </button>
        ))}
      </div>

      {tab === "kdv" && <KdvForm user={user} gate={gate} />}
      {tab === "marj" && <MarjForm user={user} gate={gate} />}
      {tab === "vade" && <VadeForm user={user} gate={gate} />}
      {tab === "faiz" && <FaizForm user={user} gate={gate} />}
    </div>
  );
}

// ── Ortak parçalar ──────────────────────────────────
function Kutu({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {children}
    </div>
  );
}
function Satir({ l, v, vurgu }: { l: string; v: string; vurgu?: boolean }) {
  return (
    <div
      className={`flex justify-between ${vurgu ? "border-t border-[var(--color-border)] pt-2 text-base font-medium" : "text-sm"}`}
    >
      <span className={vurgu ? "" : "text-[var(--color-muted)]"}>{l}</span>
      <span className={vurgu ? "text-[var(--color-gold-dark)]" : ""}>{v}</span>
    </div>
  );
}
function HesaplaBtn({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <Button onClick={onClick} size="lg" className="mt-4 w-full">
      Hesapla
    </Button>
  );
}
function PdfBtn({ onClick }: { onClick: () => void }) {
  const [yuk, setYuk] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <>
      <Button
        variant="secondary"
        className="mt-3 w-full"
        disabled={yuk}
        onClick={async () => {
          setYuk(true);
          setErr(false);
          try {
            await onClick();
          } catch (e) {
            console.error("PDF hatası:", e);
            setErr(true);
          } finally {
            setYuk(false);
          }
        }}
      >
        {yuk ? "Hazırlanıyor…" : "PDF indir"}
      </Button>
      {err && (
        <p className="mt-2 text-xs text-[var(--color-danger)]">
          PDF oluşturulamadı, tekrar dene.
        </p>
      )}
    </>
  );
}

// ── KDV ─────────────────────────────────────────────
function KdvForm({ user, gate }: { user: User; gate: (f: () => void) => void }) {
  const [tutar, setTutar] = useState("1000");
  const [oran, setOran] = useState(0.2);
  const [dahil, setDahil] = useState(false);
  const [s, setS] = useState<ReturnType<typeof kdvHesapla> | null>(null);
  const [hata, setHata] = useState("");

  return (
    <Kutu>
      <Input
        id="kdvtutar"
        label={dahil ? "KDV dahil tutar (₺)" : "Matrah / KDV hariç tutar (₺)"}
        inputMode="decimal"
        value={tutar}
        onChange={(e) => setTutar(e.target.value)}
      />
      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium">Oran</label>
          <select
            value={oran}
            onChange={(e) => setOran(Number(e.target.value))}
            className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {P.kdvOranlari.map((o) => (
              <option key={o} value={o}>
                %{o * 100}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-end gap-2 pb-3 text-sm">
          <input
            type="checkbox"
            checked={dahil}
            onChange={(e) => setDahil(e.target.checked)}
            className="size-4 accent-[var(--color-gold-dark)]"
          />
          Tutar KDV dahil
        </label>
      </div>

      <HesaplaBtn
        user={user}
        onClick={() =>
          gate(() => {
            if (parse(tutar) <= 0) {
              setHata("Geçerli bir tutar gir.");
              setS(null);
              return;
            }
            setHata("");
            setS(kdvHesapla(parse(tutar), oran, dahil));
          })
        }
      />

      {hata && <p className="mt-3 text-sm text-[var(--color-danger)]">{hata}</p>}

      {s && (
        <div className="mt-4 space-y-2">
          <Satir l="Matrah" v={fmt(s.matrah) + " ₺"} />
          <Satir l={`KDV (%${oran * 100})`} v={fmt(s.kdv) + " ₺"} />
          <Satir l="Genel toplam" v={fmt(s.toplam) + " ₺"} vurgu />
          <PdfBtn
            onClick={() =>
              finansPdfIndir("KDV Hesabı", [
                ["Matrah", fmt(s.matrah) + " TL"],
                [`KDV (%${oran * 100})`, fmt(s.kdv) + " TL"],
                ["Genel toplam", fmt(s.toplam) + " TL"],
              ])
            }
          />
        </div>
      )}
    </Kutu>
  );
}

// ── Kâr marjı ───────────────────────────────────────
function MarjForm({ user, gate }: { user: User; gate: (f: () => void) => void }) {
  const [maliyet, setMaliyet] = useState("100");
  const [mod, setMod] = useState<"marj" | "satis">("marj");
  const [deger, setDeger] = useState("30");
  const [s, setS] = useState<ReturnType<typeof marjHesapla> | null>(null);
  const [hata, setHata] = useState("");

  return (
    <Kutu>
      <Input
        id="maliyet"
        label="Maliyet (₺)"
        inputMode="decimal"
        value={maliyet}
        onChange={(e) => setMaliyet(e.target.value)}
      />
      <div className="mt-4 flex gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
        {(["marj", "satis"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMod(m)}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${mod === m ? "bg-[var(--color-surface)] shadow-sm" : "text-[var(--color-muted)]"}`}
          >
            {m === "marj" ? "Marj % gir" : "Satış fiyatı gir"}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Input
          id="marjdeger"
          label={mod === "marj" ? "Kâr marjı (%, satış üzerinden)" : "Satış fiyatı (₺)"}
          inputMode="decimal"
          value={deger}
          onChange={(e) => setDeger(e.target.value)}
        />
      </div>

      <HesaplaBtn
        user={user}
        onClick={() =>
          gate(() => {
            const m = parse(maliyet);
            const d = parse(deger);
            if (m <= 0) {
              setHata("Maliyet 0'dan büyük olmalı.");
              setS(null);
              return;
            }
            if (mod === "marj" && d >= 100) {
              setHata("Marj %100'den küçük olmalı (satış üzerinden hesaplanır).");
              setS(null);
              return;
            }
            if (mod === "satis" && d <= 0) {
              setHata("Satış fiyatı 0'dan büyük olmalı.");
              setS(null);
              return;
            }
            setHata("");
            setS(
              marjHesapla(m, mod === "marj" ? { marjYuzde: d } : { satis: d }),
            );
          })
        }
      />

      {hata && <p className="mt-3 text-sm text-[var(--color-danger)]">{hata}</p>}

      {s && (
        <div className="mt-4 space-y-2">
          <Satir l="Satış fiyatı" v={fmt(s.satis) + " ₺"} />
          <Satir l="Kâr" v={fmt(s.kar) + " ₺"} />
          <Satir l="Marj (satış üzerinden)" v={"%" + fmt(s.marjYuzde)} />
          <Satir l="Markup (maliyet üzerinden)" v={"%" + fmt(s.markupYuzde)} vurgu />
          <PdfBtn
            onClick={() =>
              finansPdfIndir("Kar Marji Hesabi", [
                ["Maliyet", fmt(s.maliyet) + " TL"],
                ["Satış fiyatı", fmt(s.satis) + " TL"],
                ["Kâr", fmt(s.kar) + " TL"],
                ["Marj / Markup", `%${fmt(s.marjYuzde)} / %${fmt(s.markupYuzde)}`],
              ])
            }
          />
        </div>
      )}
    </Kutu>
  );
}

// ── Vade farkı ──────────────────────────────────────
function VadeForm({ user, gate }: { user: User; gate: (f: () => void) => void }) {
  const [anapara, setAnapara] = useState("10000");
  const [oran, setOran] = useState(String(P.tcmbAvans * 100));
  const [gun, setGun] = useState("30");
  const [kdvEkle, setKdvEkle] = useState(false);
  const [s, setS] = useState<ReturnType<typeof vadeFarki> | null>(null);
  const [hata, setHata] = useState("");

  return (
    <Kutu>
      <Input id="anapara" label="Anapara (₺)" inputMode="decimal" value={anapara} onChange={(e) => setAnapara(e.target.value)} />
      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <Input id="voran" label="Yıllık oran (%)" inputMode="decimal" value={oran} onChange={(e) => setOran(e.target.value)} />
        </div>
        <div className="flex-1">
          <Input id="vgun" label="Gün" inputMode="numeric" value={gun} onChange={(e) => setGun(e.target.value)} />
        </div>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={kdvEkle} onChange={(e) => setKdvEkle(e.target.checked)} className="size-4 accent-[var(--color-gold-dark)]" />
        Vade farkına %20 KDV ekle
      </label>
      <p className="mt-1 text-xs text-[var(--color-muted)]">Oran boşsa TCMB avans (%{P.tcmbAvans * 100}) referans alınabilir.</p>

      <HesaplaBtn
        user={user}
        onClick={() =>
          gate(() => {
            if (parse(anapara) <= 0) {
              setHata("Anapara 0'dan büyük olmalı.");
              setS(null);
              return;
            }
            if (parse(gun) <= 0) {
              setHata("Gün sayısı 0'dan büyük olmalı.");
              setS(null);
              return;
            }
            setHata("");
            setS(
              vadeFarki(
                parse(anapara),
                parse(oran) / 100,
                parse(gun),
                kdvEkle ? 0.2 : 0,
              ),
            );
          })
        }
      />

      {hata && <p className="mt-3 text-sm text-[var(--color-danger)]">{hata}</p>}

      {s && (
        <div className="mt-4 space-y-2">
          <Satir l="Vade farkı" v={fmt(s.fark) + " ₺"} />
          {kdvEkle && <Satir l="KDV (%20)" v={fmt(s.kdv) + " ₺"} />}
          <Satir l="Toplam" v={fmt(s.toplam) + " ₺"} vurgu />
          <PdfBtn
            onClick={() =>
              finansPdfIndir("Vade Farki Hesabi", [
                ["Vade farkı", fmt(s.fark) + " TL"],
                ...(kdvEkle ? ([["KDV (%20)", fmt(s.kdv) + " TL"]] as [string, string][]) : []),
                ["Toplam", fmt(s.toplam) + " TL"],
              ])
            }
          />
        </div>
      )}
    </Kutu>
  );
}

// ── Faiz ────────────────────────────────────────────
const FAIZ_TIP: { key: "gecikme" | "yasal" | "ticari3095" | "ttk1530"; ad: string }[] = [
  { key: "gecikme", ad: "Gecikme zammı (aylık %3,70)" },
  { key: "yasal", ad: "Yasal faiz (%24/yıl)" },
  { key: "ticari3095", ad: "Ticari temerrüt 3095 (%49,25/yıl)" },
  { key: "ttk1530", ad: "TTK 1530 geç ödeme (%43/yıl)" },
];

function FaizForm({ user, gate }: { user: User; gate: (f: () => void) => void }) {
  const [tutar, setTutar] = useState("10000");
  const [gun, setGun] = useState("60");
  const [tip, setTip] = useState<(typeof FAIZ_TIP)[number]["key"]>("gecikme");
  const [s, setS] = useState<{ faiz: number; toplam: number; ek?: string } | null>(null);
  const [hata, setHata] = useState("");

  function hesapla() {
    const t = parse(tutar);
    const g = parse(gun);
    if (t <= 0) {
      setHata("Tutar 0'dan büyük olmalı.");
      setS(null);
      return;
    }
    if (g <= 0) {
      setHata("Gecikme günü 0'dan büyük olmalı.");
      setS(null);
      return;
    }
    setHata("");
    if (tip === "gecikme") {
      const r = gecikmeZammi(t, g);
      setS({ faiz: r.faiz, toplam: r.toplam, ek: `${r.ay} ay (her başlayan ay tam sayılır)` });
    } else {
      const r = temerrutFaizi(t, g, tip);
      setS({ faiz: r.faiz, toplam: r.toplam });
    }
  }

  return (
    <Kutu>
      <Input id="ftutar" label="Tutar (₺)" inputMode="decimal" value={tutar} onChange={(e) => setTutar(e.target.value)} />
      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <Input id="fgun" label="Gecikme (gün)" inputMode="numeric" value={gun} onChange={(e) => setGun(e.target.value)} />
        </div>
        <div className="flex-[2]">
          <label className="text-sm font-medium">Faiz türü</label>
          <select
            value={tip}
            onChange={(e) => setTip(e.target.value as typeof tip)}
            className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {FAIZ_TIP.map((f) => (
              <option key={f.key} value={f.key}>
                {f.ad}
              </option>
            ))}
          </select>
        </div>
      </div>

      <HesaplaBtn user={user} onClick={() => gate(hesapla)} />

      {hata && <p className="mt-3 text-sm text-[var(--color-danger)]">{hata}</p>}

      {s && (
        <div className="mt-4 space-y-2">
          <Satir l="Faiz" v={fmt(s.faiz) + " ₺"} />
          {s.ek && <p className="text-xs text-[var(--color-muted)]">{s.ek}</p>}
          <Satir l="Toplam (anapara + faiz)" v={fmt(s.toplam) + " ₺"} vurgu />
          <PdfBtn
            onClick={() =>
              finansPdfIndir(
                "Faiz Hesabi",
                [
                  ["Faiz", fmt(s.faiz) + " TL"],
                  ["Toplam", fmt(s.toplam) + " TL"],
                ],
                FAIZ_TIP.find((f) => f.key === tip)?.ad,
              )
            }
          />
        </div>
      )}
    </Kutu>
  );
}
