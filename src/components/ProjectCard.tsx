import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import type { Project } from "../api/types";
import { formatDate } from "../lib/format";
import { PriorityBadge, StatusBadge } from "./ProjectBadges";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-lg border border-hairline bg-surface-raised p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-pop"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-title break-words">{project.name}</h3>
        <ArrowUpRight className="size-5 shrink-0 text-subtle transition-colors group-hover:text-primary" />
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {project.description || <span className="italic text-subtle">No description</span>}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
        <span className="ml-auto text-xs text-subtle">{formatDate(project.createdAt)}</span>
      </div>
    </Link>
  );
}
