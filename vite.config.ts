import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": API_TARGET,
      "/health": API_TARGET,
    },
  },
});
