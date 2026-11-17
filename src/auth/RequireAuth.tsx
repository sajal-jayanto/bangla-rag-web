import { Navigate, Outlet, useLocation } from "react-router";

import { Spinner } from "../components/ui/Spinner";
import { useAuthStore } from "../stores/authStore";

export function FullPageSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center text-muted">
      <Spinner label="Loading…" />
    </div>
  );
}

/** Guards app routes: waits for the session check, then sends guests to /login. */
export function RequireAuth() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === "idle" || status === "loading") return <FullPageSpinner />;
  if (status !== "authed")
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Login/register pages: bounce signed-in users to the app. */
export function GuestOnly() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  if (status === "idle" || status === "loading") return <FullPageSpinner />;
  if (status === "authed")
    return <Navigate to={from && from !== "/login" ? from : "/projects"} replace />;
  return <Outlet />;
}
