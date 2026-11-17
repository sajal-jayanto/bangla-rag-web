import { create } from "zustand";

import { toApiError } from "../api/client";
import { documentApi } from "../api/endpoints";
import type { DocumentMetadata } from "../api/types";
import { onLogout } from "./authStore";

export type UploadPhase = "uploading" | "ocr" | "done" | "error";

export interface UploadState {
  fileName: string;
  phase: UploadPhase;
  /** 0–1, bytes sent to the server. */
  progress: number;
  startedAt: number;
  truncated: boolean;
  error: string | null;
}

interface ListState {
  items: DocumentMetadata[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

interface DocumentState {
  lists: Record<string, ListState>;
  uploads: Record<string, UploadState | undefined>;
  fetchForProject: (projectId: string) => Promise<void>;
  upload: (projectId: string, file: File) => Promise<void>;
  clearUpload: (projectId: string) => void;
  reset: () => void;
}

const emptyList: ListState = { items: [], loaded: false, loading: false, error: null };

export const useDocumentStore = create<DocumentState>()((set, get) => {
  const patchList = (projectId: string, patch: Partial<ListState>) =>
    set((s) => ({
      lists: { ...s.lists, [projectId]: { ...(s.lists[projectId] ?? emptyList), ...patch } },
    }));

  const patchUpload = (projectId: string, patch: Partial<UploadState>) =>
    set((s) => {
      const current = s.uploads[projectId];
      if (!current) return s;
      return { uploads: { ...s.uploads, [projectId]: { ...current, ...patch } } };
    });

  return {
    lists: {},
    uploads: {},

    fetchForProject: async (projectId) => {
      patchList(projectId, { loading: true, error: null });
      try {
        const items = await documentApi.list(projectId);
        patchList(projectId, { items, loaded: true, loading: false });
      } catch (err) {
        patchList(projectId, { loading: false, error: toApiError(err).message });
      }
    },

    upload: async (projectId, file) => {
      set((s) => ({
        uploads: {
          ...s.uploads,
          [projectId]: {
            fileName: file.name,
            phase: "uploading",
            progress: 0,
            startedAt: Date.now(),
            truncated: false,
            error: null,
          },
        },
      }));
      try {
        const { document, truncated } = await documentApi.upload(projectId, file, (e) => {
          const progress = e.total ? e.loaded / e.total : 0;
          // Once every byte is sent, the server is running OCR + embeddings.
          patchUpload(projectId, { progress, phase: progress >= 1 ? "ocr" : "uploading" });
        });
        const list = get().lists[projectId] ?? emptyList;
        patchList(projectId, {
          items: [document, ...list.items.filter((d) => d.id !== document.id)],
        });
        patchUpload(projectId, { phase: "done", progress: 1, truncated });
      } catch (err) {
        patchUpload(projectId, { phase: "error", error: toApiError(err).message });
      }
    },

    clearUpload: (projectId) => set((s) => ({ uploads: { ...s.uploads, [projectId]: undefined } })),

    reset: () => set({ lists: {}, uploads: {} }),
  };
});

export const selectDocumentList = (projectId: string) => (s: DocumentState) =>
  s.lists[projectId] ?? emptyList;

onLogout(() => useDocumentStore.getState().reset());
