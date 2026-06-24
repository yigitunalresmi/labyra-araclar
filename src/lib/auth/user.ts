import { createClient } from "@/lib/supabase/server";

/**
 * Mevcut kullanıcıyı döndürür; Supabase erişilemezse veya oturum yoksa null.
 * Public sayfalarda güvenle kullanılır (çökmez).
 */
export async function getOptionalUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
