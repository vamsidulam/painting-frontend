import { useEffect, useState, type FormEvent } from "react";
import { Mail, Phone, User as UserIcon } from "lucide-react";
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
import { toast } from "sonner";
import { api } from "@/lib/api";
import { onlyDigits, type UserRecord } from "./data";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: UserRecord) => void;
};

type SignupResponse = {
  success: boolean;
  message?: string;
  data: { user: UserRecord };
};

export function OnboardAdminModal({ open, onOpenChange, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setError(null);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Phone must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api<SignupResponse>("/admin/auth/signup", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim(),
          phone,
          role: "admin",
        },
      });
      onSuccess(res.data.user);
      toast.success("Invitation sent", {
        description: `${res.data.user.name} will receive an email to set their password.`,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to onboard admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Onboard Admin</DialogTitle>
          <DialogDescription>
            Add a new admin. They'll receive an email with a secure link to set
            their own password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="onboard-name">Full name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="onboard-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                minLength={2}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="onboard-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@PaintBrush.com"
                required
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="onboard-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(onlyDigits(e.target.value, 10))}
                placeholder="10-digit mobile number"
                required
                minLength={10}
                maxLength={10}
                pattern="\d{10}"
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
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending invite..." : "Onboard Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
