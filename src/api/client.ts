import axios, { AxiosError } from "axios";

import { useAuthStore } from "../stores/authStore";
import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[] | undefined>;

  constructor(message: string, status: number, details?: ApiErrorBody["details"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /** First message for a field from the backend's Zod `details`, if any. */
  fieldError(field: string): string | undefined {
    return this.details?.[field]?.[0];
  }
}

export const toApiError = (err: unknown): ApiError => {
  if (err instanceof ApiError) return err;
  if (err instanceof Error) return new ApiError(err.message, 0);
  return new ApiError("Something went wrong", 0);
};

const AUTH_PATHS = ["/api/auth/login", "/api/auth/register"];

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) return Promise.reject(toApiError(error));

    if (!error.response) {
      const offline = error.code === "ERR_NETWORK";
      return Promise.reject(
        new ApiError(offline ? "Can't reach the API server. Is it running?" : error.message, 0),
      );
    }

    const { status, data } = error.response as { status: number; data: Partial<ApiErrorBody> };
    const message =
      typeof data?.message === "string" && data.message
        ? data.message
        : `Request failed (${status})`;

    const url = error.config?.url ?? "";
    if (status === 401 && !AUTH_PATHS.some((p) => url.endsWith(p))) {
      // Token expired or was revoked: drop the session and send the user to log in.
      useAuthStore.getState().logout({ expired: true });
    }

    return Promise.reject(new ApiError(message, status, data?.details));
  },
);
