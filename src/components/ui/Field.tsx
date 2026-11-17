import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../../lib/cn";

const control =
  "w-full rounded-md border border-hairline-strong bg-surface-raised px-3 text-ink placeholder:text-subtle transition-shadow outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 disabled:opacity-60 aria-invalid:border-error aria-invalid:ring-error/15";

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  id: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ label, hint, error, id, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface Common {
  label: string;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...rest
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={wrapperClassName}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(control, "h-11", className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function Textarea({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  ...rest
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={wrapperClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(control, "min-h-24 py-2.5 leading-relaxed", className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  children,
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} id={id} className={wrapperClassName}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(control, "h-11 cursor-pointer", className)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}
