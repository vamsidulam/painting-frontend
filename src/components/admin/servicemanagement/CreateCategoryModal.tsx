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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (category: ServiceCategoryRecord) => void;
};

type CreateResponse = {
  success: boolean;
  data: { category: ServiceCategoryRecord };
};

export function CreateCategoryModal({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [includesMoney, setIncludesMoney] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setName("");
        setDescription("");
        setIncludesMoney(true);
        setIsActive(true);
        setImageFile(null);
        setError(null);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("name", trimmed);
      form.set("description", description.trim());
      form.set("includesMoney", String(includesMoney));
      form.set("isActive", String(isActive));
      if (imageFile) form.set("image", imageFile);

      const res = await api<CreateResponse>("/admin/service-categories", {
        method: "POST",
        body: form,
      });
      toast.success(`Created ${res.data.category.name}`);
      onCreated(res.data.category);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
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
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Categories group services so customers can browse them easily.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-category-name">Name</Label>
            <Input
              id="create-category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Interior"
              required
              minLength={2}
              maxLength={100}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-category-desc">Description</Label>
            <Textarea
              id="create-category-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's included in this category…"
              maxLength={2000}
              rows={3}
              className="rounded-xl"
            />
          </div>

          <ImageField
            id="create-category-image"
            label="Image (optional)"
            file={imageFile}
            onFileChange={setImageFile}
          />

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <div className="text-sm font-medium">Includes money</div>
              <div className="text-xs text-muted-foreground">
                When off, services in this category have no cost and no
                payment is collected at booking.
              </div>
            </div>
            <Switch
              checked={includesMoney}
              onCheckedChange={setIncludesMoney}
              disabled={submitting}
            />
          </div>

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
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
