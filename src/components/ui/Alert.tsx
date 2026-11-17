import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

type Kind = "error" | "warning" | "success" | "info";

const styles: Record<Kind, string> = {
  error: "bg-error-soft text-error",
  warning: "bg-amber-soft text-amber",
  success: "bg-teal-soft text-teal",
  info: "bg-surface-card text-body",
};

const icons: Record<Kind, ReactNode> = {
  error: <AlertTriangle className="size-4" />,
  warning: <AlertTriangle className="size-4" />,
  success: <CheckCircle2 className="size-4" />,
  info: <Info className="size-4" />,
};

export function Alert({
  kind = "error",
  children,
  className,
}: {
  kind?: Kind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-md px-3.5 py-3 text-sm",
        styles[kind],
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[kind]}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
