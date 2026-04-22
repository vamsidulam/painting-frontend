import { useState, type FormEvent } from "react";
import { Loader2, Mail, Phone, Upload, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { QR_IMAGE_DATA_URL } from "./qr";
import {
  formatRupees,
  type BookingAddress,
  type BookingService,
  type PropertyType,
  type ServiceCategory,
} from "./types";

type Props = {
  category: ServiceCategory;
  service: BookingService;
  propertyType: PropertyType;
  sqft: number;
  address: BookingAddress;
  total: number;
  onSubmitted: () => void;
};

function onlyDigits(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

export function PaymentStep({
  category,
  service,
  propertyType,
  sqft,
  address,
  total,
  onSubmitted,
}: Props) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!screenshot) {
      setError("Please upload your payment screenshot.");
      return;
    }
    if (phone.length !== 10) {
      setError("Phone must be exactly 10 digits.");
      return;
    }

    const fd = new FormData();
    fd.append("screenshot", screenshot);
    fd.append("category", category);
    fd.append(
      "service",
      JSON.stringify({ id: service.id, name: service.name, cost: service.cost }),
    );
    fd.append("propertyType", propertyType);
    fd.append("sqft", String(sqft));
    fd.append("totalCost", String(total));
    fd.append("address", JSON.stringify(address));
    fd.append(
      "customer",
      JSON.stringify({ name: name.trim(), email: email.trim(), phone }),
    );

    setSubmitting(true);
    try {
      await api("/orders", { method: "POST", auth: false, body: fd });
      onSubmitted();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit your booking",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-block rounded-2xl border border-border p-3 bg-background">
          <img
            src={QR_IMAGE_DATA_URL}
            alt="PhonePe QR code"
            className="h-48 w-48"
            draggable={false}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Scan to pay
          </div>
          <div className="font-display font-bold text-2xl text-foreground">
            {formatRupees(total)}
          </div>
          <p className="text-xs text-muted-foreground">
            Pay via any UPI app, then upload your payment screenshot below.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-screenshot">Payment screenshot</Label>
        <label
          htmlFor="order-screenshot"
          className={`flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            screenshot
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:border-primary/50"
          }`}
        >
          {screenshot ? (
            <div className="text-center px-4">
              <div className="text-sm font-medium text-foreground truncate max-w-[240px]">
                {screenshot.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Click to change
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                Click to upload screenshot
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                PNG or JPG, up to 10MB
              </span>
            </>
          )}
          <input
            id="order-screenshot"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="order-name">Full name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              minLength={2}
              maxLength={100}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="order-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="order-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(onlyDigits(e.target.value, 10))}
              placeholder="10-digit mobile number"
              required
              pattern="\d{10}"
              minLength={10}
              maxLength={10}
              className="pl-10 h-12 rounded-xl tracking-wide"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-12 rounded-xl font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit booking"
        )}
      </Button>
    </form>
  );
}
