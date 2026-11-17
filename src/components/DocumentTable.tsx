import { ChevronDown, FileImage, FileText } from "lucide-react";
import { Fragment, useState } from "react";

import type { DocumentMetadata } from "../api/types";
import { cn } from "../lib/cn";
import { formatBytes, formatDuration } from "../lib/format";
import { Badge } from "./ui/Badge";

const PDF_LABELS: Record<string, string> = {
  title: "Title",
  subject: "Subject",
  author: "Author",
  creator: "Creator",
  producer: "Producer",
  creationDate: "Created",
  modDate: "Modified",
  pageSize: "Page size",
  pdfVersion: "PDF version",
  encrypted: "Encrypted",
};

function pages(d: DocumentMetadata) {
  if (d.pagesProcessed == null) return "—";
  if (d.pageCount != null && d.pageCount !== d.pagesProcessed)
    return `${d.pagesProcessed} / ${d.pageCount}`;
  return String(d.pagesProcessed);
}

function Details({ doc }: { doc: DocumentMetadata }) {
  const info = Object.entries(doc.pdfInfo ?? {}).filter(([, v]) => v);
  return (
    <div className="grid gap-4 px-4 py-4 text-sm sm:grid-cols-2">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <dt className="text-muted">SHA-256</dt>
        <dd className="font-mono text-xs break-all text-ink">{doc.sha256}</dd>
        <dt className="text-muted">Type</dt>
        <dd>{doc.mimeType}</dd>
        <dt className="text-muted">Characters</dt>
        <dd>{doc.textLength?.toLocaleString() ?? "—"}</dd>
        <dt className="text-muted">Embedding</dt>
        <dd className="font-mono text-xs">{doc.embeddingModel ?? "—"}</dd>
        {doc.ocrError && (
          <>
            <dt className="text-error">Error</dt>
            <dd className="text-error">{doc.ocrError}</dd>
          </>
        )}
      </dl>
      {info.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          {info.map(([k, v]) => (
            <Fragment key={k}>
              <dt className="text-muted">{PDF_LABELS[k] ?? k}</dt>
              <dd className="break-words">{v}</dd>
            </Fragment>
          ))}
        </dl>
      )}
    </div>
  );
}

export function DocumentTable({ documents }: { documents: DocumentMetadata[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-surface-raised">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-hairline bg-surface-card/60 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">File</th>
            <th className="px-4 py-3 font-medium">Size</th>
            <th className="px-4 py-3 font-medium">Pages</th>
            <th className="px-4 py-3 font-medium">Chunks</th>
            <th className="px-4 py-3 font-medium">OCR</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="w-10 px-2 py-3">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => {
            const open = openId === d.id;
            return (
              <Fragment key={d.id}>
                <tr
                  className={cn(
                    "cursor-pointer border-b border-hairline last:border-0 hover:bg-surface-card/40",
                    open && "bg-surface-card/40",
                  )}
                  onClick={() => setOpenId(open ? null : d.id)}
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      {d.kind === "pdf" ? (
                        <FileText className="size-4 shrink-0 text-primary" />
                      ) : (
                        <FileImage className="size-4 shrink-0 text-teal" />
                      )}
                      <span className="max-w-72 truncate font-medium text-ink" title={d.fileName}>
                        {d.fileName}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {formatBytes(d.sizeBytes)}
                  </td>
                  <td className="px-4 py-3 text-muted">{pages(d)}</td>
                  <td className="px-4 py-3 text-muted">{d.chunkCount ?? "—"}</td>
                  <td className="px-4 py-3">
                    {d.ocrStatus === "completed" ? (
                      <Badge tone="teal">Completed</Badge>
                    ) : (
                      <Badge tone="error">Failed</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {formatDuration(d.ocrDurationMs)}
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-label={open ? "Hide details" : "Show details"}
                      className="cursor-pointer rounded p-1 text-muted hover:text-ink"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(open ? null : d.id);
                      }}
                    >
                      <ChevronDown
                        className={cn("size-4 transition-transform", open && "rotate-180")}
                      />
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr className="border-b border-hairline bg-surface-card/30 last:border-0">
                    <td colSpan={7}>
                      <Details doc={d} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
