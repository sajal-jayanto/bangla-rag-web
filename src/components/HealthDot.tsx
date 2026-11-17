import { useEffect, useState } from "react";

import { healthApi } from "../api/endpoints";
import { cn } from "../lib/cn";

type Health = "checking" | "up" | "down";

export function HealthDot() {
  const [health, setHealth] = useState<Health>("checking");

  useEffect(() => {
    let alive = true;
    const check = () =>
      healthApi
        .get()
        .then((h) => alive && setHealth(h.status === "ok" ? "up" : "down"))
        .catch(() => alive && setHealth("down"));
    void check();
    const timer = window.setInterval(check, 30_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const label = health === "up" ? "API online" : health === "down" ? "API offline" : "Checking API";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted" title={label}>
      <span
        className={cn(
          "size-2 rounded-full",
          health === "up" && "bg-teal",
          health === "down" && "bg-error",
          health === "checking" && "animate-pulse bg-subtle",
        )}
      />
      <span className="hidden lg:inline">{label}</span>
    </span>
  );
}
