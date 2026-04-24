import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import type { ProjectRecord } from "./data";

type Props = {
  project: ProjectRecord | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export function DeleteProjectDialog({ project, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!project) return;
    setSubmitting(true);
    try {
      await api(`/admin/projects/${project.id}`, { method: "DELETE" });
      toast.success(`Deleted ${project.name}`);
      onDeleted(project.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete project",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {project?.name ?? "project"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The project will be removed from the
            public site.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
