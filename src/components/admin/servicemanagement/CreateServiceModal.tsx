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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (service: ServiceRecord) => void;
};

type CreateResponse = {
  success: boolean;
  data: { service: ServiceRecord };
};

export function CreateServiceModal({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setName("");
        setCost("");
        setDescription("");
        setCategory("");
        setError(null);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category) {
      setError("Please choose a category.");
      return;
    }

    const parsedCost = Number(cost);
    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      setError("Cost must be a non-negative number.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api<CreateResponse>("/admin/services", {
        method: "POST",
        body: {
          name: name.trim(),
          cost: parsedCost,
          description: description.trim(),
          category,
        },
      });
      toast.success(`Created ${res.data.service.name}`);
      onCreated(res.data.service);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && submitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New service</DialogTitle>
          <DialogDescription>
            Add a service that customers can book. You can edit these details
            later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-service-name">Service name</Label>
            <Input
              id="create-service-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Interior painting"
              required
              minLength={2}
              maxLength={200}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-service-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ServiceCategory)}
            >
              <SelectTrigger id="create-service-category" className="h-11 rounded-xl">
                <SelectValue placeholder="Choose a category" />
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
            <Label htmlFor="create-service-cost">Cost (₹)</Label>
            <Input
              id="create-service-cost"
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
            <Label htmlFor="create-service-desc">Description</Label>
            <Textarea
              id="create-service-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's included in this service…"
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
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
