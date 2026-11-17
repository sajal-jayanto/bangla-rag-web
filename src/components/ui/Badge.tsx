import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export type Tone = "neutral" | "coral" | "teal" | "amber" | "error" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-card text-body border-hairline",
  coral: "bg-primary-soft text-primary-hover border-transparent",
  teal: "bg-teal-soft text-teal border-transparent",
  amber: "bg-amber-soft text-amber border-transparent",
  error: "bg-error-soft text-error border-transparent",
  dark: "bg-surface-dark text-on-dark border-transparent",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
