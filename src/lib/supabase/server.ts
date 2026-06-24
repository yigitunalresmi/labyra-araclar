import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Sunucu (Server Component / Server Action / Route Handler) tarafı Supabase istemcisi.
 * Next.js 16: cookies() artık async.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component içinden çağrıldı; oturum yenilemesini proxy üstlenir.
            // Bu durumda yok sayılabilir.
          }
        },
      },
    },
  );
}
