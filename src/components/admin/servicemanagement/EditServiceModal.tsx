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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  CATEGORY_OPTIONS,
  type ServiceCategory,
  type ServiceRecord,
} from "./data";

type Props = {
  service: ServiceRecord | null;
  onClose: () => void;
  onUpdated: (service: ServiceRecord) => void;
};

type UpdateResponse = {
  success: boolean;
  data: { service: ServiceRecord };
};

export function EditServiceModal({ service, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("interior");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setCost(String(service.cost));
      setDescription(service.description ?? "");
      setCategory(service.category);
      setError(null);
    }
  }, [service]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!service) return;

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const parsedCost = Number(cost);

    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      setError("Cost must be a non-negative number.");
      return;
    }

    const patch: {
      name?: string;
      cost?: number;
      description?: string;
      category?: ServiceCategory;
    } = {};
    if (trimmedName !== service.name) patch.name = trimmedName;
    if (parsedCost !== service.cost) patch.cost = parsedCost;
    if (trimmedDesc !== (service.description ?? ""))
      patch.description = trimmedDesc;
    if (category !== service.category) patch.category = category;

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api<UpdateResponse>(`/admin/services/${service.id}`, {
        method: "PATCH",
        body: patch,
      });
      toast.success(`Updated ${res.data.service.name}`);
      onUpdated(res.data.service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!service}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            Update the name, category, cost, or description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-service-name">Service name</Label>
            <Input
              id="edit-service-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={200}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-service-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ServiceCategory)}
            >
              <SelectTrigger id="edit-service-category" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-service-cost">Cost (₹)</Label>
            <Input
              id="edit-service-cost"
              type="number"
              inputMode="numeric"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="20"
              min={0}
              step={1}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-service-desc">Description</Label>
            <Textarea
              id="edit-service-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
              className="rounded-xl"
            />
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
