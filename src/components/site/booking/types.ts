export type ServiceCategory = "interior" | "exterior";

export type PropertyType = "apartment" | "villa" | "building" | "office";

export type BookingService = {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: ServiceCategory;
};

export type BookingAddress = {
  doorNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

export const EMPTY_ADDRESS: BookingAddress = {
  doorNumber: "",
  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

export function formatRupees(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
