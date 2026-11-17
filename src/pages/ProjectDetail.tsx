import { ArrowLeft, FileStack, MessageSquareText, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { toApiError } from "../api/client";
import { AskPanel } from "../components/AskPanel";
import { DocumentTable } from "../components/DocumentTable";
import { PriorityBadge, StatusBadge } from "../components/ProjectBadges";
import { ProjectForm } from "../components/ProjectForm";
import { UploadZone } from "../components/UploadZone";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { Tabs } from "../components/ui/Tabs";
import { formatDate } from "../lib/format";
import { selectDocumentList, useDocumentStore } from "../stores/documentStore";
import { useProjectStore } from "../stores/projectStore";
import { NotFound } from "./NotFound";

type Tab = "ask" | "documents";

export function ProjectDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "documents" ? "documents" : "ask";

  const project = useProjectStore((s) => s.byId[id]);
  const fetchOne = useProjectStore((s) => s.fetchOne);
  const update = useProjectStore((s) => s.update);
  const remove = useProjectStore((s) => s.remove);

  const docs = useDocumentStore(selectDocumentList(id));
  const fetchDocs = useDocumentStore((s) => s.fetchForProject);

  const [failure, setFailure] = useState<{ id: string; status: number; message: string } | null>(
    null,
  );
  // Only show an error that belongs to the project currently in the URL.
  const loadError = failure?.id === id ? failure : null;
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchOne(id).catch((err) => {
      const e = toApiError(err);
      setFailure({ id, status: e.status, message: e.message });
    });
    void fetchDocs(id);
  }, [id, fetchOne, fetchDocs]);

  if (loadError && (loadError.status === 404 || loadError.status === 400))
    return <NotFound what="project" />;
  if (!project) {
    return loadError ? (
      <Alert>{loadError.message}</Alert>
    ) : (
      <div className="py-20 text-center text-muted">
        <Spinner label="Loading project…" />
      </div>
    );
  }

  const setTab = (t: Tab) => setParams(t === "ask" ? {} : { tab: t }, { replace: true });

  const doDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await remove(id);
      navigate("/projects", { replace: true });
    } catch (err) {
      setDeleteError(toApiError(err).message);
      setDeleting(false);
    }
  };

  return (
    <div>
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-headline break-words sm:text-display">{project.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <span className="font-mono text-xs text-subtle">/{project.slug}</span>
            <span className="text-xs text-subtle">· Created {formatDate(project.createdAt)}</span>
          </div>
          {project.description && (
            <p className="mt-4 max-w-3xl leading-relaxed whitespace-pre-wrap text-body">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<Pencil className="size-4" />}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            icon={<Trash2 className="size-4" />}
            onClick={() => setConfirmDelete(true)}
            className="text-error hover:text-error"
          >
            Delete
          </Button>
        </div>
      </header>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        items={[
          {
            id: "ask",
            label: (
              <>
                <MessageSquareText className="size-4" /> Ask
              </>
            ),
          },
          {
            id: "documents",
            label: (
              <>
                <FileStack className="size-4" /> Documents
                {docs.loaded && (
                  <span className="rounded-full bg-surface-card px-2 text-xs text-muted">
                    {docs.items.length}
                  </span>
                )}
              </>
            ),
          },
        ]}
      />

      <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-6">
        {tab === "ask" ? (
          <div className="mx-auto max-w-3xl">
            <AskPanel
              projectId={id}
              hasDocuments={!docs.loaded || docs.items.some((d) => d.ocrStatus === "completed")}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <UploadZone projectId={id} />
            {docs.error && (
              <Alert>
                <div className="flex flex-wrap items-center gap-3">
                  <span>{docs.error}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<RefreshCw className="size-3.5" />}
                    onClick={() => void fetchDocs(id)}
                  >
                    Retry
                  </Button>
                </div>
              </Alert>
            )}
            {!docs.loaded && docs.loading ? (
              <div className="py-10 text-center text-muted">
                <Spinner label="Loading documents…" />
              </div>
            ) : docs.loaded && docs.items.length === 0 ? (
              <EmptyState icon={<FileStack className="size-9" />} title="No documents yet">
                Upload a scanned PDF or a photo of a page. The text is read with OCR and indexed for
                search.
              </EmptyState>
            ) : docs.items.length > 0 ? (
              <DocumentTable documents={docs.items} />
            ) : null}
          </div>
        )}
      </section>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Edit project">
        <ProjectForm
          initial={project}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={async (input) => {
            await update(id, input);
            setEditing(false);
          }}
        />
      </Dialog>

      <Dialog
        open={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        title="Delete this project?"
      >
        <p className="text-body">
          <span className="font-medium text-ink">{project.name}</span> and its documents will no
          longer be available. This can't be undone from the app.
        </p>
        {deleteError && <Alert className="mt-4">{deleteError}</Alert>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={() => void doDelete()}>
            Delete project
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
