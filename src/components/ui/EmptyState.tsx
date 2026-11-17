import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-hairline-strong bg-surface-card/50 px-6 py-14 text-center">
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <h3 className="text-title">{title}</h3>
      {children && <div className="mt-2 max-w-md text-muted">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
