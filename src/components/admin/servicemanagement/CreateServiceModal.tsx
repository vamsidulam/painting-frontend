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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (service: ServiceRecord) => void;
  defaultCategoryId?: string;
};

type CreateResponse = {
  success: boolean;
  data: { service: ServiceRecord };
};

type CategoriesResponse = {
  success: boolean;
  data: { rows: ServiceCategoryRecord[]; pagination: PaginationMeta };
};

export function CreateServiceModal({
  open,
  onOpenChange,
  onCreated,
  defaultCategoryId,
}: Props) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [workType, setWorkType] = useState<WorkType | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ServiceCategoryRecord[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setName("");
        setCost("");
        setDescription("");
        setCategoryId("");
        setWorkType("");
        setImageFile(null);
        setError(null);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCategoriesLoading(true);
    api<CategoriesResponse>("/admin/service-categories?page=1&limit=100")
      .then((res) => {
        if (cancelled) return;
        setCategories(res.data.rows);
        if (defaultCategoryId) {
          setCategoryId(defaultCategoryId);
        } else if (res.data.rows.length > 0) {
          setCategoryId((current) => current || "");
        }
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, defaultCategoryId]);

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const categoryIncludesMoney = selectedCategory
    ? selectedCategory.includesMoney
    : true;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      setError("Please choose a category.");
      return;
    }

    if (!workType) {
      setError("Please choose fresh painting or repainting.");
      return;
    }

    const parsedCost = categoryIncludesMoney ? Number(cost) : 0;
    if (
      categoryIncludesMoney &&
      (!Number.isFinite(parsedCost) || parsedCost < 0)
    ) {
      setError("Cost must be a non-negative number.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("name", name.trim());
      form.set("cost", String(parsedCost));
      form.set("description", description.trim());
      form.set("categoryId", categoryId);
      form.set("workType", workType);
      if (imageFile) form.set("image", imageFile);

      const res = await api<CreateResponse>("/admin/services", {
        method: "POST",
        body: form,
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
              placeholder="Living room painting"
              required
              minLength={2}
              maxLength={200}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-service-category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => setCategoryId(v)}
              disabled={categoriesLoading || categories.length === 0}
            >
              <SelectTrigger
                id="create-service-category"
                className="h-11 rounded-xl"
              >
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading categories…"
                      : categories.length === 0
                        ? "Create a category first"
                        : "Choose a category"
                  }
                />
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
            <Label htmlFor="create-service-worktype">Work type</Label>
            <Select
              value={workType}
              onValueChange={(v) => setWorkType(v as WorkType)}
            >
              <SelectTrigger
                id="create-service-worktype"
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
          )}

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

          <ImageField
            id="create-service-image"
            label="Image (optional)"
            file={imageFile}
            onFileChange={setImageFile}
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
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || categories.length === 0}
            >
              {submitting ? "Creating..." : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
