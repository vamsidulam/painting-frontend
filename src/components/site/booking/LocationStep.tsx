import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingAddress } from "./types";

type Props = {
  sqft: string;
  onSqftChange: (v: string) => void;
  address: BookingAddress;
  onAddressChange: (a: BookingAddress) => void;
};

export function LocationStep({
  sqft,
  onSqftChange,
  address,
  onAddressChange,
}: Props) {
  const update = (key: keyof BookingAddress, value: string) =>
    onAddressChange({ ...address, [key]: value });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="booking-sqft">Area (sqft)</Label>
        <Input
          id="booking-sqft"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={sqft}
          onChange={(e) => onSqftChange(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 800"
          className="h-12 rounded-xl"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="booking-door">Door / flat number</Label>
          <Input
            id="booking-door"
            value={address.doorNumber}
            onChange={(e) => update("doorNumber", e.target.value)}
            placeholder="12-A"
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-street">Street</Label>
          <Input
            id="booking-street"
            value={address.street}
            onChange={(e) => update("street", e.target.value)}
            placeholder="MG Road"
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-city">City</Label>
          <Input
            id="booking-city"
            value={address.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Bengaluru"
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-district">District</Label>
          <Input
            id="booking-district"
            value={address.district}
            onChange={(e) => update("district", e.target.value)}
            placeholder="Bengaluru Urban"
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-state">State</Label>
          <Input
            id="booking-state"
            value={address.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="Karnataka"
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-pincode">Pincode</Label>
          <Input
            id="booking-pincode"
            inputMode="numeric"
            maxLength={6}
            value={address.pincode}
            onChange={(e) =>
              update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="560001"
            className="h-12 rounded-xl"
            required
          />
        </div>
      </div>
    </div>
  );
}
