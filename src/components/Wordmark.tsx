import { Link } from "react-router";

export function Wordmark() {
  return (
    <Link to="/projects" className="flex items-center gap-2.5 text-ink">
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-md bg-primary font-display text-xl leading-none text-on-primary"
      >
        ব
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight">Bangla RAG</span>
    </Link>
  );
}
