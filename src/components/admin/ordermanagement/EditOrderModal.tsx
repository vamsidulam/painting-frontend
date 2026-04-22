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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { OrderRecord, OrderStatus, OrderWorkStatus } from "./data";

type Props = {
  order: OrderRecord | null;
  onClose: () => void;
  onUpdated: (order: OrderRecord) => void;
};

type UpdateResponse = {
  success: boolean;
  data: { order: OrderRecord };
};

const WORK_STATUS_NONE = "__none__";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const WORK_STATUS_OPTIONS: {
  value: OrderWorkStatus | typeof WORK_STATUS_NONE;
  label: string;
}[] = [
  { value: WORK_STATUS_NONE, label: "None" },
  { value: "pending", label: "Pending" },
  { value: "started", label: "Started" },
  { value: "completed", label: "Completed" },
];

export function EditOrderModal({ order, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<OrderStatus>("requested");
  const [workStatus, setWorkStatus] = useState<
    OrderWorkStatus | typeof WORK_STATUS_NONE
  >(WORK_STATUS_NONE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setWorkStatus(order.workStatus ?? WORK_STATUS_NONE);
      setError(null);
    }
  }, [order]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!order) return;

    const newWorkStatus: OrderWorkStatus | null =
      workStatus === WORK_STATUS_NONE ? null : workStatus;

    const patch: {
      status?: OrderStatus;
      workStatus?: OrderWorkStatus | null;
    } = {};
    if (status !== order.status) patch.status = status;
    if (newWorkStatus !== order.workStatus) patch.workStatus = newWorkStatus;

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api<UpdateResponse>(`/admin/orders/${order.id}`, {
        method: "PATCH",
        body: patch,
      });
      toast.success("Order updated");
      onUpdated(res.data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!order}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit order</DialogTitle>
          <DialogDescription>
            Update the request status or the work status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-order-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as OrderStatus)}
            >
              <SelectTrigger id="edit-order-status" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-order-workstatus">Work status</Label>
            <Select
              value={workStatus}
              onValueChange={(v) =>
                setWorkStatus(v as OrderWorkStatus | typeof WORK_STATUS_NONE)
              }
            >
              <SelectTrigger
                id="edit-order-workstatus"
                className="h-11 rounded-xl"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORK_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
