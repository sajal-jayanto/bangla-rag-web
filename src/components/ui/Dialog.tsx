import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/** Modal built on the native <dialog> element (focus trap + Esc for free). */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-hairline bg-canvas p-0 text-body shadow-pop backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] open:animate-pop-in"
    >
      {open && (
        <div className="p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-title">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-1 -mr-2 cursor-pointer rounded-md p-2 text-muted hover:bg-surface-card hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
