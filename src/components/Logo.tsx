export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" fill="var(--color-gold)" />
        <path
          d="M12 5a7 7 0 1 0 7 7"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5"
          stroke="var(--color-gold-dark)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-medium tracking-tight text-[var(--color-text)]">
        Labyra <span className="text-[var(--color-muted)]">Araçlar</span>
      </span>
    </span>
  );
}
