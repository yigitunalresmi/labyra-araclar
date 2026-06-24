// Tek seferlik migration uygulayıcı.
// Kullanım: PGCONN='postgresql://...' node scripts/migrate.mjs <sql-dosyası>
// Connection string ASLA bu dosyada/git'te tutulmaz; yalnızca PGCONN env değişkeninden okunur.
import { readFileSync } from "node:fs";
import pg from "pg";

const sqlPath = process.argv[2];
if (!process.env.PGCONN) {
  console.error("PGCONN env değişkeni gerekli.");
  process.exit(1);
}
if (!sqlPath) {
  console.error("SQL dosya yolu gerekli.");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = new pg.Client({
  connectionString: process.env.PGCONN,
  // Supabase pooler TLS gerektirir
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);

  const tables = await client.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name",
  );
  const fns = await client.query(
    "select proname from pg_proc where proname in ('consume_quota','handle_new_user')",
  );
  const trig = await client.query(
    "select tgname from pg_trigger where tgname='on_auth_user_created'",
  );

  console.log("✓ Tablolar:", tables.rows.map((r) => r.table_name).join(", "));
  console.log("✓ Fonksiyonlar:", fns.rows.map((r) => r.proname).join(", "));
  console.log("✓ Trigger:", trig.rows.map((r) => r.tgname).join(", ") || "YOK");
  console.log("MIGRATION OK");
} catch (e) {
  console.error("MIGRATION HATASI:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
