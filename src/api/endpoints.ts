import type { AxiosProgressEvent } from "axios";

import { api } from "./client";
import type {
  AuthResponse,
  Dashboard,
  DocumentMetadata,
  Health,
  Project,
  ProjectInput,
  ProjectPatch,
  PublicUser,
  SearchResult,
  UploadResponse,
} from "./types";

const enc = encodeURIComponent;

export const authApi = {
  register: async (body: { name: string; email: string; password: string }) =>
    (await api.post<AuthResponse>("/api/auth/register", body)).data,
  login: async (body: { email: string; password: string }) =>
    (await api.post<AuthResponse>("/api/auth/login", body)).data,
  me: async () => (await api.get<{ user: PublicUser }>("/api/users/me")).data.user,
};

export const dashboardApi = {
  get: async () => (await api.get<Dashboard>("/api/dashboard")).data,
};

export const healthApi = {
  get: async () => (await api.get<Health>("/health", { timeout: 5000 })).data,
};

export const projectApi = {
  list: async () => (await api.get<{ projects: Project[] }>("/api/projects")).data.projects,
  get: async (id: string) =>
    (await api.get<{ project: Project }>(`/api/projects/${enc(id)}`)).data.project,
  create: async (body: ProjectInput) =>
    (await api.post<{ project: Project }>("/api/projects", body)).data.project,
  update: async (id: string, body: ProjectPatch) =>
    (await api.patch<{ project: Project }>(`/api/projects/${enc(id)}`, body)).data.project,
  remove: async (id: string) => {
    await api.delete(`/api/projects/${enc(id)}`);
  },
};

export const documentApi = {
  list: async (projectId: string) =>
    (await api.get<{ documents: DocumentMetadata[] }>(`/api/projects/${enc(projectId)}/documents`))
      .data.documents,
  upload: async (
    projectId: string,
    file: File,
    onUploadProgress?: (e: AxiosProgressEvent) => void,
  ) => {
    const form = new FormData();
    form.append("file", file);
    return (
      await api.post<UploadResponse>(`/api/projects/${enc(projectId)}/ocr`, form, {
        onUploadProgress,
      })
    ).data;
  },
};

export const searchApi = {
  ask: async (projectId: string, query: string, limit: number) =>
    (await api.post<SearchResult>(`/api/projects/${enc(projectId)}/search`, { query, limit })).data,
};
