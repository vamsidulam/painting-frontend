import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ImageField } from "@/components/admin/servicemanagement/ImageField";
import type { ProjectRecord } from "./data";

type Props = {
  project: ProjectRecord | null;
  onClose: () => void;
  onUpdated: (project: ProjectRecord) => void;
};

type UpdateResponse = {
  success: boolean;
  data: { project: ProjectRecord };
};

export function EditProjectModal({ project, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setImageFile(null);
      setRemoveImage(false);
      setError(null);
    }
  }, [project]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const trimmedName = name.trim();
    const form = new FormData();
    let hasChange = false;

    if (trimmedName !== project.name) {
      form.set("name", trimmedName);
      hasChange = true;
    }
    if (imageFile) {
      form.set("image", imageFile);
      hasChange = true;
    } else if (removeImage && project.image) {
      form.set("removeImage", "true");
      hasChange = true;
    }

    if (!hasChange) {
      onClose();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api<UpdateResponse>(`/admin/projects/${project.id}`, {
        method: "PATCH",
        body: form,
      });
      toast.success(`Updated ${res.data.project.name}`);
      onUpdated(res.data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update the name or photo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Project name</Label>
            <Input
              id="edit-project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={200}
              className="h-11 rounded-xl"
            />
          </div>

          <ImageField
            id="edit-project-image"
            label="Project photo"
            initialUrl={project?.image || ""}
            file={imageFile}
            onFileChange={setImageFile}
            removed={removeImage}
            onRemovedChange={setRemoveImage}
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
