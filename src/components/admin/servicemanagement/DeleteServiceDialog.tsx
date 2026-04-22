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
import type { ServiceRecord } from "./data";

type Props = {
  service: ServiceRecord | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export function DeleteServiceDialog({ service, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!service) return;
    setSubmitting(true);
    try {
      await api(`/admin/services/${service.id}`, { method: "DELETE" });
      toast.success(`Deleted ${service.name}`);
      onDeleted(service.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={!!service}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {service?.name ?? "service"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The service will be permanently
            removed from your catalog.
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
