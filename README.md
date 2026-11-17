# Bangla RAG — web

Browser frontend for the [bangla-rag](../bangla-rag) API: sign up, create projects, upload scanned
Bangla PDFs or images (OCR + embeddings), and ask questions that are answered only from those
documents — or with **জানা নেই** when they don't cover it.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Zustand · axios · lucide-react

## Run it

```bash
# 1. API (in ../bangla-rag)
docker compose up db -d
npm run migrate
npm run dev                  # http://localhost:3000

# 2. Frontend (here)
npm install
npm run dev                  # http://localhost:5173
```

In development Vite proxies `/api` and `/health` to `http://localhost:3000`
(override with `API_PROXY_TARGET=http://host:port npm run dev`).

For a production build pointed at another origin, set `VITE_API_URL` (see `.env.example`) before
`npm run build`. Leave it empty when the API is served from the same origin. Any static host works,
as long as unknown paths fall back to `index.html` (client-side routing).

## Scripts

| Script              | What it does                      |
| ------------------- | --------------------------------- |
| `npm run dev`       | Dev server with the API proxy     |
| `npm run build`     | Typecheck + production build      |
| `npm run preview`   | Serve the built `dist/`           |
| `npm run lint`      | oxlint                            |
| `npm run typecheck` | `tsc -b`                          |
| `npm run format`    | Prettier (same config as the API) |

## Layout

```
src/
  api/          axios client (auth header, error mapping, 401 → logout), endpoints, types
  stores/       Zustand: auth (token persisted), projects, documents/uploads, chat threads
  auth/         route guards
  components/   ui/ primitives + TopNav, ProjectCard, ProjectForm, UploadZone, DocumentTable, AskPanel
  pages/        Login, Register, Projects, ProjectDetail (Ask / Documents tabs), Account, NotFound
  lib/          formatting + client-side upload/password checks
```

## Notes

- `src/api/types.ts` is copied by hand from the backend models — update it when the API changes.
- Q&A history lives in memory per project for the browser session; the API stores none.
- JWTs expire after 1 h; any 401 logs you out and the login page says the session expired.
- Uploads: PDF/PNG/JPG up to 5 MB; only the first 20 PDF pages are read. OCR on a scanned PDF can
  take about a minute, and the upload panel shows elapsed time while it runs.
