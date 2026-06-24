import { type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
};

export function Card({ as: Tag = "div", className = "", ...props }: Props) {
  return (
    <Tag
      className={`rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
      {...props}
    />
  );
}
