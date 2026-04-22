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
import type { UserRecord, UserRole } from "./data";

type Props = {
  user: UserRecord | null;
  role: UserRole;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

const basePath: Record<UserRole, string> = {
  admin: "/admin/users/adminusers",
  customer: "/admin/users/customers",
};

export function DeleteUserDialog({ user, role, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await api(`${basePath[role]}/${user.id}`, { method: "DELETE" });
      toast.success(`Deleted ${user.name}`);
      onDeleted(user.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={!!user}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user?.name ?? "user"}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The account will be permanently
            removed along with its access.
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
