import { Outlet } from "react-router";

import { TopNav } from "./TopNav";

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-hairline py-6 text-center text-xs text-subtle">
        Bangla RAG · OCR + semantic search over your Bangla documents
      </footer>
    </div>
  );
}
