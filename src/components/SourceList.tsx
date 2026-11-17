import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";

import type { SearchSource } from "../api/types";
import { cn } from "../lib/cn";
import { formatPercent } from "../lib/format";

export function SourceList({ sources }: { sources: SearchSource[] }) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-hairline pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        {sources.length} {sources.length === 1 ? "source" : "sources"}
      </button>
      {open && (
        <ol className="mt-3 flex flex-col gap-3 animate-fade-in">
          {sources.map((s, i) => (
            <li
              key={`${s.documentId}-${s.chunkIndex}`}
              className="rounded-md border border-hairline bg-canvas p-3.5"
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="font-mono text-subtle">[{i + 1}]</span>
                <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-ink">
                  <FileText className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{s.fileName}</span>
                </span>
                {s.pageNumber != null && <span>Page {s.pageNumber}</span>}
                <span className="ml-auto inline-flex items-center gap-2">
                  <span className="h-1 w-14 overflow-hidden rounded-full bg-hairline">
                    <span
                      className="block h-full rounded-full bg-teal"
                      style={{ width: formatPercent(Math.max(0, Math.min(1, s.similarity))) }}
                    />
                  </span>
                  {formatPercent(s.similarity)} match
                </span>
              </div>
              <p className="font-bangla text-sm leading-relaxed whitespace-pre-wrap text-body">
                {s.content}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
