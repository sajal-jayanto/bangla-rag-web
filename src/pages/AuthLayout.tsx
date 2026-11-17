import type { ReactNode } from "react";

import { Wordmark } from "../components/Wordmark";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Wordmark />
      </div>
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-raised p-6 shadow-card sm:p-8">
        <h1 className="text-headline">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
      <p className="mt-6 text-sm text-muted">{footer}</p>
    </div>
  );
}
