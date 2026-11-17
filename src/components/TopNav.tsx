import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";

import { cn } from "../lib/cn";
import { useAuthStore } from "../stores/authStore";
import { HealthDot } from "./HealthDot";
import { Wordmark } from "./Wordmark";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/account", label: "Account" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-surface-card text-ink" : "text-muted hover:text-ink",
  );

export function TopNav() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <HealthDot />
          <div className="hidden items-center gap-3 md:flex">
            {user && (
              <span className="flex items-center gap-2 text-sm text-body">
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-hover"
                >
                  {user.name.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <span className="max-w-40 truncate">{user.name}</span>
              </span>
            )}
            <button
              type="button"
              onClick={signOut}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-muted hover:bg-surface-card hover:text-ink"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-md p-2 text-ink hover:bg-surface-card md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-hairline bg-canvas px-4 pt-2 pb-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
            <span className="truncate text-sm text-body">{user?.email}</span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-muted hover:text-ink"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
