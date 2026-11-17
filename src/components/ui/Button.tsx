import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-hairline-strong bg-surface-raised text-ink hover:bg-surface-card",
  ghost: "text-body hover:bg-surface-card hover:text-ink",
  danger: "bg-error text-on-primary hover:brightness-95",
  dark: "bg-surface-dark text-on-dark hover:bg-surface-dark-raised",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}
