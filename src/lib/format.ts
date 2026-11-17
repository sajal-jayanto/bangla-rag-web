export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)} s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s % 60)}s`;
};

export const formatPercent = (ratio: number): string => `${Math.round(ratio * 100)}%`;

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const ACCEPT_ATTR = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

/** Client-side mirror of the backend's upload rules. Returns an error message or null. */
export const validateUpload = (file: File): string | null => {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const typeOk = ACCEPTED_TYPES.includes(file.type) || ["pdf", "png", "jpg", "jpeg"].includes(ext);
  if (!typeOk) return "Only PDF, PNG and JPG files are accepted.";
  if (file.size > MAX_UPLOAD_BYTES)
    return `File is ${formatBytes(file.size)}; the maximum is 5 MB.`;
  if (file.size === 0) return "This file is empty.";
  return null;
};

/** UTF-8 byte length, for the backend's 72-byte bcrypt password limit. */
export const byteLength = (s: string): number => new TextEncoder().encode(s).length;
