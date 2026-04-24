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
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { ImageField } from "./ImageField";
import type { ServiceCategoryRecord } from "./data";

type Props = {
  category: ServiceCategoryRecord | null;
  onClose: () => void;
  onUpdated: (category: ServiceCategoryRecord) => void;
};

type UpdateResponse = {
  success: boolean;
  data: { category: ServiceCategoryRecord };
};

export function EditCategoryModal({ category, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description ?? "");
      setIsActive(category.isActive);
      setImageFile(null);
      setRemoveImage(false);
      setError(null);
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const form = new FormData();
    let hasChange = false;

    if (trimmedName !== category.name) {
      form.set("name", trimmedName);
      hasChange = true;
    }
    if (trimmedDesc !== (category.description ?? "")) {
      form.set("description", trimmedDesc);
      hasChange = true;
    }
    if (isActive !== category.isActive) {
      form.set("isActive", String(isActive));
      hasChange = true;
    }
    if (imageFile) {
      form.set("image", imageFile);
      hasChange = true;
    } else if (removeImage && category.image) {
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
      const res = await api<UpdateResponse>(
        `/admin/service-categories/${category.id}`,
        { method: "PATCH", body: form },
      );
      toast.success(`Updated ${res.data.category.name}`);
      onUpdated(res.data.category);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!category}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the name, description, image, or active state.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Name</Label>
            <Input
              id="edit-category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category-desc">Description</Label>
            <Textarea
              id="edit-category-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
              className="rounded-xl"
            />
          </div>

          <ImageField
            id="edit-category-image"
            label="Image (optional)"
            initialUrl={category?.image || ""}
            file={imageFile}
            onFileChange={setImageFile}
            removed={removeImage}
            onRemovedChange={setRemoveImage}
          />

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <div className="text-sm font-medium">Active</div>
              <div className="text-xs text-muted-foreground">
                Visible to customers when on.
              </div>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={submitting}
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
