import { FolderOpen, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ProjectCard } from "../components/ProjectCard";
import { ProjectForm } from "../components/ProjectForm";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { useProjectStore } from "../stores/projectStore";

export function Projects() {
  const ids = useProjectStore((s) => s.ids);
  const byId = useProjectStore((s) => s.byId);
  const loaded = useProjectStore((s) => s.listLoaded);
  const loading = useProjectStore((s) => s.loading);
  const error = useProjectStore((s) => s.error);
  const fetchAll = useProjectStore((s) => s.fetchAll);
  const create = useProjectStore((s) => s.create);
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const projects = ids.map((id) => byId[id]).filter(Boolean);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-headline sm:text-display">Projects</h1>
          <p className="mt-2 text-muted">
            Each project holds its own documents and answers questions from them.
          </p>
        </div>
        <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
          New project
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span>{error}</span>
            <Button
              size="sm"
              variant="secondary"
              icon={<RefreshCw className="size-3.5" />}
              onClick={() => void fetchAll()}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {!loaded && loading ? (
        <div className="py-20 text-center text-muted">
          <Spinner label="Loading projects…" />
        </div>
      ) : loaded && projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-10" />}
          title="No projects yet"
          action={
            <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
              Create your first project
            </Button>
          }
        >
          Create a project, upload a scanned Bangla PDF or image, then ask it questions.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <Dialog open={creating} onClose={() => setCreating(false)} title="New project">
        <ProjectForm
          submitLabel="Create project"
          onCancel={() => setCreating(false)}
          onSubmit={async (input) => {
            const project = await create(input);
            setCreating(false);
            navigate(`/projects/${project.id}`);
          }}
        />
      </Dialog>
    </div>
  );
}
