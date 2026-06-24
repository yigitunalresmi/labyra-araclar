import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth/user";
import { TopBar } from "@/components/shell/TopBar";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/lib/auth/actions";

export default async function HesapPage() {
  const user = await getOptionalUser();
  if (!user) redirect("/giris");

  return (
    <>
      <TopBar userEmail={user.email ?? null} />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-medium text-[var(--color-text)]">Hesabım</h1>
        <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted)]">E-posta</p>
          <p className="text-[var(--color-text)]">{user.email}</p>
        </div>
        <form action={signOutAction} className="mt-6">
          <Button variant="secondary" type="submit">
            Çıkış yap
          </Button>
        </form>
      </main>
    </>
  );
}
