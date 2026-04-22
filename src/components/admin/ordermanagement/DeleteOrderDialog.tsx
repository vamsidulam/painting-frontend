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
import type { OrderRecord } from "./data";

type Props = {
  order: OrderRecord | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export function DeleteOrderDialog({ order, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      await api(`/admin/orders/${order.id}`, { method: "DELETE" });
      toast.success(`Deleted order for ${order.customer.name}`);
      onDeleted(order.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={!!order}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete order for {order?.customer.name ?? "this customer"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The booking record and the linked
            payment screenshot reference will be permanently removed.
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
