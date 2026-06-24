import { formatMenuPrice, type MenuData } from "@/lib/tools/menu";

/**
 * Menünün sunum görünümü. Hem builder önizlemesinde hem de public
 * /m/{slug} sayfasında kullanılır → birebir aynı görünür.
 * Müşteriye dönük olduğu için uygulama temasından bağımsız, sabit açık palet.
 */
export function MenuView({
  menu,
  watermark = true,
}: {
  menu: MenuData;
  watermark?: boolean;
}) {
  const accent = menu.business.color || "#c4a882";

  return (
    <div className="mx-auto w-full max-w-md bg-white px-5 py-8 text-neutral-900">
      <header className="text-center">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: accent }}
        >
          {menu.business.name || "Menü"}
        </h1>
        {(menu.business.note || menu.business.phone) && (
          <p className="mt-1.5 text-sm text-neutral-500">
            {[menu.business.note, menu.business.phone]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        )}
        <div
          className="mx-auto mt-4 h-[3px] w-12 rounded-full"
          style={{ background: accent }}
        />
      </header>

      <div className="mt-7 space-y-8">
        {menu.categories.map((cat, ci) => {
          const items = cat.items.filter((it) => it.name.trim());
          if (!items.length && !cat.name.trim()) return null;
          return (
            <section key={ci}>
              {cat.name.trim() && (
                <h2
                  className="mb-3 border-b pb-1.5 text-sm font-semibold uppercase tracking-wide"
                  style={{ color: accent, borderColor: accent + "44" }}
                >
                  {cat.name}
                </h2>
              )}
              <ul className="space-y-3.5">
                {items.map((it, ii) => {
                  const price = formatMenuPrice(it.price);
                  return (
                    <li
                      key={ii}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{it.name}</p>
                        {it.desc && (
                          <p className="mt-0.5 text-sm leading-snug text-neutral-500">
                            {it.desc}
                          </p>
                        )}
                      </div>
                      {price && (
                        <span className="shrink-0 font-medium tabular-nums">
                          {price}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {watermark && (
        <footer className="mt-10 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400">
          <a
            href="https://labyra.co"
            target="_blank"
            rel="noopener"
            className="transition-colors hover:text-neutral-600"
          >
            Powered by <span className="font-medium">Labyra</span>
          </a>
        </footer>
      )}
    </div>
  );
}
