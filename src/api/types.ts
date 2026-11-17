// Hand-copied from the bangla-rag backend (src/models, src/services, src/repositories).
// Keep in sync when the API changes.

export type UserRole = "user" | "admin";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export const PROJECT_STATUSES = ["planning", "active", "completed", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PRIORITIES = ["low", "mid", "high"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  /** ISO timestamp (serialized Date). */
  createdAt: string;
}

export interface ProjectInput {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}

export type ProjectPatch = Partial<ProjectInput>;

export type OcrFileKind = "pdf" | "image";
export type OcrStatus = "completed" | "failed";

export type PdfInfo = Partial<
  Record<
    | "title"
    | "subject"
    | "author"
    | "creator"
    | "producer"
    | "creationDate"
    | "modDate"
    | "pageSize"
    | "pdfVersion"
    | "encrypted",
    string
  >
>;

export interface DocumentMetadata {
  id: string;
  projectId: string;
  uploadedBy: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  kind: OcrFileKind;
  pageCount: number | null;
  pagesProcessed: number | null;
  textLength: number | null;
  pdfInfo: PdfInfo | null;
  ocrStatus: OcrStatus;
  ocrError: string | null;
  ocrDurationMs: number;
  chunkCount: number | null;
  embeddingModel: string | null;
}

export interface UploadResponse {
  document: DocumentMetadata;
  truncated: boolean;
}

export interface SearchSource {
  documentId: string;
  fileName: string;
  pageNumber: number | null;
  chunkIndex: number;
  similarity: number;
  content: string;
}

export interface SearchResult {
  query: string;
  found: boolean;
  answer: string;
  sources: SearchSource[];
}

export interface DatabaseInfo {
  postgresVersion: string;
  pgvectorVersion: string | null;
}

export interface Dashboard {
  user: PublicUser;
  database: DatabaseInfo;
}

export interface Health {
  status: string;
  time: string;
  uptime: number;
}

/** The backend's error body: `{ statusCode, message, details? }`. */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  details?: Record<string, string[] | undefined>;
}

export const NOT_FOUND_ANSWER = "জানা নেই";
