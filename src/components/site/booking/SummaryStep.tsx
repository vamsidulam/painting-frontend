import { CalendarClock, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatRupees,
  WORK_TYPE_LABEL,
  type BookingAddress,
  type BookingService,
  type PropertyType,
  type ServiceCategory,
  type WorkType,
} from "./types";

type Props = {
  category: ServiceCategory;
  service: BookingService;
  workType: WorkType;
  propertyType: PropertyType;
  sqft: number;
  address: BookingAddress;
  orderId: string | null;
  includesMoney: boolean;
  onBookSlot: () => void;
  onPayNow: () => void;
  onContinuePayment: () => void;
  onFinish: () => void;
};

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function SummaryStep({
  category,
  service,
  workType,
  propertyType,
  sqft,
  address,
  orderId,
  includesMoney,
  onBookSlot,
  onPayNow,
  onContinuePayment,
  onFinish,
}: Props) {
  if (orderId) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-6 md:p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h3 className="mt-4 font-display font-bold text-xl md:text-2xl text-foreground">
          Slot booked!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our agent will reach out to you shortly on the number you provided.
        </p>
        {includesMoney ? (
          <>
            <Button
              type="button"
              onClick={onContinuePayment}
              className="mt-6 h-11 rounded-xl px-6 font-semibold"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Continue to payment
            </Button>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Optional — pay later if you prefer.
            </div>
          </>
        ) : (
          <Button
            type="button"
            onClick={onFinish}
            className="mt-6 h-11 rounded-xl px-6 font-semibold"
          >
            Done
          </Button>
        )}
      </div>
    );
  }

  const total = sqft * service.cost;
  const formattedAddress = [
    address.doorNumber,
    address.street,
    address.city,
    address.district,
    address.state,
    address.pincode,
  ]
    .filter((p) => p && p.trim())
    .join(", ");

  return (
    <div>
      {includesMoney ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Instant estimate
          </div>
          <div className="mt-4 font-display font-bold text-4xl md:text-6xl text-gradient">
            {formatRupees(total)}
          </div>
          <div className="text-muted-foreground mt-1.5 text-xs">
            {sqft.toLocaleString()} sqft × {formatRupees(service.cost)} / sqft
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Booking summary
          </div>
          <div className="mt-3 font-display font-bold text-2xl md:text-3xl text-foreground">
            {service.name}
          </div>
          <div className="text-muted-foreground mt-1.5 text-xs">
            Our agent will share details after confirming your slot.
          </div>
        </div>
      )}

      <div className="mt-8 space-y-0">
        <Row label="Service" value={`${service.name} · ${category.name}`} />
        <Row label="Work type" value={WORK_TYPE_LABEL[workType]} />
        <Row label="Property type" value={capitalize(propertyType)} />
        <Row label="Area" value={`${sqft.toLocaleString()} sqft`} />
        <Row label="Location" value={formattedAddress || "—"} />
      </div>

      <div
        className={`mt-8 grid gap-3 ${
          includesMoney ? "sm:grid-cols-2" : "sm:grid-cols-1"
        }`}
      >
        <Button
          type="button"
          variant={includesMoney ? "outline" : "default"}
          onClick={onBookSlot}
          className="h-12 rounded-xl font-semibold"
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Book slot
        </Button>
        {includesMoney && (
          <Button
            type="button"
            onClick={onPayNow}
            className="h-12 rounded-xl font-semibold"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay now
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground font-medium text-right text-sm max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
