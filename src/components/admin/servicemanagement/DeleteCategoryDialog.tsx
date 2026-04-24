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
import type { ServiceCategoryRecord } from "./data";

type Props = {
  category: ServiceCategoryRecord | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export function DeleteCategoryDialog({ category, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      await api(`/admin/service-categories/${category.id}`, {
        method: "DELETE",
      });
      toast.success(`Deleted ${category.name}`);
      onDeleted(category.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={!!category}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {category?.name ?? "category"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Services still using this category
            must be moved or removed before deletion.
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
