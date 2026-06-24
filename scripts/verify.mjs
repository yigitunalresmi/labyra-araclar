// Test yardımcısı: bir kullanıcının profiles satırını kontrol eder ve auth.users'tan siler.
// Kullanım: PGCONN='postgresql://...' node scripts/verify.mjs <userId>
import pg from "pg";

const userId = process.argv[2];
if (!process.env.PGCONN || !userId) {
  console.error("PGCONN ve userId gerekli.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.PGCONN,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const before = await client.query(
    "select id, email, full_name from public.profiles where id = $1",
    [userId],
  );
  console.log("PROFILE (trigger sonucu):", JSON.stringify(before.rows));

  const del = await client.query("delete from auth.users where id = $1", [userId]);
  console.log("auth.users silindi:", del.rowCount);

  const after = await client.query(
    "select count(*)::int as n from public.profiles where id = $1",
    [userId],
  );
  console.log("PROFILE cascade silindi mi (0 beklenir):", after.rows[0].n);
} catch (e) {
  console.error("HATA:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
