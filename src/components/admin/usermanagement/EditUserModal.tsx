import { useEffect, useState, type FormEvent } from "react";
import { Phone, User as UserIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  formatPhoneForDisplay,
  onlyDigits,
  type UserRecord,
  type UserRole,
} from "./data";

type Props = {
  user: UserRecord | null;
  role: UserRole;
  onClose: () => void;
  onUpdated: (user: UserRecord) => void;
};

type UpdateResponse = {
  success: boolean;
  data: { user: UserRecord };
};

const basePath: Record<UserRole, string> = {
  admin: "/admin/users/adminusers",
  customer: "/admin/users/customers",
};

export function EditUserModal({ user, role, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(formatPhoneForDisplay(user.phone));
      setError(null);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = name.trim();
    const currentPhone = formatPhoneForDisplay(user.phone);

    if (trimmedName === user.name && phone === currentPhone) {
      onClose();
      return;
    }

    if (phone !== currentPhone && phone.length !== 10) {
      setError("Phone must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const patch: { name?: string; phone?: string } = {};
      if (trimmedName !== user.name) patch.name = trimmedName;
      if (phone !== currentPhone) patch.phone = phone;

      const res = await api<UpdateResponse>(`${basePath[role]}/${user.id}`, {
        method: "PATCH",
        body: patch,
      });

      toast.success(`Updated ${res.data.user.name}`);
      onUpdated(res.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!user}
      onOpenChange={(open) => {
        if (!open && !submitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {role === "admin" ? "admin" : "customer"}</DialogTitle>
          <DialogDescription>
            Update the name or phone number. Email and role can't be changed
            here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="h-11 rounded-xl bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Full name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                required
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(onlyDigits(e.target.value, 10))}
                placeholder="10-digit mobile number"
                minLength={10}
                maxLength={10}
                pattern="\d{10}"
                required
                className="pl-10 h-11 rounded-xl tracking-wide"
              />
            </div>
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
