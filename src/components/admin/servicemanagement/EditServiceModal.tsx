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
import { ImageField } from "./ImageField";
import {
  WORK_TYPE_OPTIONS,
  type PaginationMeta,
  type ServiceCategoryRecord,
  type ServiceRecord,
  type WorkType,
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

type CategoriesResponse = {
  success: boolean;
  data: { rows: ServiceCategoryRecord[]; pagination: PaginationMeta };
};

export function EditServiceModal({ service, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [workType, setWorkType] = useState<WorkType>("fresh");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [categories, setCategories] = useState<ServiceCategoryRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setCost(String(service.cost));
      setDescription(service.description ?? "");
      setCategoryId(service.categoryId ?? "");
      setWorkType(service.workType ?? "fresh");
      setImageFile(null);
      setRemoveImage(false);
      setError(null);
    }
  }, [service]);

  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    api<CategoriesResponse>("/admin/service-categories?page=1&limit=100")
      .then((res) => {
        if (!cancelled) setCategories(res.data.rows);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [service]);

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const categoryIncludesMoney = selectedCategory
    ? selectedCategory.includesMoney
    : (service?.category?.includesMoney ?? true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!service) return;

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const parsedCost = categoryIncludesMoney ? Number(cost) : 0;

    if (
      categoryIncludesMoney &&
      (!Number.isFinite(parsedCost) || parsedCost < 0)
    ) {
      setError("Cost must be a non-negative number.");
      return;
    }
    if (!categoryId) {
      setError("Please choose a category.");
      return;
    }

    const form = new FormData();
    let hasChange = false;

    if (trimmedName !== service.name) {
      form.set("name", trimmedName);
      hasChange = true;
    }
    if (parsedCost !== service.cost) {
      form.set("cost", String(parsedCost));
      hasChange = true;
    }
    if (trimmedDesc !== (service.description ?? "")) {
      form.set("description", trimmedDesc);
      hasChange = true;
    }
    if (categoryId !== (service.categoryId ?? "")) {
      form.set("categoryId", categoryId);
      hasChange = true;
    }
    if (workType !== (service.workType ?? "fresh")) {
      form.set("workType", workType);
      hasChange = true;
    }
    if (imageFile) {
      form.set("image", imageFile);
      hasChange = true;
    } else if (removeImage && service.image) {
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
      const res = await api<UpdateResponse>(`/admin/services/${service.id}`, {
        method: "PATCH",
        body: form,
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            Update the name, category, cost, image, or description.
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
              value={categoryId}
              onValueChange={(v) => setCategoryId(v)}
              disabled={categories.length === 0}
            >
              <SelectTrigger
                id="edit-service-category"
                className="h-11 rounded-xl"
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-service-worktype">Work type</Label>
            <Select
              value={workType}
              onValueChange={(v) => setWorkType(v as WorkType)}
            >
              <SelectTrigger
                id="edit-service-worktype"
                className="h-11 rounded-xl"
              >
                <SelectValue placeholder="Fresh painting or repainting" />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {categoryIncludesMoney && (
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
          )}

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

          <ImageField
            id="edit-service-image"
            label="Image (optional)"
            initialUrl={service?.image || ""}
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
