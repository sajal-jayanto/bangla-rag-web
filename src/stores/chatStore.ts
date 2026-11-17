import { create } from "zustand";

import { toApiError } from "../api/client";
import { searchApi } from "../api/endpoints";
import type { SearchResult } from "../api/types";
import { onLogout } from "./authStore";

export interface ChatTurn {
  id: string;
  question: string;
  pending: boolean;
  result?: SearchResult;
  error?: string;
}

interface ChatState {
  /** Q&A history per project, kept for this browser session only (the API stores none). */
  threads: Record<string, ChatTurn[]>;
  limit: number;
  setLimit: (limit: number) => void;
  ask: (projectId: string, query: string) => Promise<void>;
  clear: (projectId: string) => void;
  reset: () => void;
}

const EMPTY: ChatTurn[] = [];
let seq = 0;

export const useChatStore = create<ChatState>()((set, get) => {
  const patchTurn = (projectId: string, id: string, patch: Partial<ChatTurn>) =>
    set((s) => ({
      threads: {
        ...s.threads,
        [projectId]: (s.threads[projectId] ?? EMPTY).map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      },
    }));

  return {
    threads: {},
    limit: 5,

    setLimit: (limit) => set({ limit: Math.min(20, Math.max(1, Math.round(limit))) }),

    ask: async (projectId, query) => {
      const id = `t${++seq}`;
      set((s) => ({
        threads: {
          ...s.threads,
          [projectId]: [...(s.threads[projectId] ?? EMPTY), { id, question: query, pending: true }],
        },
      }));
      try {
        const result = await searchApi.ask(projectId, query, get().limit);
        patchTurn(projectId, id, { pending: false, result });
      } catch (err) {
        patchTurn(projectId, id, { pending: false, error: toApiError(err).message });
      }
    },

    clear: (projectId) => set((s) => ({ threads: { ...s.threads, [projectId]: EMPTY } })),

    reset: () => set({ threads: {} }),
  };
});

export const selectThread = (projectId: string) => (s: ChatState) => s.threads[projectId] ?? EMPTY;

onLogout(() => useChatStore.getState().reset());
