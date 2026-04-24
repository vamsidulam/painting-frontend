import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type {
  BookingAddress,
  BookingService,
  PropertyType,
  ServiceCategory,
} from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ServiceCategory;
  service: BookingService;
  propertyType: PropertyType;
  sqft: number;
  total: number;
  address: BookingAddress;
  onConfirmed: (orderId: string, customer: {
    name: string;
    email: string;
    phone: string;
  }) => void;
};

type CreateOrderResponse = {
  success: boolean;
  data: { order: { id: string } };
};

function onlyDigits(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

export function BookSlotModal({
  open,
  onOpenChange,
  category,
  service,
  propertyType,
  sqft,
  total,
  address,
  onConfirmed,
}: Props) {
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
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (phone.length !== 10) {
      setError("Phone must be exactly 10 digits.");
      return;
    }

    const fd = new FormData();
    fd.append("category", category.name);
    fd.append("categoryId", category.id);
    fd.append(
      "service",
      JSON.stringify({
        id: service.id,
        name: service.name,
        cost: service.cost,
      }),
    );
    fd.append("propertyType", propertyType);
    fd.append("sqft", String(sqft));
    fd.append("totalCost", String(total));
    fd.append("address", JSON.stringify(address));
    fd.append(
      "customer",
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone,
      }),
    );

    setSubmitting(true);
    try {
      const res = await api<CreateOrderResponse>("/orders", {
        method: "POST",
        auth: false,
        body: fd,
      });
      toast.success("Slot booked!");
      onConfirmed(res.data.order.id, {
        name: name.trim(),
        email: email.trim(),
        phone,
      });
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to book your slot",
      );
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
          <DialogTitle>Book your slot</DialogTitle>
          <DialogDescription>
            Share your contact details — our agent will reach out to confirm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slot-name">Full name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="slot-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                minLength={2}
                maxLength={100}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="slot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot-phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="slot-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(onlyDigits(e.target.value, 10))}
                placeholder="10-digit mobile number"
                required
                pattern="\d{10}"
                minLength={10}
                maxLength={10}
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
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming…
                </>
              ) : (
                "Confirm booking"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
