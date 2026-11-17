import { create } from "zustand";

import { toApiError } from "../api/client";
import { projectApi } from "../api/endpoints";
import type { Project, ProjectInput, ProjectPatch } from "../api/types";
import { onLogout } from "./authStore";

interface ProjectState {
  /** Project ids in list order (newest first, as the API returns them). */
  ids: string[];
  byId: Record<string, Project>;
  listLoaded: boolean;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchOne: (id: string) => Promise<Project>;
  create: (input: ProjectInput) => Promise<Project>;
  update: (id: string, patch: ProjectPatch) => Promise<Project>;
  remove: (id: string) => Promise<void>;
  reset: () => void;
}

const initial = { ids: [], byId: {}, listLoaded: false, loading: false, error: null };

export const useProjectStore = create<ProjectState>()((set) => ({
  ...initial,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectApi.list();
      set({
        ids: projects.map((p) => p.id),
        byId: Object.fromEntries(projects.map((p) => [p.id, p])),
        listLoaded: true,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: toApiError(err).message });
    }
  },

  fetchOne: async (id) => {
    const project = await projectApi.get(id);
    set((s) => ({ byId: { ...s.byId, [id]: project } }));
    return project;
  },

  create: async (input) => {
    const project = await projectApi.create(input);
    set((s) => ({
      ids: [project.id, ...s.ids],
      byId: { ...s.byId, [project.id]: project },
    }));
    return project;
  },

  update: async (id, patch) => {
    const project = await projectApi.update(id, patch);
    set((s) => ({ byId: { ...s.byId, [id]: project } }));
    return project;
  },

  remove: async (id) => {
    await projectApi.remove(id);
    set((s) => {
      const byId = { ...s.byId };
      delete byId[id];
      return { ids: s.ids.filter((x) => x !== id), byId };
    });
  },

  reset: () => set(initial),
}));

onLogout(() => useProjectStore.getState().reset());
