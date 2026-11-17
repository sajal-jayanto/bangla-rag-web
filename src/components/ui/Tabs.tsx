import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-hairline">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            id={`tab-${item.id}`}
            aria-selected={active}
            aria-controls={`panel-${item.id}`}
            onClick={() => onChange(item.id)}
            className={cn(
              "-mb-px inline-flex h-11 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors",
              active ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
