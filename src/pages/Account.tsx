import { Database, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";

import { toApiError } from "../api/client";
import { dashboardApi } from "../api/endpoints";
import type { Dashboard } from "../api/types";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { capitalize } from "../lib/format";

export function Account() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((err) => setError(toApiError(err).message));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-headline sm:text-display">Account</h1>
      <p className="mt-2 mb-8 text-muted">Your profile and the server the API is connected to.</p>

      {error && <Alert className="mb-6">{error}</Alert>}
      {!data && !error && <Spinner className="text-muted" label="Loading…" />}

      {data && (
        <div className="flex flex-col gap-6">
          <Card className="p-6 sm:p-7">
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="grid size-14 place-items-center rounded-full bg-primary-soft font-display text-3xl text-primary-hover"
              >
                {data.user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0">
                <h2 className="text-title break-words">{data.user.name}</h2>
                <Badge tone={data.user.role === "admin" ? "coral" : "neutral"} className="mt-1">
                  {capitalize(data.user.role)}
                </Badge>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 border-t border-hairline pt-5 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
              <dt className="flex items-center gap-2 text-muted">
                <User className="size-4" /> User ID
              </dt>
              <dd className="font-mono text-ink">{data.user.id}</dd>
              <dt className="flex items-center gap-2 text-muted">
                <Mail className="size-4" /> Email
              </dt>
              <dd className="break-all text-ink">{data.user.email}</dd>
              <dt className="flex items-center gap-2 text-muted">
                <Shield className="size-4" /> Role
              </dt>
              <dd className="text-ink">{data.user.role}</dd>
            </dl>
          </Card>

          <div className="overflow-hidden rounded-lg bg-surface-dark shadow-card">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 inline-flex items-center gap-1.5 font-mono text-xs text-on-dark-muted">
                <Database className="size-3.5" /> GET /api/dashboard
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-on-dark">
              <span className="text-on-dark-muted">{"{"}</span>
              {"\n"} <span className="text-primary">"postgresVersion"</span>:{" "}
              <span className="text-teal-soft">"{data.database.postgresVersion}"</span>,{"\n"}{" "}
              <span className="text-primary">"pgvectorVersion"</span>:{" "}
              {data.database.pgvectorVersion ? (
                <span className="text-teal-soft">"{data.database.pgvectorVersion}"</span>
              ) : (
                <span className="text-amber-soft">null</span>
              )}
              {"\n"}
              <span className="text-on-dark-muted">{"}"}</span>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
