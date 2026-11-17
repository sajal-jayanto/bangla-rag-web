import { Link } from "react-router";

export function NotFound({ what = "page" }: { what?: string }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="mt-4 text-headline">This {what} doesn't exist</h1>
      <p className="mt-2 text-muted">It may have been deleted, or the link is wrong.</p>
      <Link
        to="/projects"
        className="mt-8 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        Go to projects
      </Link>
    </div>
  );
}
