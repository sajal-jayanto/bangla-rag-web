import type { ProjectPriority, ProjectStatus } from "../api/types";
import { capitalize } from "../lib/format";
import { Badge, type Tone } from "./ui/Badge";

const statusTone: Record<ProjectStatus, Tone> = {
  planning: "amber",
  active: "teal",
  completed: "dark",
  archived: "neutral",
};

const priorityTone: Record<ProjectPriority, Tone> = {
  low: "neutral",
  mid: "amber",
  high: "coral",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={statusTone[status]}>{capitalize(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  return <Badge tone={priorityTone[priority]}>{capitalize(priority)} priority</Badge>;
}
