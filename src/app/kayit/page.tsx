import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { safeNext } from "@/lib/auth/safeNext";

export default async function KayitPage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string }>;
}) {
  const returnTo = safeNext((await searchParams).return);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <AuthHeading mode="signup" />
          <AuthForm mode="signup" returnTo={returnTo} />
        </div>
      </div>
    </main>
  );
}
