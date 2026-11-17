import { FileUp, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";

import { cn } from "../lib/cn";
import { ACCEPT_ATTR, formatDuration, validateUpload } from "../lib/format";
import { useDocumentStore } from "../stores/documentStore";
import { Alert } from "./ui/Alert";
import { Spinner } from "./ui/Spinner";

function useElapsed(startedAt: number | undefined, running: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, [running]);
  return startedAt ? Math.max(0, now - startedAt) : 0;
}

export function UploadZone({ projectId }: { projectId: string }) {
  const upload = useDocumentStore((s) => s.uploads[projectId]);
  const start = useDocumentStore((s) => s.upload);
  const clear = useDocumentStore((s) => s.clearUpload);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const busy = upload?.phase === "uploading" || upload?.phase === "ocr";
  const elapsed = useElapsed(upload?.startedAt, busy);

  const pick = (file: File | undefined) => {
    if (!file || busy) return;
    const problem = validateUpload(file);
    setLocalError(problem);
    if (problem) return;
    void start(projectId, file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-primary bg-primary-soft/50"
            : "border-hairline-strong bg-surface-card/50",
          busy && "opacity-90",
        )}
      >
        {busy && upload ? (
          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            <Spinner className="text-primary" />
            <p className="font-medium break-all text-ink">{upload.fileName}</p>
            {upload.phase === "uploading" ? (
              <>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${Math.round(upload.progress * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted">
                  Uploading… {Math.round(upload.progress * 100)}%
                </p>
              </>
            ) : (
              <>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
                </div>
                <p className="text-sm text-muted">
                  Running OCR and building embeddings… {formatDuration(elapsed)}
                  <br />
                  <span className="text-xs text-subtle">
                    Scanned PDFs can take a minute or more. Keep this tab open.
                  </span>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <FileUp className="mb-3 size-8 text-primary" />
            <p className="font-medium text-ink">Drop a PDF or image here</p>
            <p className="mt-1 text-sm text-muted">
              PDF, PNG or JPG · up to 5 MB · first 20 pages are read
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
            >
              Choose file
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {localError && <Alert>{localError}</Alert>}
      {upload?.phase === "error" && (
        <Alert>
          <span className="font-medium">{upload.fileName}:</span> {upload.error}
        </Alert>
      )}
      {upload?.phase === "done" && (
        <Alert kind={upload.truncated ? "warning" : "success"}>
          <div className="flex items-start justify-between gap-3">
            <span>
              <span className="font-medium break-all">{upload.fileName}</span> was processed
              {upload.truncated
                ? ". It has more than 20 pages, so only the first 20 were read."
                : " and is ready for questions."}
            </span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => clear(projectId)}
              className="cursor-pointer opacity-70 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        </Alert>
      )}
    </div>
  );
}
