import { Sparkles } from "lucide-react";
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
};

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function SummaryStep({
  category,
  service,
  propertyType,
  sqft,
  address,
}: Props) {
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
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Instant estimate
        </div>
        <div className="mt-6 font-display font-bold text-5xl md:text-7xl text-gradient">
          {formatRupees(total)}
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          {sqft.toLocaleString()} sqft × {formatRupees(service.cost)} / sqft
        </div>
      </div>

      <div className="mt-10 space-y-0">
        <Row
          label="Service"
          value={`${service.name} · ${capitalize(category)}`}
        />
        <Row label="Property type" value={capitalize(propertyType)} />
        <Row label="Area" value={`${sqft.toLocaleString()} sqft`} />
        <Row label="Location" value={formattedAddress || "—"} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground font-medium text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
