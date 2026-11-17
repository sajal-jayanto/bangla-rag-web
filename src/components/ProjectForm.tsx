import { useState, type FormEvent } from "react";

import { toApiError } from "../api/client";
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectInput,
} from "../api/types";
import { capitalize } from "../lib/format";
import { Alert } from "./ui/Alert";
import { Button } from "./ui/Button";
import { Input, Select, Textarea } from "./ui/Field";

interface Props {
  initial?: Project;
  submitLabel: string;
  onSubmit: (input: ProjectInput) => Promise<unknown>;
  onCancel: () => void;
}

export function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState(initial?.status ?? "planning");
  const [priority, setPriority] = useState(initial?.priority ?? "mid");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    else if (name.trim().length > 150) next.name = "Name cannot exceed 150 characters";
    if (description.length > 5000) next.description = "Description cannot exceed 5000 characters";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        status,
        priority,
      });
    } catch (err) {
      const apiErr = toApiError(err);
      setErrors({ name: apiErr.fieldError("name"), description: apiErr.fieldError("description") });
      setFormError(apiErr.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      {formError && <Alert>{formError}</Alert>}
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        maxLength={150}
        autoFocus
        required
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        hint="Optional. What documents will this project hold?"
        maxLength={5000}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {capitalize(s)}
            </option>
          ))}
        </Select>
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as typeof priority)}
        >
          {PROJECT_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {capitalize(p)}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
